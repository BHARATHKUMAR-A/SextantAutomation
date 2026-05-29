import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { RQA0102Steps } from '../../steps/RQA0102Steps';
import { RQA0102Page } from '../../pages/RQA0102Page';
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
let attribute: string;
let description: string;
let updatedDesc: string;

test.describe.serial('RQA0102 - Manage Measured Parameter Attributes', () => {

    test.beforeAll(() => {
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    test.beforeEach(async ({ page }, testInfo) => {
        if (!attribute) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            attribute = `TEST_${await sshHelper.generateRandomAlphanumeric(1)}`;
            description = `Description_${await sshHelper.generateRandomAlphanumeric(3)}`;
            updatedDesc = `UPD_${await sshHelper.generateRandomAlphanumeric(3)}`;
        }
    });

    test('Submission — select workshop and submit for selecting  Measurable parameters Families.', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);

        await rqa0102Steps.submitRQA0102(WORKSHOP);

    });

    test('Validation of cancel button while adding an attribute for selecting  Measurable parameters Families.', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102(WORKSHOP);
        await rqa0102Steps.addAttributeRQA0102(attribute, description);
        await helper.clickElement(rqa0102Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of add an attribute by clicking submit button for selecting  Measurable parameters Families.', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102(WORKSHOP);
        await rqa0102Steps.addAttributeRQA0102(attribute, description);
        await helper.clickElement(rqa0102Page.submitButtonToAdd, 'Click Submit button to confirm addition');

        // Validate UI success message and backend log
        await rqa0102Steps.verifyAddLog(verifier, USER_ID, attribute, description, WORKSHOP);

    });

    test('Validation of cancel button while updating an attribute for selecting  Measurable parameters Families.', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102(WORKSHOP);
        await rqa0102Steps.updateAttributeRQA0102(attribute, updatedDesc);
        await helper.clickElement(rqa0102Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of update an attribute by clicking submit button for selecting  Measurable parameters Families.', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102(WORKSHOP);
        await rqa0102Steps.updateAttributeRQA0102(attribute, updatedDesc);
        await helper.clickElement(rqa0102Page.submitButtonToAdd, 'Click Submit button to confirm update');

        // Validate UI success message and backend log
        await rqa0102Steps.verifyUpdateLog(verifier, USER_ID, attribute, updatedDesc, WORKSHOP);

    });

    test('Validation of cancel button while deleting an attribute for selecting  Measurable parameters Families.', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102(WORKSHOP);
        await rqa0102Steps.deleteAttributeRQA0102(attribute);
        await helper.clickElement(rqa0102Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of delete an attribute by clicking submit button for selecting  Measurable parameters Families.', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102(WORKSHOP);
        await rqa0102Steps.deleteAttributeRQA0102(attribute);
        await helper.clickElement(rqa0102Page.submitButtonToAdd, 'Click Submit button to confirm deletion');

        // Validate UI success message and backend log
        await rqa0102Steps.verifyDeleteLog(verifier, USER_ID, attribute, updatedDesc, WORKSHOP);

    });

});

// ─────────────────────────────────────────────────────────────────────────────
// TYPE radio button test suite
// ─────────────────────────────────────────────────────────────────────────────

let typeAttribute: string;
let typeDescription: string;
let typeUpdatedDesc: string;

test.describe.serial('RQA0102 - Manage Measured Parameter Attributes (Type radio)', () => {

    test.beforeAll(() => {
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    test.beforeEach(async ({ page }, testInfo) => {
        if (!typeAttribute) {
            const sshHelper   = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            typeAttribute     = `TEST_${await sshHelper.generateRandomAlphanumeric(1)}`;
            typeDescription   = `${await sshHelper.generateRandomAlphanumeric(3)}`;
            typeUpdatedDesc   = `UPD_${await sshHelper.generateRandomAlphanumeric(3)}`;
        }
    });

    test('Submission — select workshop, check Type radio and submit', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);

        await rqa0102Steps.submitRQA0102WithType(WORKSHOP);

    });

    test('Validation of cancel button while adding a Type attribute', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithType(WORKSHOP);
        await rqa0102Steps.addAttributeRQA0102(typeAttribute, typeDescription);
        await helper.clickElement(rqa0102Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of add a Type attribute by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithType(WORKSHOP);
        await rqa0102Steps.addAttributeRQA0102(typeAttribute, typeDescription);
        await helper.clickElement(rqa0102Page.submitButtonToAdd, 'Click Submit button to confirm addition');

        // Validate UI success message and backend log
        await rqa0102Steps.verifyAddLogType(verifier, USER_ID, typeAttribute, typeDescription, WORKSHOP);

    });

    test('Validation of cancel button while updating a Type attribute', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithType(WORKSHOP);
        await rqa0102Steps.updateAttributeRQA0102(typeAttribute, typeUpdatedDesc);
        await helper.clickElement(rqa0102Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of update a Type attribute by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithType(WORKSHOP);
        await rqa0102Steps.updateAttributeRQA0102(typeAttribute, typeUpdatedDesc);
        await helper.clickElement(rqa0102Page.submitButtonToAdd, 'Click Submit button to confirm update');

        // Validate UI success message and backend log
        await rqa0102Steps.verifyUpdateLogType(verifier, USER_ID, typeAttribute, typeUpdatedDesc, WORKSHOP);

    });

    test('Validation of cancel button while deleting a Type attribute', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithType(WORKSHOP);
        await rqa0102Steps.deleteAttributeRQA0102(typeAttribute);
        await helper.clickElement(rqa0102Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of delete a Type attribute by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithType(WORKSHOP);
        await rqa0102Steps.deleteAttributeRQA0102(typeAttribute);
        await helper.clickElement(rqa0102Page.submitButtonToAdd, 'Click Submit button to confirm deletion');

        // Validate UI success message and backend log
        await rqa0102Steps.verifyDeleteLogType(verifier, USER_ID, typeAttribute, typeUpdatedDesc, WORKSHOP);

    });

});

// ─────────────────────────────────────────────────────────────────────────────────
// UNIT radio button test suite
// ─────────────────────────────────────────────────────────────────────────────────

let unitAttribute: string;
let unitDescription: string;
let unitUpdatedDesc: string;

test.describe.serial('RQA0102 - Manage Measured Parameter Attributes (Unit radio)', () => {

    test.beforeAll(() => {
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    test.beforeEach(async ({ page }, testInfo) => {
        if (!unitAttribute) {
            const sshHelper  = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            unitAttribute    = `T${await sshHelper.generateRandomAlphanumeric(2)}`;
            unitDescription  = `${await sshHelper.generateRandomAlphanumeric(3)}`;
            unitUpdatedDesc  = `UPD_${await sshHelper.generateRandomAlphanumeric(3)}`;
        }
    });

    test('Submission — select workshop, check Unit radio and submit', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);

        await rqa0102Steps.submitRQA0102WithUnit(WORKSHOP);

    });

    test('Validation of cancel button while adding a Unit attribute', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithUnit(WORKSHOP);
        await rqa0102Steps.addAttributeRQA0102(unitAttribute, unitDescription);
        await helper.clickElement(rqa0102Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of add a Unit attribute by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithUnit(WORKSHOP);
        await rqa0102Steps.addAttributeRQA0102(unitAttribute, unitDescription);
        await helper.clickElement(rqa0102Page.submitButtonToAdd, 'Click Submit button to confirm addition');

        // Validate UI success message and backend log
        await rqa0102Steps.verifyAddLogUnit(verifier, USER_ID, unitAttribute, unitDescription, WORKSHOP);

    });

    test('Validation of cancel button while updating a Unit attribute', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithUnit(WORKSHOP);
        await rqa0102Steps.updateAttributeRQA0102(unitAttribute, unitUpdatedDesc);
        await helper.clickElement(rqa0102Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of update a Unit attribute by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithUnit(WORKSHOP);
        await rqa0102Steps.updateAttributeRQA0102(unitAttribute, unitUpdatedDesc);
        await helper.clickElement(rqa0102Page.submitButtonToAdd, 'Click Submit button to confirm update');

        // Validate UI success message and backend log
        await rqa0102Steps.verifyUpdateLogUnit(verifier, USER_ID, unitAttribute, unitUpdatedDesc, WORKSHOP);

    });

    test('Validation of cancel button while deleting a Unit attribute', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithUnit(WORKSHOP);
        await rqa0102Steps.deleteAttributeRQA0102(unitAttribute);
        await helper.clickElement(rqa0102Page.cancelButton, 'Click Cancel button');

    });

    test('Validation of delete a Unit attribute by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0102Steps = new RQA0102Steps(page, testInfo, helper);
        const rqa0102Page  = new RQA0102Page(page);

        await rqa0102Steps.submitRQA0102WithUnit(WORKSHOP);
        await rqa0102Steps.deleteAttributeRQA0102(unitAttribute);
        await helper.clickElement(rqa0102Page.submitButtonToAdd, 'Click Submit button to confirm deletion');

        // Validate UI success message and backend log
        await rqa0102Steps.verifyDeleteLogUnit(verifier, USER_ID, unitAttribute, unitUpdatedDesc, WORKSHOP);

    });

});
