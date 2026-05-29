import { Locator, Page, expect, chromium } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import vehicleDetails from '../test-data/vehicleDetails.json';
import { LoginSteps } from '../steps/loginSteps';

interface TestInfo {
    [key: string]: any;
}

//common function imported from step helper
interface StepHelper {
    clickElement: (locator: any, name: string) => Promise<void>;
    clickElementForcefully: (locator: any, name: string) => Promise<void>;
    enterText: (locator: any, value: string, name: string) => Promise<void>;
    captureScreenshot(label: string): Promise<void> ;
    fillInFrame(frameName: string, buttonSelector: string,text:string, label: string): Promise<void>
    pressEnterOnElement(frameName: string, buttonSelector: string, label: string): Promise<void>
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>
    navigateTo(url: string): Promise<void>;
    ExtractTextInFrame(frameName: string, buttonSelector: string, label: string): Promise<string>
    assertElementHasTextInFrame(frameName:string,errorInFrame:string, expectedText: string, label:string): Promise<void>
}

export class demoSteps {
    
    private page: Page;
    private testInfo: TestInfo;
    private helper: StepHelper;
    

    //constructor to initialize the objects
    constructor(page: Page, testInfo: TestInfo, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;   
    }
    

    async Test1(context: any) {
                // await this.helper.fillInFrame("menu", "#codeTransaction", "SF75684", "username field in login frame");
                await this.helper.clickButtonInFrame("menu", "//div[text()='Production tracking']", "click on Production tracking");
                await this.helper.clickButtonInFrame("menu", "//td[text()='SFA0501-S1 - Supervision panel Assembly Line EB']", "click on SFA0501-S1 - Supervision panel Assembly Line EB");
        
                // Wait for the new window to open
                //   const [newPage] = await Promise.all([
                //     context.waitForEvent('page'), // listens for a new tab/window
                    await this.helper.clickButtonInFrame("main", "//td[text()='BUFCGENG']", "click on BUFCGENG")   // the action that triggers new window
                //   ]);

                // Ensure the new window is ready
                await this.page.waitForLoadState();
                await this.helper.clickButtonInFrame("main", "//div[text()='Detail']", "click on Detail")  
                const MedailleText =await this.helper.ExtractTextInFrame("main", `(//td[@ecwkeyname="identifiant0Key"])[4]`, "vehicle details");
                await this.helper.clickButtonInFrame("top", "//a[normalize-space()='Return to Menu']", "click on Return to Menu");
                await this.helper.clickButtonInFrame("menu", "//div[normalize-space()='Quality monitoring']", "click on Quality monitoring");
                await this.helper.clickButtonInFrame("menu", "//td[normalize-space()='QUA0301 - Consult parts quality information']", "click on QUA0301 - Consult parts quality information");
                await this.helper.fillInFrame("main", `//input[@name="jspOrganeSelectionValeur"]`, MedailleText, "fill medaille text in search field");
                await this.helper.clickButtonInFrame("main", `//button[normalize-space()='Submit']`, "click on Submit");
                await this.helper.clickButtonInFrame("main", `//div[normalize-space()='Passing to the workstations']`, "click on Passing to the workstations");
                await this.helper.clickButtonInFrame("main", `//div[normalize-space()='Measured parameters']`, "click on Measured parameters");
                await this.helper.clickButtonInFrame("main", `//div[normalize-space()='Defects']`, "click on Defects");
                await this.helper.clickButtonInFrame("main", `//div[normalize-space()='Quality blocking']`, "click on Quality blocking");
                await this.helper.clickButtonInFrame("main", `//div[normalize-space()='Parcel Part']`, "click on Parcel Part");
                await this.helper.clickButtonInFrame("main", `//div[normalize-space()='Affected Parts']`, "click on Affected Parts");
                await this.helper.clickButtonInFrame("main", `//div[normalize-space()='Particular events']`, "click on Particular events");


                await this.page.waitForTimeout(5000);
//   await this.helper.fillInFrame("main", `(//td[@ecwkeyname="identifiant0Key"])[4]`, MedailleText, "fill medaille text in search field");


    }
}

        
   

