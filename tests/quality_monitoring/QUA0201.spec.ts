import { expect } from '@playwright/test';
import * as path from 'path';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { QUA0201Steps } from '../../steps/QUA0201Steps';
import { QUA0201Page } from '../../pages/QUA0201Page';
import { PuttyLogReader } from '../../utils/puttyLogReader';
import * as fs from 'fs';
import envConfig from '../../test-data/envConfig.json';
import credentials from '../../test-data/credentials.json';
import testConfig from '../../test-data/testConfig.json';



const QUA0401_EXCEL_FILE = path.resolve(__dirname, '../../test-data/SynopticsGlobalView.xlsx');
const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : DEFAULT_PUTTY_LOG_FILE;

let benchNum = 'HTB1';
let partId = '10ZA0R0000002';

test.describe.serial('QUA0201 - Declare test bench result ', () => {

    test('Validation of input mandatory error when submitting with empty test bench on QUA0201 Screen ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0201Steps = new QUA0201Steps(page, testInfo, helper);
        const qua0201Page = new QUA0201Page(page);
        const verifier = new PuttyLogReader(PUTTY_LOG_FILE);


        await qua0201Steps.submitWithoutTestBenchToSeeError();
    });

    test('Validation of input mandatory error when submitting with empty Part id on QUA0201 Screen ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0201Steps = new QUA0201Steps(page, testInfo, helper);
        const qua0201Page = new QUA0201Page(page);
        const verifier = new PuttyLogReader(PUTTY_LOG_FILE);


        await qua0201Steps.submitWithoutPartIdToSeeError(benchNum);
    });

    test('Validation of input mandatory error when submitting with empty Result on QUA0201 Screen ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0201Steps = new QUA0201Steps(page, testInfo, helper);
        const qua0201Page = new QUA0201Page(page);
        const verifier = new PuttyLogReader(PUTTY_LOG_FILE);


        await qua0201Steps.submitWithoutResultToSeeError(benchNum, partId);
    });

    test('Validation of Declaring test bench result Good on QUA0201 Screen ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0201Steps = new QUA0201Steps(page, testInfo, helper);
        const qua0201Page = new QUA0201Page(page);
        const verifier = new PuttyLogReader(PUTTY_LOG_FILE);


        await qua0201Steps.testBenchResult(benchNum, partId, 'Good');
        await helper.clickElement(qua0201Page.submitButton, 'Click on submit button after selecting Result option');

        const successMessage = page.locator('frame[name="main"]').contentFrame().locator(`//div[contains(text(),'Declaring Passing to bed done (workstation : ${benchNum}, part : ${partId}, user : SF75684, result : Good ,  nbPassage : ')]`);
        console.log('Success Message locator prepared');

        await expect(successMessage).toBeVisible({ timeout: 5000 });

        await qua0201Steps.verifyPassageLog(verifier, credentials.Credentials.username, benchNum, partId, 'B');
    });

    test('Validation of Declaring test bench result Bad on QUA0201 Screen ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0201Steps = new QUA0201Steps(page, testInfo, helper);
        const verifier = new PuttyLogReader(PUTTY_LOG_FILE);
        const qua0201Page = new QUA0201Page(page);





        await qua0201Steps.testBenchResult(benchNum, partId, 'Bad');
        await helper.clickElement(qua0201Page.submitButton, 'Click on submit button after selecting Result option');

        console.log('screen transitioned to QUA0401, now verifying the title');
        await helper.assertElementHasText(qua0201Page.qua0401Title, 'Manage defects of a part  (QUA0401)', 'QUA0401 Title');
        // await qua0201Steps.verifyPassageLog(verifier, credentials.Credentials.username, benchNum, partId, 'M');

    });

    test('Validation of Cleaning on QUA0201 Screen ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0201Steps = new QUA0201Steps(page, testInfo, helper);
        const qua0201Page = new QUA0201Page(page);



        await qua0201Steps.testBenchResult(benchNum, partId, 'Bad');
        await helper.clickElement(qua0201Page.cleaningButton, 'Click on cleaning button after selecting Result option');
    });

    test('Validation of Degraded mode on QUA0201 Screen ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0201Steps = new QUA0201Steps(page, testInfo, helper);
        const qua0201Page = new QUA0201Page(page);



        await qua0201Steps.testBenchResult(benchNum, partId, 'Bad');
        await helper.clickElement(qua0201Page.degradedModeButton, 'Click on degraded mode button after selecting Result option');
        await helper.assertElementHasText(qua0201Page.changingModeMessage, 'Changing the mode done', 'Active degraded mode text after clicking on degraded mode button');
    });

    test('Validation of Normal mode on QUA0201 Screen ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0201Steps = new QUA0201Steps(page, testInfo, helper);
        const qua0201Page = new QUA0201Page(page);



        await qua0201Steps.testBenchResult(benchNum, partId, 'Bad');
        await helper.clickElement(qua0201Page.nominalModeButton, 'Click on nominal mode button after selecting Result option');
        await helper.assertElementHasText(qua0201Page.changingModeMessage, 'Changing the mode done', 'Active degraded mode text after clicking on degraded mode button');

        await expect(qua0201Page.degradedModeButton).toBeVisible({ timeout: 5000 });
        console.log('Degraded mode button is visible after clicking on nominal mode button');

    });

});



