import { expect } from '@playwright/test';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { CPT0102ScreenSteps } from '../../steps/CPT0102Steps';
import { CPT0102Page } from '../../pages/CPT0102Page';
import { Top0401ManageProductionAreasPage } from '../../pages/Top0401ManageProductionAreasPage';



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

    test('Validation of creation abandoned error message on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);
        const cpt0102Steps = new CPT0102ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;


        await cpt0102Steps.creationCPT0102();
        selectedCounterText = cpt0102Steps.counterText;
        console.log('✅✅✅Selected Counter Text:', selectedCounterText); // Debug log to verify the counter text
        await helper.clickElement(cpt0102Page.cancelButton, 'Click on Cancel button');
        await helper.assertElementHasText(cpt0102Page.creationAbondenedMessage, 'creation abandoned', 'Verify creation abandoned message is displayed');
        await page.waitForTimeout(3000);


    });

    test('Validation of error messages while creation on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);
        const cpt0102Steps = new CPT0102ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;

        await helper.clickElement(cpt0102Page.productionGoals, 'Click on Production Goals');
        await helper.clickElement(cpt0102Page.CPT0102, 'Select CPT0102 option');
        await helper.clickElement(cpt0102Page.createButton, 'Click on Create button');
        await helper.clickElement(cpt0102Page.validateButton, 'Click on validate button');
        await page.waitForTimeout(2000);
        await helper.captureScreenshot('ErrorMessagesOnCreation');
        await helper.assertElementHasText(cpt0102Page.noCounterAssociatedErrorMessage, 'No counter associated', 'Verify No counter associated error message is displayed');
        await helper.clickElement(cpt0102Page.add, 'Click on Add button');
        await helper.clickElement(cpt0102Page.validateButton, 'Click on validate button');
        await page.waitForTimeout(2000);
        await helper.captureScreenshot('ErrorMessagesOnCreation_FieldRequired');
        await helper.assertElementHasText(cpt0102Page.fieldRequiredErrorMessage, 'This field  is required', 'Verify Field required error message is displayed');


    });

    test('Validation of create success message on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);
        const cpt0102Steps = new CPT0102ScreenSteps(page, testInfo, helper);
        // selectedCounterText = undefined;

        console.log('📸📸📸✅✅✅Selected Counter Text:', selectedCounterText);
        await cpt0102Steps.creationCPT0102();
        await helper.clickElement(cpt0102Page.validateButton, 'Click on Validate button');
        await helper.assertElementHasText(cpt0102Page.creationSuccessMessage, 'creation done', 'Verify creation success message is displayed');
        await page.waitForTimeout(3000);


    });

    test('Validation of view button on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);


        await helper.clickElement(cpt0102Page.productionGoals, 'Click on Production Goals');
        await helper.clickElement(cpt0102Page.CPT0102, 'Select CPT0102 option');
        await helper.clickElement(cpt0102Page.goalPen1, 'Click on Create button');
        const goal1Option = page.locator('frame[name="main"]').contentFrame().getByText(`${selectedCounterText}`, { exact: true }).nth(1);
        await helper.clickElement(goal1Option, `Select Counter ${selectedCounterText} option`);

        await helper.clickElement(cpt0102Page.goalPen2, 'Click on goalPen2 button');
        const goalFilter2Option = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: `${selectedCounterText}`, exact: true }).nth(1);
        await helper.clickElement(goalFilter2Option, 'Click on counter filter 2 option');

        await helper.clickElement(cpt0102Page.goalPen3, 'Click on goalPen3 button');
        await helper.clickElement(cpt0102Page.workingDayOption, 'Click on working day option');


        console.log('✅✅✅📸📸📸✅✅✅Selected Counter Text:', selectedCounterText); // Debug log to verify the counter text
        const text = `${selectedCounterText}-(${selectedCounterText})`;
        const counterGateSelection = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: text }).nth(3)

        await helper.clickElement(counterGateSelection, 'Click on  counter selection');
        await helper.clickElement(cpt0102Page.viewButton, 'Click on View button');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `screenshots/${testInfo.title}_ViewScreen.png` });


    });

    test('Validation of Modify abandoned error message on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);
        const cpt0102Steps = new CPT0102ScreenSteps(page, testInfo, helper);
        const top0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);


        await helper.clickElement(cpt0102Page.productionGoals, 'Click on Production Goals');
        await helper.clickElement(cpt0102Page.CPT0102, 'Select CPT0102 option');
        const text = `${selectedCounterText}-(${selectedCounterText})`;
        const counterGateSelection = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: text }).nth(3);
        await helper.clickElement(counterGateSelection, 'Click on  counter selection');
        await helper.clickElement(cpt0102Page.modifyButton, 'Click on Modify button');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `screenshots/${testInfo.title}_ModifyScreen.png` });

        await cpt0102Steps.ModifyGoalValues();
        await page.waitForTimeout(3000);
        await helper.clickElement(cpt0102Page.cancelButton, 'Click on Cancel button after modification');

        await helper.assertElementHasText(cpt0102Page.modifyErrorMessage, 'Modification abandoned', 'Verify modification abandoned error message is displayed');

    });

    test('Validation of Modify button on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);
        const cpt0102Steps = new CPT0102ScreenSteps(page, testInfo, helper);
        const top0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);


        await helper.clickElement(cpt0102Page.productionGoals, 'Click on Production Goals');
        await helper.clickElement(cpt0102Page.CPT0102, 'Select CPT0102 option');
        const text = `${selectedCounterText}-(${selectedCounterText})`;
        const counterGateSelection = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: text }).nth(3);
        await helper.clickElement(counterGateSelection, 'Click on  counter selection');
        await helper.clickElement(cpt0102Page.modifyButton, 'Click on Modify button');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `screenshots/${testInfo.title}_ModifyScreen.png` });

        await cpt0102Steps.ModifyGoalValues();
        await helper.clickElement(cpt0102Page.validateButton, 'Click on Validate button after modification');
        await helper.clickElement(cpt0102Page.yesButton, 'Click on Yes button on confirmation');

        await page.waitForTimeout(3000);
        await helper.assertElementHasText(top0401ManageProductionAreas.modifySuccessMessage, 'Modification done', 'Verify modification success message is displayed');

    });

    test('Validation of Duplicate error message on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);
        const cpt0102Steps = new CPT0102ScreenSteps(page, testInfo, helper);
        const top0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);


        await helper.clickElement(cpt0102Page.productionGoals, 'Click on Production Goals');
        await helper.clickElement(cpt0102Page.CPT0102, 'Select CPT0102 option');
        const text = `${selectedCounterText}-(${selectedCounterText})`;
        const counterGateSelection = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: text }).nth(3);
        await helper.clickElement(counterGateSelection, 'Click on  counter selection');
        await helper.clickElement(cpt0102Page.duplicateButton, 'Click on Duplicate button');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `screenshots/${testInfo.title}_ModifyScreen.png` });
        await helper.clickElement(cpt0102Page.cancelButton, 'Click on Cancel button after modification');

        await page.waitForTimeout(3000);
        await helper.assertElementHasText(cpt0102Page.duplicateErrorMessage, 'Duplication abandoned', 'Verify duplication abandoned error message is displayed');

    });

    test('Validation of Duplicate success message on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);
        const cpt0102Steps = new CPT0102ScreenSteps(page, testInfo, helper);
        const top0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);


        await helper.clickElement(cpt0102Page.productionGoals, 'Click on Production Goals');
        await helper.clickElement(cpt0102Page.CPT0102, 'Select CPT0102 option');
        const text = `${selectedCounterText}-(${selectedCounterText})`;
        const counterGateSelection = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: text }).nth(3);
        await helper.clickElement(counterGateSelection, 'Click on  counter selection');
        await helper.clickElement(cpt0102Page.duplicateButton, 'Click on Duplicate button');
        await helper.clickElement(cpt0102Page.dayTypePenForDuplicate, 'Click on day type pen for duplicate');
        await helper.clickElement(cpt0102Page.dayTypeOptionHalfWorkingDay, 'Select Half Working Day option');

        await page.waitForTimeout(2000);
        await page.screenshot({ path: `screenshots/${testInfo.title}_ModifyScreen.png` });
        await helper.clickElement(cpt0102Page.validateButton, 'Click on Validate button after duplication');
        await helper.clickElement(cpt0102Page.yesButton, 'Click on Yes button on confirmation');

        await page.waitForTimeout(3000);
        await helper.assertElementHasText(cpt0102Page.duplicateSuccessMessage, 'Duplication done', 'Verify duplication success message is displayed');

    });

    test('Validation of Delete abandoned error message on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);
        const cpt0102Steps = new CPT0102ScreenSteps(page, testInfo, helper);
        const top0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);


        await helper.clickElement(cpt0102Page.productionGoals, 'Click on Production Goals');
        await helper.clickElement(cpt0102Page.CPT0102, 'Select CPT0102 option');
        const text = `${selectedCounterText}-(${selectedCounterText})`;
        const counterGateSelection = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: text, exact: true }).nth(2);
        await helper.clickElement(counterGateSelection, 'Click on  counter selection');
        await helper.clickElement(cpt0102Page.deleteButton, 'Click on Delete button');

        await page.waitForTimeout(2000);
        await page.screenshot({ path: `screenshots/${testInfo.title}_ModifyScreen.png` });
        await helper.clickElement(cpt0102Page.cancelButton, 'Click on Validate button after deletion');

        await page.waitForTimeout(3000);
        await helper.assertElementHasText(cpt0102Page.deleteErrorMessage, 'Deletion abandoned', 'Verify deletion abandoned error message is displayed');

    });

    test('Validation of Delete success message on  UI for CPT0102', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0102Page = new CPT0102Page(page);
        const cpt0102Steps = new CPT0102ScreenSteps(page, testInfo, helper);
        const top0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);


        await helper.clickElement(cpt0102Page.productionGoals, 'Click on Production Goals');
        await helper.clickElement(cpt0102Page.CPT0102, 'Select CPT0102 option');
        const text = `${selectedCounterText}-(${selectedCounterText})`;
        const counterGateSelection = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: text, exact: true }).nth(2);
        await helper.clickElement(counterGateSelection, 'Click on  counter selection');
        await helper.clickElement(cpt0102Page.deleteButton, 'Click on Delete button');

        await page.waitForTimeout(2000);
        await page.screenshot({ path: `screenshots/${testInfo.title}_ModifyScreen.png` });
        await helper.clickElement(cpt0102Page.validateButton, 'Click on Validate button after deletion');
        await helper.clickElement(cpt0102Page.yesButton, 'Click on Yes button on confirmation');

        await page.waitForTimeout(3000);
        const counterGateSelectionDuplicate = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: text }).nth(3);
        await helper.clickElement(counterGateSelectionDuplicate, 'Click on  counter selection');

        await cpt0102Steps.DeletionDuplication(counterGateSelectionDuplicate);
        await helper.assertElementHasText(cpt0102Page.deleteSuccessMessage, 'Deletion done', 'Verify deletion success message is displayed');




    });



});