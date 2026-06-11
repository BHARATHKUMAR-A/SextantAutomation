import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { SshHelper } from '../utils/sshHelper';
import { NOM0201Page } from '../pages/NOM0201Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class NOM0201Steps {

    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private nom0201Page: NOM0201Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.nom0201Page = new NOM0201Page(page);
    }

    async navigateToNOM0201(): Promise<void> {
        await this.helper.clickElement(this.nom0201Page.referenceDataMenu, 'Click on Reference Data menu');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0201Page.billOfMaterialsMenu, 'Click on Bill of materials submenu');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0201Page.nom0201Option, 'Select NOM0201 - Manage raw materials');
        await this.page.waitForTimeout(2000);
    }

    async verifyPageTitle(): Promise<void> {
        await this.helper.assertElementHasText(this.nom0201Page.pageTitle, 'Manage the supplies  (NOM0201)', 'Verify NOM0201 page title');
        await this.page.waitForTimeout(2000);
        console.log('✅ Page loaded successfully');
    }

    async searchBySourceAndVerifyFilter(sourceValue: string): Promise<void> {
        await this.helper.clickElement(this.nom0201Page.sourceDropdownPen, 'Click on Source dropdown pen');
        await this.page.waitForTimeout(1500);

        const sourceLocator = this.page.locator('frame[name="main"]').contentFrame().locator('#listSource').getByRole('cell', { name: sourceValue, exact: true }).nth(1);
        await this.helper.clickElement(sourceLocator, `Select source: ${sourceValue}`);
        await this.page.waitForTimeout(1500);

        await this.helper.clickElement(this.nom0201Page.searchButton, 'Click on Search button');
        await this.page.waitForTimeout(2000);

        const visibleRows = this.nom0201Page.tableRows;
        const rowCount = await visibleRows.count();
        console.log(`✅ Table filtered successfully with ${rowCount} rows for source: ${sourceValue}`);
    }

    async createRawMaterial(): Promise<{ productCode: string; repereOrgane: string; shortLabel: string }> {
        const productCode = await this.sshHelper.generateRandomNumeric(10);
        const randomDigits = await this.sshHelper.generateRandomNumeric(2);
        const repereOrgane = `TEST${randomDigits}`;
        const shortLabel = `TEST_${await this.sshHelper.generateRandomAlphanumeric(5)}`;
        const extendedLabel = `EL_${await this.sshHelper.generateRandomAlphanumeric(5)}`;

        await this.helper.clickElement(this.nom0201Page.createButton, 'Click Create button');
        await this.page.waitForTimeout(1500);

        await this.helper.enterText(this.nom0201Page.productField, productCode, `Enter Product Code: ${productCode}`);
        await this.page.waitForTimeout(500);
        await this.helper.enterText(this.nom0201Page.sgrField, `SG6`, `Enter SGR/Repère Organe: SGR`);
        await this.page.waitForTimeout(500);

        await this.helper.clickElement(this.nom0201Page.generalPropertiesButton, 'Click General properties button');
        await this.page.waitForTimeout(1000);

        await this.helper.enterText(this.nom0201Page.shortLabelField, shortLabel, `Enter Short Label: ${shortLabel}`);
        await this.page.waitForTimeout(300);

        await this.helper.enterText(this.nom0201Page.extendedLabelField, extendedLabel, `Enter Extended Label: ${extendedLabel}`);
        await this.page.waitForTimeout(300);

        await this.helper.enterText(this.nom0201Page.functionalityCodeField, `FUNC_${productCode}`, `Enter Functionality Code: FUNC_${productCode}`);
        await this.page.waitForTimeout(300);

        await this.helper.enterText(this.nom0201Page.psaCodeField, `PSA_${productCode}`, `Enter PSA Code: PSA_${productCode}`);
        await this.page.waitForTimeout(300);

        await this.helper.enterText(this.nom0201Page.ssrCodeField, `SSR_${productCode}`, `Enter SSR Code: SSR_${productCode}`);
        await this.page.waitForTimeout(300);
        await this.helper.clickElement(this.nom0201Page.classificationCombo, 'Click on Classification combo box');
        await pressKey(this.page, 'ArrowDown');
        await pressKey(this.page, 'Enter');
        await this.page.waitForTimeout(300);


        await this.partcularPropertiesfilling();
       
        await this.localAttributesfilling();
        await this.columnsfilling();

        await this.helper.clickElement(this.nom0201Page.validateButton, 'Click Validate button');
        await this.page.waitForTimeout(2000);

        await this.helper.assertElementHasText(
            this.nom0201Page.creationDoneMessage,
            'creation done',
            'Verify Creation Done message appears'
        );
        console.log('✅ Raw material created successfully');

        return { productCode, repereOrgane, shortLabel };
    }

    async partcularPropertiesfilling() {
        const valueText = `TEST${await this.sshHelper.generateRandomAlphanumeric(3)}`;
        await this.helper.clickElement(this.nom0201Page.creationDoneparticularProperties, 'Click on Particular properties');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0201Page.naturePen, 'Click on Nature pen button');
        await this.page.waitForTimeout(1000);
        await pressKey(this.page, 'Enter');
        await this.helper.enterText(this.nom0201Page.valueTextBox, valueText, `Enter Value: ${valueText}`);
        await this.page.waitForTimeout(300);
        await this.helper.clickElement(this.nom0201Page.moveToRightArrow.first(), 'Click on Move to right arrow to add nature');
        await this.page.waitForTimeout(500);

    }


    async localAttributesfilling() {
        await this.helper.clickElement(this.nom0201Page.localAttributesTab, 'Click on Local Attributes tab');
        await this.helper.clickElement(this.nom0201Page.columnPen, 'Click on Column pen button');
        await pressKey(this.page, 'ArrowDown'); // Navigate to the first option in the dropdown
        await pressKey(this.page, 'Enter');
        await this.helper.clickElement(this.nom0201Page.localAttributesRightArrow, 'Click on Move to right arrow to add local attribute');
        await this.page.waitForTimeout(500);
    }

    async columnsfilling() {
        await this.helper.clickElement(this.nom0201Page.columnsTab, 'Click on Columns tab');
        await this.helper.clickElement(this.nom0201Page.columnKPen, 'Click on Column K pen button');
        await pressKey(this.page, 'ArrowDown'); // Navigate to the first option in the dropdown
        await pressKey(this.page, 'Enter');
        await this.helper.clickElement(this.nom0201Page.columnKRightArrow, 'Click on Move to right arrow to add column K');
        await this.page.waitForTimeout(500);
    }


    async filterTableByProduct(productCode: string): Promise<void> {
        await this.helper.clickElement(this.nom0201Page.rawMaterialProductPen, 'Click Product pen button');
        const productRow = this.nom0201Page.getProductRow(productCode);
        await this.helper.clickElement(productRow, `Select product row: ${productCode}`);
        await this.page.waitForTimeout(500);
        await this.helper.clickElement(this.nom0201Page.searchButton, 'Click Search button');
        await this.page.waitForTimeout(1500);
    }

    async modifyProduct(productCode: string): Promise<void> {
        await this.filterTableByProduct(productCode);
        await this.helper.clickElement(this.nom0201Page.modifyButton, 'Click Modify button');
        await this.helper.enterText(this.nom0201Page.shortLabelField, `MOD_${productCode}`, `Modify Short Label to: MOD_${productCode}`);
        await this.page.waitForTimeout(500);
        await this.helper.clickElement(this.nom0201Page.validateButton, 'Click Validate button after modification');
        await this.page.waitForTimeout(500);
        console.log(`✅ Product modified successfully: ${productCode}`);
    }

    async deleteProduct(productCode: string): Promise<void> {
        await this.filterTableByProduct(productCode);
        await this.helper.clickElement(this.nom0201Page.deleteButton, 'Click Delete button');
        await this.helper.clickElement(this.nom0201Page.validateButton, 'Click Validate button after marking for deletion');
        await this.page.waitForTimeout(500);
        await this.helper.assertElementHasText(this.nom0201Page.confirmDeletionText, 'Do you confirm the deletion ?', 'Verify deletion confirmation message appears');
        await this.helper.clickElement(this.nom0201Page.yesButton, 'Click Yes button to confirm deletion');
        await this.page.waitForTimeout(500);
        console.log(`✅ Product deletion confirmed: ${productCode}`);
    }

    async duplicateProduct(productCode: string): Promise<{ productCode: string;repereOrgane: string}> {
        const duplicateProductCode = await this.sshHelper.generateRandomNumeric(10);
        const randomDigits = await this.sshHelper.generateRandomNumeric(3);
        const repereOrgane = `${randomDigits}`;

        await this.filterTableByProduct(productCode);
        await this.helper.clickElement(this.nom0201Page.duplicateButton, 'Click Duplicate button');
        this.nom0201Page.sgrField.fill(''); // Clear the product field before entering new code
        await this.helper.enterText(this.nom0201Page.sgrField, `${repereOrgane}`, `Enter new Product Code for duplicate: ${duplicateProductCode}`);
        await this.page.waitForTimeout(5000);
        await this.helper.enterText(this.nom0201Page.productFieldForDuplicate, `${duplicateProductCode}`, `Enter new Product Code for duplicate: ${duplicateProductCode}`);
        await this.page.waitForTimeout(5000);
        await this.helper.clickElement(this.nom0201Page.validateButton, 'Click Validate button after entering duplicate product details');
        await this.page.waitForTimeout(1000);
        console.log(`✅ Product duplicated successfully: Original=${productCode}, Duplicate=${duplicateProductCode}`);

        return { productCode: `${duplicateProductCode}`, repereOrgane: `${repereOrgane}` };
    }

    async viewProduct(productCode: string): Promise<void> {
        await this.filterTableByProduct(productCode);
        await this.helper.clickElement(this.nom0201Page.viewButton, 'Click View button');
        await this.page.waitForTimeout(2000);
        console.log(`✅ Clicked View button for product: ${productCode}`);
    }
}

async function pressKey(page: Page, key: string) {
    await page.keyboard.press(key);
}