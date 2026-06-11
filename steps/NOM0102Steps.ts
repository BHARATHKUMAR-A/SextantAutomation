import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { SshHelper } from '../utils/sshHelper';
import { NOM0102Page } from '../pages/NOM0102Page';


interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class NOM0102Steps {

    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private nom0102Page: NOM0102Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.nom0102Page = new NOM0102Page(page);
    }

    /**
     * Navigate to NOM0102 screen
     */
    async navigateToNOM0102(): Promise<void> {
        await this.helper.clickElement(this.nom0102Page.referenceDataMenu, 'Click on Reference Data menu');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0102Page.billOfMaterialsMenu, 'Click on Bill of materials submenu');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0102Page.nom0102Option, 'Select NOM0102 - Compare manufactured products');
        await this.page.waitForTimeout(2000);
    }

};