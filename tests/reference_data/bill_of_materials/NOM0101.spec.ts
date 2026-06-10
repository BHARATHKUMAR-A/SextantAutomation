import { test } from '../../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper } from '../../../utils/StepHelper';
import { SshHelper } from '../../../utils/sshHelper';
import { NOM0101Steps } from '../../../steps/NOM0101Steps';
import { NOM0101Page } from '../../../pages/NOM0101Page';
import { PuttyLogReader } from '../../../utils/puttyLogReader';
import * as fs from 'fs';
import envConfig from '../../../test-data/envConfig.json';
import credentials from '../../../test-data/credentials.json';

const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : DEFAULT_PUTTY_LOG_FILE;

const USER_ID = credentials.Credentials.username;

let verifier: PuttyLogReader;
let createdProductCode: string;
let duplicateProductCode: string;

test.describe.serial('NOM0101 - Manage manufactured products', () => {
    test.beforeAll(() => {
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    test('Navigate to NOM0101 and verify title', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);

        await nom0101Steps.navigateToNOM0101();
        await nom0101Steps.verifyPageTitle();
    });

    test('Search by source and verify table filters', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();

        // Select source and search - filtering table with source data
        await nom0101Steps.searchBySourceAndVerifyFilter('C');

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_filtered_results');
    });

    test('Complete NOM0101 workflow', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);

        // Execute complete workflow: navigate → verify title → search by source
        await nom0101Steps.completeNOM0101Workflow('Source_001');

        await helper.captureScreenshot('NOM0101_workflow_complete');
    });

    test('Create manufactured product with required fields only', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);

        await nom0101Steps.navigateToNOM0101();
    });

    test('Create manufactured product with all properties to see creation abandoned error message', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();

        await helper.clickElement(nom0101Page.createButton, 'Click Create button');

        // Click Cancel button
        await helper.clickElement(nom0101Page.cancelButton, 'Click Cancel button');
        await page.waitForTimeout(2000);

        // Verify Creation Abandoned message
        await helper.assertElementHasText(
            nom0101Page.creationAbandonedMessage,
            'creation abandoned',
            'Verify Creation Abandoned message appears'
        );
        console.log('✅ Product creation abandoned');

        await helper.captureScreenshot('NOM0101_creation_error_message');
    });

    test('Modify manufactured product with all properties to see modify abandoned error message', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();
        // await page.keyboard.press('ArrowDown');
        await helper.clickElement(nom0101Page.tableRowsNom0101.nth(15), 'select product in the table');
        await helper.clickElement(nom0101Page.modifyButton, 'Click Modify button');
        await helper.clickElement(nom0101Page.cancelButton, 'Click Cancel button');
        await page.waitForTimeout(2000);

        // Verify Modify Abandoned message
        await helper.assertElementHasText(nom0101Page.modifyAbandonedMessage, 'Modification abandoned', 'Verify Modify Abandoned message appears');
        console.log('✅ Product modification abandoned');
        await helper.captureScreenshot('NOM0101_modification_error_message');
    });

    test('Delete manufactured product with all properties to see delete abandoned error message', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();
        // await page.keyboard.press('ArrowDown');
        await helper.clickElement(nom0101Page.tableRowsNom0101.nth(15), 'select product in the table');
        await helper.clickElement(nom0101Page.deleteButton, 'Click Delete button');
        await helper.clickElement(nom0101Page.cancelButton, 'Click Cancel button');
        await page.waitForTimeout(2000);

        // Verify Delete Abandoned message
        await helper.assertElementHasText(nom0101Page.deletionAbandonedMessage, 'Deletion abandoned', 'Verify Delete Abandoned message appears');
        console.log('✅ Product deletion abandoned');
        await helper.captureScreenshot('NOM0101_deletion_error_message');
    });


    test('Create manufactured product with all properties + SSH log validation', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const ssh = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();

        // Create manufactured product with all required fields
        const productData = await nom0101Steps.createManufacturedProduct();
        createdProductCode = productData.productCode;
        console.log(`✅ Created product: Product Code=${productData.productCode}, Repère=${productData.repereOrgane}`);

        // Verify SSH log: user SF75684 created product with Product Code
        // Log pattern: "L utilisateur SF75684 a cree l eaf SG6 [productCode]"
        const logPattern = new RegExp(`L utilisateur SF75684 a cree l eaf SG6 ${productData.productCode}|l eaf SG6 ${productData.productCode}.*SF75684`, 'i');
        const logContent = verifier.tail(500);
        const logFound = logPattern.test(logContent);

        expect(logFound, `SSH log should contain creation entry for user SF75684 with Product Code ${productData.productCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} created product with Product Code=${productData.productCode}`);

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_creation_success_with_log');
    });

    test('View manufactured product', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();

        // Click next page until created product visible, then click View
        await nom0101Steps.viewProduct(createdProductCode);

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_product_viewed');
    });

    test('Tree structure for a manufactured product with table selection on NOM0101', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);
        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();

        await nom0101Steps.navigateTreeStructureAndFilter(createdProductCode, nom0101Page.tableView);


    });

    test('Tree structure for a manufactured product with tree selection on NOM0101', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);
        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();

        await nom0101Steps.navigateTreeStructureAndFilter(createdProductCode, nom0101Page.treeView);

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_tree_structure_navigation');

    });

    test(`verify user able to transitioned to "View product tree  (NOM0305)" after clicking on manage the components button in NOM0101 `, async ({ page }, testInfo) => { 
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();
        await nom0101Steps.manageCompositionForManageCompounds('SG6 0928793000');

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_navigate_to_NOM0305_from_components');

    });
    test(`verify user able to transitioned to  " Manage the composition  (NOM0302)"  after clicking on manage the compounds button in NOM0101 `, async ({ page }, testInfo) => { 
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();
        await nom0101Steps.manageCompositionForManageComponents('SG6 0928793000');

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_navigate_to_NOM0302_from_compounds');
    });

    test('Modify manufactured product + SSH log validation', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();

        // Click next page until created product visible, then click View
        await nom0101Steps.modifyProduct(createdProductCode);

        await helper.assertElementHasText(nom0101Page.modifySuccessMessage, 'Modification done', 'Modification success message should be visible');

        // Verify SSH log: user SF75684 modified product with Product Code
        // Log pattern: "L utilisateur SF75684 a modifie l eaf SG6 [productCode]"
        const modifyLogPattern = new RegExp(`L utilisateur SF75684 a modifie l eaf SG6 ${createdProductCode}`, 'i');
        const logContent = verifier.tail(500);
        const modifyLogFound = modifyLogPattern.test(logContent);

        expect(modifyLogFound, `SSH log should contain modification entry for user SF75684 with Product Code ${createdProductCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} modified product with Product Code=${createdProductCode}`);

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_product_modified');
    });



    test('Duplicate manufactured product', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);
        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();
        // await nom0101Steps.duplicateProduct(createdProductCode);
        const duplicateProductData = await nom0101Steps.duplicateProduct(createdProductCode);
        duplicateProductCode = duplicateProductData.productCode;

        await helper.assertElementHasText(nom0101Page.duplicationSuccessMessage, 'Duplication done', 'Duplication done message should be visible after duplication');


        // Verify SSH log: user SF75684 duplicated product with Product Code
        const logPattern = new RegExp(`L utilisateur SF75684 a cree l eaf SG6 ${duplicateProductCode}|l eaf SG6 ${duplicateProductCode}.*SF75684`, 'i');
        const logContent = verifier.tail(500);
        const logFound = logPattern.test(logContent);

        expect(logFound, `SSH log should contain creation entry for user SF75684 with Product Code ${duplicateProductCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} created product with Product Code=${duplicateProductCode}`);

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_creation_success_with_log');
    });



    test('Delete manufactured product + SSH log validation', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();

        // Click next page until created product visible, then click Delete
        await nom0101Steps.deleteProduct(createdProductCode);

        await helper.assertElementHasText(nom0101Page.deletionSuccessMessage, 'Deletion done', 'Deletion success message should be visible');

        // Verify SSH log: user SF75684 deleted product with Product Code
        // Log pattern: "L utilisateur SF75684 a supprime l eaf SG6 [productCode]"
        const deleteLogPattern = new RegExp(`L utilisateur SF75684 a supprime l eaf SG6 ${createdProductCode}`, 'i');
        const logContent = verifier.tail(500);
        const deleteLogFound = deleteLogPattern.test(logContent);

        expect(deleteLogFound, `SSH log should contain deletion entry for user SF75684 with Product Code ${createdProductCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} deleted product with Product Code=${createdProductCode}`);

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_product_deleted');
    });



    test('Delete duplicated manufactured product', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();
        await nom0101Steps.deleteDuplicateProduct(duplicateProductCode);
        await helper.assertElementHasText(nom0101Page.deletionSuccessMessage, 'Deletion done', 'Deletion success message should be visible');

        // Verify SSH log: user SF75684 deleted product with Product Code
        const deleteLogPattern = new RegExp(`L utilisateur SF75684 a supprime l eaf SG6 ${duplicateProductCode}`, 'i');
        const logContent = verifier.tail(500);
        const deleteLogFound = deleteLogPattern.test(logContent);

        expect(deleteLogFound, `SSH log should contain deletion entry for user SF75684 with Product Code ${duplicateProductCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} deleted product with Product Code=${duplicateProductCode}`);

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_duplicate_product_deleted');
    });

    test('Compare two products on NOM0101 ', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0101Steps = new NOM0101Steps(page, testInfo, helper);
        const nom0101Page = new NOM0101Page(page);

        // Navigate to the screen
        await nom0101Steps.navigateToNOM0101();
        await nom0101Steps.compareProducts('SG6 0928793000', 'SG6 0928793253');

        // Capture screenshot for report
        await helper.captureScreenshot('NOM0101_products_compared');
    });

});