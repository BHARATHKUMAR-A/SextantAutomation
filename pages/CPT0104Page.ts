import { Page, Locator } from '@playwright/test';

export class CPT0104Page {
    CPT0104Option: Locator;
    reportOfCountingTextbox: Locator;
    counterPen: Locator;
    enp000Option: Locator;
    addButton: Locator;
    labelTextbox: Locator;
    modificationErrorMessage: Locator;
    cuttingPen: Locator;
    cuttingPenOption: Locator;
    infoCountersPen: Locator;
    infoCountersPenOption: Locator;
    addVariationOption: Locator;
    removeVariationOption: Locator;
    typePen: Locator;
    typePenOption: Locator;

    managementOfCountersButton: Locator;
    ManagementOfCountersTitle: Locator;
    deleteAbondenedErrorMessage: Locator;
    deletionConfirmationMessage: Locator;
    addedCounterSelectionInTable: Locator;
    actionsButton: Locator;
    addThresholdOption: Locator;
    removeThresholdOption: Locator;
    addedThresholdInTable: Locator;
    emptyThresholdInTable: Locator;

    addedVariationInTable: Locator;
    emptyVariationInTable: Locator;
    displayButton: Locator;
    displayScreenTitle: Locator;

    constructor(page: Page) {


        this.CPT0104Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'CPT0104 - Manage production' });
        this.reportOfCountingTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Report of counting' });
        this.counterPen = page.locator('frame[name="main"]').contentFrame().locator('#compteursCombo span');

        this.enp000Option = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'ENP000__', exact: true }).nth(2);

        this.addButton = page.locator('frame[name="main"]').contentFrame().locator('#add');
        this.labelTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Label' });
        this.modificationErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('Modification abandoned');

        this.cuttingPen = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '60' }).locator('span').nth(1)
        this.cuttingPenOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '30', exact: true })
        this.infoCountersPen = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'NO INFORMATION' }).locator('span').nth(1)
        this.infoCountersPenOption = page.locator('frame[name="main"]').contentFrame().getByRole('row', { name: 'Label', exact: true }).getByRole('cell');

        this.typePen = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'INSTANTANEOUS' }).locator('span').nth(1);
        this.typePenOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'COMPLETE', exact: true });

        this.managementOfCountersButton = page.locator('frame[name="main"]').contentFrame().getByText('Management of the counters');
        this.ManagementOfCountersTitle = page.locator('frame[name="main"]').contentFrame().getByText('Management of the counters (CPT0101)');
        this.deleteAbondenedErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('Deletion abandoned');
        this.deletionConfirmationMessage = page.locator('frame[name="main"]').contentFrame().getByText('Do you confirm the deletion ?');

        this.addedCounterSelectionInTable = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'ENP000__', exact: true }).nth(2);
        this.actionsButton = page.locator('frame[name="main"]').contentFrame().getByText('Actions');
        this.addThresholdOption = page.locator('frame[name="main"]').contentFrame().getByText('Add [goal or threshold]');
        this.removeThresholdOption = page.locator('frame[name="main"]').contentFrame().getByText('Remove [goal or threshold]');
        this.addedThresholdInTable = page.locator('frame[name="main"]').contentFrame().getByText('X').nth(2);
        this.emptyThresholdInTable = page.locator('frame[name="main"]').contentFrame().locator(`(//td[text()=' '])[2]`);

        this.addVariationOption = page.locator('frame[name="main"]').contentFrame().getByText('Add [variation]');
        this.removeVariationOption = page.locator('frame[name="main"]').contentFrame().getByText('Remove [variation]');
        
        this.addedVariationInTable = page.locator('frame[name="main"]').contentFrame().getByText('X').nth(3);
        this.emptyVariationInTable = page.locator('frame[name="main"]').contentFrame().locator(`(//td[text()=' '])[3]`);

        this.displayButton = page.locator('frame[name="main"]').contentFrame().getByText('Display');
        this.displayScreenTitle = page.locator('frame[name="main"]').contentFrame().getByText('Display a report of counting (CPT0104)');

    }
}
