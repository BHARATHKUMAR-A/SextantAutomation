import { Page, Locator } from '@playwright/test';

export class QUA0401Page {
    qualityMonitoring: Locator;
    qua0401Option: Locator;
    reworkStationPen: Locator;
    reworkStationPenOptionCrank: Locator;
    valueField: Locator;
    submitButton: Locator;
    qualityFollowupButton: Locator;
    escapeArrow: Locator;
    qualityIndicator: Locator;
    OrangeCard: Locator;
    GreenCard: Locator;
    YellowCard: Locator;
    Yellow: Locator;
    Orange: Locator;
    Green: Locator;
    manageDefects: Locator;
    addDefect: Locator;
    firstTableCell: Locator;
    reworkDefects: Locator;
    backButton: Locator;
    deleteDefect: Locator;
    machiningCrankAreaOptionInTheTable: Locator;
    partDefects: Locator;
    partQualityBlockings: Locator;
    manageBlockings: Locator;
    setBlocking: Locator;
    testCell: Locator;
    cancelBlocking: Locator;

    constructor(page: Page) {
        const menuFrame = page.locator('frame[name="menu"]').contentFrame();
        const mainFrame = page.locator('frame[name="main"]').contentFrame();

        this.qualityMonitoring = menuFrame.getByText('Quality monitoring', { exact: true });
        this.qua0401Option = menuFrame.getByRole('cell', { name: 'QUA0401 - Manage defects and' });

        this.reworkStationPen = mainFrame.locator('#comboListePosteRetouche span');
        this.reworkStationPenOptionCrank = mainFrame.getByRole('cell', { name: 'EXPERTISE CRANK WORKSTATION' }).nth(2);
        this.valueField = mainFrame.getByRole('textbox', { name: 'Value :' });
        this.submitButton = mainFrame.getByText('Submit');
        this.qualityFollowupButton = mainFrame.getByText('Quality follow up');
        this.escapeArrow = mainFrame.getByTitle('\n\t\t\tBack (ESC)\n\t\t');

        this.qualityIndicator = mainFrame.getByText('Switch quality indicator');
        this.OrangeCard = mainFrame.getByText('Orange card');
        this.GreenCard = mainFrame.getByText('Green card');
        this.YellowCard = mainFrame.getByText('Yellow card');
        this.Yellow = mainFrame.getByText('YELLOW');
        this.Orange = mainFrame.getByText('ORANGE', { exact: true });
        this.Green = mainFrame.getByText('GREEN', { exact: true });
        this.manageDefects = mainFrame.getByText('Manage defects', { exact: true });
        this.addDefect = mainFrame.getByText('Add defect');
        this.firstTableCell = mainFrame.locator('(//td[text()="MC"])[8]');
        // this.submitButton = mainFrame.getByText('Submit');
        this.reworkDefects = mainFrame.getByText('Rework defects');
        this.backButton = mainFrame.getByText('Back');
        this.deleteDefect = mainFrame.getByText('Delete defect');
       this.machiningCrankAreaOptionInTheTable = mainFrame.getByTitle('MACHINING CRANK AREA').nth(2);
       this.partDefects = mainFrame.getByText('Part defects');
       this.partQualityBlockings = mainFrame.getByText('Part quality blockings');

       this.manageBlockings = mainFrame.getByText('Manage blockings');
       this.setBlocking = mainFrame.getByText('Set blocking');
       this.testCell = mainFrame.getByRole('cell', { name: 'TEST', exact: true }).nth(1);
       this.cancelBlocking = mainFrame.getByText('Cancel blocking');
    }
}

