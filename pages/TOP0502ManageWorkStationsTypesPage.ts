import { Page, Locator } from '@playwright/test';

export class Top0502ManageWorkstationTypesPage {

    top0502ManageWorkstationTypes: Locator;
    stationField: Locator;
    typeOfStationPen: Locator;
    modifyButton: Locator;
    typeOfStationOption: Locator;
    batchNum: Locator;
    stationRequiredErrorMessage: Locator;
    zonePen: Locator;
    modifySuccessMessage: Locator;
    deleteSuccessMessage: Locator;
    rightsButton: Locator;
    addAllToLeft: Locator;
    removeAllToRight: Locator;





    constructor(page: Page) {

        this.top0502ManageWorkstationTypes = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'TOP0502 - Manage workstation types' });
        this.zonePen = page.locator('frame[name="main"]').contentFrame().locator('#zoneCombo span');
        this.stationField = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Station' });
        this.typeOfStationPen = page.locator('frame[name="main"]').contentFrame().locator('#typePosteCombo span');
        this.typeOfStationOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'POSTE_BANC' }).nth(2);
        this.modifyButton = page.locator('frame[name="main"]').contentFrame().getByText('Modify');

        this.batchNum = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Bench NO.' });
        this.modifySuccessMessage = page.locator('frame[name="main"]').contentFrame().locator('//div[text()="Modification done"]');
        this.deleteSuccessMessage = page.locator('frame[name="main"]').contentFrame().locator('//div[text()="Deletion done"]');

        this.rightsButton = page.locator('frame[name="main"]').contentFrame().getByText('Rights');
        this.addAllToLeft = page.locator('frame[name="main"]').contentFrame().getByTitle('Add all lines');
        this.removeAllToRight = page.locator('frame[name="main"]').contentFrame().getByTitle('Remove all lines');
        this.stationRequiredErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('The station is required');



    }

}