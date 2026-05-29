import { Page, Locator } from '@playwright/test';

export class CAL0101Page {
    // ── Menu navigation ──────────────────────────────────────────────────────
    referenceData: Locator;
    calendarMenu: Locator;
    cal0101Option: Locator;

    // ── Screen titles ─────────────────────────────────────────────────────────
    screenTitle: Locator;
    createShiftTitle: Locator;

    // ── Shared form controls ──────────────────────────────────────────────────
    createButton: Locator;
    validateButton: Locator;

    // ── Element-type selector buttons (shown after clicking Create) ───────────
    shiftTypeButton: Locator;
    dayTypeButton: Locator;
    weekTypeButton: Locator;

    // ── Calendar-type combo (shared across Shift / Day / Week forms) ──────────
    calendarTypePen: Locator;
    assemblyLineOption: Locator;

    // ── Shift form fields ─────────────────────────────────────────────────────
    shiftTypeTextbox: Locator;
    shiftBeginningHour: Locator;
    shiftEndHour: Locator;

    // ── Day form fields ───────────────────────────────────────────────────────
    dayTypeTextbox: Locator;
    dayBeginningHour: Locator;
    dayEndHour: Locator;
    tourneeComboPen: Locator;
    addTourneeButton: Locator;

    // ── View / Modify / Duplicate / Delete controls ─────────────────────────────
    viewButton: Locator;
    modifyButton: Locator;
    duplicateButton: Locator;
    deleteButton: Locator;
    yesButton: Locator;
    fatherElementsTab: Locator;
    shiftsTab: Locator;
    backButton: Locator;

    // ── Week form fields ──────────────────────────────────────────────────────
    weekTypeTextbox: Locator;
    mondayCombo: Locator;
    tuesdayCombo: Locator;
    wednesdayCombo: Locator;
    thursdayCombo: Locator;
    fridayCombo: Locator;
    saturdayCombo: Locator;
    sundayCombo: Locator;

    constructor(page: Page) {
        // ── Menu navigation ──────────────────────────────────────────────────
        this.referenceData = page.locator('frame[name="menu"]').contentFrame().getByText('Reference data', { exact: true });
        this.calendarMenu  = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Calendar' });
        this.cal0101Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'CAL0101 - Manage calendar' });

        // ── Screen titles ────────────────────────────────────────────────────
        this.screenTitle      = page.locator('frame[name="main"]').contentFrame().getByText('Manage the elements types  (CAL0101)');
        this.createShiftTitle = page.locator('frame[name="main"]').contentFrame().getByText('Create a shift type  (CAL0101)');

        // ── Shared form controls ─────────────────────────────────────────────
        this.createButton   = page.locator('frame[name="main"]').contentFrame().getByText('Create', { exact: true });
        this.validateButton = page.locator('frame[name="main"]').contentFrame().getByText('Validate');

        // ── Element-type selector buttons ────────────────────────────────────
        this.shiftTypeButton = page.locator('frame[name="main"]').contentFrame().getByText('Shift', { exact: true });
        this.dayTypeButton   = page.locator('frame[name="main"]').contentFrame().getByText('Day',   { exact: true });
        this.weekTypeButton  = page.locator('frame[name="main"]').contentFrame().getByText('Week',  { exact: true });

        // ── Calendar-type combo ──────────────────────────────────────────────
        this.calendarTypePen    = page.locator('frame[name="main"]').contentFrame().locator('#codeCalCombo span');
        this.assemblyLineOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'Assembly line', exact: true });

        // ── Shift form fields ────────────────────────────────────────────────
        this.shiftTypeTextbox   = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Shift type' });
        this.shiftBeginningHour = page.locator('frame[name="main"]').contentFrame()
            .getByRole('row', { name: 'Beginning hour __:__ End hour __:__', exact: true })
            .getByLabel('Beginning hour');
        // After typing the beginning hour the row name changes, and 'End hour' also exists in
        // the Breaks Group row — so use the specific field id to target this element uniquely.
        this.shiftEndHour       = page.locator('frame[name="main"]').contentFrame().locator('#heureFinTourneeType');

        // ── Day form fields ──────────────────────────────────────────────────
        this.dayTypeTextbox   = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Day Type' });
        this.dayBeginningHour = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Beginning hour' });
        this.dayEndHour       = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'End hour' });
        this.tourneeComboPen  = page.locator('frame[name="main"]').contentFrame().locator('#tourneeCombo span');
        this.addTourneeButton = page.locator('frame[name="main"]').contentFrame().locator('#addTournee');

        // ── View / Modify mode controls ──────────────────────────────────────
        this.viewButton      = page.locator('frame[name="main"]').contentFrame().getByText('View',      { exact: true });
        this.modifyButton   = page.locator('frame[name="main"]').contentFrame().getByText('Modify',    { exact: true });
        this.duplicateButton = page.locator('frame[name="main"]').contentFrame().getByText('Duplicate', { exact: true });
        this.deleteButton   = page.locator('frame[name="main"]').contentFrame().getByText('Delete',    { exact: true });
        this.yesButton      = page.locator('frame[name="main"]').contentFrame().getByText('Yes',       { exact: true });
        this.fatherElementsTab = page.locator('frame[name="main"]').contentFrame().getByText('Father Elements', { exact: true });
        this.shiftsTab         = page.locator('frame[name="main"]').contentFrame().getByText('Shifts', { exact: true });
        this.backButton        = page.locator('frame[name="main"]').contentFrame().locator('.ecwTitleButtonBackIhm');

        // ── Week form fields ─────────────────────────────────────────────────
        this.weekTypeTextbox = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Week type' });
        this.mondayCombo     = page.locator('frame[name="main"]').contentFrame().locator('#journeeCombo0 span');
        this.tuesdayCombo    = page.locator('frame[name="main"]').contentFrame().locator('#journeeCombo1 span');
        this.wednesdayCombo  = page.locator('frame[name="main"]').contentFrame().locator('#journeeCombo2 span');
        this.thursdayCombo   = page.locator('frame[name="main"]').contentFrame().locator('#journeeCombo3 span');
        this.fridayCombo     = page.locator('frame[name="main"]').contentFrame().locator('#journeeCombo4 span');
        this.saturdayCombo   = page.locator('frame[name="main"]').contentFrame().locator('#journeeCombo5 span');
        this.sundayCombo     = page.locator('frame[name="main"]').contentFrame().locator('#journeeCombo6 span');
    }
}
