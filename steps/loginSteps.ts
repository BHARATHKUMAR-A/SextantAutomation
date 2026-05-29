import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    // assertElementHasText: (locator: any, expectedText: string, message: string) => Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>
    
   // BOTH methods included (the one LoginSteps expects + your custom one)
    // assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;

}  

class LoginSteps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private usernameField: Locator;
    private passwordField: Locator;
    private signInBtn: Locator;
    private errorMsg: Locator;
    private fillFieldMsg: Locator;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;

        // Page elements
        this.usernameField = page.locator("#username");
        this.passwordField = page.locator("#password");
        this.signInBtn = page.locator("#signOnButton");
        this.errorMsg = page.locator("//div[@class='ping-error']"); // Assuming the error message locator
        this.fillFieldMsg = page.locator("#fillFieldMsg"); // Assuming the fill field error locator
    }

    async navigate(): Promise<void> {
        await this.helper.navigateTo(envConfig.url.devUrl);
    }


    async login(username: string, password: string): Promise<void> {
        // await this.helper.clickButtonInFrame("login", "#buttonUserLogin", "login frame");
        await this.helper.enterText(this.usernameField, username, 'username');
        await this.helper.enterText(this.passwordField, password, 'password');
        await this.helper.clickElement(this.signInBtn, 'signInBtn');
    }
   

    async verifyErrorMessage() {
        // Wait for the error message element to be visible
        await this.errorMsg.waitFor();

        // Get the text content of the error message
        const errorMessage = await this.errorMsg.textContent();
        console.log(errorMessage);

        // Verify that the error message contains the expected text
        await expect(this.errorMsg).toContainText("We didn't recognize the username or password");

    }

    async getFillFieldError(): Promise<string | null> {
        return await this.fillFieldMsg.textContent();
    }
}

export { LoginSteps };