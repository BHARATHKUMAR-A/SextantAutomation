import { Page, Locator } from '@playwright/test';

export class RQA0202Page {
    // ── Menu navigation ──────────────────────────────────────────────────────
    referenceData: Locator;
    qualityMenu: Locator;
    rqa0202Option: Locator;

    // ── Screen title ────────────────────────────────────────────────────────
    screenTitle: Locator;

    // ── Workshop/Zone/Poste/Defect ──────────────────────────────────────────
    workshopPen: Locator;
    workshopOption: Locator;
    zonePen: Locator;
    zoneOption: Locator;
    postePen: Locator;
    posteOption: Locator;
    defectPen: Locator;
    defectOption: Locator;

    // ── Submit ───────────────────────────────────────────────────────────────
    submitButton: Locator;

    // ── Defect form ─────────────────────────────────────────────────────────
    addButton: Locator;
    daDescriptionTextbox: Locator;
    submitButtonToAdd: Locator;
    updateButton: Locator;
    deleteButton: Locator;
    cancelButton: Locator;

    constructor(page: Page) {
        // ── Menu navigation ──────────────────────────────────────────────────
        this.referenceData = page.locator('frame[name="menu"]').contentFrame().getByText('Reference data', { exact: true });
        this.qualityMenu   = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Quality', exact: true });
        this.rqa0202Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'RQA0202 - Manage defects' });

        // ── Screen title ─────────────────────────────────────────────────---
        this.screenTitle = page.locator('frame[name="main"]').contentFrame().getByText('Manage the announceable defects  (RQA0202)');

        // ── Workshop/Zone/Poste/Defect ─────────────────────────────────-----
        this.workshopPen    = page.locator('frame[name="main"]').contentFrame().locator('#listAtelier span');
        this.workshopOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'EBAS1' }).nth(2);
        this.zonePen        = page.locator('frame[name="main"]').contentFrame().locator('#listZone span');
        this.zoneOption     = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'E2' }).nth(2);
        this.postePen       = page.locator('frame[name="main"]').contentFrame().locator('#listPoste span');
        this.posteOption    = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '100', exact: true }).nth(1);
        this.defectPen      = page.locator('frame[name="main"]').contentFrame().locator('#listDefaut span');
        this.defectOption   = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'AIR' }).nth(3);

        // ── Submit ─────────────────────────────────────────────────────────-
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByLabel('', { exact: true });

        // ── Defect form ─────────────────────────────────────────────────----
        this.addButton            = page.locator('frame[name="main"]').contentFrame().getByText('Add');
        this.daDescriptionTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'DA Description :' });
        this.submitButtonToAdd    = page.locator('frame[name="main"]').contentFrame().getByText('Submit');
        this.updateButton         = page.locator('frame[name="main"]').contentFrame().getByText('Update', { exact: true });
        this.deleteButton         = page.locator('frame[name="main"]').contentFrame().getByText('Delete', { exact: true });
        this.cancelButton         = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
    }
}
