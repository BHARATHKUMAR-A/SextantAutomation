import { Page, Locator } from '@playwright/test';

export class RQA0203Page {
    // ── Menu navigation ──────────────────────────────────────────────────────
    referenceData: Locator;
    qualityMenu: Locator;
    rqa0203Option: Locator;

    // ── Screen title ─────────────────────────────────────────────────────────
    screenTitle: Locator;

    // ── Workshop/Zone/Poste/Defect ────────────────────────────────────────────
    workshopPen: Locator;
    workshopOption: Locator;
    zonePen: Locator;
    zoneOption: Locator;
    postePen: Locator;
    posteOption: Locator;
    defectPen: Locator;
    defectOption: Locator;

    // ── Submit (initial search) ───────────────────────────────────────────────
    submitButton: Locator;

    // ── Rework form ───────────────────────────────────────────────────────────
    addButton: Locator;
    actionPen: Locator;
    actionOption: Locator;
    piecePen: Locator;
    pieceOption: Locator;
    famillePen: Locator;
    familyTextbox: Locator;
    respPen: Locator;
    respOption: Locator;
    cartonPen: Locator;
    cartonOption: Locator;
    drDescriptionTextbox: Locator;
    submitButtonToAdd: Locator;
    updateButton: Locator;
    deleteButton: Locator;
    cancelButton: Locator;
    newSelectionButton: Locator;

    constructor(page: Page) {
        // ── Menu navigation ───────────────────────────────────────────────────
        this.referenceData = page.locator('frame[name="menu"]').contentFrame().getByText('Reference data', { exact: true });
        this.qualityMenu   = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Quality', exact: true });
        this.rqa0203Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'RQA0203 - Manage reworks' });

        // ── Screen title ──────────────────────────────────────────────────────
        this.screenTitle = page.locator('frame[name="main"]').contentFrame().getByText('Manage the reworkable defects  (RQA0203)');

        // ── Workshop/Zone/Poste/Defect ────────────────────────────────────────
        this.workshopPen    = page.locator('frame[name="main"]').contentFrame().locator('#comboListeAtelier span');
        this.workshopOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'EBAS1' }).nth(2);
        this.zonePen        = page.locator('frame[name="main"]').contentFrame().locator('#comboListeZone span');
        this.zoneOption     = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'E2' }).nth(2);
        this.postePen       = page.locator('frame[name="main"]').contentFrame().locator('#comboListePoste span');
        this.posteOption    = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '100', exact: true }).nth(1);
        this.defectPen      = page.locator('frame[name="main"]').contentFrame().locator('#comboListeDefaut span');
        this.defectOption   = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'ENG', exact: true }).nth(1);

        // ── Submit (initial search) ────────────────────────────────────────────
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByLabel('', { exact: true });

        // ── Rework form ────────────────────────────────────────────────────────
        this.addButton            = page.locator('frame[name="main"]').contentFrame().getByText('Add');
        this.actionPen            = page.locator('frame[name="main"]').contentFrame().locator('#comboListeAction span');
        this.actionOption         = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'REW', exact: true }).nth(2);
        this.piecePen             = page.locator('frame[name="main"]').contentFrame().locator('#comboListePiece span');
        this.pieceOption          = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'ENG', exact: true }).nth(2);
        this.famillePen           = page.locator('frame[name="main"]').contentFrame().locator('#comboListeFamille span');
        this.familyTextbox        = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Family :' });
        this.respPen              = page.locator('frame[name="main"]').contentFrame().locator('#comboListeResp span');
        this.respOption           = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'RG' }).nth(3);
        this.cartonPen            = page.locator('frame[name="main"]').contentFrame().locator('#comboListeCarton span');
        this.cartonOption         = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'V', exact: true }).nth(1);
        this.drDescriptionTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'DR Description :' });
        this.submitButtonToAdd    = page.locator('frame[name="main"]').contentFrame().getByText('Submit');
        this.updateButton         = page.locator('frame[name="main"]').contentFrame().getByText('Update', { exact: true });
        this.deleteButton         = page.locator('frame[name="main"]').contentFrame().getByText('Delete', { exact: true });
        this.cancelButton         = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
        this.newSelectionButton   = page.locator('frame[name="main"]').contentFrame().getByText('New selection');
    }
}
