import { Page, Locator, expect } from '@playwright/test';
import { QUA0802Page } from '../pages/QUA0802Page';
import testConfig from '../test-data/testConfig.json';


interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class QUA0802Steps {
    private helper: StepHelper;
    private qua0802Page: QUA0802Page;
    private page: Page;
    private testConfig: any;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        void testInfo;
        this.page = page;
        this.helper = stepHelper;
        this.qua0802Page = new QUA0802Page(page);
        this.testConfig = testConfig;
    }

    async partToPartTraceability(value: string): Promise<void> {
        await this.helper.clickElement(this.qua0802Page.qualityMonitoring, 'Click on Quality monitoring');
        await this.helper.clickElement(this.qua0802Page.qua0802Option, 'Click on QUA0802 - Update traceability');

        await this.helper.assertElementHasText(this.qua0802Page.titleQua0802, 'Manage the part-to-part traceability  (QUA0802)', 'Verify that QUA0802 page is opened');
        await this.helper.clickElement(this.qua0802Page.reworkStationPen, 'Click on Rework Station dropdown');
        await this.helper.clickElement(this.qua0802Page.reworkStationOption, `Select ${value} from dropdown`);

        await this.helper.clickElement(this.qua0802Page.submitButton, 'Click on Submit button');

        await this.helper.enterText(this.qua0802Page.serialNumberTextbox, '123456789', 'Enter Serial Number');
        await this.helper.clickElement(this.qua0802Page.submitButton, 'Click on Submit button');
    }

}