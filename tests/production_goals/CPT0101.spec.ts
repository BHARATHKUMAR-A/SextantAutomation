import { expect } from '@playwright/test';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { CPT0101ScreenSteps } from '../../steps/CPT0101Steps';
import { CPT0101Page } from '../../pages/CPT0101Page';


let counterName: string;


test.describe.serial('Log verification after UI actions', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        if (!counterName) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            counterName = `TEST_${await sshHelper.generateRandomAlphanumeric(1)}`;
        }
    });

    test('Validation of success abandoned error message on  UI for CPT0101', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);


        await cpt0101Steps.creationCPT0101(counterName);
        await helper.clickElement(cpt0101Page.cancelButton, 'Click on Cancel button');
        await helper.assertElementHasText(cpt0101Page.creationAbondenedMessage, 'creation abandoned', 'Verify creation abandoned message is displayed');
        await page.waitForTimeout(3000);


    });

    test('Validation of success message on both Putty and UI for CPT0101', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);

        
        await cpt0101Steps.creationCPT0101(counterName);
        await helper.clickElement(cpt0101Page.validateButton, 'Click on Validate button');
        await helper.clickElement(cpt0101Page.yesButton, 'Click on Yes button to confirm creation');
        await helper.assertElementHasText(cpt0101Page.createSuccessMessage, 'creation done', 'Verify creation success message is displayed');
        await page.waitForTimeout(3000);


    });

    test('Validation of view button UI for CPT0101', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);


        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);
        console.log('Counter Name used for selection:', counterName);
        await cpt0101Steps.viewCPT0101Details(counterName);


        await page.waitForTimeout(3000);


    });

    test('Validation of modify button UI for CPT0101', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);


        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);
        console.log('Counter Name used for selection:', counterName);
        await cpt0101Steps.modifyCPT0101Details(counterName);


        await page.waitForTimeout(3000);


    });

    test('Validation of duplicate button UI for CPT0101', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);


        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);
        console.log('Counter Name used for selection:', counterName);
        await cpt0101Steps.duplicateCPT0101Details(counterName);


        await page.waitForTimeout(3000);


    });

    test('Validation of delete success message UI for CPT0101', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);


        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);
        // console.log('Counter Name used for selection:', counterName);
        await cpt0101Steps.deleteCPT0101Details('DUPLICAT');


        await page.waitForTimeout(3000);


    });





});