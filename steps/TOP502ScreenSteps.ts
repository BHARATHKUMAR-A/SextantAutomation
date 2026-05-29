import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { sampleDemoPage } from '../pages/sampleDemoPage';
import { Top0401ManageProductionAreasPage } from '../pages/Top0401ManageProductionAreasPage';
import {Top0501ManageWorkstationsPage} from '../pages/top0501ManageWorkstationsPage';
import { SshHelper } from '../utils/sshHelper';
import { Top0502ManageWorkstationTypesPage } from '../pages/TOP0502ManageWorkStationsTypesPage';
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

export class TOP502ScreenSteps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sampleDemoPage: sampleDemoPage;
    private top0501ManageWorkstationsPage: Top0501ManageWorkstationsPage;
    private top0502ManageWorkstationTypesPage: Top0502ManageWorkstationTypesPage;
    private sshHelper: SshHelper;
    private top0401ManageProductionAreasPage: Top0401ManageProductionAreasPage;
    public typeOfStationOptionText: string|undefined;



    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sampleDemoPage = new sampleDemoPage(page);
        this.top0501ManageWorkstationsPage = new Top0501ManageWorkstationsPage(page);
        this.top0401ManageProductionAreasPage = new Top0401ManageProductionAreasPage(page);
        this.top0502ManageWorkstationTypesPage = new Top0502ManageWorkstationTypesPage(page);
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.typeOfStationOptionText = undefined;
    }


    async Search502(sgr: string,station:string, workshop: string): Promise<void> {
        await this.helper.clickElement(this.sampleDemoPage.tt, "click on Reference data");
        await this.helper.clickElement(this.sampleDemoPage.topology, "click on Topology");
        await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.top0502ManageWorkstationTypes, "click on TOP0502 - Manage workstation types");
        await this.helper.clickElement(this.sampleDemoPage.penPlant, "click on Pen Plant");
        await this.helper.clickElement(this.sampleDemoPage.plantOptionSelection, "select SZENTGOTTHARD plant option");
        await this.helper.enterText(this.sampleDemoPage.sgrPenOptionField, sgr, "enter SG6 in pen selection field");
        await this.helper.enterText(this.top0401ManageProductionAreasPage.workshopField, workshop, "enter EBAS1 in workshop field");
        await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.zonePen, "click on zone pen option button");
        await this.helper.clickElement(this.top0501ManageWorkstationsPage.zoneOption, "select C1 zone option");
        await this.helper.enterText(this.top0502ManageWorkstationTypesPage.stationField,station, "click on station field in TOP0502");
        await this.helper.clickElement(this.sampleDemoPage.searchButton, "click on Search button");
       
    }

    async creationAbondened(): Promise<void> {
          await this.helper.clickElement(this.sampleDemoPage.createButton, "click on Create button");
          await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.typeOfStationPen, "click on Type of station dropdown");
          this.typeOfStationOptionText = await this.top0502ManageWorkstationTypesPage.typeOfStationOption.innerText();
          console.log(`✅ Selected type of station option: ${this.typeOfStationOptionText}`);
          await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.typeOfStationOption, "select POSTE_BANC option from dropdown");

          await this.helper.enterText(this.top0502ManageWorkstationTypesPage.batchNum, '201', "enter Bench NO. in batch number field");

          await this.helper.clickElement(this.sampleDemoPage.cancelButton, "click on Cancel button");
          let creationSuccessMessageText = await this.sampleDemoPage.creationAbondenedSuccessMessage.innerText();
          if(creationSuccessMessageText === "creation abandoned"){
            console.log(
            chalk.green(`✅ Creation abondened error message is displayed on UI : Expected : "creation abandoned"  Actual is "${creationSuccessMessageText}"`)
            );  
        }else{
            console.log(
            chalk.red(`❌ Creation abondened error message is NOT displayed on UI as expected. Expected : "creation abandoned"  Actual is "${creationSuccessMessageText}"`)
            );  
        }
                  await this.helper.captureScreenshot(`Creation_Abondened_Message_TOP0502`);

      }

        async creation502(): Promise<void> {
          await this.helper.clickElement(this.sampleDemoPage.createButton, "click on Create button");
          await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.typeOfStationPen, "click on Type of station dropdown");
          this.typeOfStationOptionText = await this.top0502ManageWorkstationTypesPage.typeOfStationOption.innerText();
          console.log(`✅ Selected type of station option: ${this.typeOfStationOptionText}`);
          await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.typeOfStationOption, "select POSTE_BANC option from dropdown");

          await this.helper.enterText(this.top0502ManageWorkstationTypesPage.batchNum, '201', "enter Bench NO. in batch number field");

          await this.helper.clickElement(this.sampleDemoPage.validateButton, "click on Validate button");
          let creationSuccessMessageText = await this.top0401ManageProductionAreasPage.creationDoneSuccessMessage.innerText();
          await this.helper.captureScreenshot(`Creation_Success_Message_TOP0502`);
            expect(creationSuccessMessageText).toBe("creation done");

            console.log(
            chalk.green(`Creation success message is displayed on UI : Expected : "creation done"  Actual is "${creationSuccessMessageText}"`)
            );    
        }

        async modifyAbondened(workshopName: string, newBatchNum: string): Promise<void> {
                await this.helper.clickElement(this.page.locator('frame[name="main"]').contentFrame().locator(workshopName), "click on test label to select it");
                await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.modifyButton, "click on Modify button");
                await this.helper.enterText(this.top0502ManageWorkstationTypesPage.batchNum, newBatchNum, "change label name to TESTING YYY");

          await this.helper.clickElement(this.sampleDemoPage.cancelButton, "click on Cancel button");
          let creationSuccessMessageText = await this.sampleDemoPage.modificationAbondenedErrorMessage.innerText();
          if(creationSuccessMessageText === "Modification abandoned"){
            console.log(
            chalk.green(`✅ Modification abondened error message is displayed on UI : Expected : "Modification abandoned"  Actual is "${creationSuccessMessageText}"`)
            );  
        }else{
            console.log(
            chalk.red(`❌ Modification abondened error message is NOT displayed on UI as expected. Expected : "Modification abandoned"  Actual is "${creationSuccessMessageText}"`)
            );  
        }
                  await this.helper.captureScreenshot(`Modification_Abondened_Message_TOP0502`);

      }


        async modify(workshopName: string, newBatchNum: string): Promise<void> {
                await this.helper.clickElement(this.page.locator('frame[name="main"]').contentFrame().locator(workshopName), "click on test label to select it");
                await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.modifyButton, "click on Modify button");
                await this.helper.enterText(this.top0502ManageWorkstationTypesPage.batchNum, newBatchNum, "change label name to TESTING YYY");
                await this.helper.clickElement(this.sampleDemoPage.validateButton, "click on Validate button after modifying label");
                await this.helper.captureScreenshot(`Modification_Success_Message_TOP0502`);
                let creationSuccessMessageText = await this.top0502ManageWorkstationTypesPage.modifySuccessMessage.innerText();
                if(creationSuccessMessageText === "Modification done"){
                    console.log(
                        chalk.green(`✅ Modification success message is displayed on UI : Expected : "Modification done"  Actual is "${creationSuccessMessageText}"`)
                        ); 
                }else{
                    console.log(
                        chalk.red(`❌ Modification success message is NOT displayed on UI as expected. Expected : "Modification done"  Actual is "${creationSuccessMessageText}"`)
                        ); 
                }
        }

          async VerifyDeleteAbondenedError(workshopName: string): Promise<void> {
                await this.helper.clickElement(this.page.locator('frame[name="main"]').contentFrame().locator(workshopName), "click on test label to select it");
                await this.helper.clickElement(this.top0401ManageProductionAreasPage.deleteButton, "click on Delete button");
                          await this.helper.clickElement(this.sampleDemoPage.cancelButton, "click on Cancel button");
          let creationSuccessMessageText = await this.sampleDemoPage.deleteAbondenedErrorMsg.innerText();
          if(creationSuccessMessageText === "Deletion abandoned"){
            console.log(
            chalk.green(`✅ Deletion abondened error message is displayed on UI : Expected : "Deletion abandoned"  Actual is "${creationSuccessMessageText}"`)
            );  
        }else{
            console.log(
            chalk.red(`❌ Deletion abondened error message is NOT displayed on UI as expected. Expected : "Deletion abandoned"  Actual is "${creationSuccessMessageText}"`)
            );  
        }
                  await this.helper.captureScreenshot(`Deletion_Abondened_Message_TOP0502`);

      }



        async delete(workshopName: string): Promise<void> {
                await this.helper.clickElement(this.page.locator('frame[name="main"]').contentFrame().locator(workshopName), "click on test label to select it");
                await this.helper.clickElement(this.top0401ManageProductionAreasPage.deleteButton, "click on Delete button");
                await this.helper.clickElement(this.sampleDemoPage.validateButton, "click on Validate button after deleting label");
                this.page.waitForTimeout(2000);
                await this.helper.clickElement(this.top0401ManageProductionAreasPage.yesButtonOnDelete, "click on Yes button to confirm deletion");
                let deletionSuccessMessageText = await this.top0502ManageWorkstationTypesPage.deleteSuccessMessage.innerText();
                if(deletionSuccessMessageText === "Deletion done"){
                    console.log(
                        chalk.green(`✅ Deletion success message is displayed on UI : Expected : "Deletion done"  Actual is "${deletionSuccessMessageText}"`)
                        ); 
                }else{
                    console.log(
                        chalk.red(`❌ Deletion success message is NOT displayed on UI as expected. Expected : "Deletion done"  Actual is "${deletionSuccessMessageText}"`)
                        ); 
                }
                await this.helper.captureScreenshot(`Deletion_Success_Message_TOP0502`);
        }


        async RightsAddAllLeftRemoveToRight(workshopName: string): Promise<void> {
                await this.helper.clickElement(this.page.locator('frame[name="main"]').contentFrame().locator(workshopName), "click on test label to select it");
                await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.rightsButton, "click on Rights button");
                await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.addAllToLeft, "click on Add all lines button to move all lines to left");
                await this.helper.captureScreenshot(`After_Clicking_Add_All_To_Left_TOP0502`);
                await this.helper.clickElement(this.top0502ManageWorkstationTypesPage.removeAllToRight, "click on Remove all lines button to move all lines back to right");
                await this.helper.captureScreenshot(`After_Clicking_Remove_All_To_Right_TOP0502`);

        }


   

}