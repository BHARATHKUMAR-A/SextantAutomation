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

        this.sanitizedTitle = testInfo.title.replace(/[^\w\s-]/g, '_').replace(/\s+/g, '_').replace(/_+/g, '_');
        this.baseDir = path.join('reports', 'artifacts', 'screenshots', this.sanitizedTitle);

        this.ensureDirectory();
    }

    private ensureDirectory(): void {
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
            console.log(`📁 Created screenshot folder: ${this.baseDir}`);
        }
    }
    async captureScreenshot(label: string): Promise<void> {
        const fileName = `step${this.stepCounter++}_${label.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
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

    async pressEnterOnElement(frameName: string, buttonSelector: string, label: string): Promise<void> {
        try {
            const timeout: number = 5000;
            const frame = this.page.frame({ name: frameName });
            if (!frame) {
                throw new Error(`Frame "${frameName}" not found`);
            }
            // Locate the button inside the frame
            const transactionBox = frame.locator(buttonSelector);

            await transactionBox.waitFor({ state: 'visible', timeout });
            await transactionBox.focus();
            await transactionBox.press('Enter');
            console.log(`✅ Pressed Enter on ${label}`);
        } catch (error) {
            console.error(`❌ Failed to press Enter on ${label}:`, error);
            throw error;
        }
    }

    async clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void> {
        try {
            const timeout: number = 5000;
            const frame = this.page.frame({ name: frameName });
            if (!frame) throw new Error(`Frame "${frameName}" not found`);
            const button = frame.locator(buttonSelector);
            await button.waitFor({ state: 'visible', timeout });
            await button.click();
            console.log(`User clicked on the location: ${label}`);
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

            const frame = this.page.frame({ name: frameName });
            if (!frame) throw new Error(`Frame "${frameName}" not found`);
            const field = frame.locator(buttonSelector);
            await field.waitFor({ state: 'visible', timeout });
            await field.clear();
            await field.fill(text);
            console.log(`✅ Filled "${text}" into ${label}`);
        } catch (error) {
            console.error(`❌ Error filling "${label}" in frame "${frameName}":`, error);
            await this.captureScreenshot(`Error_Fill_${label}`);
            throw error;
        }
    }

    async assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label = ''): Promise<void> {
        try {
            const frame = this.page.frame({ name: frameName });
            if (!frame) throw new Error(`Frame "${frameName}" not found`);
            const el = frame.locator(errorInFrame);
            await expect(el).toBeVisible({ timeout: 6000 });
            await expect(el).toHaveText(expectedText, { timeout: 6000 });
            console.log(`✅ [ASSERT] ${label}: Element has expected text "${expectedText}"`);
            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch (error) {
            console.error(`❌ [ASSERT FAILED] ${label}: Expected text "${expectedText}" not found.`);
            throw error;
        }
    }

    async typeSpacesInFrame(frameSelector: string, fieldSelector: string, count = 3, delay = 300): Promise<void> {
        const frame = this.page.frame({ name: frameSelector });
        if (!frame) throw new Error(`Frame "${frameSelector}" not found`);
        const field = frame.locator(fieldSelector);
        await field.click();
        for (let i = 0; i < count; i++) {
            await this.page.keyboard.press('Space');
            if (delay > 0) await this.page.waitForTimeout(delay);
        }
    }

    async validateElementInFrame(frameName: string, elementSelector: string, description: string): Promise<void> {
        const frame = this.page.frame({ name: frameName });
        if (!frame) throw new Error(`Frame with name "${frameName}" not found`);
        const element = frame.locator(elementSelector);
        await expect(element).toBeVisible({ timeout: 10000 });
        await expect(element).toBeEnabled();
        console.log(`${description} is visible and enabled: ${elementSelector}`);
    }

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
        const count = await tableLocator.count();
        const randomIndex = Math.floor(Math.random() * count);
        await tableLocator.nth(randomIndex).click();
        console.log(`✅ Clicked on random option from ${label}`);
    }

//     async randomClickFromDropdown(tableLocator: Locator, label: string): Promise<void> {
//         const count = await tableLocator.count();
//         const randomIndex = Math.floor(Math.random() * count);
//         await tableLocator.nth(randomIndex+1).click();
//         console.log(`✅ Clicked on random option from ${label}`);
// }

async randomClickFromDropdown(tableLocator: Locator, label: string): Promise<void> {
    // Wait for dropdown/options to be visible
    await tableLocator.first().waitFor({ state: 'visible' });
 
    // Filter only visible and interactable elements (ignores hidden/header duplicates)
    const options = tableLocator.locator(':visible');
 
    const count = await options.count();
    if (count === 0) {
        throw new Error(`❌ No visible options found for ${label}`);
    }
 
    // Pick a random option
    const randomIndex = Math.floor(Math.random() * count);
    const option = options.nth(randomIndex);
 
    // Ensure it's in view before clicking
    await option.scrollIntoViewIfNeeded();
 
    // Click safely
    await option.click();
 
    console.log(`✅ Clicked random option (${randomIndex}) from ${label}`);
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


    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        await this.captureScreenshot('navigate_to_page');
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
            await expect(locator).toHaveText(expectedText, { timeout: 6000 });

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
    async assertElementDisabled(element: Locator, elementName: string): Promise<boolean> {
        const isDisabled = await element.isDisabled();
        console.log(`${elementName} is ${isDisabled ? 'disabled' : 'enabled'}`);
        return isDisabled;
    }

    async generateRandomManualCode(length: number): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#$&\'()*+,-./:;<=>?@\\^_{|}~';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    async checkLocators(formatLocator: Locator, availabilityLocator: Locator, validLocator: Locator): Promise<boolean> {
        return (await formatLocator.count() > 0) && (await availabilityLocator.count() > 0) && (await validLocator.count() > 0);
    }

    async clearText(locator: Locator, label: string): Promise<void> {
        await locator.fill('');
        await this.captureScreenshot(`cleared_${label}`);
    }

    async isRadioButtonSelected(element: Locator): Promise<boolean> {
        return element.evaluate((el: HTMLInputElement) => el.checked);
    }

    async generateCode(length: number): Promise<string> {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
        return code;
    }

    async doubleClickElement(locator: Locator, label = ''): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
        await locator.waitFor({ state: 'visible' });
        try {
            await locator.dblclick({ force: true });
            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch {
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
            const dateValue = await datelocator.innerText();
            const parseDate = (str: string): Date => {
                const [dd, mm, yyyy] = str.split('/').map(Number);
                return new Date(yyyy, mm - 1, dd);
            };
            const isInRange = parseDate(dateValue) >= parseDate(startDateData) && parseDate(dateValue) <= parseDate(endDateData);
            if (isInRange) {
                console.log('✅ [ASSERTION PASSED] Date is in Range');
            } else {
                console.error('❌ [ASSERT FAILED] Date is not in Range');
            }
        } catch (error) {
            console.error('❌ [ASSERTION FAILED] Error occurred while checking date range.');
            throw error;
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
        await dropdownLocator.click();
        const options = page.locator('mat-option');
        await page.waitForFunction(() => {
            const opts = document.querySelectorAll('mat-option');
            return Array.from(opts).some(opt => (opt as HTMLElement).offsetParent !== null);
        }, { timeout: 7000 });
        const count = await options.count();
        if (index >= count) throw new Error(`Index ${index} is out of bounds. Only ${count} options available.`);
        await options.nth(index).click();
    }




    async assertElementHasInputValues(locator: Locator, expectedText: string, label = ''): Promise<void> {
        try {
            await expect(locator).toBeVisible({ timeout: 60000 });
            await expect(locator).toHaveValue(expectedText, { timeout: 60000 });
            console.log(`✅ [ASSERT] ${label}: Element has expected value "${expectedText}"`);
            await this.captureScreenshot(`screenshotCaptured_${label}`);
        } catch (error) {
            console.error(`❌ [ASSERT FAILED] ${label}: Expected value "${expectedText}" not found.`);
            throw error;
        }
    }

    async assertElementTextContainedIn(locator: Locator, expectedText: string, label = ''): Promise<void> {
        await expect(locator).toBeVisible({ timeout: 50000 });
        const actualText = await locator.textContent();
        if (actualText === null) throw new Error(`❌ [ASSERT FAILED] ${label}: Element text content is null.`);
        if (!expectedText.includes(actualText) && !actualText.includes(expectedText)) {
            throw new Error(`❌ [ASSERT FAILED] ${label}: Expected text "${expectedText}" does not contain actual text "${actualText}".`);
        }
        console.log(`✅ [ASSERT] ${label}: Expected text "${expectedText}" contains actual text "${actualText}"`);
    }

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

    async compareConstValues(actual: unknown, expected: unknown, label = ''): Promise<void> {
        if (actual !== expected) {
            throw new Error(`❌ [ASSERT FAILED] ${label}: Values do not match. Expected = "${expected}", Actual = "${actual}"`);
        }
        console.log(`✅ [ASSERT] ${label}: Values match. Actual = "${actual}", Expected = "${expected}"`);
    }
}