import { Page, Locator } from '@playwright/test';

export class PRP0501Page {

    // ── Navigation ─────────────────────────────────────────────────────────────
    productionProgrammeMenu: Locator;
    prp0501MenuItem:         Locator;

    // ── Toolbar ────────────────────────────────────────────────────────────────
    createButton: Locator;

    // ── Create form ────────────────────────────────────────────────────────────
    organRefComboPen:     Locator;   // #comboBoxRepereOrgane span — opens Organ Reference combo
    requiredQuantityInput: Locator;  // Required quantity textbox

    // ── Form action buttons ────────────────────────────────────────────────────
    submitButton: Locator;   // Submit — creates the rack (no further dialog)
    cancelButton: Locator;   // Cancel — discards the form

    // ── Result messages ────────────────────────────────────────────────────────
    creationDoneMessage:      Locator;   // 'creation done'      — shown after Submit
    creationAbandonedMessage: Locator;   // 'creation abandoned' — shown after Cancel

    constructor(page: Page) {
        const menu = page.locator('frame[name="menu"]').contentFrame();
        const main = page.locator('frame[name="main"]').contentFrame();

        // Navigation
        this.productionProgrammeMenu = menu.getByText('Production programme management', { exact: true });
        this.prp0501MenuItem         = menu.getByRole('cell', { name: 'PRP0501 - Manage the racks' });

        // Toolbar
        this.createButton = main.getByText('Create', { exact: true });

        // Create form
        this.organRefComboPen      = main.locator('#comboBoxRepereOrgane span');
        this.requiredQuantityInput = main.getByRole('textbox', { name: 'Required quantity' });

        // Form actions
        this.submitButton = main.getByText('Submit', { exact: true });
        this.cancelButton = main.getByText('Cancel', { exact: true });

        // Result messages
        this.creationDoneMessage      = main.getByText('creation done',      { exact: true });
        this.creationAbandonedMessage = main.getByText('creation abandoned',  { exact: true });
    }
}
