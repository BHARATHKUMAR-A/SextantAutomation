import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { CPT0101ScreenSteps } from '../../steps/CPT0101Steps';
import { CPT0101Page } from '../../pages/CPT0101Page';
import { CPT0104ScreenSteps } from '../../steps/CPT0104Steps';
import { CPT0104Page } from '../../pages/CPT0104Page';
import { expect } from '@playwright/test';


let ReportOfCountingName: string;


test.describe.serial('Log verification after UI actions', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        if (!ReportOfCountingName) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            ReportOfCountingName = `TEST__${await sshHelper.generateRandomAlphanumeric(1)}`;
        }
    });

    test('Validation of success abandoned error message on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Page = new CPT0104Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);



        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);


        await cpt0104Steps.creationCPT0104(ReportOfCountingName);
        await helper.clickElement(cpt0101Page.cancelButton, 'Click on Cancel button');

        await helper.assertElementHasText(cpt0101Page.creationAbondenedMessage, 'creation abandoned', 'Verify creation abandoned message is displayed');
        await page.waitForTimeout(3000);


    });

    test('Validation of actions button to add threshold and remove threshold while creation on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Page = new CPT0104Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);



        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);


        await cpt0104Steps.creationCPT0104(ReportOfCountingName);
        await helper.clickElement(cpt0104Page.addedCounterSelectionInTable, 'Click on added counter selection in table');
        await helper.clickElement(cpt0104Page.actionsButton, 'Click on Actions button');
        await helper.clickElement(cpt0104Page.addThresholdOption, 'Click on Add [goal or threshold] option');
        await page.waitForTimeout(2000);
        await helper.assertElementHasText(cpt0104Page.addedThresholdInTable, 'X', 'Verify added threshold is displayed in table');
        await helper.captureScreenshot('Threshold_added_to_table_CPT0104');
        await helper.clickElement(cpt0104Page.addedCounterSelectionInTable, 'Click on added counter selection in table');

        await helper.clickElement(cpt0104Page.actionsButton, 'Click on Actions button');
        await helper.clickElement(cpt0104Page.removeThresholdOption, 'Click on Remove [goal or threshold] option');
        await expect(cpt0104Page.emptyThresholdInTable).toBeVisible();
        console.log('Verify threshold is removed from table');
        await page.waitForTimeout(2000);
        await helper.captureScreenshot('Threshold_removed_from_table_CPT0104');

        await page.waitForTimeout(1000);


    });

    test('Validation of actions button to add variation and remove variation while creation on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Page = new CPT0104Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);



        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);


        await cpt0104Steps.creationCPT0104(ReportOfCountingName);
        await helper.clickElement(cpt0104Page.addedCounterSelectionInTable, 'Click on added counter selection in table');
        await helper.clickElement(cpt0104Page.actionsButton, 'Click on Actions button');
        await helper.clickElement(cpt0104Page.addVariationOption, 'Click on Add [variation] option');
        await page.waitForTimeout(2000);
        await helper.assertElementHasText(cpt0104Page.addedVariationInTable, 'X', 'Verify added variation is displayed in table');
        await helper.captureScreenshot('Variation_added_to_table_CPT0104');
        await helper.clickElement(cpt0104Page.addedCounterSelectionInTable, 'Click on added counter selection in table');

        await helper.clickElement(cpt0104Page.actionsButton, 'Click on Actions button');
        await helper.clickElement(cpt0104Page.removeVariationOption, 'Click on Remove [variation] option');
        await expect(cpt0104Page.emptyVariationInTable).toBeVisible();
        console.log('Verify variation is removed from table');
        await page.waitForTimeout(2000);
        await helper.captureScreenshot('Variation_removed_from_table_CPT0104');

        await page.waitForTimeout(1000);


    });

    test('Validation of Management of the counters screen after clicking management of counters at create screen on UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Page = new CPT0104Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);



        const cpt0101Steps = new CPT0101ScreenSteps(page, testInfo, helper);


        await cpt0104Steps.creationCPT0104(ReportOfCountingName);
        await helper.clickElement(cpt0104Page.managementOfCountersButton, 'Click on Management of the counters button');
        await helper.assertElementHasText(cpt0104Page.ManagementOfCountersTitle, 'Management of the counters (CPT0101)', 'Verify Management of the counters title is displayed');
        await helper.captureScreenshot('Management_of_counters_screen_CPT0104');
        await page.waitForTimeout(3000);


    });

    test('Validation of success done success message on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);


        await cpt0104Steps.creationCPT0104(ReportOfCountingName);
        await helper.clickElement(cpt0101Page.validateButton, 'Click on Validate button');
        await helper.clickElement(cpt0101Page.yesButton, 'Click on Yes button to confirm creation');
        await helper.assertElementHasText(cpt0101Page.createSuccessMessage, 'creation done', 'Verify creation done message is displayed');

        await page.waitForTimeout(3000);


    });

    test('Validation of Display button and screen on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);
        const cpt0104Page = new CPT0104Page(page);



        await cpt0104Steps.reportOfCountingSelection(ReportOfCountingName);
        await helper.clickElement(cpt0104Page.displayButton, 'Click on Display button');
        await helper.assertElementHasText(cpt0104Page.displayScreenTitle, 'Display a report of counting (CPT0104)', 'Verify Display screen title is displayed');
        await page.waitForTimeout(1000);


    });



    test('Validation of view on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);



        await cpt0104Steps.reportOfCountingSelection(ReportOfCountingName);
        await helper.clickElement(cpt0101Page.viewButton, 'Click on View button');
        await page.waitForTimeout(1000);


    });

    test('Validation of modify abondened error message on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Page = new CPT0104Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);



        await cpt0104Steps.reportOfCountingSelection(ReportOfCountingName);
        // await cpt0104Steps.modify();
        await helper.clickElement(cpt0101Page.modify, 'Click on Modify button');
        const labelName = await helper.generateLabelName();
        await helper.enterText(cpt0101Page.labelTextbox, labelName, 'Enter new label value');
        await helper.clickElement(cpt0101Page.cancelButton, 'Click on Cancel button');

        await helper.assertElementHasText(cpt0104Page.modificationErrorMessage, 'Modification abandoned', 'Verify modification abandoned message is displayed');



        await page.waitForTimeout(1000);


    });


    test('Validation of modify success message on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Page = new CPT0104Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);



        await cpt0104Steps.reportOfCountingSelection(ReportOfCountingName);
        await cpt0104Steps.modify();

        await helper.assertElementHasText(cpt0101Page.modifySuccessMessage, 'Modification done', 'Verify modification done message is displayed');
        await page.waitForTimeout(1000);


    });



    test('Validation of Delete abondened error message on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Page = new CPT0104Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);



        await cpt0104Steps.reportOfCountingSelection(ReportOfCountingName);
        await helper.clickElement(cpt0101Page.deleteButton, 'Click on Delete button');
        await helper.clickElement(cpt0101Page.cancelButton, 'Click on Cancel button to confirm deletion');

        await helper.assertElementHasText(cpt0104Page.deleteAbondenedErrorMessage, 'Deletion abandoned', 'Verify deletion abandoned message is displayed');
        await page.waitForTimeout(1000);


    });

    test('Validation of Delete success message on  UI for CPT0104', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0101Page = new CPT0101Page(page);
        const cpt0104Page = new CPT0104Page(page);
        const cpt0104Steps = new CPT0104ScreenSteps(page, testInfo, helper);



        await cpt0104Steps.reportOfCountingSelection(ReportOfCountingName);
        await helper.clickElement(cpt0101Page.deleteButton, 'Click on Delete button');
        await helper.clickElement(cpt0101Page.validateButton, 'Click on Validate button to confirm deletion');
        await helper.assertElementHasText(cpt0104Page.deletionConfirmationMessage, 'Do you confirm the deletion ?', 'Verify deletion confirmation message is displayed');
        await helper.clickElement(cpt0101Page.yesButton, 'Click on Yes button to confirm deletion');

        await helper.assertElementHasText(cpt0101Page.deleteSuccessMessage, 'Deletion done', 'Verify deletion done message is displayed');
        await page.waitForTimeout(1000);


    });





});