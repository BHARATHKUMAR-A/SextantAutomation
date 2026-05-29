import { Page, Locator } from '@playwright/test';

export class CAL0103Page {

    // ── Navigation ─────────────────────────────────────────────────────────────
    referenceDataMenu: Locator;
    calendarSubmenu:   Locator;
    cal0103MenuItem:   Locator;

    // ── Calendar Type + Zone combos ────────────────────────────────────────────
    // These determine which calendar's non-working days are being managed.
    calTypeComboPen: Locator;   // #listCodeCalendrierTypeAAjouterCombo span
    calZoneComboPen: Locator;   // #listCodeCalendrierZoneAAjouterCombo span

    // ── Date picker ────────────────────────────────────────────────────────────
    // #journeeDatee_img opens the calendar widget.
    // datePickerNextMonth is the navigation arrow to advance one month
    // (needed when today is the last day of the month — tomorrow is in next month).
    datePicker:          Locator;
    datePickerNextMonth: Locator;

    // ── Action buttons ─────────────────────────────────────────────────────────
    addButton:      Locator;   // #ajouter — appends the selected date to the pending list
    validateButton: Locator;   // Validate — opens the Yes/No confirmation dialog
    yesButton:      Locator;   // Yes — commits the modification
    noButton:       Locator;   // No  — abandons the modification
    cancelButton:   Locator;   // Cancel — resets the form / clears criteria

    constructor(page: Page) {
        const menu = page.locator('frame[name="menu"]').contentFrame();
        const main = page.locator('frame[name="main"]').contentFrame();

        // Navigation
        this.referenceDataMenu = menu.getByText('Reference data', { exact: true });
        this.calendarSubmenu   = menu.getByRole('cell', { name: 'Calendar' });
        this.cal0103MenuItem   = menu.getByRole('cell', { name: 'CAL0103 - Manage non working' });

        // Calendar combos
        this.calTypeComboPen = main.locator('#listCodeCalendrierTypeAAjouterCombo span');
        this.calZoneComboPen = main.locator('#listCodeCalendrierZoneAAjouterCombo span');

        // Date picker
        // datePickerNextMonth uses the jQuery UI standard class (.ui-datepicker-next).
        // If Sextent renders a custom widget, update to the actual next-arrow selector.
        this.datePicker          = main.locator('#journeeDatee_img');
        this.datePickerNextMonth = main.locator('.ui-datepicker-next');

        // Action buttons
        this.addButton      = main.locator('#ajouter');
        this.validateButton = main.getByText('Validate', { exact: true });
        this.yesButton      = main.getByText('Yes',      { exact: true });
        this.noButton       = main.getByText('No',       { exact: true });
        this.cancelButton   = main.getByText('Cancel',   { exact: true });
    }
}
