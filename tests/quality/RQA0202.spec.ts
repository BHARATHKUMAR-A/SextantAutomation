import { test } from '../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { RQA0202Steps } from '../../steps/RQA0202Steps';
import { RQA0202Page } from '../../pages/RQA0202Page';
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
let defectLabel: string;
let updatedLabel: string;

test.describe.serial('RQA0202 - Manage Announceable Defects', () => {

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

    test('Validation of screen title — Manage the announceable defects', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0202Steps = new RQA0202Steps(page, testInfo, helper);
        const rqa0202Page  = new RQA0202Page(page);
        await rqa0202Steps.navigateToRQA0202();
        await helper.assertElementHasText(rqa0202Page.screenTitle, 'Manage the announceable defects  (RQA0202)', 'Verify screen title is displayed');
    });

    // ── Submit (workshop/zone/poste/defect selection) ───────────────────────

    test('Submission — select all dropdowns and submit for Manage Announceable Defects', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0202Steps = new RQA0202Steps(page, testInfo, helper);
        const { defect, zone } = await rqa0202Steps.submitRQA0202();
        console.log(`[RQA0202] Submitted with defect=${defect}, zone=${zone}`);
    });

    // ── Create ───────────────────────────────────────────────────────────────

    test('Validation of cancel button while creating an announceable defect', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0202Steps = new RQA0202Steps(page, testInfo, helper);
        const rqa0202Page  = new RQA0202Page(page);
        await rqa0202Steps.submitRQA0202();
        await rqa0202Steps.createDefect(defectLabel);
        await helper.clickElement(rqa0202Page.cancelButton, 'Click Cancel button');
    });

    test('Validation of creating an announceable defect by clicking submit button', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0202Steps = new RQA0202Steps(page, testInfo, helper);
        const rqa0202Page  = new RQA0202Page(page);
        const { defect, zone } = await rqa0202Steps.submitRQA0202();
        await rqa0202Steps.createDefect(defectLabel);
        await helper.clickElement(rqa0202Page.submitButtonToAdd, 'Click Submit button to confirm creation');
        await rqa0202Steps.verifyCreateLog(verifier, USER_ID, defect, defectLabel, WORKSHOP);
    });

    // ── Update ───────────────────────────────────────────────────────────────

    test('Validation of cancel button while updating an announceable defect', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0202Steps = new RQA0202Steps(page, testInfo, helper);
        const rqa0202Page  = new RQA0202Page(page);
        const { zone } = await rqa0202Steps.submitRQA0202();
        await rqa0202Steps.updateDefect(zone, updatedLabel);
        await helper.clickElement(rqa0202Page.cancelButton, 'Click Cancel button');
    });

    test('Validation of updating an announceable defect by clicking submit button', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0202Steps = new RQA0202Steps(page, testInfo, helper);
        const rqa0202Page  = new RQA0202Page(page);
        const { defect, zone } = await rqa0202Steps.submitRQA0202();
        await rqa0202Steps.updateDefect(zone, updatedLabel);
        await helper.clickElement(rqa0202Page.submitButtonToAdd, 'Click Submit button to confirm update');
        await rqa0202Steps.verifyUpdateLog(verifier, USER_ID, defect, updatedLabel, WORKSHOP);
    });

    // ── Delete ───────────────────────────────────────────────────────────────

    test('Validation of cancel button while deleting an announceable defect', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0202Steps = new RQA0202Steps(page, testInfo, helper);
        const rqa0202Page  = new RQA0202Page(page);
        const { zone } = await rqa0202Steps.submitRQA0202();
        await rqa0202Steps.deleteDefect(zone);
        await helper.clickElement(rqa0202Page.cancelButton, 'Click Cancel button');
    });

    test('Validation of deleting an announceable defect by clicking submit button', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const rqa0202Steps = new RQA0202Steps(page, testInfo, helper);
        const rqa0202Page  = new RQA0202Page(page);
        const { defect, zone } = await rqa0202Steps.submitRQA0202();
        await rqa0202Steps.deleteDefect(zone);
        await helper.clickElement(rqa0202Page.submitButtonToAdd, 'Click Submit button to confirm deletion');
        await rqa0202Steps.verifyDeleteLog(verifier, USER_ID, defect, updatedLabel, WORKSHOP);
    });

});
