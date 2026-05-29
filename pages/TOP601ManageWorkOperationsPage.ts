import { Page, Locator } from '@playwright/test';
 
export class Top0601ManageWorkOperationsPage {
    
        top0601ManageWorkOperations: Locator;
        zonePen: Locator;
        OperationField: Locator;
        labelField: Locator;
        // typeOfStationPen: Locator;
        // typeOfStationOption: Locator;
        // batchNum: Locator;
        // zonePen: Locator;
        // stationField: Locator;
        // typeOfStationPen: Locator;
        // typeOfStationOption: Locator;
        // batchNum: Locator;
        // zonePen: Locator;



 
    constructor(page: Page) {
 
        this.top0601ManageWorkOperations=page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'TOP0601 - Manage work operations' });
        this.zonePen = page.locator('frame[name="main"]').contentFrame().locator('#ligneZoneCombo span');
        this.OperationField = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Operation' });
        this.labelField = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Label' });

        // this.typeOfStationPen =  page.locator('frame[name="main"]').contentFrame().locator('#typePosteCombo span');
        // this.typeOfStationOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'POSTE_BANC' }).nth(2);
        // this.batchNum = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Bench NO.' });


    }
 
}