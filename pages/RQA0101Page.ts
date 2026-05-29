import { Page, Locator } from '@playwright/test';

export class RQA0101Page {
    // ── Menu navigation ──────────────────────────────────────────────────────
    referenceData: Locator;
    qualityMenu: Locator;
    rqa0101Option: Locator;

    // ── Workshop (Atelier) ────────────────────────────────────────────────────
    workshopPen: Locator;
    workshopOption: Locator;

    // ── Area (Zone) ───────────────────────────────────────────────────────────
    areaPen: Locator;
    areaOption: Locator;

    // ── Poste ─────────────────────────────────────────────────────────────────
    postePen: Locator;
    posteOption: Locator;

    // ── Operation ─────────────────────────────────────────────────────────────
    operationPen: Locator;
    operationTextbox: Locator;

    // ── Submit ────────────────────────────────────────────────────────────────
    submitButton: Locator;

    // ── Add Parameter form ────────────────────────────────────────────────────
    addButton: Locator;
    parameterTextbox: Locator;
    familyPen: Locator;
    familyOption: Locator;
    descriptionTextbox: Locator;
    typePen: Locator;
    typeOption: Locator;
    unitPen: Locator;
    unitOption: Locator;
    cancelButton: Locator;
    submitButtonToAdd: Locator;
    updateButton: Locator;
    deleteButton: Locator;

    constructor(page: Page) {
        // ── Menu navigation ──────────────────────────────────────────────────
        this.referenceData = page.locator('frame[name="menu"]').contentFrame().getByText('Reference data', { exact: true });
        this.qualityMenu   = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Quality', exact: true });
        this.rqa0101Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'RQA0101 - Manage the measured parameters' });

        // ── Workshop (Atelier) ───────────────────────────────────────────────
        this.workshopPen    = page.locator('frame[name="main"]').contentFrame().locator('#comboListeAtelier span');
        this.workshopOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'EBAS1' }).nth(2);

        // ── Area (Zone) ──────────────────────────────────────────────────────
        this.areaPen    = page.locator('frame[name="main"]').contentFrame().locator('#comboListeZone span');
        this.areaOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'C1' }).nth(2);

        // ── Poste ────────────────────────────────────────────────────────────
        this.postePen    = page.locator('frame[name="main"]').contentFrame().locator('#comboListePoste span');
        this.posteOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '0110' }).nth(3);

        // ── Operation ────────────────────────────────────────────────────────
        this.operationPen     = page.locator('frame[name="main"]').contentFrame().locator('#comboListeOperation span');
        this.operationTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Operation :' });

        // ── Submit ───────────────────────────────────────────────────────────
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByLabel('', { exact: true });

        // ── Add Parameter form ───────────────────────────────────────────────
        this.addButton         = page.locator('frame[name="main"]').contentFrame().getByText('Add');
        this.parameterTextbox  = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Parameter :' });
        this.familyPen         = page.locator('frame[name="main"]').contentFrame().locator('#comboListeFamille span');
        this.familyOption      = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '' }).nth(2); // TODO: update with actual family option name
        this.descriptionTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Description :' });
        this.typePen           = page.locator('frame[name="main"]').contentFrame().locator('#comboListeType span');
        this.typeOption        = page.locator('frame[name="main"]').contentFrame().locator('#listeType').getByRole('cell', { name: 'VALEUR' }).nth(1);
        this.unitPen           = page.locator('frame[name="main"]').contentFrame().locator('#comboListeUnite span');
        this.unitOption        = page.locator('frame[name="main"]').contentFrame().locator('#listeUnite').getByRole('cell', { name: 'TXT' }).nth(1);
        this.cancelButton      = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
        this.submitButtonToAdd = page.locator('frame[name="main"]').contentFrame().getByText('Submit');
        this.updateButton      = page.locator('frame[name="main"]').contentFrame().getByText('Update', { exact: true });
        this.deleteButton      = page.locator('frame[name="main"]').contentFrame().getByText('Delete', { exact: true });
        // this.deleteSuccessMsg = page.locator('frame[name="main"]').contentFrame().getByText('The regulable parameter was deleted successfully.');

    }
}
