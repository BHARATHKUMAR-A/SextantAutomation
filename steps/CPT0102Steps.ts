import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { SshHelper } from '../utils/sshHelper';
import chalk from 'chalk';
import { CPT0101Page } from '../pages/CPT0101Page';
import { CPT0102Page } from '../pages/CPT0102Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    // assertElementHasText: (locator: any, expectedText: string, message: string) => Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>
    captureScreenshot(label: string): Promise<void>
    // BOTH methods included (the one LoginSteps expects + your custom one)
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;

}

export class CPT0102ScreenSteps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private cpt0102Page: CPT0102Page;
    public counterText: string | undefined;



    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.cpt0102Page = new CPT0102Page(page);
        this.counterText = undefined;
    }




    async creationCPT0102(): Promise<void> {

        await this.helper.clickElement(this.cpt0102Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0102Page.CPT0102, 'Select CPT0102 option');
        await this.helper.clickElement(this.cpt0102Page.createButton, 'Click on Create button');
        await this.helper.clickElement(this.cpt0102Page.counterCp_Redeb, 'Select Counter CP_REDEB option');
        this.counterText = await this.cpt0102Page.counterCp_Redeb.innerText();
        console.log('Counter Text from UI:', this.counterText); // Debug log to verify the counter text
        await this.helper.clickElement(this.cpt0102Page.add, 'Click on Add button');
        const counterOption = this.page.locator(`frame[name="main"]`).contentFrame().getByRole('cell', { name: this.counterText, exact: true }).nth(1);
        await this.helper.clickElement(counterOption, 'Click on day type pen');
        await this.helper.clickElement(this.cpt0102Page.delete, 'Click on Delete button to remove default counter');
        await this.helper.clickElement(this.cpt0102Page.counterCp_Redeb, 'Select Counter CP_REDEB option');

        await this.helper.clickElement(this.cpt0102Page.add, 'Click on Add button');

        await this.helper.clickElement(this.cpt0102Page.dayTypePen, 'Click on day type pen');
        await this.helper.clickElement(this.cpt0102Page.dayTypeOptionWorkingDay, 'Select Working Day option');
        await this.helper.clickElement(this.cpt0102Page.dateEntry, 'Click on Topology pen');
        await this.helper.clickElement(this.cpt0102Page.day20, 'Select Topology option B_GEN005');
        const labelValue = `${await this.sshHelper.generateRandomNumeric(2)}`;
        await this.helper.enterText(this.cpt0102Page.shift1Field, labelValue, 'Enter Label value');
        await this.helper.enterText(this.cpt0102Page.shift2Field, labelValue, 'Enter Label value');
        await this.helper.enterText(this.cpt0102Page.shift3Field, labelValue, 'Enter Label value');
    }

    async ModifyGoalValues(): Promise<void> {
        const min = `1`;
        const max = `100`;
        // await this.helper.clickElement(this.cpt0102Page.shift1FieldMin, 'Click on Shift 1 Min field');
        await this.helper.enterText(this.cpt0102Page.shift1FieldMin, min, 'Enter Shift 1 Min value');
        // await this.helper.clickElement(this.cpt0102Page.shift1FieldMax, 'Click on Shift 1 Max field');
        await this.helper.enterText(this.cpt0102Page.shift1FieldMax, max, 'Enter Shift 1 Max value');
        // await this.helper.clickElement(this.cpt0102Page.shift2FieldMin, 'Click on Shift 2 Min field');
        await this.helper.enterText(this.cpt0102Page.shift2FieldMin, min, 'Enter Shift 2 Min value');
        // await this.helper.clickElement(this.cpt0102Page.shift2FieldMax, 'Click on Shift 2 Max field');
        await this.helper.enterText(this.cpt0102Page.shift2FieldMax, max, 'Enter Shift 2 Max value');
        // await this.helper.clickElement(this.cpt0102Page.shift3FieldMin, 'Click on Shift 3 Min field');
        await this.helper.enterText(this.cpt0102Page.shift3FieldMin, min, 'Enter Shift 3 Min value');
        // await this.helper.clickElement(this.cpt0102Page.shift3FieldMax, 'Click on Shift 3 Max field');
        await this.helper.enterText(this.cpt0102Page.shift3FieldMax, max, 'Enter Shift 3 Max value');
        // await this.helper.clickElement(this.cpt0102Page.dayFieldMin, 'Click on Day Min field');
        // await this.helper.enterText(this.cpt0102Page.dayFieldMin, min, 'Enter Day Min value');
        // await this.helper.clickElement(this.cpt0102Page.dayFieldMax, 'Click on Day Max field');
        // await this.helper.enterText(this.cpt0102Page.dayFieldMax, max, 'Enter Day Max value');
        // await this.helper.clickElement(this.cpt0102Page.validateButton, 'Click on Validate button');

    }

    async DeletionDuplication(duplicateCounter:Locator): Promise<void> {

        // await this.helper.clickElement(duplicateCounter, 'Click on  counter selection');
        await this.helper.clickElement(this.cpt0102Page.deleteButton, 'Click on Delete button');

        await this.page.waitForTimeout(2000);
        await this.page.screenshot({ path: `screenshots/${this.testInfo.title}_ModifyScreen.png` });
        await this.helper.clickElement(this.cpt0102Page.validateButton, 'Click on Validate button after deletion');
        await this.helper.clickElement(this.cpt0102Page.yesButton, 'Click on Yes button on confirmation');

        await this.page.waitForTimeout(3000);


    }









}