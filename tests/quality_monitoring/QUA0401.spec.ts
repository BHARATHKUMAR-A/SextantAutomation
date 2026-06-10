import { expect } from '@playwright/test';
import * as path from 'path';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { QUA0401Steps } from '../../steps/QUA0401Steps';
import { QUA0401Page } from '../../pages/QUA0401Page';
import { getFirstCellValueByHeader } from '../../utils/excelHelper';

const QUA0401_EXCEL_FILE = path.resolve(__dirname, '../../test-data/SynopticsGlobalView.xlsx');

test.describe.serial('QUA0401 - Manage defects and reworks on parts', () => {
    test('Validation of consult parts quality information on UI using Excel crankline value for part defects', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0401Steps = new QUA0401Steps(page, testInfo, helper);
        const qua0401Page = new QUA0401Page(page);


        const cranklineValue = getFirstCellValueByHeader(QUA0401_EXCEL_FILE, 'Parts', 'Crankline');
        await qua0401Steps.qualityFollowUp(cranklineValue);
        await helper.clickElement(qua0401Page.qualityFollowupButton, 'Click on Quality follow up button');
        await page.waitForTimeout(2000);
        await helper.captureScreenshot('QUA0401_Quality_Follow_Up');

    });

    test('Validate switch quality indicator on UI using Excel crankline value for part defects', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0401Steps = new QUA0401Steps(page, testInfo, helper);
        const qua0401Page = new QUA0401Page(page);

        const cranklineValue = getFirstCellValueByHeader(QUA0401_EXCEL_FILE, 'Parts', 'Crankline');
        await qua0401Steps.switchQualityIndicator(qua0401Page.partDefects, cranklineValue);

    });

    test('Validate manage defects on UI using Excel crankline value for part defects', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0401Steps = new QUA0401Steps(page, testInfo, helper);
        const qua0401Page = new QUA0401Page(page);

        const cranklineValue = getFirstCellValueByHeader(QUA0401_EXCEL_FILE, 'Parts', 'Crankline');
        await qua0401Steps.manageDefects(qua0401Page.partDefects, cranklineValue);

    });

    test('Validate consult parts quality information on UI using Excel crankline value for Part quality blockings', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0401Steps = new QUA0401Steps(page, testInfo, helper);
        const qua0401Page = new QUA0401Page(page);


        const cranklineValue = getFirstCellValueByHeader(QUA0401_EXCEL_FILE, 'Parts', 'Crankline');
        await qua0401Steps.qualityFollowUp(cranklineValue);
        await helper.clickElement(qua0401Page.partQualityBlockings, 'Click on Part quality blockings');
         await page.waitForTimeout(2000);
        await helper.clickElement(qua0401Page.qualityFollowupButton, 'Click on Quality follow up button');
        await page.waitForTimeout(2000);
        await helper.captureScreenshot('QUA0401_Quality_Follow_Up');

    });

    

    test('Validation of switch quality indicator on UI using Excel crankline value for Part quality blockings', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0401Steps = new QUA0401Steps(page, testInfo, helper);
        const qua0401Page = new QUA0401Page(page);

        const cranklineValue = getFirstCellValueByHeader(QUA0401_EXCEL_FILE, 'Parts', 'Crankline');
        await qua0401Steps.switchQualityIndicator(qua0401Page.partQualityBlockings, cranklineValue);

    });

    test('Validation of manage blockings on UI using Excel crankline value for Part quality blockings scenario 2', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0401Steps = new QUA0401Steps(page, testInfo, helper);
        const qua0401Page = new QUA0401Page(page);

        const cranklineValue = getFirstCellValueByHeader(QUA0401_EXCEL_FILE, 'Parts', 'Crankline');
        await qua0401Steps.manageBlockings(qua0401Page.partQualityBlockings, cranklineValue);

    });



});