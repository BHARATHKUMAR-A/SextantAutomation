import { Page, Locator } from '@playwright/test';

export class QUA0301Page {
    qualityMonitoring: Locator;
    qua0301Option: Locator;
    valueTextbox: Locator;
    submitButton: Locator;
    passingToWorkstationsTab: Locator;
    measuredParametersTab: Locator;
    defectsTab: Locator;
    qualityBlockingTab: Locator;
    parcelPartTab: Locator;
    affectedPartsTab: Locator;
    particularEventsTab: Locator;
    consultInformationTitle: Locator;

    constructor(page: Page) {
        this.qualityMonitoring = page.locator('frame[name="menu"]').contentFrame().getByText('Quality monitoring', { exact: true });
        this.qua0301Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: /QUA0301 - Consult parts/ });
        this.valueTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Value :' });
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByText('Submit', { exact: true });
        this.passingToWorkstationsTab = page.locator('frame[name="main"]').contentFrame().getByText('Passing to the workstations', { exact: true });
        this.measuredParametersTab = page.locator('frame[name="main"]').contentFrame().getByText('Measured parameters', { exact: true });
        this.defectsTab = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'Defects' }).locator('div');
        this.qualityBlockingTab = page.locator('frame[name="main"]').contentFrame().getByText('Quality blocking', { exact: true });
        this.parcelPartTab = page.locator('frame[name="main"]').contentFrame().getByText('Parcel Part', { exact: true });
        this.affectedPartsTab = page.locator('frame[name="main"]').contentFrame().getByText('Affected Parts', { exact: true });
        this.particularEventsTab = page.locator('frame[name="main"]').contentFrame().getByText('Particular events', { exact: true });
        this.consultInformationTitle = page.locator('frame[name="main"]').contentFrame().getByText('Consult the information of a');
    }
}