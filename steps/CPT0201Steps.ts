import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { SshHelper } from '../utils/sshHelper';
import chalk from 'chalk';
import { CPT0101Page } from '../pages/CPT0101Page';
import { CPT0104Page } from '../pages/CPT0104Page';
import { CPT0201Page } from '../pages/CPT0201Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    generateLabelName(): Promise<string>
    // assertElementHasText: (locator: any, expectedText: string, message: string) => Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>
    captureScreenshot(label: string): Promise<void>
    randomClickFromTable(tableLocator: Locator, label: string): Promise<void> 
    // BOTH methods included (the one LoginSteps expects + your custom one)
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;

}

export class CPT0201ScreenSteps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private cpt0201Page: CPT0201Page;
    private cpt0104Page: CPT0104Page;
    private cpt0101Page: CPT0101Page;



    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.cpt0201Page = new CPT0201Page(page);
        this.cpt0104Page = new CPT0104Page(page);
        this.cpt0101Page = new CPT0101Page(page);
    }

    async navigateToCPT0201Screen(ReportOfCountingName: string): Promise<void> {

        await this.helper.clickElement(this.cpt0101Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0201Page.CPT0201Option, 'Select CPT0201 option');
        await this.helper.assertElementHasText(this.cpt0201Page.cpt0201ScreenTitle, 'Configure the counter groups  (CPT0201) ', 'Verify Configure the counter groups header is displayed');
        await this.helper.captureScreenshot('CPT0201Screen');
    }

    async validateErrorMessagesOnCPT0201Screen(ReportOfCountingName: string): Promise<void> {
        await this.helper.clickElement(this.cpt0201Page.addButton, 'Click on Add button without entering mandatory fields');
        await this.helper.clickElement(this.cpt0201Page.submitButton, 'Click on submit button');
        await this.helper.assertElementHasText(this.cpt0201Page.inputMandatoryErrorMessage, 'Input mandatory', 'Verify Input mandatory error message is displayed');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('CPT0201ErrorMessages');
        await this.helper.enterText(this.cpt0201Page.groupNameTextBox, ReportOfCountingName, 'Enter group name');
        await this.helper.clickElement(this.cpt0201Page.submitButton, 'Click on submit button');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('CPT0201AfterEnteringGroupName');
        await this.helper.enterText(this.cpt0201Page.descriptionTextBox, 'Description for ' + ReportOfCountingName, 'Enter description');
        await this.helper.clickElement(this.cpt0201Page.submitButton, 'Click on submit button');
        await this.page.waitForTimeout(2000);
        await this.helper.assertElementHasText(this.cpt0201Page.impossibleToCreateACounterErrorMessage, 'Impossible to create a counter group which contains no counter.', 'Verify error message for not having any counter in the group is displayed');
        await this.helper.captureScreenshot('CPT0201AfterEnteringDescription');

    }
    async addGroupInListOfGroups(groupName: string, description: string): Promise<void> {
        await this.helper.clickElement(this.cpt0201Page.addButton, 'Click on Add button');
        await this.helper.enterText(this.cpt0201Page.groupNameTextBox, groupName, 'Enter group name');
        await this.helper.enterText(this.cpt0201Page.descriptionTextBox, description, 'Enter description');
        await this.helper.randomClickFromTable(this.cpt0201Page.leftCounterTable, 'Select a counter from the left table');
        await this.helper.clickElement(this.cpt0201Page.addButtonExactArrow, 'Click on Add button to move the counter to right table');
        await this.helper.clickElement(this.cpt0201Page.submitButton, 'Click on submit button');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('CPT0201AfterAddingGroup');
    }

    async updateGroupInListOfGroups(selectedGroupName: Locator): Promise<void> {
        await this.helper.clickElement(selectedGroupName, 'Select the group to update');

        await this.helper.clickElement(this.cpt0201Page.updateButton, 'Click on Update button');
        await this.helper.enterText(this.cpt0201Page.descriptionTextBoxAfterUpdateSelection, 'Test', 'Enter description');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('CPT0201AfterUpdatingGroup');
    }
    async deleteGroupInListOfGroups(selectedGroupName: Locator): Promise<void> {
        await this.helper.clickElement(selectedGroupName, 'Select the group to delete');

        await this.helper.clickElement(this.cpt0201Page.deleteButton, 'Click on Delete button');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('CPT0201AfterDeletingGroup');
    }



}