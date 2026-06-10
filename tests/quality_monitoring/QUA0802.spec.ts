import { expect } from '@playwright/test';
import * as path from 'path';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { PuttyLogReader } from '../../utils/puttyLogReader';
import * as fs from 'fs';
import envConfig from '../../test-data/envConfig.json';
import { QUA0802Steps } from '../../steps/QUA0802Steps';
import { QUA0802Page } from '../../pages/QUA0802Page';



const QUA0401_EXCEL_FILE = path.resolve(__dirname, '../../test-data/SynopticsGlobalView.xlsx');
const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : DEFAULT_PUTTY_LOG_FILE;


test.describe('QUA0802 - Manage defects and follow up ', () => {

    test('Validation of The format of the serial number of the component is not correct error on  QUA0802 - Update traceability between parts and components packages  ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0802Steps = new QUA0802Steps(page, testInfo, helper);
        const qua0802Page = new QUA0802Page(page);
        const verifier = new PuttyLogReader(PUTTY_LOG_FILE);


        await qua0802Steps.partToPartTraceability('EXP1');

        await helper.assertElementHasText(qua0802Page.formatNotCorrectError, 'The format of the serial number of the component is not correct', 'Verify error message is displayed');
        await page.waitForTimeout(1500);
    });

    

    
});