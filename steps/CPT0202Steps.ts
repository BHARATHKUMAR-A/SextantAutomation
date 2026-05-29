import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { SshHelper } from '../utils/sshHelper';
import chalk from 'chalk';
import { CPT0101Page } from '../pages/CPT0101Page';
import { CPT0104Page } from '../pages/CPT0104Page';
import { CPT0201Page } from '../pages/CPT0201Page';
import { CPT0202Page } from '../pages/CPT0202Page';

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

export class CPT0202ScreenSteps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private cpt0201Page: CPT0201Page;
    private cpt0104Page: CPT0104Page;
    private cpt0101Page: CPT0101Page;
    private cpt0202Page: CPT0202Page;



    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.cpt0201Page = new CPT0201Page(page);
        this.cpt0104Page = new CPT0104Page(page);
        this.cpt0101Page = new CPT0101Page(page);
        this.cpt0202Page = new CPT0202Page(page);
    }

    async navigateToCPT0202Screen(): Promise<void> {

        await this.helper.clickElement(this.cpt0101Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0202Page.CPT0202Option, 'Select CPT0202 option');
        await this.helper.assertElementHasText(this.cpt0202Page.cpt0202ScreenTitle, '  Consult the counter groups  (CPT0202) ', 'Verify Consult real-time header is displayed');
        await this.helper.captureScreenshot('CPT0202Screen');
    }

    async CPT0202ScreenCheck(): Promise<void> {
        await this.helper.clickElement(this.cpt0202Page.counterGroupPen, 'Click on counter group dropdown');
        await this.helper.randomClickFromTable(this.cpt0202Page.CounterGroupTable, 'Select a counter from the left table');
        await this.helper.clickElement(this.cpt0202Page.submitButton, 'Click on submit button');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('CPT0202ScreenAfterSubmit');
        await this.helper.enterText(this.cpt0202Page.filterTextBox, "e", 'Enter counter name in filter text box');
        await this.helper.clickElement(this.cpt0202Page.filterButton, 'Click on filter button');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('CPT0202ScreenAfterFilter');
        await this.helper.clickElement(this.cpt0202Page.newSelectionButton, 'Click on new selection button');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('CPT0202ScreenAfterNewSelection');


    }





}