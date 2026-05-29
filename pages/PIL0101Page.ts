import { Page, Locator } from '@playwright/test';

export class PIL0101Page {

    // ── Menu ─────────────────────────────────────────────────────────────────
    processControlMenu: Locator;
    pil0101Option: Locator;

    // ── Main frame — header ──────────────────────────────────────────────────
    headerText: Locator;

    // ── Main frame — toolbar / actions ──────────────────────────────────────
    submitButton: Locator;

    constructor(page: Page) {
        const menu = page.locator('frame[name="menu"]').contentFrame();
        const main = page.locator('frame[name="main"]').contentFrame();

        // ── Menu navigation ──────────────────────────────────────────────────
        // Primary: English text; fallback handled via self-healing in Steps
        this.processControlMenu = menu.getByText('Process control', { exact: true });
        this.pil0101Option      = menu.getByRole('cell', { name: 'PIL0101 -' });

        // ── Header text — used to assert correct screen loaded ──────────────
        this.headerText  = main.getByText('Reinitialize the automaton piles (PIL0101)', { exact: false });

        // ── Submit button ────────────────────────────────────────────────────
        // Primary: role-based; fallback: exact text — resolved in Steps
        this.submitButton = main.getByRole('button', { name: 'Submit' });
    }
}
