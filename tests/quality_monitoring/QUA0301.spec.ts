import { expect } from '@playwright/test';
import * as path from 'path';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { QUA0301Steps } from '../../steps/QUA0301Steps';
import { getFirstCellValueByHeader } from '../../utils/excelHelper';

const QUA0301_EXCEL_FILE = path.resolve(__dirname, '../../test-data/SynopticsGlobalView.xlsx');

test.describe('QUA0301 - Consult parts quality information', () => {
    test('Validation of consult parts quality information on UI using Excel crankline value', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const qua0301Steps = new QUA0301Steps(page, testInfo, helper);
        const cranklineValue = getFirstCellValueByHeader(QUA0301_EXCEL_FILE, 'Parts', 'Crankline');
        await qua0301Steps.consultPartsQualityInformation(cranklineValue);
    });

    
});