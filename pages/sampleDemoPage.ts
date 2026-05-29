import { Page, Locator } from '@playwright/test';
 
export class sampleDemoPage {
    
    homeTransaction:string;

    referenceData:string;
    topology:Locator;
    top0301ManageWokshops: Locator;
    tt:Locator;
    penPlant: Locator;
    plantOptionSelection: Locator;
    sgrPen: Locator;
    searchButton: Locator;
    sgrPenOptionField: Locator;
    createButton: Locator;
    workshopField: Locator;
    labelField: Locator;
    validateButton: Locator;
    cancelButton: Locator;
    creationAbondenedSuccessMessage: Locator;
    modificationAbondenedErrorMessage: Locator;
    deleteAbondenedErrorMsg: Locator;

    constructor(page: Page) {
 
        //initial step locators
        this.referenceData = "//div[text()='Reference data']";
        this.homeTransaction = "//input[@name='codeTransaction']";
        // this.topology = "//td[text()='Topology']";
        // this.top0301ManageWokshops="//td[text()='TOP0301 - Manage workshops']";
        this.tt = page.locator('frame[name="menu"]').contentFrame().getByText('Reference data', { exact: true });
        this.topology =  page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Topology' });
        this.top0301ManageWokshops=page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'TOP0301 - Manage workshops' });
        this.penPlant = page.locator('frame[name="main"]').contentFrame().locator('#centreCombo span');
        this.plantOptionSelection =  page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'SZENTGOTTHARD' }).nth(3);
        this.sgrPen = page.locator('frame[name="main"]').contentFrame().locator('#sgrCombo span');
        this.sgrPenOptionField = page.locator('frame[name="main"]').contentFrame().getByLabel('sgr');
        this.searchButton = page.locator('frame[name="main"]').contentFrame().getByText('Search(F)');
        this.createButton = page.locator('frame[name="main"]').contentFrame().getByText('reate');
        this.workshopField = page.locator('frame[name="main"]').contentFrame().locator('[name="atelierDataEntry"]');
        this.labelField = page.locator('frame[name="main"]').contentFrame().locator('[name="libAtelierDataEntry"]');
        this.validateButton = page.locator('frame[name="main"]').contentFrame().getByText('alidate');
        this.cancelButton = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
        this.creationAbondenedSuccessMessage = page.locator('frame[name="main"]').contentFrame().locator(`//div[text()='creation abandoned']`); 
        this.modificationAbondenedErrorMessage = page.locator('frame[name="main"]').contentFrame().locator(`//div[text()='Modification abandoned']`); 
        this.deleteAbondenedErrorMsg = page.locator('frame[name="main"]').contentFrame().locator(`//div[text()='Deletion abandoned']`);







    }
 
}