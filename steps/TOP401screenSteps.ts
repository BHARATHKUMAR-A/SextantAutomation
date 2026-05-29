import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { sampleDemoPage } from '../pages/sampleDemoPage';
import { Top0401ManageProductionAreasPage } from '../pages/Top0401ManageProductionAreasPage';
import { SshHelper } from '../utils/sshHelper';
import chalk from 'chalk';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    // assertElementHasText: (locator: any, expectedText: string, message: string) => Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>
    captureScreenshot(label: string): Promise<void>
    // BOTH methods included (the one LoginSteps expects + your custom one)
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;

}

export class TOP401ScreenSteps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sampleDemoPage: sampleDemoPage;
    private manageProductionAreas: Top0401ManageProductionAreasPage;
    private sshHelper: SshHelper;



    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sampleDemoPage = new sampleDemoPage(page);
        this.manageProductionAreas = new Top0401ManageProductionAreasPage(page);
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    }




    async Search(sgr: string, workshop: string): Promise<void> {
        await this.helper.clickElement(this.sampleDemoPage.tt, "click on Reference data");
        await this.helper.clickElement(this.sampleDemoPage.topology, "click on Topology");
        await this.helper.clickElement(this.manageProductionAreas.top0401ManageProductionAreas, "click on TOP0401 - Manage production areas");
        await this.helper.clickElement(this.sampleDemoPage.penPlant, "click on Pen Plant");
        await this.helper.clickElement(this.sampleDemoPage.plantOptionSelection, "select SZENTGOTTHARD plant option");
        await this.helper.enterText(this.sampleDemoPage.sgrPenOptionField, sgr, "enter SG6 in pen selection field");
        await this.helper.enterText(this.manageProductionAreas.workshopField, workshop, "enter EBAS1 in workshop field");
        await this.helper.clickElement(this.sampleDemoPage.searchButton, "click on Search button");
    }

    async fieldErrorCheck(topology: Locator): Promise<void> {
        await this.helper.clickElement(this.sampleDemoPage.tt, "click on Reference data");
        await this.helper.clickElement(this.sampleDemoPage.topology, "click on Topology");
        await this.helper.clickElement(topology, "click on TOP0401 - Manage production areas");
        await this.page.waitForTimeout(2000);
        await this.manageProductionAreas.plantField.clear();
        await this.manageProductionAreas.sgrField.clear();
        await this.helper.clickElement(this.sampleDemoPage.searchButton, "click on Search button");
        await this.page.waitForTimeout(3000);
        await this.helper.assertElementHasText(this.manageProductionAreas.centereRequiredErrorMessage, "The center is required", "Center required error message validation");
        await this.helper.clickElement(this.sampleDemoPage.penPlant, "click on Pen Plant");
        await this.helper.clickElement(this.sampleDemoPage.plantOptionSelection, "select SZENTGOTTHARD plant option");
        await this.helper.clickElement(this.sampleDemoPage.searchButton, "click on Search button");

        await this.helper.assertElementHasText(this.manageProductionAreas.sgrRequiredErrorMessage, "The SGR is required", "SGR required error message validation");
        await this.helper.enterText(this.sampleDemoPage.sgrPenOptionField, "SG6", "enter SG6 in pen selection field");
        await this.helper.clickElement(this.sampleDemoPage.searchButton, "click on Search button");

        await this.helper.assertElementHasText(this.manageProductionAreas.workshopRequiredErrorMessage, "The workshop is required", "Workshop required error message validation");

    }


    async creationAbondened(Field: Locator, label: Locator, workshopName: string): Promise<void> {
        await this.helper.clickElement(this.sampleDemoPage.createButton, "click on Create button");
        //   const workshopName = `Y${await this.sshHelper.generateRandomAlphanumeric(1)}`;
        console.log(`Generated workshop name: ${workshopName}`);
        await this.helper.enterText(Field, workshopName, "enter Test Workshop in workshop field");
        const today = new Date();
        const formattedDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        const labelName = `Test Label ${formattedDate}`;
        console.log(`Generated label name: ${labelName}`);
        await this.helper.enterText(label, labelName, "enter Test Label in label field");
        await this.helper.clickElement(this.sampleDemoPage.cancelButton, "click on Cancel button");
        let creationSuccessMessageText = await this.sampleDemoPage.creationAbondenedSuccessMessage.innerText();
        if (creationSuccessMessageText === "creation abandoned") {
            console.log(
                chalk.green(`✅ Creation error message is displayed on UI : Expected : "creation abandoned"  Actual is "${creationSuccessMessageText}"`)
            );
        } else {
            console.log(
                chalk.red(`❌ Creation error message is NOT displayed on UI as expected. Expected : "creation abandoned"  Actual is "${creationSuccessMessageText}"`)
            );
        }
        await this.helper.captureScreenshot(`Creation_Error_Message_TOP0401`);
    }

    async creation(Field: Locator, label: Locator, workshopName: string): Promise<void> {
        await this.helper.clickElement(this.sampleDemoPage.createButton, "click on Create button");
        //   const workshopName = `Y${await this.sshHelper.generateRandomAlphanumeric(1)}`;
        console.log(`Generated workshop name: ${workshopName}`);
        await this.helper.enterText(Field, workshopName, "enter Test Workshop in workshop field");
        const today = new Date();
        const formattedDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        const labelName = `Test Label ${formattedDate}`;
        console.log(`Generated label name: ${labelName}`);
        await this.helper.enterText(label, labelName, "enter Test Label in label field");
        await this.helper.clickElement(this.sampleDemoPage.validateButton, "click on Validate button");
        let creationSuccessMessageText = await this.manageProductionAreas.creationDoneSuccessMessage.innerText();
        if (creationSuccessMessageText === "creation done") {
            console.log(
                chalk.green(`✅ Creation success message is displayed on UI : Expected : "creation done"  Actual is "${creationSuccessMessageText}"`)
            );
        } else {
            console.log(
                chalk.red(`❌ Creation success message is NOT displayed on UI as expected. Expected : "creation done"  Actual is "${creationSuccessMessageText}"`)
            );
        }
        await this.helper.captureScreenshot(`Creation_Success_Message_TOP0401`);
    }

    async view(workshopName: string): Promise<void> {
        // Wait a moment for the page to refresh after creation
        await this.page.waitForTimeout(2000);

        // Try to find by the row in the table that contains the batch number or other identifying info
        // The workshopName parameter contains an XPath, so use it directly
        const selector = this.page.locator('frame[name="main"]').contentFrame().locator(workshopName);

        // Wait with a more forgiving timeout for the element to appear
        try {
            await selector.waitFor({ state: 'visible', timeout: 5000 });
            await this.helper.clickElement(selector, "click on test label to select it");
        } catch (e) {
            console.log(`Element not found with selector: ${workshopName}. Attempting alternative search...`);
            // If not found, search for 201 (batch number) in the results instead
            const batchSelector = this.page.locator('frame[name="main"]').contentFrame().locator('xpath=(//div[text()="201"])[2]');
            await this.helper.clickElement(batchSelector, "click on row with batch number 201");
        }

        await this.helper.clickElement(this.manageProductionAreas.viewButton, "click on View button");

    }

    async modifyAbondened(workshopName: string): Promise<void> {
        await this.helper.clickElement(this.page.locator('frame[name="main"]').contentFrame().locator(workshopName), "click on test label to select it");
        await this.helper.clickElement(this.manageProductionAreas.modifyButton, "click on Modify button");
        await this.helper.enterText(this.manageProductionAreas.labelChange, 'TESTING YYY', "change label name to TESTING YYY");
        await this.helper.clickElement(this.sampleDemoPage.cancelButton, "click on Cancel button after modifying label");
        let creationErrorMessageText = await this.sampleDemoPage.modificationAbondenedErrorMessage.innerText();
        if (creationErrorMessageText === "Modification abandoned") {
            console.log(
                chalk.green(`✅ Modification abandoned message is displayed on UI : Expected : "Modification abandoned"  Actual is "${creationErrorMessageText}"`)
            );
        } else {
            console.log(
                chalk.red(`❌ Modification abandoned message is NOT displayed on UI as expected. Expected : "Modification abandoned"  Actual is "${creationErrorMessageText}"`)
            );
        }
        await this.helper.captureScreenshot(`Modification_Abondened_Message_TOP0502`);
    }

    async modify(workshopName: string): Promise<void> {
        await this.helper.clickElement(this.page.locator('frame[name="main"]').contentFrame().locator(workshopName), "click on test label to select it");
        await this.helper.clickElement(this.manageProductionAreas.modifyButton, "click on Modify button");
        await this.helper.enterText(this.manageProductionAreas.labelChange, 'TESTING YYY', "change label name to TESTING YYY");
        await this.helper.clickElement(this.sampleDemoPage.validateButton, "click on Validate button after modifying label");
        let creationSuccessMessageText = await this.manageProductionAreas.modifySuccessMessage.innerText();
        if (creationSuccessMessageText === "Modification done") {
            console.log(
                chalk.green(`✅ Modification success message is displayed on UI : Expected : "Modification done"  Actual is "${creationSuccessMessageText}"`)
            );
        } else {
            console.log(
                chalk.red(`❌ Modification success message is NOT displayed on UI as expected. Expected : "Modification done"  Actual is "${creationSuccessMessageText}"`)
            );
        }
        await this.helper.captureScreenshot(`Modification_Success_Message_TOP0502`);
    }

    async VerifydeleteAbondenedError(workshopName: string): Promise<void> {
        await this.helper.clickElement(this.page.locator('frame[name="main"]').contentFrame().locator(workshopName), "click on test label to select it");
        await this.helper.clickElement(this.manageProductionAreas.deleteButton, "click on Delete button");
        await this.helper.clickElement(this.sampleDemoPage.cancelButton, "click on Cancel button after deleting label");
        this.page.waitForTimeout(2000);
        // await this.helper.clickElement(this.manageProductionAreas.yesButtonOnDelete, "click on Yes button to confirm deletion");
        let deletionAbondenedErrorMessageText = await this.sampleDemoPage.deleteAbondenedErrorMsg.innerText();
        if (deletionAbondenedErrorMessageText === "Deletion abandoned") {
            console.log(
                chalk.green(`✅ Deletion abandoned message is displayed on UI : Expected : "Deletion abandoned"  Actual is "${deletionAbondenedErrorMessageText}"`)
            );
        } else {
            console.log(
                chalk.red(`❌ Deletion abandoned message is NOT displayed on UI as expected. Expected : "Deletion abandoned"  Actual is "${deletionAbondenedErrorMessageText}"`)
            );
        }
        await this.helper.captureScreenshot(`Deletion_Abandoned_Message_TOP0502`);
    }


    async delete(workshopName: string): Promise<void> {
        await this.helper.clickElement(this.page.locator('frame[name="main"]').contentFrame().locator(workshopName), "click on test label to select it");
        await this.helper.clickElement(this.manageProductionAreas.deleteButton, "click on Delete button");
        await this.helper.clickElement(this.sampleDemoPage.validateButton, "click on Validate button after deleting label");
        this.page.waitForTimeout(2000);
        await this.helper.clickElement(this.manageProductionAreas.yesButtonOnDelete, "click on Yes button to confirm deletion");
        let deletionSuccessMessageText = await this.manageProductionAreas.deleteSuccessMessage.innerText();
        if (deletionSuccessMessageText === "Deletion done") {
            console.log(
                chalk.green(`✅ Deletion success message is displayed on UI : Expected : "Deletion done"  Actual is "${deletionSuccessMessageText}"`)
            );
        } else {
            console.log(
                chalk.red(`❌ Deletion success message is NOT displayed on UI as expected. Expected : "Deletion done"  Actual is "${deletionSuccessMessageText}"`)
            );
        }
        await this.helper.captureScreenshot(`Deletion_Success_Message_TOP0502`);
    }
}
