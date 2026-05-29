import { Page, Locator } from '@playwright/test';

export class CPT0202Page {
    CPT0202Option: Locator;
    counterGroupPen: Locator;
    CounterGroupTable: Locator;
    cpt0202ScreenTitle: Locator;
    submitButton: Locator;
    filterButton: Locator;
    newSelectionButton: Locator;
    filterTextBox: Locator;
   



    constructor(page: Page) {
        this.CPT0202Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'CPT0202 - Consult real-time' });
        this.counterGroupPen = page.locator('frame[name="main"]').contentFrame().locator('#comboGroupe span');
        this.CounterGroupTable = page.locator('frame[name="main"]').contentFrame().locator(`(//div[@class="ecwTableBody"])[1]/table/tbody/tr`);
        this.cpt0202ScreenTitle = page.locator('frame[name="main"]').contentFrame().getByText('Consult the counter groups  (CPT0202) ');
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByText('Submit (V)');
        this.filterTextBox = page.locator('frame[name="main"]').contentFrame().locator('#filteNom');
        this.filterButton = page.locator('frame[name="main"]').contentFrame().getByText('Filter');
        this.newSelectionButton = page.locator('frame[name="main"]').contentFrame().getByText('New selection');








    }
}
