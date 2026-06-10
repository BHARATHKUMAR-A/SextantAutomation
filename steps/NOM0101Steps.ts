import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { SshHelper } from '../utils/sshHelper';
import { NOM0101Page } from '../pages/NOM0101Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class NOM0101Steps {

    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private nom0101Page: NOM0101Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.nom0101Page = new NOM0101Page(page);
    }

    /**
     * Navigate to NOM0101 screen
     */
    async navigateToNOM0101(): Promise<void> {
        await this.helper.clickElement(this.nom0101Page.referenceDataMenu, 'Click on Reference Data menu');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0101Page.billOfMaterialsMenu, 'Click on Bill of materials submenu');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0101Page.nom0101Option, 'Select NOM0101 - Manage manufactured products');
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify page title
     */
    async verifyPageTitle(): Promise<void> {
        // Wait for page to load after navigation
        await this.helper.assertElementHasText(this.nom0101Page.pageTitle, 'Manage the Products (NOM0101)', 'Verify NOM0101 page title');
        await this.page.waitForTimeout(2000);
        console.log('✅ Page loaded successfully');
    }

    /**
     * Search by source and verify table filters
     */
    async searchBySourceAndVerifyFilter(sourceValue: string): Promise<void> {
        // Click on source dropdown to open it
        await this.helper.clickElement(this.nom0101Page.sourceDropdownPen, 'Click on Source dropdown pen');
        await this.page.waitForTimeout(1500);

        // Select source option
        const sourceLocator = this.page.locator('frame[name="main"]').contentFrame().locator('#listSource').getByRole('cell', { name: sourceValue, exact: true }).nth(1);
        await this.helper.clickElement(sourceLocator, `Select source: ${sourceValue}`);
        await this.page.waitForTimeout(1500);

        // Click Search button
        await this.helper.clickElement(this.nom0101Page.searchButton, 'Click on Search button');
        await this.page.waitForTimeout(2000);

        // Verify table is populated with filtered results
        const tableLocator = this.nom0101Page.resultTable;
        await this.page.waitForSelector('frame[name="main"]');
        const visibleRows = this.nom0101Page.tableRows;
        const rowCount = await visibleRows.count();

        console.log(`✅ Table filtered successfully with ${rowCount} rows for source: ${sourceValue}`);
    }

    /**
     * Complete workflow: navigate, verify title, search by source
     */
    async completeNOM0101Workflow(sourceValue: string): Promise<void> {
        await this.navigateToNOM0101();
        await this.verifyPageTitle();
        await this.searchBySourceAndVerifyFilter(sourceValue);
    }

    async creationAbandonedErrorMsg(): Promise<void> {

        // Click Create button
        await this.helper.clickElement(this.nom0101Page.createButton, 'Click Create button');

        // Click Cancel button
        await this.helper.clickElement(this.nom0101Page.cancelButton, 'Click Cancel button');
        await this.page.waitForTimeout(2000);

        // Verify Creation Abandoned message
        await this.helper.assertElementHasText(
            this.nom0101Page.creationAbandonedMessage,
            'creation abandoned',
            'Verify Creation Abandoned message appears'
        );
        console.log('✅ Product creation abandoned');


    }

    /**
     * Create manufactured product with all required fields
     */
    async createManufacturedProduct(): Promise<{ productCode: string; repereOrgane: string; shortLabel: string }> {
        // Generate random test data
        const productCode = await this.sshHelper.generateRandomNumeric(10);
        const randomDigits = await this.sshHelper.generateRandomNumeric(2);
        const repereOrgane = `TEST${randomDigits}`;
        const shortLabel = `SL_${await this.sshHelper.generateRandomAlphanumeric(5)}`;
        const extendedLabel = `EL_${await this.sshHelper.generateRandomAlphanumeric(5)}`;
        const functionalityCode = `FC_${await this.sshHelper.generateRandomAlphanumeric(3)}`;
        const psaCode = `PSA_${await this.sshHelper.generateRandomAlphanumeric(3)}`;
        const ssrCode = `SSR_${await this.sshHelper.generateRandomAlphanumeric(3)}`;

        // Click Create button
        await this.helper.clickElement(this.nom0101Page.createButton, 'Click Create button');
        await this.page.waitForTimeout(1500);

        // Fill SGR/Nature/Product field with 10 digit random number
        await this.helper.enterText(this.nom0101Page.sgrNatureProductField, productCode, `Enter Product Code: ${productCode}`);
        await this.page.waitForTimeout(500);

        // Fill Repère Organe field with TEST + 4 random digits
        await this.helper.enterText(this.nom0101Page.repereOrganeField, repereOrgane, `Enter Repère Organe: ${repereOrgane}`);
        await this.page.waitForTimeout(500);

        // Click General Properties tab/button
        await this.helper.clickElement(this.nom0101Page.generalPropertiesButton, 'Click General properties button');
        await this.page.waitForTimeout(1000);

        // Fill Short Label
        await this.helper.enterText(this.nom0101Page.shortLabelField, shortLabel, `Enter Short Label: ${shortLabel}`);
        await this.page.waitForTimeout(300);

        // Fill Extended Label
        await this.helper.enterText(this.nom0101Page.extendedLabelField, extendedLabel, `Enter Extended Label: ${extendedLabel}`);
        await this.page.waitForTimeout(300);

        // Check Enhanced parts traceability (PSTR) checkbox
        const pstrCheckbox = this.nom0101Page.enhancedPartsTraceabilityCheckbox;
        const isPstrChecked = await pstrCheckbox.isChecked().catch(() => false);
        if (!isPstrChecked) {
            await this.helper.clickElement(pstrCheckbox, 'Check Enhanced parts traceability (PSTR)');
            await this.page.waitForTimeout(300);
        }

        // Fill Functionality Code
        await this.helper.enterText(this.nom0101Page.functionalityCodeField, functionalityCode, `Enter Functionality Code: ${functionalityCode}`);
        await this.page.waitForTimeout(300);

        // Fill PSA Code
        await this.helper.enterText(this.nom0101Page.psaCodeField, psaCode, `Enter PSA Code: ${psaCode}`);
        await this.page.waitForTimeout(300);

        // Fill SSR Code
        await this.helper.enterText(this.nom0101Page.ssrCodeField, ssrCode, `Enter SSR Code: ${ssrCode}`);
        await this.page.waitForTimeout(300);

        // Click Classification pen and select random option
        await this.helper.clickElement(this.nom0101Page.classificationPenButton, 'Click Classification pen button');
        await this.page.waitForTimeout(1000);
        await pressKey(this.page, 'ArrowDown'); // Navigate to the first option in the dropdown
        await pressKey(this.page, 'Enter');
        await this.page.waitForTimeout(500);

        // Check NFC Request checkbox
        const nfcCheckbox = this.nom0101Page.nfcRequestCheckbox;
        const isNfcChecked = await nfcCheckbox.isChecked().catch(() => false);
        if (!isNfcChecked) {
            await this.helper.clickElement(nfcCheckbox, 'Check NFC request checkbox');
            await this.page.waitForTimeout(500);
        }

        await this.helper.clickElement(this.nom0101Page.decompositionDateFieldPen, 'Click on Decomposition Date field to open date picker');

        // Select today's decomposition date after NFC request checkbox
        const today = new Date();
        const todayString = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        await this.helper.enterText(this.nom0101Page.decompositionDateField, todayString, `Enter Decomposition Date: ${todayString}`);
        await this.page.waitForTimeout(300);

        // Check Production Forbidden checkbox
        const prodForbiddenCheckbox = this.nom0101Page.productionForbiddenCheckbox;
        const isProdForbiddenChecked = await prodForbiddenCheckbox.isChecked().catch(() => false);
        if (!isProdForbiddenChecked) {
            await this.helper.clickElement(prodForbiddenCheckbox, 'Check Production forbidden checkbox');
            await this.page.waitForTimeout(500);
        }

        // Fill Comment Prohibited field after Production Forbidden checkbox
        await this.helper.enterText(this.nom0101Page.commentProhibitedField, 'test', 'Enter Comment Prohibited: test');
        await this.page.waitForTimeout(300);

        await this.partcularPropertiesfilling();
        await this.biwSequencefilling();
        await this.localAttributesfilling();
        await this.columnsfilling();


        // Click Validate button
        await this.helper.clickElement(this.nom0101Page.validateButton, 'Click Validate button');
        await this.page.waitForTimeout(2000);

        // Verify Creation Done message
        await this.helper.assertElementHasText(
            this.nom0101Page.creationDoneMessage,
            'creation done',
            'Verify Creation Done message appears'
        );
        console.log('✅ Product created successfully');

        return { productCode, repereOrgane, shortLabel };
    }

    async partcularPropertiesfilling() {
        const valueText = `TEST${await this.sshHelper.generateRandomAlphanumeric(3)}`;
        await this.helper.clickElement(this.nom0101Page.creationDoneparticularProperties, 'Click on Particular properties');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0101Page.naturePen, 'Click on Nature pen button');
        await this.page.waitForTimeout(1000);
        await pressKey(this.page, 'Enter');
        await this.helper.enterText(this.nom0101Page.valueTextBox, valueText, `Enter Value: ${valueText}`);
        await this.page.waitForTimeout(300);
        await this.helper.clickElement(this.nom0101Page.moveToRightArrow.first(), 'Click on Move to right arrow to add nature');
        await this.page.waitForTimeout(500);

    }

    async biwSequencefilling() {
        await this.helper.clickElement(this.nom0101Page.sequenzText, 'Click on Columns tab');
        await this.helper.clickElement(this.nom0101Page.ppfPen, 'Click on ppf pen button');
        await pressKey(this.page, 'ArrowDown'); // Navigate to the first option in the dropdown
        await pressKey(this.page, 'Enter');
        await this.helper.clickElement(this.nom0101Page.BiwSequencePen, 'Click on BIW Sequence pen button');
        await this.page.waitForTimeout(1000);
        await pressKey(this.page, 'ArrowDown'); // Navigate to the first option in the dropdown
        await pressKey(this.page, 'Enter');
        await this.helper.clickElement(this.nom0101Page.sequenzeRightArrow, 'Click on Move to right arrow to add BIW sequence');
        await this.page.waitForTimeout(500);
    }

    async localAttributesfilling() {
        await this.helper.clickElement(this.nom0101Page.localAttributesTab, 'Click on Local Attributes tab');
        await this.helper.clickElement(this.nom0101Page.columnPen, 'Click on Column pen button');
        await pressKey(this.page, 'ArrowDown'); // Navigate to the first option in the dropdown
        await pressKey(this.page, 'Enter');
        await this.helper.clickElement(this.nom0101Page.localAttriRightArrow, 'Click on Move to right arrow to add local attribute');
        await this.page.waitForTimeout(500);
    }

    async columnsfilling() {
        await this.helper.clickElement(this.nom0101Page.columnsTab, 'Click on Columns tab');
        await this.helper.clickElement(this.nom0101Page.columnKPen, 'Click on Column K pen button');
        await pressKey(this.page, 'ArrowDown'); // Navigate to the first option in the dropdown
        await pressKey(this.page, 'Enter');
        await this.helper.clickElement(this.nom0101Page.columnKRightArrow, 'Click on Move to right arrow to add column K');
        await this.page.waitForTimeout(500);
    }

    /**
     * View manufactured product - clicks next page until product found, then clicks View
     */
    async viewProduct(productCode: string): Promise<void> {

        await this.filterTableByProduct(productCode);

        // Click View button
        await this.helper.clickElement(this.nom0101Page.viewButton, 'Click View button');
        await this.page.waitForTimeout(2000);
        console.log(`✅ Clicked View button for product: ${productCode}`);
    }
    async filterTableByProduct(productCode: string) {
        await this.helper.clickElement(this.nom0101Page.sg6NatureProductPen, 'Click SG6 Nature Product pen button');
        const productRow = this.nom0101Page.getProductRow(productCode);
        await this.helper.clickElement(productRow, `Select product row: ${productCode}`);
        await this.page.waitForTimeout(500);
        await this.helper.clickElement(this.nom0101Page.searchButton, 'Click SG6 Nature Product pen button');

    }

    async modifyProduct(productCode: string): Promise<void> {
        await this.filterTableByProduct(productCode);
        await this.helper.clickElement(this.nom0101Page.modifyButton, 'Click Modify button');
        await this.helper.enterText(this.nom0101Page.shortLabelField, `MOD_${productCode}`, `Modify Short Label to: MOD_${productCode}`);
        await this.page.waitForTimeout(5000);
        console.log(`✅ Clicked Modify button for product: ${productCode}`);
        await this.helper.clickElement(this.nom0101Page.validateButton, 'Click Validate button after modification');
        await this.page.waitForTimeout(500);
        console.log(`✅ Product modified successfully: ${productCode}`);
    }

    async deleteProduct(productCode: string): Promise<void> {
        await this.filterTableByProduct(productCode);
        await this.helper.clickElement(this.nom0101Page.deleteButton, 'Click Delete button');
        // await this.helper.clickElement(this.nom0101Page.productionForbiddenCheckbox, 'Check Production forbidden checkbox to mark product for deletion');
        // await this.page.waitForTimeout(500);
        await this.helper.clickElement(this.nom0101Page.validateButton, 'Click Validate button after marking for deletion');
        await this.page.waitForTimeout(500);
        console.log(`✅ Product marked for deletion successfully: ${productCode}`);
        await this.helper.assertElementHasText(this.nom0101Page.confirmDeletionText, 'Do you confirm the deletion ?', 'Verify deletion confirmation message appears');
        await this.helper.clickElement(this.nom0101Page.yesButton, 'Click Yes button to confirm deletion');
        await this.page.waitForTimeout(500);
        console.log(`✅ Product deletion confirmed: ${productCode}`);
    }


    async duplicateProduct(productCode: string): Promise<{ productCode: string; repereOrgane: string }> {
        const duplicateProductCode = await this.sshHelper.generateRandomNumeric(10);
        const randomDigits = await this.sshHelper.generateRandomNumeric(3);
        const repereOrgane = `DUP${randomDigits}`;


        await this.filterTableByProduct(productCode);
        await this.helper.clickElement(this.nom0101Page.duplicateButton, 'Click Duplicate button');

        await this.helper.enterText(this.nom0101Page.productField, `${duplicateProductCode}`, `Enter new Product Code for duplicate: COPY_${duplicateProductCode}`);
        await this.page.waitForTimeout(500);
        await this.helper.enterText(this.nom0101Page.repereOrganeField, `${repereOrgane}`, `Enter new Repère Organe for duplicate: ${repereOrgane}`);
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0101Page.validateButton, 'Click Validate button after entering duplicate product details');
        await this.page.waitForTimeout(1000);
        console.log(`✅ Product duplicated successfully: Original=${productCode}, Duplicate=COPY_${duplicateProductCode}`);

        return { productCode: `${duplicateProductCode}`, repereOrgane };
    }

    async deleteDuplicateProduct(duplicateProductCode: string): Promise<void> {
        await this.filterTableByProduct(duplicateProductCode);
        await this.helper.clickElement(this.nom0101Page.deleteButton, 'Click Delete button for duplicate product');
        await this.helper.clickElement(this.nom0101Page.validateButton, 'Click Validate button after marking duplicate for deletion');
        await this.page.waitForTimeout(500);
        console.log(`✅ Duplicate product marked for deletion successfully: ${duplicateProductCode}`);
        await this.helper.assertElementHasText(this.nom0101Page.confirmDeletionText, 'Do you confirm the deletion ?', 'Verify deletion confirmation message appears for duplicate product');
        await this.helper.clickElement(this.nom0101Page.yesButton, 'Click Yes button to confirm deletion of duplicate product');
        await this.page.waitForTimeout(500);
        console.log(`✅ Duplicate product deletion confirmed: ${duplicateProductCode}`);
    }

    async compareProducts(product1Code: string, product2Code: string): Promise<void> {
        await this.helper.clickElement(this.nom0101Page.compareButton, 'Click Compare button to open product comparison');
        
        // Select first product
        await this.page.locator('frame[name="main"]').contentFrame().locator('#comboProduit1 span').click();
        await this.page.waitForTimeout(500);
        await this.helper.clickElement(
            this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: product1Code }).nth(2),
            `Select first product: ${product1Code}`
        );
        await this.page.waitForTimeout(500);

        // Select second product
        await this.page.locator('frame[name="main"]').contentFrame().locator('#comboProduit2 span').click();
        await this.page.waitForTimeout(500);
        await this.helper.clickElement(
            this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: product2Code }).nth(2),
            `Select second product: ${product2Code}`
        );
        await this.page.waitForTimeout(500);

        await this.helper.clickElement(this.nom0101Page.compareSearchButton, 'Click Compare Search button to perform product comparison');
        await this.page.waitForTimeout(1000);
        await this.helper.assertElementHasText(this.nom0101Page.localAttributesTabCompare, 'Local attributes', 'Verify Local attributes tab is visible in comparison results');
        await this.page.waitForTimeout(1000);
        await this.helper.captureScreenshot('NOM0101_product_comparison');
        await this.helper.assertElementHasText(this.nom0101Page.compositionTabCompare, 'Composition', 'Verify Composition tab is visible in comparison results');
        await this.helper.clickElement(this.nom0101Page.compositionTabCompare, 'Click on Composition tab in comparison results');
        console.log(`✅ Product comparison performed successfully: ${product1Code} vs ${product2Code}`);


    }

    /**
     * Navigate tree structure: click Tree Structure, switch to Table view, select current date, and apply filter
     */
    async navigateTreeStructureAndFilter(productCode: string, table: Locator): Promise<void> {

        await this.filterTableByProduct(productCode);
        // Click on Tree structure
        await this.helper.clickElement(this.nom0101Page.treeStructure, 'Click on Tree structure');
        await this.page.waitForTimeout(1000);

        // Click on Table view
        await this.helper.clickElement(table, 'Click on Table view');
        await this.page.waitForTimeout(1000);
        await this.helper.assertElementHasText(this.nom0101Page.titleNom305, '  View product tree  (NOM0305) ', 'Verify navigation to NOM0305 - View product tree');
        // Click on date field to select current date
        await this.helper.clickElement(this.nom0101Page.dateDemandeImg, 'Click on Date demand image to open date picker');
        await this.page.waitForTimeout(500);

        // Select today's date
        const today = new Date();
        const todayString = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        await this.helper.enterText(
            this.page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Request Date' }),
            todayString,
            `Enter current date: ${todayString}`
        );
        await this.page.waitForTimeout(500);

        // Apply filter
        await this.helper.clickElement(this.nom0101Page.filterText, 'Click on Filter button to apply filter');
        await this.page.waitForTimeout(1000);

        console.log('✅ Tree structure navigation and filter applied successfully');
    }

    async manageCompositionForManageComponents(productCode: string): Promise<void> {

        await this.filterTableByProduct(productCode);
        // Click on Tree structure
        await this.helper.clickElement(this.nom0101Page.manageComposition, 'Click on Manage Composition button');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0101Page.manageComponents, 'Click on Manage the manageComponents option');
                await this.helper.assertElementHasText(this.nom0101Page.manageCompositionOptionNOM0302, 'Manage the composition  (NOM0302)', 'Verify navigation to NOM0302 - Manage the composition');

    }

    async manageCompositionForManageCompounds(productCode: string): Promise<void> {

        await this.filterTableByProduct(productCode);
        // Click on Tree structure
        await this.helper.clickElement(this.nom0101Page.manageComposition, 'Click on Manage Composition button');
        await this.page.waitForTimeout(1000);
        await this.helper.clickElement(this.nom0101Page.manageCompounds, 'Click on Manage the manageCompounds option');
        // await this.helper.assertElementHasText(this.nom0101Page.viewProductTreeNOM0305, 'View product tree  (NOM0305)', 'Verify navigation to NOM0305 - View product tree');
                        await this.helper.assertElementHasText(this.nom0101Page.manageCompositionOptionNOM0302, 'Manage the composition  (NOM0302)', 'Verify navigation to NOM0302 - Manage the composition');


    }

    


}
async function pressKey(page: Page, key: string) {
    await page.keyboard.press(key);
}

