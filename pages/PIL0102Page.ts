import { Page, Locator } from '@playwright/test';

export class PIL0102Page {

    // ── Menu ─────────────────────────────────────────────────────────────────
    processControlMenu: Locator;
    pil0102Option: Locator;

    // ── Main frame — header ──────────────────────────────────────────────────
    headerText: Locator;

    // ── Main frame — primary action button ──────────────────────────────────
    setRemoveLockButton: Locator;

    // ── Lock dialog / inline form ────────────────────────────────────────────
    commentField: Locator;
    submitButton: Locator;
    cancelButton: Locator;

    // ── Success / info messages ──────────────────────────────────────────────
    lockSetSuccessMessage: Locator;
    lockRemovedSuccessMessage: Locator;
    cancelledMessage: Locator;

    constructor(page: Page) {
        const menu = page.locator('frame[name="menu"]').contentFrame();
        const main = page.locator('frame[name="main"]').contentFrame();

        // ── Menu navigation ──────────────────────────────────────────────────
        this.processControlMenu = menu.getByText('Process control', { exact: true });
        // Exact name confirmed from live app: 'PIL0102 - Lock/unlock production kick-off'
        this.pil0102Option      = menu.getByRole('cell', { name: 'PIL0102 - Lock/unlock production kick-off' });

        // ── Header text ──────────────────────────────────────────────────────
        this.headerText = main.getByText('Set/Remove a lock on engagement (PIL0102)', { exact: false });

        // ── Set / Remove lock button ─────────────────────────────────────────
        // Sextent may render this as a button or a clickable text — both covered in Steps
        this.setRemoveLockButton = main.getByRole('button', { name: 'Set/Remove lock' });

        // ── Lock dialog form ─────────────────────────────────────────────────
        this.commentField  = main.getByRole('textbox', { name: 'Comment' });
        this.submitButton  = main.getByRole('button', { name: 'Submit' });
        this.cancelButton  = main.getByRole('button', { name: 'Cancel' });

        // ── Result messages ──────────────────────────────────────────────────
        this.lockSetSuccessMessage     = main.getByText('lock set', { exact: false });
        this.lockRemovedSuccessMessage = main.getByText('lock removed', { exact: false });
        this.cancelledMessage          = main.getByText('cancelled', { exact: false });
    }
}
