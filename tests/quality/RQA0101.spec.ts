import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { RQA0101Steps } from '../../steps/RQA0101Steps';
import { RQA0101Page } from '../../pages/RQA0101Page';
import { PuttyLogReader } from '../../utils/puttyLogReader';
import * as fs from 'fs';
import envConfig from '../../test-data/envConfig.json';
import credentials from '../../test-data/credentials.json';

const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : DEFAULT_PUTTY_LOG_FILE;

const USER_ID = credentials.Credentials.username;

let verifier: PuttyLogReader;


let counterName: string;

test.describe.serial('RQA0101 - Manage Attributes', () => {
    test.beforeAll(() => {
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    test.beforeEach(async ({ page }, testInfo) => {
        if (!counterName) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            counterName = `TEST_${await sshHelper.generateRandomAlphanumeric(1)}`;
        }
    });

    test('Submission — select workshop, area, operation and submit', async ({ page }, testInfo) => {

        const helper      = new StepHelper(page, testInfo);
        const rqa0101Steps = new RQA0101Steps(page, testInfo, helper);

        await rqa0101Steps.submitRQA0101('EBAS1', 'C1', 'OP2000');

    });

    test('Validation of cancel button while adding a measurable parameter', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0101Steps = new RQA0101Steps(page, testInfo, helper);
        const rqa0101Page  = new RQA0101Page(page);

        // First submit to reach the results screen where Add button appears
        await rqa0101Steps.submitRQA0101('EBAS1', 'C1', 'OP2000');

        // Then fill and cancel the Add parameter form
        await rqa0101Steps.addParameterRQA0101(counterName, 'TEST');
        await helper.clickElement(rqa0101Page.cancelButton, 'Click Cancel button');

    });

    

    test('Validation of add a measurable parameter by clicking submit button', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0101Steps = new RQA0101Steps(page, testInfo, helper);
        const rqa0101Page  = new RQA0101Page(page);

        // First submit to reach the results screen where Add button appears
        await rqa0101Steps.submitRQA0101('EBAS1', 'C1', 'OP2000');

        // Then fill and submit the Add parameter form
        await rqa0101Steps.addParameterRQA0101(counterName, 'TEST');
        await helper.clickElement(rqa0101Page.submitButtonToAdd, 'Click Submit button');

        // Validate UI success message and backend log entry
        await rqa0101Steps.verifyAddLog(verifier, USER_ID, counterName, 'EBAS1', 'C1', 'OP2000', 'TEST');

    });

    test('Update — select created parameter and update description', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0101Steps = new RQA0101Steps(page, testInfo, helper);

        // Submit first to load the parameters table
        await rqa0101Steps.submitRQA0101('EBAS1', 'C1', 'OP2000');

        // Select the parameter created in the previous test and update its description
        await rqa0101Steps.updateParameterRQA0101(counterName, 'TESTING');

    });

    test('Validation of cancel button while deleting a measurable parameter', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0101Steps = new RQA0101Steps(page, testInfo, helper);
        const rqa0101Page  = new RQA0101Page(page);

        // Submit first to load the parameters table
        await rqa0101Steps.submitRQA0101('EBAS1', 'C1', 'OP2000');

        // Select the created parameter and click Delete, then cancel the deletion
        await rqa0101Steps.deleteParameterRQA0101(counterName);
        await helper.clickElement(rqa0101Page.cancelButton, 'Click Cancel button');


    });

    test('Validation of submit button while deleting a measurable parameter', async ({ page }, testInfo) => {

        const helper       = new StepHelper(page, testInfo);
        const rqa0101Steps = new RQA0101Steps(page, testInfo, helper);
        const rqa0101Page  = new RQA0101Page(page);

        // Submit first to load the parameters table
        await rqa0101Steps.submitRQA0101('EBAS1', 'C1', 'OP2000');

        // Select the created parameter and click Delete, then submit the deletion
        await rqa0101Steps.deleteParameterRQA0101(counterName);
        await helper.clickElement(rqa0101Page.submitButtonToAdd, 'Click Submit button to confirm deletion');

        // Validate backend log entry
        await rqa0101Steps.verifyDeleteLog(verifier, USER_ID, counterName);
    });

});
