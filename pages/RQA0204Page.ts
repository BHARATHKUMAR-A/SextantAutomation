import { Page, Locator } from '@playwright/test';

export class RQA0204Page {
    // ── Menu navigation ──────────────────────────────────────────────────────
    referenceData: Locator;
    qualityMenu: Locator;
    rqa0204Option: Locator;

    // ── Screen title ─────────────────────────────────────────────────────────
    screenTitle: Locator;

    // ── Filter dropdowns ──────────────────────────────────────────────────────
    workshopPen: Locator;
    workshopOption: Locator;
    zoneDeaPen: Locator;
    zoneDeaOption: Locator;
    posteDeaPen: Locator;
    posteDeaOption: Locator;
    zoneDerPen: Locator;
    zoneDerOption: Locator;
    posteDerPen: Locator;
    posteDerOption: Locator;

    // ── Submit (filter search) ────────────────────────────────────────────────
    submitButton: Locator;

    // ── Association form ──────────────────────────────────────────────────────
    addButton: Locator;
    deaPen: Locator;
    deaOption: Locator;
    derPen: Locator;
    derOption: Locator;
    submitButtonToAdd: Locator;
    deleteButton: Locator;
    cancelButton: Locator;

    constructor(page: Page) {
        // ── Menu navigation ───────────────────────────────────────────────────
        this.referenceData = page.locator('frame[name="menu"]').contentFrame().getByText('Reference data', { exact: true });
        this.qualityMenu   = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Quality', exact: true });
        this.rqa0204Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'RQA0204 - Link reworks to' });

        // ── Screen title ──────────────────────────────────────────────────────
        this.screenTitle = page.locator('frame[name="main"]').contentFrame().getByText('Associate declarable and reworkable defects  (RQA0204)');

        // ── Filter dropdowns ──────────────────────────────────────────────────
        this.workshopPen    = page.locator('frame[name="main"]').contentFrame().locator('#comboListeAtelier span');
        this.workshopOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'EBAS1' }).nth(2);
        this.zoneDeaPen     = page.locator('frame[name="main"]').contentFrame().locator('#comboListeZoneDea span');
        this.zoneDeaOption  = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'E2' }).nth(2);
        this.posteDeaPen    = page.locator('frame[name="main"]').contentFrame().locator('#comboListePosteDea span');
        this.posteDeaOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '100', exact: true }).nth(1);
        this.zoneDerPen     = page.locator('frame[name="main"]').contentFrame().locator('#comboListeZoneDer span');
        this.zoneDerOption  = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'E2' }).nth(3);
        this.posteDerPen    = page.locator('frame[name="main"]').contentFrame().locator('#comboListePosteDer span');
        this.posteDerOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '100', exact: true }).nth(2);

        // ── Submit (filter search) ─────────────────────────────────────────────
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByLabel('', { exact: true });

        // ── Association form ──────────────────────────────────────────────────
        this.addButton         = page.locator('frame[name="main"]').contentFrame().getByText('Add');
        this.deaPen            = page.locator('frame[name="main"]').contentFrame().locator('#comboListeDea span');
        this.deaOption         = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'DG01' }).nth(2);
        this.derPen            = page.locator('frame[name="main"]').contentFrame().locator('#comboListeDer span');
        this.derOption         = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'ENG', exact: true }).nth(2);
        this.submitButtonToAdd = page.locator('frame[name="main"]').contentFrame().getByText('Submit');
        this.deleteButton      = page.locator('frame[name="main"]').contentFrame().getByText('Delete', { exact: true });
        this.cancelButton      = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
    }
}
