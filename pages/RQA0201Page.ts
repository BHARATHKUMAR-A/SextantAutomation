import { Page, Locator } from '@playwright/test';

export class RQA0201Page {
    // ── Menu navigation ──────────────────────────────────────────────────────
    referenceData: Locator;
    qualityMenu: Locator;
    rqa0201Option: Locator;
    newSelectionButton: Locator;

    // ── Screen title ──────────────────────────────────────────────────────────
    screenTitle: Locator;

    // ── Workshop (Atelier) ────────────────────────────────────────────────────
    workshopPen: Locator;
    workshopOption: Locator;

    // ── Search submit ─────────────────────────────────────────────────────────
    submitButton: Locator;

    // ── Defect form ───────────────────────────────────────────────────────────
    addButton: Locator;
    codeTextBox: Locator;
    labelTextbox: Locator;
    submitButtonToAdd: Locator;
    updateButton: Locator;
    nextPageButton: Locator;
    deleteButton: Locator;
    cancelButton: Locator;

    constructor(page: Page) {
        // ── Menu navigation ──────────────────────────────────────────────────
        this.referenceData = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Reference data', exact: true });
        this.qualityMenu   = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Quality', exact: true });
        this.rqa0201Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'RQA0201 - Manage elementary' });

        // ── Screen title ─────────────────────────────────────────────────────
        this.screenTitle = page.locator('frame[name="main"]').contentFrame().getByText('Manage the elementary defects (RQA0201)');

        // ── Workshop (Atelier) ───────────────────────────────────────────────
        this.workshopPen    = page.locator('frame[name="main"]').contentFrame().locator('#comboListeAtelier span');
        this.workshopOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'EBAS1' }).nth(2);

        // ── Search submit ────────────────────────────────────────────────────
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByLabel('', { exact: true });

        // ── Defect form ──────────────────────────────────────────────────────
        this.addButton         = page.locator('frame[name="main"]').contentFrame().getByText('Add');
        this.codeTextBox       = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Code :' });
        this.labelTextbox      = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Label :' });
        this.submitButtonToAdd = page.locator('frame[name="main"]').contentFrame().getByText('Submit');
        this.updateButton      = page.locator('frame[name="main"]').contentFrame().getByText('Update', { exact: true });
        this.nextPageButton     = page.locator('frame[name="main"]').contentFrame().getByTitle('Next page');
        this.deleteButton      = page.locator('frame[name="main"]').contentFrame().getByText('Delete', { exact: true });
        this.cancelButton      = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
        this.newSelectionButton = page.locator('frame[name="main"]').contentFrame().getByText('New selection');
    }
}
