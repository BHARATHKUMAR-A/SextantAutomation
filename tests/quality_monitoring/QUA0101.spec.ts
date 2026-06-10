import { expect } from '@playwright/test';
import * as path from 'path';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { QUA0101Steps } from '../../steps/QUA0101Steps';
import { QUA0101Page } from '../../pages/QUA0101Page';
import testConfig from '../../test-data/testConfig.json';



const QUA0401_EXCEL_FILE = path.resolve(__dirname, '../../test-data/SynopticsGlobalView.xlsx');

test.describe.serial('Update part definition  (QUA0101) ', () => {
    test('Validation of Updating part definition on QUA0101 Screen ', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const qua0101Steps = new QUA0101Steps(page, testInfo, helper);
        const qua0101Page = new QUA0101Page(page); 
        const qua0101Config = testConfig[1]?.QUA0101;

        if (!qua0101Config) {
            throw new Error('Missing QUA0101 test config');
        }
                

        await qua0101Steps.updatePartDefinition(qua0101Config.oldProduct, qua0101Config.rangeNumber);
    });



    });