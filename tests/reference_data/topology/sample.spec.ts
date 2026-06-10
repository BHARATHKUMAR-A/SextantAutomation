import { expect } from '@playwright/test';
import { test } from '../../fixtures/testWithLogIn';
import { PuttyLogReader } from '../../../utils/puttyLogReader';
import envConfig from '../../../test-data/envConfig.json';
import credentials from '../../../test-data/credentials.json';
import { StepHelper } from '../../../utils/StepHelper';
import * as fs from 'fs';

// ── Configuration ────────────────────────────────────────────────────────────

const PUTTY_LOG_FILE = envConfig.logFilePath.puttyLogFile; // Absolute path to the local PuTTY log file, configured in envConfig.json
const TAIL_LINES = 50; /** Number of trailing lines to read after each UI action. */
const EXPECTED_USER_ID = credentials.Credentials.username;
const EXPECTED_PROFILE = 'LTP.ALPHOR'; // Or add to envConfig if it varies

// ── Shared reader (created once for the whole file) ──────────────────────────

    let verifier: PuttyLogReader;
    test.beforeAll(() => {
      // PuttyLogReader reads the local file – no async connection needed.
      verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });


// ── Tests ────────────────────────────────────────────────────────────────────

test.describe('Log verification after UI actions', () => {

  test('Login flow should produce an auth log entry', async ({ page }, testInfo) => {


    const helper = new StepHelper(page, testInfo);


    // ── PuTTY Log Check ─────────────────────────────────────────────────
    await page.waitForTimeout(1000);
    const logAfterLogin = verifier.tail(TAIL_LINES);

    // Dynamic pattern with named capture groups using config values:
    //  - timestamp (YYYY-MM-DD HH:MM:SS format)
    //  - userId (extracted from parentheses, must match configured user)
    const logRegex = new RegExp(
      `\\[INFO\\][\\s\\S]*?(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2})[\\s\\S]*?\\((?<userId>[A-Za-z0-9]+)\\)[\\s\\S]*?Connexion administrateur[\\s\\S]*?avec le profil \\{${EXPECTED_PROFILE}\\}`
    );

    // Assert the full pattern matches
    verifier.assertContains(logAfterLogin, logRegex, 'Administrator Login text with ID');

    // Extract and validate structured components (timestamp, userId)
    const groups = verifier.extractGroups(logAfterLogin, logRegex, 'Login entry validation');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(groups.userId).toBe(EXPECTED_USER_ID);

  });
  
 

});

