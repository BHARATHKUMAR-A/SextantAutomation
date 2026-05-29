import { Page, Locator, TestInfo, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { attachment } from 'allure-js-commons';

export class StepHelper {
    private page: Page;
    private testInfo: TestInfo;
    private stepCounter: number;
    private assertionCounter: number;
    private sanitizedTitle: string;
    private baseDir: string;

    constructor(page: Page, testInfo: TestInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.stepCounter = 1;
        this.assertionCounter = 1;

        this.sanitizedTitle = testInfo.title.replace(/\s+/g, '_');
        this.baseDir = path.join('reports', 'artifacts', 'screenshots', this.sanitizedTitle);

        this.ensureDirectory();
    }

    private ensureDirectory(): void {
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
            console.log(`📁 Created screenshot folder: ${this.baseDir}`);
        }
    }
    /* async captureScreenshot(label: string): Promise<void> {
        const fileName = `step${this.stepCounter++}_${label.replace(/\s+/g, '_')}.png`;
        const screenshotPath = path.join(this.baseDir, fileName);

        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        attachment(label, await this.page.screenshot(), 'image/png');
        await this.testInfo.attach(label, {
            path: screenshotPath,
            contentType: 'image/png',
        });

        console.log(`📸 Screenshot attached: ${screenshotPath}`);
    } */
    async captureScreenshot(label: string): Promise<void> {
        const fileName = `step${this.stepCounter++}_${label.replace(/\s+/g, '_')}.png`;
        const screenshotPath = path.join(this.baseDir, fileName);

        // Take screenshot once and reuse it
        const screenshotBuffer = await this.page.screenshot({ path: screenshotPath, fullPage: true });

        // Attach to custom report
        attachment(label, screenshotBuffer, 'image/png');

        // Attach to Playwright report
        await this.testInfo.attach(label, {
            path: screenshotPath,
            contentType: 'image/png',
        });

        console.log(`📸 Screenshot attached: ${screenshotPath}`);
    }
    //bharath
    async pressEnterOnElement(frameName: string, buttonSelector: string, label: string): Promise<void> {
        try {
            const timeout: number = 5000;
            const frame = this.page.frame({ name: frameName });
            if (!frame) {
                throw new Error(`Frame "${frameName}" not found`);
            }
            // Locate the button inside the frame
            const transactionBox = frame.locator(buttonSelector);

            // Wait for the button to be visible and enabled
            await transactionBox.waitFor({ state: 'visible', timeout });
            await transactionBox.focus(); // Ensure element is focused
            await transactionBox.press('Enter');
            // await this.page.waitForTimeout(3000);

            console.log(`✅ Pressed Enter on ${label}`);
        } catch (error) {
            console.error(`❌ Failed to press Enter on ${label}:`, error);
            // await this.captureScreenshot(`Error_PressEnter_${label}`);
            throw error;
        }
    }

    /* async pressTab3OnElement(frameName: string, buttonSelector: string, label: string): Promise<void> {
        try {
            const timeout:number=5000;
            const frame = this.page.frame({ name: frameName });
        if (!frame) {
            throw new Error(`Frame "${frameName}" not found`);
        }
        // Locate the button inside the frame
        const locationBox = frame.locator(buttonSelector);

        // Wait for the button to be visible and enabled
            await locationBox.waitFor({ state: 'visible', timeout });
            await locationBox.click();
            await locationBox.focus(); // Ensure element is focused

                for (const option of options) {
                    const text = await option.getText();
                    if (text === fixedText) {
                        console.log("Selected Fifo: " + text);
                        await option.click();
                        break;
                    }
                }


           // await this.page.waitForTimeout(3000);
           
            console.log(`✅ Pressed Enter on ${label}`);
        } catch (error) {
            console.error(`❌ Failed to press Enter on ${label}:`, error);
           // await this.captureScreenshot(`Error_PressEnter_${label}`);
            throw error;
        }
    } */

    async clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void> {
        try {
            const timeout: number = 5000;

            // Get the frame by name
            const frame = this.page.frame({ name: frameName });
            if (!frame) {
                throw new Error(`Frame "${frameName}" not found`);
            }

            // Locate the button inside the frame
            const button = frame.locator(buttonSelector);

            // Wait for the button to be visible and enabled
            await button.waitFor({ state: 'visible', timeout });

            // Click the button
            await button.click();
            console.log(`User clicked on the location : ${label}`);

        } catch (error) {
            console.error(`❌ Error clicking "${label}" in frame "${frameName}":`, error);
            await this.captureScreenshot(`Error_Click_${label}`);
            throw error;
        }
    }

    async ExtractTextInFrame(frameName: string, buttonSelector: string, label: string): Promise<string> {
        try {
            const timeout: number = 5000;

            // Get the frame by name
            const frame = this.page.frame({ name: frameName });
            if (!frame) {
                throw new Error(`Frame "${frameName}" not found`);
            }

            // Locate the button inside the frame
            const button = frame.locator(buttonSelector);

            // Wait for the button to be visible and enabled
            await button.waitFor({ state: 'visible', timeout });

            // Click the button
            const text = await button.innerText();
            console.log(`User clicked on the location : ${label} and extracted text: ${text}`);
            return text;




        } catch (error) {
            console.error(`❌ Error clicking "${label}" in frame "${frameName}":`, error);
            await this.captureScreenshot(`Error_Click_${label}`);
            throw error;
        }
    }
    async fillInFrame(frameName: string, buttonSelector: string, text: string, label: string): Promise<void> {
        try {
            const timeout: number = 5000;

            // Get the frame by name
            const frame = this.page.frame({ name: frameName });
            if (!frame) {
                throw new Error(`Frame "${frameName}" not found`);
            }

            // Locate the button inside the frame
            const button = frame.locator(buttonSelector);

            // Wait for the button to be visible and enabled
            await button.waitFor({ state: 'visible', timeout });

            // Click the button
            await button.clear();
            await button.fill(text);
            await this.page.waitForTimeout(3000);

        } catch (error) {
            console.error(`❌ Error clicking "${label}" in frame "${frameName}":`, error);
            await this.captureScreenshot(`Error_Click_${label}`);
            throw error;
        }
    }

    async assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label = ''): Promise<void> {
        try {
            const timeout: number = 5000;

            // Get the frame by name
            const frame = this.page.frame({ name: frameName });
            if (!frame) {
                throw new Error(`Frame "${frameName}" not found`);
            }

            // Locate the button inside the frame
            const button = frame.locator(errorInFrame);
            await expect(button).toBeVisible({ timeout: 6000 });
            const actualText = await button.textContent();
            console.log(actualText);
            await expect(button).toHaveText(expectedText, { timeout: 6000 });

            console.log(`✅ [ASSERT] ${label}: Element has expected text "${expectedText}"`);
            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch (error) {
            console.error(`❌ [ASSERT FAILED] ${label}: Expected text "${expectedText}" not found.`);
            throw error;
        }
    }

    //Enter spaces 3

    async typeSpacesInFrame(frameSelector: string, fieldSelector: string): Promise<void> {
        const frame = this.page.frame({ name: frameSelector });

        if (!frame) {
            throw new Error(`Frame "${frame}" not found`);
        }
        const field = frame.locator(fieldSelector);
        let count = 3;
        let delay = 300;
        await field.click(); // Focus the field
        for (let i = 0; i < count; i++) {
            await this.page.keyboard.press('Space');
            if (delay > 0) {
                await this.page.waitForTimeout(delay);
            }
        }
    }
    //checking element visibility


    async validateElementInFrame(frameName: string, elementSelector: string, description: string): Promise<void> {
        const frame = this.page.frame({ name: frameName });
        if (!frame) {
            throw new Error(`Frame with name "${frameName}" not found`);
        }

        const element = frame.locator(elementSelector);

        // Check visibility
        await expect(element).toBeVisible({ timeout: 10000 });

        // Check enabled state
        await expect(element).toBeEnabled();

        console.log(`${description} is visible and enabled : ${elementSelector}`);

        // Capture screenshot
        //await this.captureScreenshot(description);
    }




    /*  async enterText(locator: Locator, text: string, label: string): Promise<void> {
         await locator.fill(text);
         await this.captureScreenshot(`entered_${label}`);
     } */

    async enterText(locator: Locator, text: string, label: string): Promise<void> {
        try {
            console.log(`⌛ Waiting for ${label} to be visible`);
            await locator.waitFor({ state: 'visible' });

            console.log(`✏️  Entering text "${text}" into ${label}`);
            await locator.fill(text);

            await this.captureScreenshot(`entered_${label}`);
            console.log(`✅ Successfully entered text into ${label}`);
        } catch (error) {
            console.error(`❌ Failed to enter text into ${label}`, error);
            await this.captureScreenshot(`ERROR_entered_${label}`);
            throw error;
        }
    }

    async generateLabelName(): Promise<string> {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        return `Test_Label_${formattedDate}`;
    }

    async randomClickFromTable(tableLocator: Locator, label: string): Promise<void> {
        // Locate all rows/items in the list
        const options = tableLocator; // adjust selector if needed

        // Get count
        const count = await options.count();

        // Pick random index
        const randomIndex = Math.floor(Math.random() * count);

        // Click random option
        await options.nth(randomIndex).click();
        console.log(`✅ Clicked on random option from ${label}`);
    }


    async clickElement(locator: Locator, label: string): Promise<void> {
        try {
            console.log(`⌛ Waiting for ${label} to be visible`);
            await locator.waitFor({ state: 'visible' });

            console.log(`🖱️  Clicking on ${label}`);
            await locator.click();

            await this.captureScreenshot(`click_${label}`);
            console.log(`✅ Successfully clicked on ${label}`);
        } catch (error) {
            console.error(`❌ Failed to click on ${label}`, error);
            await this.captureScreenshot(`ERROR_click_${label}`);
            throw error;
        }
    }


    // BOTH methods included (the one LoginSteps expects + your custom one)
    // assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    // assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;

    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        // await this.page.waitForURL(url);
        await this.captureScreenshot('navigate_to_page');
        // await expect(this.page).toHaveURL(url);
    }

    async expectWithScreenshot(assertionFn: () => Promise<void>, label = 'assertion'): Promise<void> {
        try {
            await assertionFn();
            await this.captureAssertionScreenshot(`PASS_${label}`);
        } catch (err) {
            await this.captureAssertionScreenshot(`FAIL_${label}`);
            throw err;
        }
    }

    private async captureAssertionScreenshot(label: string): Promise<void> {
        const fileName = `assert${this.assertionCounter++}_${label}.png`;
        const screenshotPath = path.join(this.baseDir, fileName);

        await this.page.screenshot({ path: screenshotPath, fullPage: true });

        await this.testInfo.attach(label, {
            path: screenshotPath,
            contentType: 'image/png',
        });

        console.log(`✅ Assertion screenshot attached: ${screenshotPath}`);
    }

    async clickElementForcefully(locator: Locator, label = ''): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
        await locator.waitFor({ state: 'visible' });

        try {
            await locator.click({ force: true });
            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch (e) {
            await locator.evaluate(el => (el as HTMLElement).click());
        }
    }

    async assertElementHasText(locator: Locator, expectedText: string, label = ''): Promise<void> {
        try {
            //await expect(locator).toBeVisible({ timeout: 6000 });
            // const actualText = await locator.textContent();
            const sd = await expect(locator).toHaveText(expectedText, { timeout: 6000 });
            console.log(sd)

            console.log(`✅ [ASSERT] ${label}: Element has expected text "${expectedText}"`);
            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch (error) {
            console.error(`❌ [ASSERT FAILED] ${label}: Expected text "${expectedText}" not found.`);
            throw error;
        }
    }

    async assertElementVisible(locator: Locator, label: string, timeout: number = 60000): Promise<void> {
        try {
            await expect(locator).toBeVisible({ timeout });
            console.log(`✅ [ASSERTION PASSED] ${label} is visible.`);
            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch (error) {
            console.error(`❌ [ASSERTION FAILED] ${label} is not visible.`);
            throw error; // Re-throw the error to fail the test
        }
    }

    async assertElementEnabled(locator: Locator, label: string, timeout: number = 60000): Promise<void> {
        try {
            await expect(locator).toBeEnabled({ timeout });
            console.log(`✅ [ASSERTION PASSED] ${label} is enabled.`);
            await this.captureScreenshot(`captured_${label}`);
        } catch (error) {
            console.error(`❌ [ASSERTION FAILED] ${label} is not enabled.`);
            throw error; // Re-throw the error to fail the test
        }
    }
    async assertElementDisabled(element: any, elementName: string, timeout: number = 30000): Promise<boolean> {
        const isDisabled = await element.getAttribute('disabled') === 'true';

        if (isDisabled) {
            console.log(`${elementName} is disabled`);

        } else {
            console.log(`${elementName} is enabled`);
        }
        return isDisabled;
    }

    async getRandomNumber(min: number, max: number): Promise<number> {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async generateRandomManualCode(length: number): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#$&\'()*+,-./:;<=>?@\\^_{|}~';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    async generateRandomFeatureCode(length: number): Promise<string> {

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }

    async checkLocators(formatLocator: Locator, availabilityLocator: Locator, validLocator: Locator): Promise<boolean> {
        const formatPresent = await formatLocator.count() > 0;
        const availabilityPresent = await availabilityLocator.count() > 0;
        const validPresent = await validLocator.count() > 0;
        return formatPresent && availabilityPresent && validPresent;
    }

    //function to clear text from textbox
    async clearText(locator: Locator, label: string): Promise<void> {
        await locator.fill('');
        await this.captureScreenshot(`cleared_${label}`);
    }

    //function to check if radio button is selected or not
    async isRadioButtonSelected(element: any): Promise<boolean> {
        const isSelected = await element.evaluate((el: any) => el.checked);
        return isSelected;
    }

    async generateCode(length: number): Promise<string> {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            code += chars[randomIndex];
        }
        return code;
    }

    //new method
    async codeLength(): Promise<number> {
        const length = Math.random() < 0.5 ? 2 : 3;
        return length;
    }


    //double click on element
    async doubleClickElement(locator: Locator, label = ''): Promise<void> {
        // Ensure the element is scrolled into view and visible
        await locator.scrollIntoViewIfNeeded();
        await locator.waitFor({ state: 'visible' });

        try {
            // Perform a double-click action forcefully
            await locator.dblclick({ force: true });
            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch (e) {
            // Fallback to evaluating the double-click action
            await locator.evaluate(el => {
                const event = new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window });
                el.dispatchEvent(event);
            });
        }
    }

    async assertTextboxValue(locator: Locator, expectedValue: string, label = ''): Promise<void> {
        try {
            await expect(locator).toBeVisible({ timeout: 60000 });
            const actualValue = await locator.inputValue();
            console.log("actual value: " + actualValue);
            console.log("expected value: " + expectedValue);
            if (actualValue === expectedValue) {
                console.log(`✅ [ASSERT] ${label}: Textbox value matches expected value "${expectedValue}"`);
            } else {
                console.error(`❌ [ASSERT FAILED] ${label}: Expected value "${expectedValue}" not found. Actual value: "${actualValue}"`);
                throw new Error(`Expected value "${expectedValue}" not found. Actual value: "${actualValue}"`);
            }

            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch (error) {
            console.error(`❌ [ASSERT FAILED] ${label}: Error occurred while asserting textbox value.`);
            throw error;
        }
    }

    async selectDropdownOption(page: Page, selector: string, value: string): Promise<void> {
        await page.selectOption(selector, value);
    }

    async toggleButtonAction(locator: Locator, element: string): Promise<void> {
        if (await locator.isVisible) {
            console.log(`${element} is visible`);
        } else {
            console.log(`${element} is not visible`);
        }
        await locator.click();

    }

    async checkDateInRange(datelocator: Locator, startDateData: string, endDateData: string): Promise<void> {
        try {
            let dateValue = await datelocator.innerText();
            await this.page.waitForTimeout(3000);

            const parseDate = (str: string): Date => {
                const [dd, mm, yyyy] = str.split('/').map(Number);
                return new Date(yyyy, mm - 1, dd); // Month is 0-indexed
            };

            const currentDate = parseDate(dateValue);
            const startDate = parseDate(startDateData);
            const endDate = parseDate(endDateData);

            const isInRange = currentDate >= startDate && currentDate <= endDate;

            if (isInRange) {
                console.log("✅ [ASSERTION PASSED] Date is in Range");
            } else {
                console.error("❌ [ASSERT FAILED] Date is not in Range");
            }
        } catch (error) {
            console.error("❌ [ASSERTION FAILED] Error occurred while checking date range.");
            throw error; // Re-throw the error to fail the test
        }
    }


    // Generate random text
    async generateRandomText(length: number): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    async selectDropdownByIndex(dropdownLocator: Locator, index: number): Promise<void> {
        const page = dropdownLocator.page();

        // Click the dropdown to open options
        await dropdownLocator.click();

        // Wait for mat-option elements to appear globally (not scoped to dropdown)
        const options = page.locator('mat-option');

        await page.waitForFunction(() => {
            const options = document.querySelectorAll('mat-option');
            return Array.from(options).some(opt => (opt as HTMLElement).offsetParent !== null);
        }, { timeout: 7000 });


        // Ensure the desired index exists
        const count = await options.count();
        if (index >= count) {
            throw new Error(`Index ${index} is out of bounds. Only ${count} options available.`);
        }

        // Click the option at the given index
        await options.nth(index).click();
    }




    async assertElementHasInputValues(locator: Locator, expectedText: string, label = ''): Promise<void> {
        try {
            await expect(locator).toBeVisible({ timeout: 60000 });
            const actualText = await locator.inputValue();
            await expect(locator).toHaveValue(expectedText, { timeout: 60000 });

            console.log(`✅ [ASSERT] ${label}: Element has expected value "${expectedText}"`);
            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch (error) {
            console.error(`❌ [ASSERT FAILED] ${label}: Expected value "${expectedText}" not found.`);
            throw error;
        }
    }

    async assertElementTextContainedIn(locator: Locator, expectedText: string, label = ''): Promise<void> {
        try {
            await expect(locator).toBeVisible({ timeout: 50000 });
            const actualText = await locator.textContent();

            if (actualText === null) {
                throw new Error(`❌ [ASSERT FAILED] ${label}: Element text content is null.`);
            }

            if (expectedText.includes(actualText) || actualText.includes(expectedText)) {
                console.log(`✅ [ASSERT] ${label}: Expected text "${expectedText}" contains actual text "${actualText}"`);
            } else {
                throw new Error(`❌ [ASSERT FAILED] ${label}: Expected text "${expectedText}" does not contain actual text "${actualText}".`);
            }
        } catch (error) {
            // console.error(error.message);
            throw error;
        }
    }
    //click using JS
    async clickByJs(page: Page, text: string): Promise<void> {
        await page.evaluate((btnText) => {
            const button = [...document.querySelectorAll('button')].find(btn =>
                btn.textContent?.trim().toLowerCase().includes(btnText.toLowerCase())
            );
            if (button) {
                (button as HTMLElement).click();
                console.log(`Clicked button with text: ${btnText}`);
            } else {
                console.warn(`No button found with text: ${btnText}`);
            }
        }, text);
    }

    async compareConstValues(actual: any, expected: any, label = ''): Promise<void> {
        try {
            if (actual === expected) {
                console.log(`✅ [ASSERT] ${label}: Values match. Actual = "${actual}", Expected = "${expected}"`);

            } else {
                throw new Error(`❌ [ASSERT FAILED] ${label}: Values do not match. Expected = "${expected}", Actual = "${actual}"`);
            }
        } catch (error: any) {
            console.error(error.message);
            throw error;
        }
    }
    async checkTotalRecordsUnchanged(helper: any, page: any, genericSearchHierarchyPage: any): Promise<void> {
        try {
            await helper.assertElementVisible(genericSearchHierarchyPage.itemsPerPage, 'itemsPerPage');
            const itemsPerPageValue = await genericSearchHierarchyPage.itemsPerPage.textContent();
            console.log("Items per page:", itemsPerPageValue);
            await attachment('Items per page Value', `Items per page: ${itemsPerPageValue}`, 'text/plain')
            await page.waitForTimeout(5000);


            const rowCountValue = await genericSearchHierarchyPage.rowCount.count()

            const itemsPerPageText: any = await genericSearchHierarchyPage.itemsPerPage.textContent()

            if (rowCountValue - 4 == itemsPerPageText) {
                console.log("✅ Row count matched !!")
                await attachment('Row Count Verification', '✅  Row count matched !!', 'text/plain')
            }
            else {
                console.log("❌ Row count not matched !!")
                await attachment('Row Count Verification', '❌ Row count not matched !!', 'text/plain')

            }

            const elements = await page.locator("div.mat-mdc-paginator-range-label").all();
            const lastElement = elements[elements.length - 1];
            const paginatorText = await lastElement.textContent() ?? '';

            const totalCount = paginatorText.split('of')[1]?.trim();
            console.log("Total count before navigation:", totalCount);
            await attachment('Total count before navigation:', `Total count before navigation: ${totalCount}`, 'text/plain')

            await helper.assertElementVisible(genericSearchHierarchyPage.nextBtn, 'nextBtn');
            await helper.clickElement(genericSearchHierarchyPage.nextBtn, 'nextBtn');
            await page.waitForTimeout(5000);

            const paginatorTextAfter = await lastElement.textContent() ?? '';

            const verifyTotalCount = paginatorTextAfter.split('of')[1]?.trim();
            console.log("Total count after navigation:", verifyTotalCount);
            await attachment('Total count after navigation:', `Total count after navigation: ${verifyTotalCount}`, 'text/plain')

            if (totalCount === verifyTotalCount) {
                console.log("✅ Total number of records remains unchanged!");
                await attachment('Total Count Verification', '✅ Total number of records remains unchanged!', 'text/plain')

            } else {
                console.error("❌ Total number of records changed!");
                await attachment('Total Count Verification', '❌ Total number of records changed!', 'text/plain')
            }
        } catch (error) {
            console.error("❌ An error occurred while verifying total record count");
            await attachment('Error', '❌ An error occurred while verifying total record count', 'text/plain')
            throw error;
        }
    }



}