import { Page, Locator } from '@playwright/test';

export class QUA0101Page {
    qualityMonitoring: Locator;
    qua0101Option: Locator;
    reworkPenmain: Locator;
    reworkPenOption: Locator;
    oldPartIDTextBox: Locator;
    newPartPositionPen: Locator;
    newPartPositionOption: Locator;
    rangeNumberTextbox: Locator;
    updatePartButton: Locator;
    newSelection: Locator;
    submitButton: Locator;




    constructor(page: Page) {
        const menuFrame = page.locator('frame[name="menu"]').contentFrame();
        const mainFrame = page.locator('frame[name="main"]').contentFrame();

        this.qualityMonitoring = menuFrame.getByText('Quality monitoring', { exact: true });

        this.qua0101Option = menuFrame.getByRole('cell', { name: 'QUA0101 - Update part' });
        this.reworkPenmain = mainFrame.locator('#comboListePoste span');
        this.reworkPenOption =mainFrame.getByRole('cell', { name: 'EXP1' }).nth(2);
        this.submitButton = mainFrame.getByLabel('', { exact: true });
        this.oldPartIDTextBox = mainFrame.getByRole('textbox', { name: 'Old Part ID:' });
        this.newPartPositionPen = mainFrame.locator('#comboRepOrg span');
        this.newPartPositionOption = mainFrame.getByRole('cell', { name: '10Z1AA' }).nth(2);
        this.rangeNumberTextbox = mainFrame.getByRole('textbox', { name: 'Range number:' });
        this.updatePartButton = mainFrame.getByText('Update a part', { exact: true });
        this.newSelection = mainFrame.getByText('New selection');





    }
}



