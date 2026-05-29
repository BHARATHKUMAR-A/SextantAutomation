import { Page, Locator } from '@playwright/test';
 
export class CPT0101Page {
    productionGoals: Locator;
    cpt0101Option: Locator;
    createButton: Locator;
    counterTextbox: Locator;        
    frequencyInitialisationPen: Locator;
    frequencyInitialisationOption: Locator;
    topologyPen: Locator;
    topologyOption: Locator;
    labelTextbox: Locator;
    labelTextboxFill: Locator;
    calenderAreasPen: Locator;
    calenderOption: Locator;
    frequencyHistorisationPen: Locator;
    frequencyHistorisationOption: Locator;
    validateButton: Locator;
    yesButton: Locator;
    createSuccessMessage: Locator;
    viewButton: Locator;
    cancelButton: Locator;
    creationAbondenedMessage: Locator;

    modify: Locator;
    label: Locator;
    modifySuccessMessage: Locator;
    deleteButton: Locator;
    deleteSuccessMessage: Locator;
    duplicate: Locator;

    constructor(page: Page) {
 
        //initial step locators

//       this.productionGoals =  page.locator('frame[name="menu"]').contentFrame().getByText('Production goals', { exact: true });
//   this.cpt0101Option =  page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'CPT0101 - Manage production' });
      this.productionGoals =  page.locator('frame[name="menu"]').contentFrame().getByText('Comptage*', { exact: true });
  this.cpt0101Option =  page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'CPT0101 - Gérer les compteurs*' });

   this.createButton =  page.locator('frame[name="main"]').contentFrame().getByText('Create', { exact: true });
   this.counterTextbox =  page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Counter' });
   this.frequencyInitialisationPen =  page.locator('frame[name="main"]').contentFrame().locator('#freInitCombo span');
   this.frequencyInitialisationOption =  page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '240' }).nth(2);
   this.topologyPen =  page.locator('frame[name="main"]').contentFrame().locator('#eltTopoCombo span');
   this.topologyOption =  page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'B_GEN005' }).nth(3);
   this.labelTextbox =  page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Label' });
   this.labelTextboxFill =  page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Label' });
   this.calenderAreasPen =  page.locator('frame[name="main"]').contentFrame().locator('#calCombo span');
   this.calenderOption =  page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'ASE' }).nth(2);
   this.frequencyHistorisationPen =  page.locator('frame[name="main"]').contentFrame().locator('#freHisCombo span');
   this.frequencyHistorisationOption =  page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '240' }).nth(3);
   this.validateButton =  page.locator('frame[name="main"]').contentFrame().getByText('Validate');
   this.yesButton =  page.locator('frame[name="main"]').contentFrame().getByText('Yes');
   this.createSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText('creation done');
   this.viewButton = page.locator('frame[name="main"]').contentFrame().getByText('View');
   this.cancelButton = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
   this.creationAbondenedMessage = page.locator('frame[name="main"]').contentFrame().getByText('creation abandoned'); 

   this.modify = page.locator('frame[name="main"]').contentFrame().getByText('Modify');
  this.label =  page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Label' });
  this.duplicate = page.locator('frame[name="main"]').contentFrame().getByText('Duplicate');

  this.modifySuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText('Modification done');
  this.deleteButton = page.locator('frame[name="main"]').contentFrame().getByText('Delete');
  this.deleteSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText('Deletion done');
   
    }
}
 
