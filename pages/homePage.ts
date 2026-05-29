//import testData_SCL_FF from '../test-data/testData_SCL_FF.json';
import testData_WPC_FF from '../test-data/testData_WPC_FF.json';
import { Page, Locator } from '@playwright/test';

class HomePage {
    page: Page;
    languageBtn: Locator;
    language: Locator;
    genericDict: Locator;
    createFamilyFeature: Locator;
    createSCLFamilyFeature: Locator;
    nature_SCL: Locator;
    transaction:Locator;
    /* language_SCL: Locator;
    nature_SCL_option: Locator;
    language_SCL_option: Locator;
    spcificSalesRange_SCL: Locator; */
    manualCode_SCL: Locator;
    nextButton_SCL: Locator;
    createFeatureValue: Locator;
    searchSideBar: Locator;
    search: Locator;
    //searchTransversalModel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.languageBtn = page.locator("lang-picker button");
        const language_US_ENG = page.locator(".cdk-overlay-pane div div  button").nth(0);
        this.language = language_US_ENG;
        this.genericDict = page.locator("//span[contains(text(), 'Generic Dictionary')]");
        this.createFamilyFeature = page.locator("//span[contains(text(), 'Create feature family')]");
        this.createSCLFamilyFeature = page.locator("//span[contains(text(), 'Create SCL feature family')]");
        this.nature_SCL = page.locator("//mat-select[@formcontrolname='natureCtrl']");
        this.manualCode_SCL = page.locator("//input[@formcontrolname='featureFamilyCodeCtrl']");
        this.nextButton_SCL = page.locator("//button[@type='submit']/span/following-sibling::span[text()='Next']").nth(0);
        this.createFeatureValue = page.locator("//span[contains(text(), 'Create feature value')]");
        this.searchSideBar = page.locator("//span[contains(text(), 'Search')]").first()
        this.search = page.locator("(//span[@class='menu-font-size'][normalize-space()='Search'])[1]");
        this.transaction = page.locator("#codeTransaction");

    }
}

export { HomePage };