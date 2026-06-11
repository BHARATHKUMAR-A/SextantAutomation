import { test } from '../../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper } from '../../../utils/StepHelper';
import { SshHelper } from '../../../utils/sshHelper';
import { PuttyLogReader } from '../../../utils/puttyLogReader';
import * as fs from 'fs';
import envConfig from '../../../test-data/envConfig.json';
import credentials from '../../../test-data/credentials.json';
import { NOM0201Page } from '../../../pages/NOM0201Page';
import { NOM0201Steps } from '../../../steps/NOM0201Steps';

const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
    ? envConfig.logFilePath.puttyLogFile
    : DEFAULT_PUTTY_LOG_FILE;

const USER_ID = credentials.Credentials.username;

let verifier: PuttyLogReader;
let createdProductCode: string;
let duplicateProductCode: string;
let sgr: string;

test.describe.serial('NOM0201 - Manage raw materials', () => {

    test.beforeAll(() => {
        verifier = new PuttyLogReader(PUTTY_LOG_FILE);
    });

    test('Navigate to NOM0201 and verify title', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0201Steps = new NOM0201Steps(page, testInfo, helper);

        await nom0201Steps.navigateToNOM0201();
        await nom0201Steps.verifyPageTitle();
    });

    test('Search by source and verify table filters', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0201Steps = new NOM0201Steps(page, testInfo, helper);

        await nom0201Steps.navigateToNOM0201();
        await nom0201Steps.searchBySourceAndVerifyFilter('C');
        await helper.captureScreenshot('NOM0201_filtered_results');
    });

    //

    test('Create manufactured product with all properties to see creation abandoned error message', async ({ page }, testInfo) => {
            const helper = new StepHelper(page, testInfo);
            const nom0201Steps = new NOM0201Steps(page, testInfo, helper);
            const nom0201Page = new NOM0201Page(page);
    
            // Navigate to the screen
            await nom0201Steps.navigateToNOM0201();
    
            await helper.clickElement(nom0201Page.createButton, 'Click Create button');
    
            // Click Cancel button
            await helper.clickElement(nom0201Page.cancelButton, 'Click Cancel button');
            await page.waitForTimeout(2000);
    
            // Verify Creation Abandoned message
            await helper.assertElementHasText(
                nom0201Page.creationAbandonedMessage,
                'creation abandoned',
                'Verify Creation Abandoned message appears'
            );
            console.log('✅ Product creation abandoned');
    
            await helper.captureScreenshot('NOM0201_creation_error_message');
        });
    
        test('Modify manufactured product with all properties to see modify abandoned error message', async ({ page }, testInfo) => {
            const helper = new StepHelper(page, testInfo);
            const nom0201Steps = new NOM0201Steps(page, testInfo, helper);
            const nom0201Page = new NOM0201Page(page);
    
            // Navigate to the screen
            await nom0201Steps.navigateToNOM0201();
            // await page.keyboard.press('ArrowDown');
            await helper.clickElement(nom0201Page.tableRowsNom0201.nth(15), 'select product in the table');
            await helper.clickElement(nom0201Page.modifyButton, 'Click Modify button');
            await helper.clickElement(nom0201Page.cancelButton, 'Click Cancel button');
            await page.waitForTimeout(2000);
    
            // Verify Modify Abandoned message
            await helper.assertElementHasText(nom0201Page.modifyAbandonedMessage, 'Modification abandoned', 'Verify Modify Abandoned message appears');
            console.log('✅ Product modification abandoned');
            await helper.captureScreenshot('NOM0201_modification_error_message');
        });
    
        test('Delete manufactured product with all properties to see delete abandoned error message', async ({ page }, testInfo) => {
            const helper = new StepHelper(page, testInfo);
            const nom0201Steps = new NOM0201Steps(page, testInfo, helper);
            const nom0201Page = new NOM0201Page(page);
    
            // Navigate to the screen
            await nom0201Steps.navigateToNOM0201();
            // await page.keyboard.press('ArrowDown');
            await helper.clickElement(nom0201Page.tableRowsNom0201.nth(15), 'select product in the table');
            await helper.clickElement(nom0201Page.deleteButton, 'Click Delete button');
            await helper.clickElement(nom0201Page.cancelButton, 'Click Cancel button');
            await page.waitForTimeout(2000);
    
            // Verify Delete Abandoned message
            await helper.assertElementHasText(nom0201Page.deletionAbandonedMessage, 'Deletion abandoned', 'Verify Delete Abandoned message appears');
            console.log('✅ Product deletion abandoned');
            await helper.captureScreenshot('NOM0201_deletion_error_message');
        });
    
        test(`verify "The product number 10 char must be filled with zeros"  if the user enter less than 10 char and click on create button`, async ({ page }, testInfo) => {
            const helper = new StepHelper(page, testInfo);
            const nom0201Steps = new NOM0201Steps(page, testInfo, helper);
            const nom0201Page = new NOM0201Page(page);
    
            // Navigate to the screen
            await nom0201Steps.navigateToNOM0201();
            await helper.clickElement(nom0201Page.createButton, 'Click Create button');
            await helper.enterText(nom0201Page.productField, '12345', 'Enter product code with less than 10 characters');
            await helper.clickElement(nom0201Page.validateButton, 'Click Validate button');
    
            await helper.assertElementHasText(nom0201Page.errorMessageProductNumMustBeFilled, 'The plant ID must be filled', 'Verify error message for product number with less than 10 characters');
            console.log('✅ Error message verified for product number with less than 10 characters');
            await helper.captureScreenshot('NOM0201_product_number_error_message');
        });
    

//

    test('Create raw material with required fields + SSH log validation', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0201Steps = new NOM0201Steps(page, testInfo, helper);

        await nom0201Steps.navigateToNOM0201();

        const productData = await nom0201Steps.createRawMaterial();

        createdProductCode = productData.productCode;
        console.log(`✅ Created raw material: Product Code=${productData.productCode}`);

        const logPattern = new RegExp(`L utilisateur SF75684 a cree l article SG6 ${productData.productCode}|l article SG6 ${productData.productCode}.*SF75684`, 'i');
        const logContent = verifier.tail(500);
        const logFound = logPattern.test(logContent);

        expect(logFound, `SSH log should contain creation entry for user SF75684 with Product Code ${productData.productCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} created raw material with Product Code=${productData.productCode}`);

        await helper.captureScreenshot('NOM0201_creation_success_with_log');
    });

    test('View raw material', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0201Steps = new NOM0201Steps(page, testInfo, helper);

        await nom0201Steps.navigateToNOM0201();
        await nom0201Steps.viewProduct(createdProductCode);
        await helper.captureScreenshot('NOM0201_product_viewed');
    });

    test('Modify raw material + SSH log validation', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0201Steps = new NOM0201Steps(page, testInfo, helper);
        const nom0201Page = new NOM0201Page(page);

        await nom0201Steps.navigateToNOM0201();
        await nom0201Steps.modifyProduct(createdProductCode);

        await helper.assertElementHasText(nom0201Page.modifySuccessMessage, 'Modification done', 'Modification success message should be visible');

        const modifyLogPattern = new RegExp(`L utilisateur SF75684 a modifie l article SG6 ${createdProductCode}`, 'i');
        const logContent = verifier.tail(500);
        const modifyLogFound = modifyLogPattern.test(logContent);

        expect(modifyLogFound, `SSH log should contain modification entry for user SF75684 with Product Code ${createdProductCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} modified raw material with Product Code=${createdProductCode}`);

        await helper.captureScreenshot('NOM0201_product_modified');
    });

    test('Duplicate raw material', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0201Steps = new NOM0201Steps(page, testInfo, helper);
        const nom0201Page = new NOM0201Page(page);

        await nom0201Steps.navigateToNOM0201();
        const duplicateProductData = await nom0201Steps.duplicateProduct(createdProductCode);
        duplicateProductCode = duplicateProductData.productCode;
        sgr = duplicateProductData.repereOrgane;

        await helper.assertElementHasText(nom0201Page.duplicationSuccessMessage, 'Duplication done', 'Duplication done message should be visible after duplication');

        const logPattern = new RegExp(`L utilisateur SF75684 a cree l article ${sgr} ${duplicateProductCode}|l article ${sgr} ${duplicateProductCode}.*SF75684`, 'i');
        const logContent = verifier.tail(500);
        const logFound = logPattern.test(logContent);

        expect(logFound, `SSH log should contain creation entry for duplicate user SF75684 with Product Code ${duplicateProductCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} duplicated raw material with Product Code=${duplicateProductCode}`);

        await helper.captureScreenshot('NOM0201_product_duplicated');
    });

    test('Delete raw material', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0201Steps = new NOM0201Steps(page, testInfo, helper);
        const nom0201Page = new NOM0201Page(page);

        await nom0201Steps.navigateToNOM0201();
        await nom0201Steps.deleteProduct(createdProductCode);

        await helper.assertElementHasText(nom0201Page.deletionSuccessMessage, 'Deletion done', 'Deletion success message should be visible');

        const deleteLogPattern = new RegExp(`L utilisateur SF75684 a supprime l article SG6 ${createdProductCode}`, 'i');
        const logContent = verifier.tail(500);
        const deleteLogFound = deleteLogPattern.test(logContent);

        expect(deleteLogFound, `SSH log should contain deletion entry for user SF75684 with Product Code ${createdProductCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} deleted raw material with Product Code=${createdProductCode}`);

        await helper.captureScreenshot('NOM0201_product_deleted');
    });

    test('Delete duplicated raw material', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const nom0201Steps = new NOM0201Steps(page, testInfo, helper);
        const nom0201Page = new NOM0201Page(page);


        await nom0201Steps.navigateToNOM0201();
        await nom0201Steps.deleteProduct(duplicateProductCode);
        await helper.assertElementHasText(nom0201Page.deletionSuccessMessage, 'Deletion done', 'Deletion success message should be visible');

        const deleteLogPattern = new RegExp(`L utilisateur SF75684 a supprime l article ${sgr} ${duplicateProductCode}`, 'i');
        const logContent = verifier.tail(500);
        const deleteLogFound = deleteLogPattern.test(logContent);

        expect(deleteLogFound, `SSH log should contain deletion entry for user SF75684 with Product Code ${duplicateProductCode}`).toBeTruthy();
        console.log(`✅ SSH log verified: User ${USER_ID} deleted raw material with Product Code=${duplicateProductCode}`);

        await helper.captureScreenshot('NOM0201_duplicated_product_deleted');
});
});