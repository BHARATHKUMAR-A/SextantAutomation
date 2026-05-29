import envConfig from '../test-data/envConfig.json';
import { Page, Locator, expect } from '@playwright/test';
import { sampleDemoPage } from '../pages/sampleDemoPage';
import { Top0401ManageProductionAreasPage } from '../pages/Top0401ManageProductionAreasPage';
import {Top0501ManageWorkstationsPage} from '../pages/top0501ManageWorkstationsPage';
import { SshHelper } from '../utils/sshHelper';
import { Top0502ManageWorkstationTypesPage } from '../pages/TOP0502ManageWorkStationsTypesPage';
import { Top0601ManageWorkOperationsPage } from '../pages/TOP601ManageWorkOperationsPage';
import chalk from 'chalk';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    // assertElementHasText: (locator: any, expectedText: string, message: string) => Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>
    
   // BOTH methods included (the one LoginSteps expects + your custom one)
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;

}  

export class TOP601ScreenSteps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sampleDemoPage: sampleDemoPage;
    private top0501ManageWorkstationsPage: Top0501ManageWorkstationsPage;
    private top0502ManageWorkstationTypesPage: Top0502ManageWorkstationTypesPage;
    private sshHelper: SshHelper;
    private top0401ManageProductionAreasPage: Top0401ManageProductionAreasPage;
    private top0601ManageWorkOperationsPage: Top0601ManageWorkOperationsPage;



    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sampleDemoPage = new sampleDemoPage(page);
        this.top0501ManageWorkstationsPage = new Top0501ManageWorkstationsPage(page);
        this.top0401ManageProductionAreasPage = new Top0401ManageProductionAreasPage(page);
        this.top0502ManageWorkstationTypesPage = new Top0502ManageWorkstationTypesPage(page);
        this.top0601ManageWorkOperationsPage = new Top0601ManageWorkOperationsPage(page);
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    }


    async Search601(sgr: string,station:string, workshop: string): Promise<void> {
        await this.helper.clickElement(this.sampleDemoPage.tt, "click on Reference data");
        await this.helper.clickElement(this.sampleDemoPage.topology, "click on Topology");
        await this.helper.clickElement(this.top0601ManageWorkOperationsPage.top0601ManageWorkOperations, "click on TOP0601 - Manage work operations");
        await this.helper.clickElement(this.sampleDemoPage.penPlant, "click on Pen Plant");
        await this.helper.clickElement(this.sampleDemoPage.plantOptionSelection, "select SZENTGOTTHARD plant option");
        await this.helper.enterText(this.sampleDemoPage.sgrPenOptionField, sgr, "enter SG6 in pen selection field");
        await this.helper.enterText(this.top0401ManageProductionAreasPage.workshopField, workshop, "enter EBAS1 in workshop field");
        await this.helper.clickElement(this.top0601ManageWorkOperationsPage.zonePen, "click on zone pen option button");
        await this.helper.clickElement(this.top0501ManageWorkstationsPage.zoneOption, "select C1 zone option");
        await this.helper.enterText(this.top0502ManageWorkstationTypesPage.stationField,station, "click on station field in TOP0502");
        await this.helper.clickElement(this.sampleDemoPage.searchButton, "click on Search button");
       
    }
}