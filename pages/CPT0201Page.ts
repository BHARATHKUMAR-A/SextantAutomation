import { Page, Locator } from '@playwright/test';

export class CPT0201Page {
    CPT0201Option: Locator;
    addButton: Locator;
    cpt0201ScreenTitle: Locator;
    submitButton: Locator;
    inputMandatoryErrorMessage: Locator;
    groupNameTextBox: Locator;
    descriptionTextBox: Locator;
    cancelButton: Locator;
    impossibleToCreateACounterErrorMessage: Locator;
    addAllLinesArrow: Locator;
    removeAllLinesArrow: Locator;
    enp000CellOptionLeftCounterNameTable: Locator;
    addButtonExactArrow: Locator;
    enp000CellRightCounterTable: Locator;
    removeButtonExactArrow: Locator;
    updateButton: Locator;
    deleteButton: Locator;
    leftCounterTable: Locator;
    descriptionTextBoxAfterUpdateSelection: Locator;



    constructor(page: Page) {


        this.CPT0201Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'CPT0201 - Manage counter' });
        this.addButton = page.locator('frame[name="main"]').contentFrame().getByText('Add');
        this.cpt0201ScreenTitle = page.locator('frame[name="main"]').contentFrame().getByText('Configure the counter groups  (CPT0201) ');
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByText('Submit');
        this.inputMandatoryErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('Input mandatory');
        this.groupNameTextBox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Group name :' });
        this.descriptionTextBox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Description :' });
        this.cancelButton = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
        this.impossibleToCreateACounterErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('Impossible to create a counter group which contains no counter.');

        this.addAllLinesArrow = page.locator('frame[name="main"]').contentFrame().getByTitle('Add all lines');
        this.removeAllLinesArrow = page.locator('frame[name="main"]').contentFrame().getByTitle('Remove all lines');
        this.enp000CellOptionLeftCounterNameTable = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'ENP000__' }).nth(3);
        this.addButtonExactArrow = page.locator('frame[name="main"]').contentFrame().getByTitle('Add', { exact: true });
        this.enp000CellRightCounterTable = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'ENP000__' }).nth(3);
        this.removeButtonExactArrow = page.locator('frame[name="main"]').contentFrame().getByTitle('Remove', { exact: true });
        this.updateButton = page.locator('frame[name="main"]').contentFrame().getByText('Update', { exact: true });
        this.deleteButton = page.locator('frame[name="main"]').contentFrame().getByText('Delete');

        this.leftCounterTable = page.locator('frame[name="main"]').contentFrame().locator(`(//div[@class="ecwTableBody"])[2]/table/tbody/tr`);
        this.updateButton = page.locator('frame[name="main"]').contentFrame().getByText('Update', { exact: true });
        this.descriptionTextBoxAfterUpdateSelection =page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Description :' });
    


    }
}
