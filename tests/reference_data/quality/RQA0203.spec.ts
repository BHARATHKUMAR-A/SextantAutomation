import { test } from '../../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper } from '../../../utils/StepHelper';
import { SshHelper } from '../../../utils/sshHelper';
import { RQA0203Steps } from '../../../steps/RQA0203Steps';
import { RQA0203Page } from '../../../pages/RQA0203Page';
import { PuttyLogReader } from '../../../utils/puttyLogReader';
import * as fs from 'fs';
import envConfig from '../../../test-data/envConfig.json';
import credentials from '../../../test-data/credentials.json';
import testConfig from '../../../test-data/testConfig.json';

const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : DEFAULT_PUTTY_LOG_FILE;

const USER_ID  = credentials.Credentials.username;
const WORKSHOP = testConfig.workshop;

let verifier: PuttyLogReader;
let defectLabel: string;
let updatedLabel: string;

test.describe.serial('RQA0203 - Manage Reworkable Defects', () => {

    test.beforeAll(() => {
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    test.beforeEach(async ({ page }, testInfo) => {
        if (!defectLabel) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            defectLabel  = `TEST_${await sshHelper.generateRandomAlphanumeric(3)}`;
            updatedLabel = `UPD_${await sshHelper.generateRandomAlphanumeric(3)}`;
        }
    });

    // ── Screen title validation ──────────────────────────────────────────────

    test('Validation of screen title — Manage the reworkable defects', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0203Steps = new RQA0203Steps(page, testInfo, helper);
        const rqa0203Page  = new RQA0203Page(page);
        await rqa0203Steps.navigateToRQA0203();
        await helper.assertElementHasText(rqa0203Page.screenTitle, 'Manage the reworkable defects  (RQA0203)', 'Verify screen title is displayed');
    });

    // ── Submit (workshop/zone/poste/defect selection) ───────────────────────

    test('Submission — select all dropdowns and submit for Manage Reworkable Defects', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0203Steps = new RQA0203Steps(page, testInfo, helper);
        const { defect, zone } = await rqa0203Steps.submitRQA0203();
        console.log(`[RQA0203] Submitted with defect=${defect}, zone=${zone}`);
    });

    // ── Create ───────────────────────────────────────────────────────────────

    test('Validation of cancel button while creating a reworkable defect', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0203Steps = new RQA0203Steps(page, testInfo, helper);
        const rqa0203Page  = new RQA0203Page(page);
        await rqa0203Steps.submitRQA0203();
        await rqa0203Steps.createRework(defectLabel);
        await helper.clickElement(rqa0203Page.cancelButton, 'Click Cancel button');
    });

    test('Validation of creating a reworkable defect by clicking submit button', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0203Steps = new RQA0203Steps(page, testInfo, helper);
        const rqa0203Page  = new RQA0203Page(page);
        const { defect, zone } = await rqa0203Steps.submitRQA0203();
        await rqa0203Steps.createRework(defectLabel);
        await helper.clickElement(rqa0203Page.submitButtonToAdd, 'Click Submit button to confirm creation');
        await rqa0203Steps.verifyCreateLog(verifier, USER_ID, defect, defectLabel, WORKSHOP);
    });

    // ── Update ───────────────────────────────────────────────────────────────

    test('Validation of cancel button while updating a reworkable defect', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0203Steps = new RQA0203Steps(page, testInfo, helper);
        const rqa0203Page  = new RQA0203Page(page);
        const { zone } = await rqa0203Steps.submitRQA0203();
        await rqa0203Steps.updateRework(zone, updatedLabel);
        await helper.clickElement(rqa0203Page.cancelButton, 'Click Cancel button');
    });

    test('Validation of updating a reworkable defect by clicking submit button', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0203Steps = new RQA0203Steps(page, testInfo, helper);
        const rqa0203Page  = new RQA0203Page(page);
        const { defect, zone } = await rqa0203Steps.submitRQA0203();
        await rqa0203Steps.updateRework(zone, updatedLabel);
        await helper.clickElement(rqa0203Page.submitButtonToAdd, 'Click Submit button to confirm update');
        await rqa0203Steps.verifyUpdateLog(verifier, USER_ID, defect, updatedLabel, WORKSHOP);
    });

    // ── Delete ───────────────────────────────────────────────────────────────

    test('Validation of cancel button while deleting a reworkable defect', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0203Steps = new RQA0203Steps(page, testInfo, helper);
        const rqa0203Page  = new RQA0203Page(page);
        const { zone } = await rqa0203Steps.submitRQA0203();
        await rqa0203Steps.deleteRework(zone);
        await helper.clickElement(rqa0203Page.cancelButton, 'Click Cancel button');
    });

    test('Validation of deleting a reworkable defect by clicking submit button', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0203Steps = new RQA0203Steps(page, testInfo, helper);
        const rqa0203Page  = new RQA0203Page(page);
        const { defect, zone } = await rqa0203Steps.submitRQA0203();
        await rqa0203Steps.deleteRework(zone);
        await helper.clickElement(rqa0203Page.submitButtonToAdd, 'Click Submit button to confirm deletion');
        await rqa0203Steps.verifyDeleteLog(verifier, USER_ID, defect, updatedLabel, WORKSHOP);
        await helper.clickElement(rqa0203Page.newSelectionButton, 'Click New selection button');
    });

});

