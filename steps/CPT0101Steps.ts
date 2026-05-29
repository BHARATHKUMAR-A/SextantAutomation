import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { SshHelper } from '../utils/sshHelper';
import chalk from 'chalk';
import { CPT0101Page } from '../pages/CPT0101Page';

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

export class CPT0101ScreenSteps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private cpt0101Page: CPT0101Page;



    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.cpt0101Page = new CPT0101Page(page);
    }




    async creationCPT0101(counter: string): Promise<void> {

        await this.helper.clickElement(this.cpt0101Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0101Page.cpt0101Option, 'Select CPT0101 option');
        await this.helper.clickElement(this.cpt0101Page.createButton, 'Click on Create button');
        await this.helper.enterText(this.cpt0101Page.counterTextbox, counter, 'Enter Counter value');
        await this.helper.clickElement(this.cpt0101Page.frequencyInitialisationPen, 'Click on Frequency Initialisation pen');
        await this.helper.clickElement(this.cpt0101Page.frequencyInitialisationOption, 'Select Frequency Initialisation option 240');
        await this.helper.clickElement(this.cpt0101Page.topologyPen, 'Click on Topology pen');
        await this.helper.clickElement(this.cpt0101Page.topologyOption, 'Select Topology option B_GEN005');
        const labelValue = `TestLabel_${await this.sshHelper.generateRandomAlphanumeric(5)}`;
        await this.helper.enterText(this.cpt0101Page.labelTextbox, labelValue, 'Enter Label value');
        await this.helper.clickElement(this.cpt0101Page.calenderAreasPen, 'Click on Calendar Areas pen');
        await this.helper.clickElement(this.cpt0101Page.calenderOption, 'Select Calendar Areas option ASE');
        await this.helper.clickElement(this.cpt0101Page.frequencyHistorisationPen, 'Click on Frequency Historisation pen');
        await this.helper.clickElement(this.cpt0101Page.frequencyHistorisationOption, 'Select Frequency Historisation option 240');
        // await this.helper.clickElement(this.cpt0101Page.validateButton, 'Click on Validate button');
        // await this.helper.clickElement(this.cpt0101Page.yesButton, 'Click on Yes button to confirm creation');
    }

    async viewCPT0101Details(counterSelection: string): Promise<void> {
        await this.helper.clickElement(this.cpt0101Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0101Page.cpt0101Option, 'Select CPT0101 option');
        // const counterLocator = this.page.locator(`frame[name="main"]`).contentFrame().locator(counterSelection);
        const counterLocator = this.page.locator('frame[name="main"]').contentFrame().getByText(counterSelection).nth(1);
        await this.page.waitForTimeout(3000); // Wait for the counter to be visible
        await this.helper.clickElement(counterLocator, 'Click on counter selection');
        await this.page.waitForTimeout(3000); // Wait for the counter to be visible

        await this.helper.clickElement(this.cpt0101Page.viewButton, 'Click on View button');
    }

    async modifyCPT0101Details(counterSelection: string): Promise<void> {
        await this.helper.clickElement(this.cpt0101Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0101Page.cpt0101Option, 'Select CPT0101 option');
        const counterLocator = this.page.locator('frame[name="main"]').contentFrame().getByText(counterSelection).nth(1);
        await this.helper.clickElement(counterLocator, 'Click on counter selection');

        await this.helper.clickElement(this.cpt0101Page.modify, 'Click on Modify button');
        const newLabelValue = `ModifiedLabel_${await this.sshHelper.generateRandomAlphanumeric(5)}`;
        await this.helper.enterText(this.cpt0101Page.label, newLabelValue, 'Enter new Label value');
        await this.helper.clickElement(this.cpt0101Page.validateButton, 'Click on Validate button');
        await this.helper.clickElement(this.cpt0101Page.yesButton, 'Click on Yes button to confirm modification');
        await this.helper.assertElementHasText(this.cpt0101Page.modifySuccessMessage, 'Modification done', 'Verify modification success message is displayed');
    }

    async duplicateCPT0101Details(counterSelection: string): Promise<void> {
        await this.helper.clickElement(this.cpt0101Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0101Page.cpt0101Option, 'Select CPT0101 option');
        const counterLocator = this.page.locator('frame[name="main"]').contentFrame().getByText(counterSelection).nth(1);
        await this.helper.clickElement(counterLocator, 'Click on counter selection');

        await this.helper.clickElement(this.cpt0101Page.duplicate, 'Click on Duplicate button');
        const newcounterValue = `Duplication_${await this.sshHelper.generateRandomAlphanumeric(5)}`;
        await this.helper.enterText(this.cpt0101Page.counterTextbox, newcounterValue, 'Enter new counter value for duplicated entry');
        await this.helper.clickElement(this.cpt0101Page.validateButton, 'Click on Validate button');
        await this.helper.clickElement(this.cpt0101Page.yesButton, 'Click on Yes button to confirm duplication');
        this.page.waitForTimeout(3000); // Wait for the duplication process to complete and message to appear
        await this.helper.assertElementHasText(this.cpt0101Page.createSuccessMessage, 'creation done', 'Verify duplication success message is displayed');


    }

    async deleteCPT0101Details(counterSelection: string): Promise<void> {
        await this.helper.clickElement(this.cpt0101Page.productionGoals, 'Click on Production Goals');
        await this.helper.clickElement(this.cpt0101Page.cpt0101Option, 'Select CPT0101 option');
        const counterLocator = this.page.locator('frame[name="main"]').contentFrame().getByText(counterSelection).nth(1);
        await this.helper.clickElement(counterLocator, 'Click on counter selection');

        await this.helper.clickElement(this.cpt0101Page.deleteButton, 'Click on Delete button');

        await this.helper.clickElement(this.cpt0101Page.validateButton, 'Click on Validate button');
        await this.helper.clickElement(this.cpt0101Page.yesButton, 'Click on Yes button to confirm deletion');
        await this.helper.assertElementHasText(this.cpt0101Page.deleteSuccessMessage, 'Deletion done', 'Verify deletion success message is displayed');
    }


}