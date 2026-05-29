import { test }   from '../fixtures/testWithLogIn';
import { expect }  from '@playwright/test';
import { StepHelper }     from '../../utils/StepHelper';
import { PRP0501Steps }   from '../../steps/PRP0501Steps';
import { PRP0501Page }    from '../../pages/PRP0501Page';
import { PuttyLogReader } from '../../utils/puttyLogReader';
import * as fs            from 'fs';
import envConfig          from '../../test-data/envConfig.json';
import credentials        from '../../test-data/credentials.json';

// ── PuTTY log file ────────────────────────────────────────────────────────────
// Falls back to a local default path when the env-configured file does not exist.
const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : DEFAULT_PUTTY_LOG_FILE;

// ── Static constants from config (never hardcoded) ────────────────────────────
const USER_ID = credentials.Credentials.username;

// Required quantity — a fixed test value (not a unique identifier, no need to
// generate randomly; adjust here if the application requires a unique integer).
const QUANTITY = '1';

// ── Module-level PuTTY verifier — shared across tests ─────────────────────────
let verifier: PuttyLogReader;

// ── Organ reference captured from the cancel test, reused in the submit test ──
let capturedOrganRef: string;

// ─────────────────────────────────────────────────────────────────────────────
test.describe.serial('PRP0501 - Manage the racks', () => {

    test.beforeAll(() => {
        // PuttyLogReader reads the local PuTTY session log synchronously.
        // No SSH connection required — initialise once for all tests.
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    // ── Test 1: Cancel path (creation abandoned) ──────────────────────────────

    test('Validation of creation abandoned when clicking Cancel on rack creation', async ({ page }, testInfo) => {
        const helper      = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);
        const prp0501Page  = new PRP0501Page(page);

        // Fill form then click Cancel
        capturedOrganRef = await prp0501Steps.cancelRackCreation(QUANTITY);

        // UI assertion: 'creation abandoned' message must be visible
        await prp0501Steps.assertCreationAbandoned();
        await helper.captureScreenshot('PRP0501_Test1_CreationAbandoned');

        console.log(`[PRP0501] Test 1 PASS — creation abandoned for organRef=${capturedOrganRef}`);
    });

    // ── Test 2: Submit path (creation done) + PuTTY log verification ──────────

    test('Validation of creating a rack (UI success message + PuTTY log verification)', async ({ page }, testInfo) => {
        const helper      = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);
        const prp0501Page  = new PRP0501Page(page);

        // Fill form then click Submit
        const organRef = await prp0501Steps.createRack(QUANTITY);

        // UI assertion: 'creation done' success message must be visible
        await prp0501Steps.assertCreationDone();
        await helper.captureScreenshot('PRP0501_Test2_CreationDone_UI');

        // PuTTY backend log assertion
        // ⚠️  The regex inside verifyCreateLog matches the French log message:
        //   "Création du casier <organRef> réalisée"
        // Run the test once, inspect the PuTTY log, and update the literal in
        // PRP0501Steps.verifyCreateLog if the actual message differs.
        await prp0501Steps.verifyCreateLog(verifier, USER_ID, organRef);

        console.log(`[PRP0501] Test 2 PASS — rack created for organRef=${organRef} by user ${USER_ID}`);
    });

});
