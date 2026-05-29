import { test } from '../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { RQA0201Steps } from '../../steps/RQA0201Steps';
import { RQA0201Page } from '../../pages/RQA0201Page';
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
let defectCode: string;
let updatedLabel: string;

test.describe.serial('RQA0201 - Manage Elementary Defects', () => {

    test.beforeAll(() => {
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    test.beforeEach(async ({ page }, testInfo) => {
        if (!defectCode) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            defectCode  = `T_${await sshHelper.generateRandomAlphanumeric(2)}`;
            updatedLabel = `UPD_${await sshHelper.generateRandomAlphanumeric(3)}`;
        }
    });

    // ── Screen title validation ──────────────────────────────────────────────

    test('Validation of screen title — Manage the elementary defects (RQA0201)', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0201Steps = new RQA0201Steps(page, testInfo, helper);
        const rqa0201Page  = new RQA0201Page(page);

        await rqa0201Steps.navigateToRQA0201();
        await helper.assertElementHasText(rqa0201Page.screenTitle, 'Manage the elementary defects (RQA0201)', 'Verify screen title is displayed');

    });

    // ── Submit (workshop selection) ──────────────────────────────────────────

    test('Submission — select workshop EBAS1 and submit for Manage Elementary Defects', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0201Steps = new RQA0201Steps(page, testInfo, helper);

        await rqa0201Steps.submitRQA0201(WORKSHOP);

    });

    // ── Create ───────────────────────────────────────────────────────────────

    test('Validation of cancel button while creating an elementary defect', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0201Steps = new RQA0201Steps(page, testInfo, helper);
        const rqa0201Page  = new RQA0201Page(page);

        await rqa0201Steps.submitRQA0201(WORKSHOP);
        await rqa0201Steps.createDefect(defectCode);
        await helper.clickElement(rqa0201Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of creating an elementary defect by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0201Steps = new RQA0201Steps(page, testInfo, helper);
        const rqa0201Page  = new RQA0201Page(page);

        await rqa0201Steps.submitRQA0201(WORKSHOP);
        await rqa0201Steps.createDefect(defectCode);
        await helper.clickElement(rqa0201Page.submitButtonToAdd, 'Click Submit button to confirm creation');

        await rqa0201Steps.verifyCreateLog(verifier, USER_ID, defectCode, 'TESTLABEL_', WORKSHOP);

    });

    // ── Update ───────────────────────────────────────────────────────────────

    test('Validation of cancel button while updating an elementary defect', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0201Steps = new RQA0201Steps(page, testInfo, helper);
        const rqa0201Page  = new RQA0201Page(page);

        await rqa0201Steps.submitRQA0201(WORKSHOP);
        await rqa0201Steps.updateDefect(defectCode, updatedLabel);
        await helper.clickElement(rqa0201Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of updating an elementary defect by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0201Steps = new RQA0201Steps(page, testInfo, helper);
        const rqa0201Page  = new RQA0201Page(page);

        await rqa0201Steps.submitRQA0201(WORKSHOP);
        await rqa0201Steps.updateDefect(defectCode, updatedLabel);
        await helper.clickElement(rqa0201Page.submitButtonToAdd, 'Click Submit button to confirm update');

        await rqa0201Steps.verifyUpdateLog(verifier, USER_ID,defectCode,updatedLabel, WORKSHOP);

    });

    // ── Delete ───────────────────────────────────────────────────────────────

    test('Validation of cancel button while deleting an elementary defect', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0201Steps = new RQA0201Steps(page, testInfo, helper);
        const rqa0201Page  = new RQA0201Page(page);

        await rqa0201Steps.submitRQA0201(WORKSHOP);
        await rqa0201Steps.deleteDefect(defectCode);
        await helper.clickElement(rqa0201Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of deleting an elementary defect by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0201Steps = new RQA0201Steps(page, testInfo, helper);
        const rqa0201Page  = new RQA0201Page(page);

        await rqa0201Steps.submitRQA0201(WORKSHOP);
        await rqa0201Steps.deleteDefect(defectCode);
        await helper.clickElement(rqa0201Page.submitButtonToAdd, 'Click Submit button to confirm deletion');

        await rqa0201Steps.verifyDeleteLog(verifier, USER_ID, defectCode,updatedLabel, WORKSHOP);

    });

});

