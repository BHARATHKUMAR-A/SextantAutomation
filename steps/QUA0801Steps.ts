import { Page, Locator, expect } from '@playwright/test';
import { QUA0801Page } from '../pages/QUA0801Page';
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

export class QUA0801Steps {
    private helper: StepHelper;
    private qua0801Page: QUA0801Page;
    private page: Page;
    private testConfig: any;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        void testInfo;
        this.page = page;
        this.helper = stepHelper;
        this.qua0801Page = new QUA0801Page(page);
        this.testConfig = testConfig;
    }

    async submit(value: string): Promise<void> {
        await this.helper.clickElement(this.qua0801Page.qualityMonitoring, 'Click on Quality monitoring');
        await this.helper.clickElement(this.qua0801Page.qua0801Option, 'Click on QUA0801 - Update traceability');
        await this.helper.clickElement(this.qua0801Page.workshopPen, 'Click on Workshop dropdown');
        await this.helper.clickElement(this.qua0801Page.workShopPenOption, `Select ${value} from dropdown`);
        await this.helper.clickElement(this.qua0801Page.SubmitButton1, 'Click on Submit button');
    }


    async replacementOfParcelToPart(): Promise<void> { 
        await this.submit(this.testConfig[0].workshop);
        await this.helper.enterText(this.qua0801Page.ProductOldParcel, this.testConfig[1].QUA0801.oldProduct, 'Enter Product Old Parcel');
        await this.helper.enterText(this.qua0801Page.SupplierOldParcel, this.testConfig[1].QUA0801.Oldsupplier, 'Enter Supplier Old Parcel');
        await this.helper.enterText(this.qua0801Page.LabelOldParcel, 'LABEL1', 'Enter Label Old Parcel');
        await this.helper.enterText(this.qua0801Page.LabelOldParcelDuplicate, 'LABEL1', 'Enter Label Old Parcel Duplicate');
        await this.helper.enterText(this.qua0801Page.ProductNewParcel, this.testConfig[1].QUA0801.newProduct, 'Enter Product New Parcel');
        await this.helper.enterText(this.qua0801Page.SupplierNewParcel, this.testConfig[1].QUA0801.newSupplier, 'Enter Supplier New Parcel');
        await this.helper.enterText(this.qua0801Page.LabelNewParcel, 'LABEL1', 'Enter Label New Parcel');

        await this.helper.enterText(this.qua0801Page.BeginningPartID, this.testConfig[1].QUA0801.newProduct, 'Enter Beginning Part ID');
        await this.helper.enterText(this.qua0801Page.EndPartID, '10ZA0R0000002', 'Enter End Part ID');
        await this.helper.clickElement(this.qua0801Page.SubmitButton2, 'Click on Submit button');
    }
}