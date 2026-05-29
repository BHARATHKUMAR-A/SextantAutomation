import { Page, Locator } from '@playwright/test';

export class Top0401ManageProductionAreasPage {

    top0401ManageProductionAreas: Locator;
    workshopOption: Locator;
    penWorkshop: Locator;
    workshopPen: Locator;
    workshopField: Locator;
    zoneFieldTop401: Locator;
    labelFieldTop401: Locator;
    creationDoneSuccessMessage: Locator;
    viewButton: Locator;
    workshopTextsCheckAfterClickOnView: Locator;
    zoneTextsCheckAfterClickOnView: Locator;
    modifyButton: Locator;
    labelChange: Locator;
    testLabelSelection: Locator;
    deleteButton: Locator;
    deleteSuccessMessage: Locator;
    yesButtonOnDelete: Locator;
    modifySuccessMessage: Locator;
    centereRequiredErrorMessage: Locator;
    sgrRequiredErrorMessage: Locator;
    workshopRequiredErrorMessage: Locator;
    plantField: Locator;
    sgrField: Locator;




    constructor(page: Page) {

        //initial step locators
        this.top0401ManageProductionAreas = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'TOP0401 - Manage production areas' });
        this.workshopOption = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'ASSEMBLY LINE EB' });
        this.penWorkshop = page.locator('frame[name="main"]').contentFrame().locator('#centreCombo span');
        this.workshopPen = page.locator('frame[name="menu"]').contentFrame().locator(`//div[@id='atelierCombo']/span`);
        this.workshopField = page.locator('frame[name="main"]').contentFrame().locator('#atelier');
        this.zoneFieldTop401 = page.locator('frame[name="main"]').contentFrame().locator('[name="zoneDataEntry"]');
        this.labelFieldTop401 = page.locator('frame[name="main"]').contentFrame().locator('[name="libZoneDataEntry"]');
        this.creationDoneSuccessMessage = page.locator('frame[name="main"]').contentFrame().locator('//div[text()="creation done"]');
        this.viewButton = page.locator('frame[name="main"]').contentFrame().getByText('View');
        this.workshopTextsCheckAfterClickOnView = page.locator('frame[name="main"]').contentFrame().locator('center');
        this.zoneTextsCheckAfterClickOnView = page.locator('frame[name="main"]').contentFrame().locator('form[name="Q3PZoneForm"]');
        this.modifyButton = page.locator('frame[name="main"]').contentFrame().getByText('Modify');
        this.modifySuccessMessage = page.locator('frame[name="main"]').contentFrame().locator('//div[text()="Modification done"]');
        this.labelChange = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Label' });
        this.testLabelSelection = page.locator('frame[name="main"]').contentFrame().locator('(//td[text()="AK"])[2]');
        this.deleteButton = page.locator('frame[name="main"]').contentFrame().getByText('Delete');
        this.deleteSuccessMessage = page.locator('frame[name="main"]').contentFrame().locator('//div[text()="Deletion done"]');
        this.yesButtonOnDelete = page.locator('frame[name="main"]').contentFrame().locator('//button[text()="es"]');
        this.centereRequiredErrorMessage = page.locator('frame[name="main"]').contentFrame().locator('//div[text()="The center is required"]');
        this.sgrRequiredErrorMessage = page.locator('frame[name="main"]').contentFrame().locator('//div[text()="The SGR is required"]');
        this.workshopRequiredErrorMessage = page.locator('frame[name="main"]').contentFrame().locator('//div[text()="The workshop is required"]');
        this.plantField = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Plant' });
        this.sgrField = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Sgr' });

    }

}