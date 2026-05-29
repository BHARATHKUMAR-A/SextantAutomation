import { Page, Locator } from '@playwright/test';

export class RQA0102Page {
    // ── Menu navigation ──────────────────────────────────────────────────────
    referenceData: Locator;
    qualityMenu: Locator;
    rqa0102Option: Locator;

    // ── Workshop (Atelier) ────────────────────────────────────────────────────
    workshopPen: Locator;
    workshopOption: Locator;

    // ── Search submit ─────────────────────────────────────────────────────────
    submitButton: Locator;

    // ── Attribute form ────────────────────────────────────────────────────────
    addButton: Locator;
    descriptionTextbox: Locator;
    cancelButton: Locator;
    submitButtonToAdd: Locator;
    updateButton: Locator;
    deleteButton: Locator;
    attributeNameTextbox: Locator;

    // ── Type radio button ─────────────────────────────────────────────────────
    typeRadioButton: Locator;

    // ── Unit radio button ─────────────────────────────────────────────────────
    unitRadioButton: Locator;

    constructor(page: Page) {
        // ── Menu navigation ──────────────────────────────────────────────────
        this.referenceData = page.locator('frame[name="menu"]').contentFrame().getByText('Reference data', { exact: true });
        this.qualityMenu   = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Quality', exact: true });
        this.rqa0102Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'RQA0102' });

        // ── Workshop (Atelier) ───────────────────────────────────────────────
        this.workshopPen    = page.locator('frame[name="main"]').contentFrame().locator('#comboListeAtelier span');
        this.workshopOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'EBAS1' }).nth(2);

        // ── Search submit ────────────────────────────────────────────────────
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByLabel('', { exact: true });

        // ── Attribute form ───────────────────────────────────────────────────
        this.addButton          = page.locator('frame[name="main"]').contentFrame().getByText('Add');
        this.attributeNameTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Attribute:' });
        this.descriptionTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Description:' });
        this.cancelButton       = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
        this.submitButtonToAdd  = page.locator('frame[name="main"]').contentFrame().getByText('Submit');
        this.updateButton       = page.locator('frame[name="main"]').contentFrame().getByText('Update', { exact: true });
        this.deleteButton       = page.locator('frame[name="main"]').contentFrame().getByText('Delete', { exact: true });

        // ── Type radio button ────────────────────────────────────────────────
        this.typeRadioButton = page.locator('frame[name="main"]').contentFrame().getByRole('radio', { name: 'Measurable parameters types' });

        // ── Unit radio button ────────────────────────────────────────────────
        this.unitRadioButton = page.locator('frame[name="main"]').contentFrame().getByRole('radio', { name: 'Measurable parameters units' });
    }
}
