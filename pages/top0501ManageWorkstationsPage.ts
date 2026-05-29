import { Page, Locator } from '@playwright/test';
 
export class Top0501ManageWorkstationsPage {
    
        top0501ManageWorkstations: Locator;
        zonePenOption: Locator;
        zoneOption: Locator;
        stationAtCreation: Locator;
        labelFieldTop501: Locator;
        zoneTextbox: Locator;
        zoneIsRequiredErrorMessage: Locator;


 
    constructor(page: Page) {
 
        this.top0501ManageWorkstations=page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'TOP0501 - Manage workstations' });
        this.zonePenOption = page.locator('frame[name="main"]').contentFrame().locator('#ligneZoneCombo span');
        this.zoneOption =  page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'C1' }).nth(3);
        this.stationAtCreation = page.locator('frame[name="main"]').contentFrame().locator('[name="posteDataEntry"]');
        this.labelFieldTop501 = page.locator('frame[name="main"]').contentFrame().locator('[name="libelleDataEntry"]');
        this.zoneTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Zone' });
        this.zoneIsRequiredErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('The zone is mandatory');


    }
 
}