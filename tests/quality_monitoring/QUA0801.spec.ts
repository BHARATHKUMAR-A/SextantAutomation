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
import { QUA0801Steps } from '../../steps/QUA0801Steps';
import { QUA0801Page } from '../../pages/QUA0801Page';
// import { QUA0801Page } from '../../pages/QUA0801Page';



const QUA0401_EXCEL_FILE = path.resolve(__dirname, '../../test-data/SynopticsGlobalView.xlsx');
const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : DEFAULT_PUTTY_LOG_FILE;


test.describe.serial('QUA0801 - Manage defects and follow up ', () => {

    test('Validation of QUA0801 - Update traceability between parts and components packages  ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0801Steps = new QUA0801Steps(page, testInfo, helper);
        const qua0801Page = new QUA0801Page(page);
        const verifier = new PuttyLogReader(PUTTY_LOG_FILE);


        await qua0801Steps.replacementOfParcelToPart();
    });

    

    
});