import { Page, Locator } from '@playwright/test';
import testConfig from '../test-data/testConfig.json';

export class QUA0801Page {

    qualityMonitoring: Locator;
    qua0801Option: Locator;
    workshopPen: Locator;
    workShopPenOption: Locator;
    SubmitButton1: Locator;
    SubmitButton2: Locator;
    ProductOldParcel: Locator;
    SupplierOldParcel: Locator;
    LabelOldParcel: Locator;
    LabelOldParcelDuplicate: Locator;
    ProductNewParcel: Locator;
    SupplierNewParcel: Locator;
    LabelNewParcel: Locator;
    BeginningPartID: Locator;
    EndPartID: Locator;





    constructor(page: Page) {
        const menuFrame = page.locator('frame[name="menu"]').contentFrame();
        const mainFrame = page.locator('frame[name="main"]').contentFrame();


        this.qualityMonitoring = menuFrame.getByText('Quality monitoring', { exact: true });
        this.qua0801Option = menuFrame.getByRole('cell', { name: 'QUA0801 - Update traceability' });
        this.workshopPen = mainFrame.locator('#CombolisteAtelier span');
        this.workShopPenOption = mainFrame.getByRole('cell', { name: testConfig[0].workshop }).nth(2);
        this.SubmitButton1 = mainFrame.getByLabel('', { exact: true });

        this.ProductOldParcel = mainFrame.getByRole('group', { name: 'Old parcel' }).getByLabel('Product :');
        this.SupplierOldParcel = mainFrame.getByRole('textbox', { name: 'Supplier :', exact: true });
        this.LabelOldParcel = mainFrame.getByRole('group', { name: 'Old parcel' }).getByLabel('Label :');
        this.LabelOldParcelDuplicate = mainFrame.getByRole('group', { name: 'Old parcel' }).getByLabel('Label :');

        this.ProductNewParcel = mainFrame.getByRole('group', { name: 'New parcel' }).getByLabel('Product :');
        this.SupplierNewParcel = mainFrame.getByRole('textbox', { name: 'Supplier : (A)' });
        this.LabelNewParcel = mainFrame.getByRole('group', { name: 'New parcel' }).getByLabel('Label :');

        this.BeginningPartID = mainFrame.getByRole('textbox', { name: 'Beginning Part ID :' });
        this.EndPartID = mainFrame.getByRole('textbox', { name: 'End Part ID : (C)' });

        this.SubmitButton2 = mainFrame.getByText('Submit');







    }
}

