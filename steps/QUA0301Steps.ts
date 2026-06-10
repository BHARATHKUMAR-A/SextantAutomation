import { Page, Locator, expect } from '@playwright/test';
import { QUA0301Page } from '../pages/QUA0301Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class QUA0301Steps {
    private helper: StepHelper;
    private qua0301Page: QUA0301Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        void testInfo;
        this.helper = stepHelper;
        this.qua0301Page = new QUA0301Page(page);
    }

    async openQUA0301(): Promise<void> {
        await this.helper.clickElement(this.qua0301Page.qualityMonitoring, 'Click on Quality monitoring');
        await this.helper.clickElement(this.qua0301Page.qua0301Option, 'Click on QUA0301 - Consult parts quality information');
        await expect(this.qua0301Page.valueTextbox).toBeVisible({ timeout: 10000 });
    }

    async consultPartsQualityInformation(partValue: string): Promise<void> {
        await this.openQUA0301();
        await this.helper.enterText(this.qua0301Page.valueTextbox, partValue, `Enter part value ${partValue}`);
        await this.helper.clickElement(this.qua0301Page.submitButton, 'Click on Submit button');
        await this.helper.clickElement(this.qua0301Page.passingToWorkstationsTab, 'Click on Passing to the workstations tab');
        await this.helper.clickElement(this.qua0301Page.measuredParametersTab, 'Click on Measured parameters tab');
        await this.helper.clickElement(this.qua0301Page.defectsTab, 'Click on Defects tab');
        await this.helper.clickElement(this.qua0301Page.qualityBlockingTab, 'Click on Quality blocking tab');
        await this.helper.clickElement(this.qua0301Page.parcelPartTab, 'Click on Parcel Part tab');
        await this.helper.clickElement(this.qua0301Page.affectedPartsTab, 'Click on Affected Parts tab');
        await this.helper.clickElement(this.qua0301Page.particularEventsTab, 'Click on Particular events tab');
        await expect(this.qua0301Page.consultInformationTitle).toBeVisible({ timeout: 10000 });
        await this.helper.captureScreenshot('QUA0301_Consult_Parts_Quality_Information');
    }
}