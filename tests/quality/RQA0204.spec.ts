import { test } from '../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { RQA0204Steps } from '../../steps/RQA0204Steps';
import { RQA0204Page } from '../../pages/RQA0204Page';
import { PuttyLogReader } from '../../utils/puttyLogReader';
import * as fs from 'fs';
import envConfig from '../../test-data/envConfig.json';
import credentials from '../../test-data/credentials.json';
import testConfig from '../../test-data/testConfig.json';

const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : DEFAULT_PUTTY_LOG_FILE;

const USER_ID  = credentials.Credentials.username;
const WORKSHOP = testConfig.workshop;

let verifier: PuttyLogReader;
let createdDeaCode: string;
let createdDerCode: string;
let createdZoneDea: string;

test.describe.serial('RQA0204 - Associate Declarable and Reworkable Defects', () => {

    test.beforeAll(() => {
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    // ── Screen title validation + Submit ──────────────────────────────────────

    test('Validation of screen title and submission for Associate Declarable and Reworkable Defects', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0204Steps = new RQA0204Steps(page, testInfo, helper);
        const rqa0204Page  = new RQA0204Page(page);

        // Navigate and assert screen title
        await rqa0204Steps.navigateToRQA0204();
        await helper.assertElementHasText(
            rqa0204Page.screenTitle,
            'Associate declarable and reworkable defects  (RQA0204)',
            'Verify screen title is displayed'
        );

        // Fill filter dropdowns and submit
        const { zoneDea, zoneDer } = await rqa0204Steps.submitRQA0204();
        console.log(`[RQA0204] Screen title validated. Submitted with zoneDea=${zoneDea}, zoneDer=${zoneDer}`);
    });

    // ── Add association ───────────────────────────────────────────────────────

    test('Validation of adding an association between declarable and reworkable defects', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0204Steps = new RQA0204Steps(page, testInfo, helper);
        const rqa0204Page  = new RQA0204Page(page);

        const { zoneDea } = await rqa0204Steps.submitRQA0204();
        const { deaCode, derCode } = await rqa0204Steps.addAssociation();
        await helper.clickElement(rqa0204Page.submitButtonToAdd, 'Click Submit button to confirm association');
        await rqa0204Steps.verifyAddLog(verifier, USER_ID, deaCode, derCode, WORKSHOP);

        // Persist for use in the delete test
        createdDeaCode = deaCode;
        createdDerCode = derCode;
        createdZoneDea = zoneDea;
    });

    // ── Delete association ────────────────────────────────────────────────────

    test('Validation of deleting an association between declarable and reworkable defects', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0204Steps = new RQA0204Steps(page, testInfo, helper);
        const rqa0204Page  = new RQA0204Page(page);

        await rqa0204Steps.submitRQA0204();
        await rqa0204Steps.deleteAssociation(createdZoneDea);
        await helper.clickElement(rqa0204Page.submitButtonToAdd, 'Click Submit button to confirm deletion');
        await rqa0204Steps.verifyDeleteLog(verifier, USER_ID, createdDeaCode, createdDerCode, WORKSHOP);
    });

});
