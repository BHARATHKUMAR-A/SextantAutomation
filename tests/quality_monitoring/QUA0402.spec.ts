import { expect } from '@playwright/test';
import * as path from 'path';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { QUA0401Steps } from '../../steps/QUA0401Steps';
import { QUA0401Page } from '../../pages/QUA0401Page';
import { getFirstCellValueByHeader } from '../../utils/excelHelper';
import { QUA0402Page } from '../../pages/QUA0402Page';
import { QUA0402Steps } from '../../steps/QUA0402Steps';

const QUA0401_EXCEL_FILE = path.resolve(__dirname, '../../test-data/SynopticsGlobalView.xlsx');

test.describe.serial('  Manage defects and reworks on multiple parts  (QUA0402) ', () => {
    test('Validation of production history on QUA0402 Screen ', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0402Steps = new QUA0402Steps(page, testInfo, helper);
        const qua0402Page = new QUA0402Page(page);


        await qua0402Steps.workStationSelectionSubmit();
        await page.waitForTimeout(2000);
        await helper.captureScreenshot('QUA0402_Quality_Follow_Up');
        await helper.clickElement(qua0402Page.newSelectionButton, 'Click on New selection button');

    });

    test('Validation of Identifier sequence on QUA0402 Screen ', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0402Steps = new QUA0402Steps(page, testInfo, helper);
        const qua0402Page = new QUA0402Page(page);


        await qua0402Steps.identifierSequenceValidation();
        await page.waitForTimeout(2000);
        await helper.captureScreenshot('QUA0402_Identifier_Sequence_Submission');

    });

    test('Validation of Quality information on QUA0402 Screen ', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0402Steps = new QUA0402Steps(page, testInfo, helper);
        const qua0402Page = new QUA0402Page(page);


        await qua0402Steps.qualityInformationValidation();

    });

    test('Validation of Advanced search on QUA0402 Screen ', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0402Steps = new QUA0402Steps(page, testInfo, helper);
        const qua0402Page = new QUA0402Page(page);


        await qua0402Steps.advancedSearchRequestSubmission();
    });



});