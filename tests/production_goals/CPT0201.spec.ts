import { expect } from '@playwright/test';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { CPT0201ScreenSteps } from '../../steps/CPT0201Steps';
import { CPT0201Page } from '../../pages/CPT0201Page';



let counterName: string;
let selectedCounterText: string | undefined;
let frameLocCommon: any;


test.describe.serial('Log verification after UI actions', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        frameLocCommon = page.locator('frame[name="main"]').contentFrame();
        if (!counterName) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            counterName = `TEST_${await sshHelper.generateRandomAlphanumeric(1)}`;
        }
    });

    test('Validation of error messages on main screen UI for CPT0201', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0201Page = new CPT0201Page(page);
        const cpt0201Steps = new CPT0201ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;


        await cpt0201Steps.navigateToCPT0201Screen(counterName);
        await cpt0201Steps.validateErrorMessagesOnCPT0201Screen(counterName);

        await page.waitForTimeout(3000);

    });



    test('Validation of add a group on  screen UI for CPT0201', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0201Page = new CPT0201Page(page);
        const cpt0201Steps = new CPT0201ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;


        await cpt0201Steps.navigateToCPT0201Screen(counterName);
        await cpt0201Steps.addGroupInListOfGroups(counterName, 'Description for ' + counterName);

        await page.waitForTimeout(3000);

    });

    test('Validation of Cancel button while updating a group on  screen UI for CPT0201', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0201Page = new CPT0201Page(page);
        const cpt0201Steps = new CPT0201ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;


        await cpt0201Steps.navigateToCPT0201Screen(counterName);
        const selectAddedGroup = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: counterName }).nth(2)
        await cpt0201Steps.updateGroupInListOfGroups(selectAddedGroup);
        await helper.clickElement(cpt0201Page.cancelButton, 'Click on cancel button');


        await page.waitForTimeout(3000);

    });

    test('Validation of update a group by click on submit button on  screen UI for CPT0201', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0201Page = new CPT0201Page(page);
        const cpt0201Steps = new CPT0201ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;


        await cpt0201Steps.navigateToCPT0201Screen(counterName);
        const selectAddedGroup = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: counterName }).nth(2)
        await cpt0201Steps.updateGroupInListOfGroups(selectAddedGroup);
        await helper.clickElement(cpt0201Page.submitButton, 'Click on submit button');


        await page.waitForTimeout(3000);

    });

    test('Validation of cancel button while deleting a group on  screen UI for CPT0201', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0201Page = new CPT0201Page(page);
        const cpt0201Steps = new CPT0201ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;


        await cpt0201Steps.navigateToCPT0201Screen(counterName);
        const selectAddedGroup = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: counterName }).nth(2)
        await cpt0201Steps.deleteGroupInListOfGroups(selectAddedGroup);
        await helper.clickElement(cpt0201Page.cancelButton, 'Click on cancel button');


        await page.waitForTimeout(3000);

    });

    test('Validation of delete a group by click on submit button on  screen UI for CPT0201', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0201Page = new CPT0201Page(page);
        const cpt0201Steps = new CPT0201ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;


        await cpt0201Steps.navigateToCPT0201Screen(counterName);
        const selectAddedGroup = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: counterName }).nth(2)
        await cpt0201Steps.deleteGroupInListOfGroups(selectAddedGroup);
        await helper.clickElement(cpt0201Page.submitButton, 'Click on submit button');


        await page.waitForTimeout(3000);

    });
});