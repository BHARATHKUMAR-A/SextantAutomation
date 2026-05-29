/**
 * sshHelper.ts
 *
 * Provides a reusable SSH client wrapper around the `ssh2` library.
 * Use this helper to open a persistent SSH session, run remote shell
 * commands, and cleanly close the connection when done.
 *
 * Usage:
 *   const ssh = new SshHelper({ host: '10.0.0.1', username: 'admin', password: 'secret' });
 *   await ssh.connect();
 *   const output = await ssh.runCommand('tail -n 50 /var/log/myapp/application.log');
 *   ssh.disconnect();
 */
import { Page, test, Locator, TestInfo, expect } from '@playwright/test';
import { Client, ConnectConfig } from 'ssh2';
import { PuttyLogReader } from './puttyLogReader';
import envConfig from '../test-data/envConfig.json';
import * as fs from 'fs';


// ── Connection configuration ────────────────────────────────────────────────

/**
 * SSH credential / connection options.
 * At minimum provide host + username + (password | privateKey).
 */
export interface SshConfig {
  host: string;
  port?: number;          // default: 22
  username: string;
  password?: string;      // use password OR privateKey
  privateKey?: string;    // e.g. fs.readFileSync('/path/to/id_rsa')
  readyTimeout?: number;  // ms to wait for handshake (default 10 000)

}

// ── Helper class ────────────────────────────────────────────────────────────

export class SshHelper {
  private page: Page;
  private testInfo: TestInfo;
  private client: Client;
  private config: ConnectConfig;
  public verifier: PuttyLogReader;
  public Regex: string;
  public logOutput: string;

  constructor(config: SshConfig, page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.client = new Client();
    this.verifier = new PuttyLogReader(envConfig.logFilePath.puttyLogFile);
    this.Regex = '';
    this.logOutput = '';
    // Map our minimal SshConfig to the full ssh2 ConnectConfig shape
    this.config = {
      host: config.host,
      port: config.port ?? 22,
      username: config.username,
      password: config.password,
      privateKey: config.privateKey,
      readyTimeout: config.readyTimeout ?? 10_000,
    };
  }

  /**
   * Open the SSH connection to the remote server.
   * Must be called (and awaited) before `runCommand`.
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client
        // 'ready' fires once the SSH handshake succeeds
        .on('ready', () => {
          console.log(`[SSH] Connected to ${this.config.host}`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`[SSH] Connection error: ${err.message}`);
          reject(err);
        })
        .connect(this.config);
    });
  }

  /**
   * Execute a single shell command on the remote server.
   *
   * @param command - The shell command to run (e.g. 'tail -n 50 /var/log/app/app.log')
   * @returns The combined stdout of the command as a string.
   * @throws If the command exits with a non-zero code or the channel errors.
   */
  runCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Open a new exec channel for every command so calls are independent
      this.client.exec(command, (err, stream) => {
        if (err) {
          reject(new Error(`[SSH] exec() failed for "${command}": ${err.message}`));
          return;
        }

        let stdout = '';
        let stderr = '';

        stream
          // Collect stdout chunks
          .on('data', (chunk: Buffer) => {
            stdout += chunk.toString('utf8');
          })
          // Collect stderr chunks (logged for debugging, not included in result)
          .stderr.on('data', (chunk: Buffer) => {
            stderr += chunk.toString('utf8');
          });

        // 'close' fires when the remote process finishes
        stream.on('close', (code: number) => {
          if (stderr) {
            console.warn(`[SSH] stderr for "${command}":\n${stderr}`);
          }
          if (code !== 0) {
            reject(new Error(`[SSH] Command exited with code ${code}: ${command}`));
            return;
          }
          resolve(stdout);
        });
      });
    });
  }

  /**
   * Close the SSH connection.
   * Call this in afterAll / finally blocks to avoid leaving open sockets.
   */
  disconnect(): void {
    this.client.end();
    console.log(`[SSH] Disconnected from ${this.config.host}`);
  }

  //common Methods

  // import { PuttyLogReader } from './PuttyLogReader';

  async tailFilee(
    verifier: PuttyLogReader,
    lines: number = 50
  ): Promise<string> {
    return verifier.tail(lines);
  }
  async logs(): Promise<void> { }

  /* async lastlogs(lines: number): Promise<string> 
  {

  const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';

  // return new PuttyLogReader(PUTTY_LOG_FILE).tail(lines);
      
      this.verifier = new PuttyLogReader(PUTTY_LOG_FILE);
      return this.verifier.tail(lines);
} */

  /*  async lastlogs(lines: number): Promise<string> 
{

const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
 ? envConfig.logFilePath.puttyLogFile
 : 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';

// return new PuttyLogReader(PUTTY_LOG_FILE).tail(lines);
   
   this.verifier = new PuttyLogReader(PUTTY_LOG_FILE);
   return this.verifier.tail(lines);
} */

  //     class SshHelper {
  // private verifier!: PuttyLogReader;

  async lastlogs(lines: number): Promise<string> {
    const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
      ? envConfig.logFilePath.puttyLogFile
      : 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';

    this.verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    return this.verifier.tail(lines);
  }

  async waitForLog(
    expected: string | RegExp,
    lines = 500,
    timeoutMs = 60000
  ): Promise<string> {

    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      // Expand search window over time so delayed/older lines are still matched.
      const elapsed = Date.now() - start;
      const dynamicLines = Math.max(lines, Math.min(3000, lines + Math.floor(elapsed / 1500) * 100));
      const logs = await this.lastlogs(dynamicLines);

      const matched =
        typeof expected === 'string'
          ? logs.includes(expected)
          : new RegExp(
            expected.source,
            expected.flags.replace('g', '')
          ).test(logs);

      if (matched) {
        return logs;
      }

      await new Promise(res => setTimeout(res, 1000));
    }

    throw new Error('Expected log not found within timeout');
  }

  async assertContains(logOutput: string, expected: string | RegExp, stepLabel = ''): Promise<void> {
    const label = stepLabel ? `[${stepLabel}] ` : '';

    if (expected instanceof RegExp) {
      expect(
        logOutput,
        `${label}Expected PuTTY log to match pattern: ${expected}`
      ).toMatch(expected);
      console.log(`[PuttyLogReader] ✔ ${label}Matched pattern: ${expected}`);
      return;
    }

    expect(
      logOutput,
      `${label}Expected PuTTY log to contain: "${expected}"`
    ).toContain(expected);
    console.log(`[PuttyLogReader] ✔ ${label}  Found: "${expected}"`);
  }

  async CreationLogAssertion(
    sshHelper: SshHelper,
    ID: string,
    workshopName: string,
    Type: string,
    lines = 300,
    timeoutMs: number,
    stepLabel = 'CreationLogAssertion'
  ): Promise<{ logOutput: string; groups: Record<string, string | undefined> }> {
    const label = stepLabel ? `[${stepLabel}] ` : '';

    const Regex = new RegExp(
      `\\[INFO\\][\\s\\S]*?` +
      `\\((?<userId>${ID})\\)[\\s\\S]*?` +
      `(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3})[\\s\\S]*?` +
      `(?<successMessage>Création de l'élément de topologie ` +
      `\\(Id=\\[(?<id>\\d+)\\], Code=\\[${workshopName}\\], Type=\\[${Type}\\]\\))`
    );

    console.log(`✅ Constructed regex: ${Regex}`);

    // Step 1 — wait until the log line appears
    const logOutput = await sshHelper.waitForLog(Regex, lines, timeoutMs);

    // Step 2 — assert the log contains the expected pattern
    await sshHelper.assertContains(logOutput, Regex, `${label}assertion`);

    // Step 3 — extract named groups
    const match = Regex.exec(logOutput);
    expect(
      match,
      `${label}Expected log to match pattern with named groups: ${Regex}`
    ).not.toBeNull();

    const groups = match?.groups || {};
    console.log(`[CreationLogAssertion] ✔ ${label}Extracted groups:`, JSON.stringify(groups, null, 2));

    return { logOutput, groups };
  }

  //Modify



  //
  async generateRandomAlphanumeric(length: number = 8): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  async generateRandomNumeric(length: number = 8): Promise<string> {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


  async ModifyLogAssertion(
    sshHelper: SshHelper,
    ID: string,
    workshopName: string,
    Type: string,
    lines = 300,
    timeoutMs: number,
    stepLabel = 'ModifyLogAssertion'
  ): Promise<{ logOutput: string; groups: Record<string, string | undefined> }> {
    const label = stepLabel ? `[${stepLabel}] ` : '';

    const Regex = new RegExp(
      `\\[INFO\\][\\s\\S]*?` +
      `\\((?<userId>${ID})\\)[\\s\\S]*?` +
      `(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3})[\\s\\S]*?` +
      `(?<successMessage>Modification de l'élément de topologie ` +
      `\\(Id=\\[(?<id>\\d+)\\], Code=\\[${workshopName}\\], Type=\\[${Type}\\]\\))`
    );

    console.log(`✅ Constructed regex: ${Regex}`);

    // Step 1 — wait until the log line appears
    const logOutput = await sshHelper.waitForLog(Regex, lines, timeoutMs);

    // Step 2 — assert the log contains the expected pattern
    await sshHelper.assertContains(logOutput, Regex, `${label}assertion`);

    // Step 3 — extract named groups
    const match = Regex.exec(logOutput);
    expect(
      match,
      `${label}Expected log to match pattern with named groups: ${Regex}`
    ).not.toBeNull();

    const groups = match?.groups || {};
    console.log(`[ModifyLogAssertion] ✔ ${label}Extracted groups:`, JSON.stringify(groups, null, 2));

    return { logOutput, groups };
  }



  async DeleteLogAssertion(
    sshHelper: SshHelper,
    ID: string,
    workshopName: string,
    Type: string,
    lines = 300,
    timeoutMs: number,
    stepLabel = 'DeleteLogAssertion'
  ): Promise<{ logOutput: string; groups: Record<string, string | undefined> }> {
    const label = stepLabel ? `[${stepLabel}] ` : '';

    const Regex = new RegExp(
      `\\[INFO\\][\\s\\S]*?` +
      `\\((?<userId>${ID})\\)[\\s\\S]*?` +
      `(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3})[\\s\\S]*?` +
      `(?<successMessage>Suppression de l'élément de topologie ` +
      `\\(Id=\\[(?<id>\\d+)\\], Code=\\[${workshopName}\\], Type=\\[${Type}\\]\\))`
    );

    console.log(`✅ Constructed regex: ${Regex}`);

    // Step 1 — wait until the log line appears
    const logOutput = await sshHelper.waitForLog(Regex, lines, timeoutMs);

    // Step 2 — assert the log contains the expected pattern
    await sshHelper.assertContains(logOutput, Regex, `${label}assertion`);

    // Step 3 — extract named groups
    const match = Regex.exec(logOutput);
    expect(
      match,
      `${label}Expected log to match pattern with named groups: ${Regex}`
    ).not.toBeNull();

    const groups = match?.groups || {};
    console.log(`[DeleteLogAssertion] ✔ ${label}Extracted groups:`, JSON.stringify(groups, null, 2));

    return { logOutput, groups };
  }

  async CreationLogAssertionFor502(
    sshHelper: SshHelper,
    ID: string,
    Type: string,
    lines = 300,
    timeoutMs: number,
    stepLabel = 'CreationLogAssertion'
  ): Promise<{ logOutput: string; groups: Record<string, string | undefined> }> {
    const label = stepLabel ? `[${stepLabel}] ` : '';


    const Regex = new RegExp(
      `\\[INFO\\][\\s\\S]*?` +
      `\\((?<userId>${ID})\\)[\\s\\S]*?` +
      `(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3})[\\s\\S]*?` +
      `(?<successMessage>` +
      `Création du poste typé \\[POSTE_BANC\\[NumBanc=201;\\]\\] associé au poste\\s*` +
      `\\(Id=\\[(?<id>\\d+)\\],` +
      `(?:\\s*Code=\\[(?<code>\\d+)\\],)?\\s*` +
      `Type=\\[(?<Type>${Type})\\]\\)` +
      `)`
    );


    console.log(`✅ Constructed regex: ${Regex}`);

    // Step 1 — wait until the log line appears
    const logOutput = await sshHelper.waitForLog(Regex, lines, timeoutMs);

    // Step 2 — assert the log contains the expected pattern
    await sshHelper.assertContains(logOutput, Regex, `${label}assertion`);

    // Step 3 — extract named groups
    const match = Regex.exec(logOutput);
    expect(
      match,
      `${label}Expected log to match pattern with named groups: ${Regex}`
    ).not.toBeNull();

    const groups = match?.groups || {};
    console.log(`[CreationLogAssertionFor502] ✔ ${label}Extracted groups:`, JSON.stringify(groups, null, 2));

    return { logOutput, groups };
  }

  async ModifyLogAssertionFor502(
    sshHelper: SshHelper,
    ID: string,
    newBatchNum: string,
    Type: string,
    lines = 300,
    timeoutMs: number,
    stepLabel = 'ModifyLogAssertionFor502'
  ): Promise<{ logOutput: string; groups: Record<string, string | undefined> }> {
    const label = stepLabel ? `[${stepLabel}] ` : '';


    const Regex = new RegExp(
      `\\[INFO\\][\\s\\S]*?` +
      `\\((?<userId>${ID})\\)[\\s\\S]*?` +
      `(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3})[\\s\\S]*?` +
      `(?<successMessage>` +
      `Modification du poste typé \\[POSTE_BANC\\[NumBanc=${newBatchNum};\\]\\] associé au poste\\s*` +
      `\\(Id=\\[(?<id>\\d+)\\],` +
      `(?:\\s*Code=\\[(?<code>\\d+)\\],)?\\s*` +
      `Type=\\[(?<Type>${Type})\\]\\)` +
      `)`
    );


    console.log(`✅ Constructed regex: ${Regex}`);

    // Step 1 — wait until the log line appears
    const logOutput = await sshHelper.waitForLog(Regex, lines, timeoutMs);

    // Step 2 — assert the log contains the expected pattern
    await sshHelper.assertContains(logOutput, Regex, `${label}assertion`);

    // Step 3 — extract named groups
    const match = Regex.exec(logOutput);
    expect(
      match,
      `${label}Expected log to match pattern with named groups: ${Regex}`
    ).not.toBeNull();

    const groups = match?.groups || {};
    console.log(`[ModifyLogAssertionFor502] ✔ ${label}Extracted groups:`, JSON.stringify(groups, null, 2));

    return { logOutput, groups };
  }

  async DeletionLogAssertionFor502(
    sshHelper: SshHelper,
    ID: string,
    Type: string,
    lines = 300,
    timeoutMs: number,
    stepLabel = 'DeletionLogAssertionFor502'
  ): Promise<{ logOutput: string; groups: Record<string, string | undefined> }> {
    const label = stepLabel ? `[${stepLabel}] ` : '';


    const Regex = new RegExp(
      `\\[INFO\\][\\s\\S]*?` +
      `\\((?<userId>${ID})\\)[\\s\\S]*?` +
      `(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3})[\\s\\S]*?` +
      `(?<successMessage>` +
      `Suppression du poste typé \\[POSTE_BANC\\[NumBanc=null;\\]\\] associé au poste\\s*` +
      `\\(Id=\\[(?<id>\\d+)\\],` +
      `(?:\\s*Code=\\[(?<code>\\d+)\\],)?\\s*` +
      `Type=\\[(?<Type>${Type})\\]\\)` +
      `)`
    );


    console.log(`✅ Constructed regex: ${Regex}`);

    // Step 1 — wait until the log line appears
    const logOutput = await sshHelper.waitForLog(Regex, lines, timeoutMs);

    // Step 2 — assert the log contains the expected pattern
    await sshHelper.assertContains(logOutput, Regex, `${label}assertion`);

    // Step 3 — extract named groups
    const match = Regex.exec(logOutput);
    expect(
      match,
      `${label}Expected log to match pattern with named groups: ${Regex}`
    ).not.toBeNull();

    const groups = match?.groups || {};
    console.log(`[DeletionLogAssertionFor502] ✔ ${label}Extracted groups:`, JSON.stringify(groups, null, 2));

    return { logOutput, groups };
  }



}
