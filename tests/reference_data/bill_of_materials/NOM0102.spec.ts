import { test } from '../../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper } from '../../../utils/StepHelper';
import { SshHelper } from '../../../utils/sshHelper';
import { NOM0101Steps } from '../../../steps/NOM0101Steps';
import { NOM0101Page } from '../../../pages/NOM0101Page';
import { PuttyLogReader } from '../../../utils/puttyLogReader';
import * as fs from 'fs';
import envConfig from '../../../test-data/envConfig.json';
import credentials from '../../../test-data/credentials.json';
import { NOM0102Steps } from '../../../steps/NOM0102Steps';
import { NOM0102Page } from '../../../pages/NOM0102Page';



test.describe.serial('NOM0102 - Compare manufactured products', () => {
   

    test('Navigate to NOM0102 and verify title', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0102Steps = new NOM0102Steps(page, testInfo, helper);
        const nom0102Page = new NOM0102Page(page);


        await nom0102Steps.navigateToNOM0102();
        await helper.assertElementHasText(nom0102Page.compareTwoProductsNom0102Title, 'Compare two Product  (NOM0102)', 'Verify NOM0102 title is visible');
    });


});