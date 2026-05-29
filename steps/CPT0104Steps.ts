import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { SshHelper } from '../utils/sshHelper';
import chalk from 'chalk';
import { CPT0101Page } from '../pages/CPT0101Page';
import { CPT0104Page } from '../pages/CPT0104Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    generateLabelName(): Promise<string>
    // assertElementHasText: (locator: any, expectedText: string, message: string) => Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>
    captureScreenshot(label: string): Promise<void>
    // BOTH methods included (the one LoginSteps expects + your custom one)
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;

}

export class CPT0104ScreenSteps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private cpt0101Page: CPT0101Page;
    private cpt0104Page: CPT0104Page;



    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.cpt0101Page = new CPT0101Page(page);
        this.cpt0104Page = new CPT0104Page(page);
    }

    async creationCPT0104(ReportOfCountingName: string): Promise<void> {

        await this.helper.clickElement(this.cpt0101Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0104Page.CPT0104Option, 'Select CPT0104 option');
        await this.helper.clickElement(this.cpt0101Page.createButton, 'Click on Create button');
        await this.helper.enterText(this.cpt0104Page.reportOfCountingTextbox, ReportOfCountingName, 'Enter Report of counting value');
        const labelName = await this.helper.generateLabelName();
        await this.helper.enterText(this.cpt0101Page.labelTextbox, labelName, 'Enter label value');

        await this.helper.clickElement(this.cpt0104Page.typePen, 'Click on Type pen');
        await this.helper.clickElement(this.cpt0104Page.typePenOption, 'Select Type pen option');
        await this.helper.clickElement(this.cpt0104Page.infoCountersPen, 'Click on info counters pen');
        await this.helper.clickElement(this.cpt0104Page.infoCountersPenOption, 'Select info counters pen option');

        await this.helper.clickElement(this.cpt0104Page.counterPen, 'Click on Counter pen');
        await this.helper.clickElement(this.cpt0104Page.enp000Option, 'Select Counter option ENP000__');
        await this.helper.clickElement(this.cpt0104Page.addButton, 'Click on Add button');


    }

    async reportOfCountingSelection(counterSelection: string): Promise<void> {
        await this.helper.clickElement(this.cpt0101Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0104Page.CPT0104Option, 'Select CPT0104 option');
        const counterLocator = this.page.locator('frame[name="main"]').contentFrame().getByText(counterSelection).nth(2);
        await this.page.waitForTimeout(1000); // Wait for the counter to be visible
        await this.helper.clickElement(counterLocator, 'Click on counter selection');
        await this.page.waitForTimeout(1000); // Wait for the counter to be visible


    }

    async modify(): Promise<void> {
        await this.helper.clickElement(this.cpt0101Page.modify, 'Click on Modify button');
        const labelName = await this.helper.generateLabelName();
        await this.helper.enterText(this.cpt0101Page.labelTextbox, labelName, 'Enter new label value');
        await this.helper.clickElement(this.cpt0104Page.cuttingPen, 'Click on cutting pen');
        await this.helper.clickElement(this.cpt0104Page.cuttingPenOption, 'Select cutting pen option');
        await this.helper.clickElement(this.cpt0104Page.infoCountersPen, 'Click on info counters pen');
        await this.helper.clickElement(this.cpt0104Page.infoCountersPenOption, 'Select info counters pen option');
        await this.helper.clickElement(this.cpt0101Page.validateButton, 'Click on Validate button');
        await this.helper.clickElement(this.cpt0101Page.yesButton, 'Click on Yes button to confirm modification');


    }



}