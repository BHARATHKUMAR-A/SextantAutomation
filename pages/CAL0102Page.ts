import { Page, Locator } from '@playwright/test';

export class CAL0102Page {

    // ── Navigation ─────────────────────────────────────────────────────────────
    referenceDataMenu: Locator;
    calendarSubmenu:   Locator;
    cal0102MenuItem:   Locator;

    // ── Toolbar buttons ────────────────────────────────────────────────────────
    addButton:       Locator;
    consultButton:   Locator;
    modifyButton:    Locator;
    deleteButton:    Locator;
    duplicateButton: Locator;

    // ── Create type sub-menu (#idMenuCreerType) ────────────────────────────────
    perCycleCreateOption: Locator;
    perWeekCreateOption:  Locator;

    // ── Consult type sub-menu (#idMenuConsulterType) ───────────────────────────
    perDayConsultOption:   Locator;
    perWeekConsultOption:  Locator;
    perMonthConsultOption: Locator;
    perYearConsultOption:  Locator;

    // ── Modify type sub-menu (#idMenuModifierType) ────────────────────────────
    perCycleModifyOption: Locator;
    perWeekModifyOption:  Locator;

    // ── Combo pen buttons (click to open dropdown) ────────────────────────────
    // After clicking, a popup appears inside the combo container
    yearComboPen:     Locator;   // #listAnneeCombo span
    weekTypeComboPen: Locator;   // #listSemainesTypesCombo span

    // ── Per-Cycle creation form buttons ───────────────────────────────────────
    addCycleButton:  Locator;   // #ajouterCycle — adds a cycle row
    selectAllButton: Locator;   // Select All weeks for Per-Week creation
    assignButton:    Locator;   // #affecter — assigns selected weeks to cycle

    // ── Duplicate form fields ─────────────────────────────────────────────────
    dupCalendarTypeInput:  Locator;
    dupCalendarLabelInput: Locator;

    // ── Selection criteria panel ──────────────────────────────────────────────
    criteriaCalTypePen: Locator;   // #codeCalTypeBox span — opens Calendar Type filter combo
    criteriaYearPen:    Locator;   // #anneeCodeBox span — opens Year filter combo
    resetButton:        Locator;   // Reset button — clears all criteria and restores full list

    // ── Generic action buttons ────────────────────────────────────────────────
    validateButton: Locator;
    yesButton:      Locator;
    noButton:       Locator;   // No — cancels the pending operation (triggers abandoned message)
    quitButton:     Locator;   // Quit(ESC) title button on view forms
    backButton:     Locator;   // Back arrow (.ecwTitleButtonBackIhm)

    constructor(page: Page) {
        const menu = page.locator('frame[name="menu"]').contentFrame();
        const main = page.locator('frame[name="main"]').contentFrame();

        // Navigation
        this.referenceDataMenu = menu.getByText('Reference data', { exact: true });
        this.calendarSubmenu   = menu.getByRole('cell', { name: 'Calendar' });
        this.cal0102MenuItem   = menu.getByRole('cell', { name: 'CAL0102 - Manage calendars' });

        // Toolbar
        this.addButton       = main.locator('#buttonTypeAdd');
        this.consultButton   = main.locator('#buttonTypeConsult');
        this.modifyButton    = main.getByText('Modify', { exact: true });
        this.deleteButton    = main.locator('#buttonTypeDelete');
        this.duplicateButton = main.getByText('Duplicate', { exact: true });

        // Create sub-menu options
        this.perCycleCreateOption = main.locator('#idMenuCreerType').getByText('Per Cycle');
        this.perWeekCreateOption  = main.locator('#idMenuCreerType').getByText('Per week');

        // Consult sub-menu options
        this.perDayConsultOption   = main.locator('#idMenuConsulterType').getByText('Per day');
        this.perWeekConsultOption  = main.locator('#idMenuConsulterType').getByText('Per week');
        this.perMonthConsultOption = main.locator('#idMenuConsulterType').getByText('Per month');
        this.perYearConsultOption  = main.locator('#idMenuConsulterType').getByText('Per year');

        // Modify sub-menu options
        this.perCycleModifyOption = main.locator('#idMenuModifierType').getByText('Per Cycle');
        this.perWeekModifyOption  = main.locator('#idMenuModifierType').getByText('Per week');

        // Combo pens
        this.yearComboPen     = main.locator('#listAnneeCombo span');
        this.weekTypeComboPen = main.locator('#listSemainesTypesCombo span');

        // Creation form buttons
        this.addCycleButton  = main.locator('#ajouterCycle');
        this.selectAllButton = main.getByText('Select All', { exact: true });
        this.assignButton    = main.locator('#affecter');

        // Duplicate form
        this.dupCalendarTypeInput  = main.getByRole('group', { name: 'New Calendar' }).getByLabel('Calendar Type');
        this.dupCalendarLabelInput = main.getByRole('group', { name: 'New Calendar' }).getByLabel('Label');

        // Generic actions
        this.validateButton = main.getByText('Validate', { exact: true });
        this.yesButton      = main.getByText('Yes', { exact: true });
        this.noButton       = main.getByText('No', { exact: true });
        this.quitButton     = main.getByTitle('Quit(ESC)');
        this.backButton     = main.locator('.ecwTitleButtonBackIhm');

        // Selection criteria panel
        this.criteriaCalTypePen = main.locator('#codeCalTypeBox span');
        this.criteriaYearPen    = main.locator('#anneeCodeBox span');
        this.resetButton        = main.getByText('Reset', { exact: true });
    }
}
