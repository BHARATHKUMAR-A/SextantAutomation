/**
 * logVerifier.ts
 *
 * High-level helpers that combine SshHelper with Playwright's `expect` to
 * read a remote log file and assert that specific patterns are present.
 *
 * Usage:
 *   const verifier = new LogVerifier(ssh, '/var/log/myapp/application.log');
 *   const output   = await verifier.tail(50);
 *   verifier.assertContains(output, 'Remontée qualité intermédiaire');
 *   verifier.assertMatches(output, /#PIL-\d{3}/);
 */

import { expect } from '@playwright/test';
import { SshHelper } from './sshHelper';

// ── LogVerifier class ───────────────────────────────────────────────────────

export class LogVerifier {
  private ssh: SshHelper;
  private logPath: string;

  /**
   * @param ssh     - An already-connected SshHelper instance.
   * @param logPath - Absolute path to the log file on the remote server.
   */
  constructor(ssh: SshHelper, logPath: string) {
    this.ssh = ssh;
    this.logPath = logPath;
  }

  /**
   * Fetch the last `lines` lines of the configured log file.
   *
   * @param lines - Number of lines to read (default 50).
   * @returns Raw log content as a string.
   */
  async tail(lines = 50): Promise<string> {
    const cmd = `tail -n ${lines} ${this.logPath}`;
    console.log(`[LogVerifier] Running: ${cmd}`);
    const output = await this.ssh.runCommand(cmd);
    console.log(`[LogVerifier] Output:\n${output}`);
    return output;
  }

  /**
   * Assert that the log content contains an exact substring.
   *
   * @param logOutput  - The string returned by `tail()`.
   * @param expected   - The exact text that must appear in the log.
   * @param stepLabel  - Optional label printed in the assertion message.
   */
  assertContains(logOutput: string, expected: string, stepLabel = ''): void {
    const label = stepLabel ? `[${stepLabel}] ` : '';
    expect(
      logOutput,
      `${label}Expected log to contain: "${expected}"`
    ).toContain(expected);
    console.log(`[LogVerifier] ✔ ${label}Found: "${expected}"`);
  }

  /**
   * Assert that the log content matches a regular expression.
   *
   * @param logOutput  - The string returned by `tail()`.
   * @param pattern    - Regular expression to match against the entire output.
   * @param stepLabel  - Optional label printed in the assertion message.
   */
  assertMatches(logOutput: string, pattern: RegExp, stepLabel = ''): void {
    const label = stepLabel ? `[${stepLabel}] ` : '';
    expect(
      logOutput,
      `${label}Expected log to match pattern: ${pattern}`
    ).toMatch(pattern);
    console.log(`[LogVerifier] ✔ ${label}Matched pattern: ${pattern}`);
  }

  /**
   * Assert that the log does NOT contain a given substring.
   * Useful for confirming that an error string is absent after an action.
   *
   * @param logOutput  - The string returned by `tail()`.
   * @param unexpected - Text that must NOT appear in the log.
   * @param stepLabel  - Optional label.
   */
  assertNotContains(logOutput: string, unexpected: string, stepLabel = ''): void {
    const label = stepLabel ? `[${stepLabel}] ` : '';
    expect(
      logOutput,
      `${label}Expected log NOT to contain: "${unexpected}"`
    ).not.toContain(unexpected);
    console.log(`[LogVerifier] ✔ ${label}Not present (as expected): "${unexpected}"`);
  }
}



/* 

await page.click('#submit');

// Read the same logs PuTTY would show
const logs = await ssh.runCommand("tail -n 30 /var/log/app.log");

expect(logs).toContain("Remontée qualité intermédiaire");
expect(logs).toContain("#PIL-003");

*/
