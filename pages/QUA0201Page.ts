import { Page, Locator } from '@playwright/test';

export class QUA0201Page {
    qualityMonitoring: Locator;
    qua0201Option: Locator;
    testBenchNumPen: Locator;
    // testBenchNumOption: Locator;
    partIdPen: Locator;
    // partIdOption: Locator;
    resultPen: Locator;
    resultOptionGood: Locator;
    resultOptionBad: Locator;
    submitButton: Locator;
    qua0401Title: Locator;
    cleaningButton: Locator;
    degradedModeButton: Locator;
    nominalModeButton: Locator;
    activeDowngradedModeText: Locator;
    changingModeMessage: Locator;
    inputMandatoryErrorMSG: Locator;
    submitButton2: Locator;



    constructor(page: Page) {
        const menuFrame = page.locator('frame[name="menu"]').contentFrame();
        const mainFrame = page.locator('frame[name="main"]').contentFrame();

        this.qualityMonitoring = menuFrame.getByText('Quality monitoring', { exact: true });

        this.qua0201Option = menuFrame.getByRole('cell', { name: 'QUA0201 - Declare test bench' });

        this.testBenchNumPen = mainFrame.locator('#comboListePostes span');
        // this.testBenchNumOption = mainFrame.getByRole('cell', { name: 'HTB1' }).nth(3);
        this.submitButton = mainFrame.getByLabel('', { exact: true });
        this.partIdPen = mainFrame.locator('#comboListMedaille span');
        // this.partIdOption = mainFrame.getByRole('cell', { name: '10ZA0R0000002' }).nth(2);
        this.resultPen = mainFrame.locator('#comboListResult span');
        this.resultOptionGood = mainFrame.getByRole('cell', { name: 'Good' }).nth(2);
        this.resultOptionBad = mainFrame.getByRole('cell', { name: 'Bad' }).nth(2);
        this.submitButton2 = mainFrame.getByText('Submit');

        this.qua0401Title = mainFrame.getByText('Manage defects of a part  (QUA0401)');
        this.cleaningButton = mainFrame.getByText('Cleaning');
        this.degradedModeButton = mainFrame.getByText('Degraded mode');
        this.nominalModeButton = mainFrame.getByText('Nominal mode');
        this.activeDowngradedModeText = mainFrame.getByText('Active downgraded mode');
        this.changingModeMessage = mainFrame.getByText('Changing the mode done');
        this.inputMandatoryErrorMSG = mainFrame.getByText('Input mandatory');



    }
}



