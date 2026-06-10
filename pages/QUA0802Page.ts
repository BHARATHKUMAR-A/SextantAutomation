import { Page, Locator } from '@playwright/test';
import testConfig from '../test-data/testConfig.json';

export class QUA0802Page {

    qualityMonitoring: Locator;
    qua0802Option: Locator;
    titleQua0802: Locator;
    reworkStationPen: Locator;
    reworkStationOption: Locator;
    submitButton: Locator;
    serialNumberTextbox: Locator;
    formatNotCorrectError: Locator;





    constructor(page: Page) {
        const menuFrame = page.locator('frame[name="menu"]').contentFrame();
        const mainFrame = page.locator('frame[name="main"]').contentFrame();


        this.qualityMonitoring = menuFrame.getByText('Quality monitoring', { exact: true });
        this.qua0802Option =  menuFrame.getByRole('cell', { name: 'QUA0802 - Manage the part-to-' });
        this.titleQua0802 = mainFrame.getByText('  Manage the part-to-part traceability  (QUA0802) ');
        this.reworkStationPen = mainFrame.locator('#comboListePosteRetouche span');
        this.reworkStationOption = mainFrame.getByRole('cell', { name: 'EXP1' }).nth(2);
        this.serialNumberTextbox = mainFrame.getByRole('textbox', { name: 'Serial Number:' });
        this.submitButton = mainFrame.getByText('Submit');
        this.formatNotCorrectError = mainFrame.getByText('The format of the serial number of the component is not correct');







    }
}

