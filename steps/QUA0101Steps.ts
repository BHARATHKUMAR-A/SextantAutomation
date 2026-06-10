import { Page, Locator, expect } from '@playwright/test';
import { QUA0101Page } from '../pages/QUA0101Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    randomClickFromTable(tableLocator: Locator, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class QUA0101Steps {
    private helper: StepHelper;
    private qua0101Page: QUA0101Page;
    private page: Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        void testInfo;
        this.page = page;
        this.helper = stepHelper;
        this.qua0101Page = new QUA0101Page(page);
    }



    async updatePartDefinition(oldPart: string, rangeNumber: string): Promise<void> {
        await this.helper.clickElement(this.qua0101Page.qualityMonitoring, 'Click on Quality monitoring menu');
        await this.helper.clickElement(this.qua0101Page.qua0101Option, 'Select QUA0101 - Update part option');
        await this.helper.clickElement(this.qua0101Page.reworkPenmain, 'Click on Rework pen main dropdown');
        await this.helper.clickElement(this.qua0101Page.reworkPenOption, 'Select EXP1 option from Rework pen dropdown');
        await this.helper.clickElement(this.qua0101Page.submitButton, 'Click on submit button after selecting Rework pen option');
        await this.helper.enterText(this.qua0101Page.oldPartIDTextBox, oldPart, 'Enter Old Part ID');
        await this.helper.clickElement(this.qua0101Page.newPartPositionPen, 'Click on New part position dropdown');
        await this.helper.clickElement(this.qua0101Page.newPartPositionOption, 'Select 10Z1AA option from New part position dropdown');
        await this.helper.enterText(this.qua0101Page.rangeNumberTextbox, rangeNumber, 'Enter Range number');
        await this.helper.clickElement(this.qua0101Page.updatePartButton, 'Click on Update a part button');

    }
}