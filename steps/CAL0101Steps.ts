import { Page, Locator, expect } from '@playwright/test';
import { CAL0101Page } from '../pages/CAL0101Page';
import { SshHelper } from '../utils/sshHelper';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class CAL0101Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private cal0101Page: CAL0101Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.sshHelper   = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.cal0101Page = new CAL0101Page(page);
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    async navigateToCAL0101(): Promise<void> {
        await this.helper.clickElement(this.cal0101Page.referenceData, 'Click Reference Data menu');
        await this.helper.clickElement(this.cal0101Page.calendarMenu,  'Click Calendar submenu');
        await this.helper.clickElement(this.cal0101Page.cal0101Option, 'Select CAL0101 - Manage calendar');
    }

    // ── Screen title assertions ───────────────────────────────────────────────

    async assertScreenTitle(): Promise<void> {
        await this.helper.assertElementHasText(
            this.cal0101Page.screenTitle,
            'Manage the elements types  (CAL0101)',
            'Verify CAL0101 list screen title'
        );
    }

    async assertCreateShiftTitle(): Promise<void> {
        await this.helper.assertElementHasText(
            this.cal0101Page.createShiftTitle,
            'Create a shift type  (CAL0101)',
            'Verify Create Shift form title'
        );
    }

    // ── Shared helper: select calendar type ──────────────────────────────────

    private async selectCalendarType(): Promise<void> {
        await this.helper.clickElement(this.cal0101Page.calendarTypePen,    'Click calendar type pen');
        await this.helper.clickElement(this.cal0101Page.assemblyLineOption, 'Select Assembly line calendar type');
    }

    // ── Shared helper: fill a masked time input (format __:__) ────────────────
    // .fill() bypasses keyboard events — the mask library never receives them.
    // page.keyboard.type() fires events on the currently focused element, so
    // the mask processes each digit as if a real user typed it.
    // Pass digits only — e.g. '0700' for 07:00 (colon is auto-inserted by the mask).

    private async fillTimeField(field: Locator, digits: string, description: string): Promise<void> {
        await this.helper.clickElement(field, `Click ${description}`);
        await this.page.keyboard.type(digits, { delay: 50 });
    }

    // ── Shift creation ────────────────────────────────────────────────────────

    /**
     * Creates a single shift type via Create → Shift form.
     * @param shiftCode  Dynamic code for the shift type (e.g. "FS_XYZ")
     * @param shiftLabel Dynamic label for the shift (e.g. "FSHIFT_XYZ")
     */
    async createShift(shiftCode: string, shiftLabel: string, beginHour = '0550', endHour = '0550'): Promise<void> {
        await this.helper.clickElement(this.cal0101Page.createButton,    'Click Create button');
        await this.helper.clickElement(this.cal0101Page.shiftTypeButton, 'Select Shift element type');
        await this.assertCreateShiftTitle();
        await this.selectCalendarType();

        await this.helper.enterText(this.cal0101Page.shiftTypeTextbox, shiftCode, `Fill shift type code ${shiftCode}`);

        // Fill shift label via dynamic row locator (row name contains the typed code)
        const shiftLabelLocator = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('row', { name: `Shift type ${shiftCode} Label` })
            .getByLabel('Label');
        await this.helper.clickElement(shiftLabelLocator, `Click label field for shift ${shiftCode}`);
        await this.helper.enterText(shiftLabelLocator, shiftLabel, `Fill label ${shiftLabel} for shift ${shiftCode}`);

        // Masked time inputs — pressSequentially fires real keydown/keypress/keyup events
        // so the mask library slots each digit correctly. .fill() and .type() do not work.
        // NOTE: after typing beginHour the row name changes, so the End hour must be
        // targeted by label alone (not by row name) — that is what shiftEndHour does.
        await this.fillTimeField(this.cal0101Page.shiftBeginningHour, beginHour, 'shift beginning hour');
        await this.fillTimeField(this.cal0101Page.shiftEndHour,       endHour,   'shift end hour');

        await this.helper.clickElement(this.cal0101Page.validateButton, `Validate creation of shift ${shiftCode}`);
        await this.helper.captureScreenshot(`CAL0101_Shift_Created_${shiftCode}`);
    }

    // ── Day type creation ─────────────────────────────────────────────────────

    /**
     * Creates a day type and links three shift labels to it.
     * The codegen flow requires two validate cycles:
     *   1st: save the day type definition (code + label + hours)
     *   2nd: save the shift assignments
     * After the 2nd validate, the day type code is updated to dayCode2 and saved.
     *
     * @param dayCode1    Initial day type code (e.g. "WD_XYZ")
     * @param dayCode2    Final day type code used in week form (e.g. "WDD_XYZ")
     * @param dayLabel    Label for the day type
     * @param shiftLabels Array of exactly 3 shift labels to link
     */
    async createDayType(
        dayCode1: string,
        dayCode2: string,
        dayLabel: string,
        shiftLabels: [string, string, string]
    ): Promise<void> {
        await this.helper.clickElement(this.cal0101Page.createButton,  'Click Create button');
        await this.helper.clickElement(this.cal0101Page.dayTypeButton, 'Select Day element type');
        await this.selectCalendarType();

        await this.helper.enterText(this.cal0101Page.dayTypeTextbox, dayCode1, `Fill day type code ${dayCode1}`);

        // Dynamic row locator for the day label field
        const dayLabelLocator = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('row', { name: `Day Type ${dayCode1} Label` })
            .getByLabel('Label');
        await this.helper.clickElement(dayLabelLocator, `Click label field for day type ${dayCode1}`);
        await this.helper.enterText(dayLabelLocator, dayLabel, `Fill label ${dayLabel}`);

        // Masked time inputs — pressSequentially types digit-by-digit for the mask library
        await this.fillTimeField(this.cal0101Page.dayBeginningHour, '0550', 'day beginning hour');
        await this.fillTimeField(this.cal0101Page.dayEndHour,       '0550', 'day end hour');

        // First validate: save the day type definition
        // await this.helper.clickElement(this.cal0101Page.validateButton, 'Validate day type definition');

        // Link shift types via code tournee combo (one at a time)
        for (const shiftLabel of shiftLabels) {
            await this.helper.clickElement(this.cal0101Page.tourneeComboPen, `Open tournee combo for shift ${shiftLabel}`);
            const shiftOption = this.page.locator('frame[name="main"]').contentFrame()
                .getByRole('cell', { name: shiftLabel, exact: true });
            await this.helper.clickElement(shiftOption,                       `Select shift ${shiftLabel}`);
            await this.helper.clickElement(this.cal0101Page.addTourneeButton, `Add shift ${shiftLabel} to day`);
        }

        // Second validate: save shift assignments
        await this.helper.clickElement(this.cal0101Page.validateButton, 'Validate shift assignments for day type');
        await this.helper.captureScreenshot(`CAL0101_DayType_Shifts_Saved_${dayCode1}`);

        // Update day type code to dayCode2 and validate
        // await this.helper.clickElement(this.cal0101Page.dayTypeTextbox,                                        'Click day type textbox for code update');
        // await this.helper.enterText(this.cal0101Page.dayTypeTextbox, dayCode2, `Update day type code to ${dayCode2}`);
        // await this.helper.clickElement(this.cal0101Page.validateButton, `Validate updated day type code ${dayCode2}`);
        await this.helper.captureScreenshot(`CAL0101_DayType_Finalized_${dayCode2}`);
    }

    // ── Week type creation ────────────────────────────────────────────────────

    /**
     * Creates a week type and assigns the given day type code to all 7 days.
     *
     * @param weekCode  Dynamic week type code (e.g. "WW_XYZ")
     * @param weekLabel Dynamic label for the week type (e.g. "WWEEK_XYZ")
     * @param dayCode   The day type code to assign to every day (e.g. "WDD_XYZ")
     */
    async createWeekType(weekCode: string, weekLabel: string, dayCode: string): Promise<void> {
        await this.helper.clickElement(this.cal0101Page.createButton,   'Click Create button');
        await this.helper.clickElement(this.cal0101Page.weekTypeButton, 'Select Week element type');
        await this.selectCalendarType();

        await this.helper.enterText(this.cal0101Page.weekTypeTextbox, weekCode, `Fill week type code ${weekCode}`);

        // Dynamic row locator for the week type label
        const weekLabelLocator = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: `Week type ${weekCode} Label`, exact: true })
            .getByLabel('Label');
        await this.helper.clickElement(weekLabelLocator, `Click label field for week type ${weekCode}`);
        await this.helper.enterText(weekLabelLocator, weekLabel, `Fill week label ${weekLabel}`);

        // Assign day type to each day of the week
        const dayComboLocators: Locator[] = [
            this.cal0101Page.mondayCombo,
            this.cal0101Page.tuesdayCombo,
            this.cal0101Page.wednesdayCombo,
            this.cal0101Page.thursdayCombo,
            this.cal0101Page.fridayCombo,
            this.cal0101Page.saturdayCombo,
            this.cal0101Page.sundayCombo,
        ];
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        for (let i = 0; i < dayComboLocators.length; i++) {
            await this.helper.clickElement(dayComboLocators[i], `Open day combo for ${dayNames[i]}`);
            const dayOption = i === 0
                // Monday: dropdown renders without a scoped list container
                ? this.page.locator('frame[name="main"]').contentFrame()
                    .getByRole('cell', { name: dayCode, exact: true })
                // Tuesday – Sunday: scoped to their list container
                : this.page.locator('frame[name="main"]').contentFrame()
                    .locator(`#journeeComboList${i}`)
                    .getByRole('cell', { name: dayCode });
            await this.helper.clickElement(dayOption, `Select day type ${dayCode} for ${dayNames[i]}`);
        }

        await this.helper.clickElement(this.cal0101Page.validateButton, `Validate creation of week type ${weekCode}`);
        await this.helper.captureScreenshot(`CAL0101_WeekType_Created_${weekCode}`);
    }
    // ── Duplicate shift type ──────────────────────────────────────────────────────

    /**
     * Selects a shift row by its code, clicks Duplicate, fills new code and label, validates.
     * @param sourceCode   The code of the shift to duplicate (used to locate the row)
     * @param currentLabel The label currently shown on the form after opening duplicate
     * @param newCode      New unique code for the duplicated shift
     * @param newLabel     New unique label for the duplicated shift
     */
    async duplicateShift(sourceCode: string, currentLabel: string, newCode: string, newLabel: string): Promise<void> {
        const sourceRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: sourceCode }).nth(2);
        await this.helper.clickElement(sourceRow,                            `Select shift row ${sourceCode}`);
        await this.helper.clickElement(this.cal0101Page.duplicateButton,     'Click Duplicate button');
        await this.helper.enterText(this.cal0101Page.shiftTypeTextbox, newCode, `Fill new shift code ${newCode}`);
        const labelInput = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: currentLabel }).getByLabel('Label');
        await this.helper.clickElement(labelInput, `Click label field for duplicate shift`);
        await this.helper.enterText(labelInput, newLabel, `Fill new label ${newLabel}`);
        await this.helper.clickElement(this.cal0101Page.validateButton, `Validate duplicate shift ${newCode}`);
        await this.helper.captureScreenshot(`CAL0101_Shift_Duplicated_${newCode}`);
    }

    // ── Duplicate day type ────────────────────────────────────────────────────────

    /**
     * Selects a day type row by its code, clicks Duplicate, fills new code and label, validates.
     */
    async duplicateDayType(sourceCode: string, newCode: string, newLabel: string): Promise<void> {
        const sourceRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: sourceCode }).nth(2);
        await this.helper.clickElement(sourceRow,                            `Select day type row ${sourceCode}`);
        await this.helper.clickElement(this.cal0101Page.duplicateButton,     'Click Duplicate button');
        await this.helper.enterText(this.cal0101Page.dayTypeTextbox, newCode, `Fill new day code ${newCode}`);
        const labelInput = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('row', { name: `Day Type ${newCode} Label` }).getByLabel('Label');
        await this.helper.clickElement(labelInput, `Click label field for duplicate day type`);
        await this.helper.enterText(labelInput, newLabel, `Fill new label ${newLabel}`);
        await this.helper.clickElement(this.cal0101Page.validateButton, `Validate duplicate day type ${newCode}`);
        await this.helper.captureScreenshot(`CAL0101_DayType_Duplicated_${newCode}`);
    }

    // ── Duplicate week type ───────────────────────────────────────────────────────

    /**
     * Selects a week type row by its code, clicks Duplicate, fills new code and label, validates.
     */
    async duplicateWeekType(sourceCode: string, newCode: string, newLabel: string): Promise<void> {
        const sourceRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: sourceCode }).nth(2);
        await this.helper.clickElement(sourceRow,                            `Select week type row ${sourceCode}`);
        await this.helper.clickElement(this.cal0101Page.duplicateButton,     'Click Duplicate button');
        await this.helper.enterText(this.cal0101Page.weekTypeTextbox, newCode, `Fill new week code ${newCode}`);
        const labelInput = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: `Week type ${newCode} Label`, exact: true }).getByLabel('Label');
        await this.helper.clickElement(labelInput, `Click label field for duplicate week type`);
        await this.helper.enterText(labelInput, newLabel, `Fill new label ${newLabel}`);
        await this.helper.clickElement(this.cal0101Page.validateButton, `Validate duplicate week type ${newCode}`);
        await this.helper.captureScreenshot(`CAL0101_WeekType_Duplicated_${newCode}`);
    }

    // ── Delete element by label ───────────────────────────────────────────────────

    /**
     * Selects a row by its label text, clicks Delete → Validate → Yes.
     * @param label       The label text shown in the list row
     * @param elementType Short description for logging (e.g. 'shift', 'day', 'week')
     */
    async deleteByLabel(label: string, elementType: string): Promise<void> {
        const row = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: label }).nth(2);
        await this.helper.clickElement(row,                               `Select ${elementType} row by label ${label}`);
        await this.helper.clickElement(this.cal0101Page.deleteButton,    `Click Delete for ${label}`);
        await this.helper.clickElement(this.cal0101Page.validateButton,  `Validate delete ${label}`);
        await this.helper.clickElement(this.cal0101Page.yesButton,       `Confirm Yes to delete ${label}`);
        await this.helper.captureScreenshot(`CAL0101_${elementType}_Deleted_${label}`);
    }
    // ── Modify shift type ──────────────────────────────────────────────────────

    /**
     * Selects a shift row by its code, clicks Modify, updates the label, and validates.
     * @param shiftCode    The shift code used to locate the row (e.g. "FSK")
     * @param currentLabel The current label shown in the label cell (used to scope the input)
     * @param newLabel     The new label to enter
     */
    async modifyShift(shiftCode: string, currentLabel: string, newLabel: string): Promise<void> {
        const shiftRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: shiftCode }).nth(2);
        await this.helper.clickElement(shiftRow,                          `Select shift row ${shiftCode}`);
        await this.helper.clickElement(this.cal0101Page.modifyButton,     'Click Modify button');
        const labelInput = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: currentLabel }).getByLabel('Label');
        await this.helper.clickElement(labelInput, `Click label field for shift ${shiftCode}`);
        await this.helper.enterText(labelInput, newLabel, `Update shift label to ${newLabel}`);
        await this.helper.clickElement(this.cal0101Page.validateButton, `Validate modify shift ${shiftCode}`);
        await this.helper.captureScreenshot(`CAL0101_Shift_Modified_${shiftCode}`);
    }

    // ── Modify day type ───────────────────────────────────────────────────────

    /**
     * Selects a day type row by its code, clicks Modify, updates the label, and validates.
     */
    async modifyDayType(dayCode: string, currentLabel: string, newLabel: string): Promise<void> {
        const dayRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: dayCode }).nth(2);
        await this.helper.clickElement(dayRow,                            `Select day type row ${dayCode}`);
        await this.helper.clickElement(this.cal0101Page.modifyButton,     'Click Modify button');
        const labelInput = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: currentLabel }).getByLabel('Label');
        await this.helper.clickElement(labelInput, `Click label field for day type ${dayCode}`);
        await this.helper.enterText(labelInput, newLabel, `Update day type label to ${newLabel}`);
        await this.helper.clickElement(this.cal0101Page.validateButton, `Validate modify day type ${dayCode}`);
        await this.helper.captureScreenshot(`CAL0101_DayType_Modified_${dayCode}`);
    }

    // ── Modify week type ──────────────────────────────────────────────────────

    /**
     * Selects a week type row by its code, clicks Modify, updates the label, and validates.
     */
    async modifyWeekType(weekCode: string, currentLabel: string, newLabel: string): Promise<void> {
        const weekRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: weekCode }).nth(2);
        await this.helper.clickElement(weekRow,                           `Select week type row ${weekCode}`);
        await this.helper.clickElement(this.cal0101Page.modifyButton,     'Click Modify button');
        const labelInput = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: currentLabel, exact: true }).getByLabel('Label');
        await this.helper.clickElement(labelInput, `Click label field for week type ${weekCode}`);
        await this.helper.enterText(labelInput, newLabel, `Update week type label to ${newLabel}`);
        await this.helper.clickElement(this.cal0101Page.validateButton, `Validate modify week type ${weekCode}`);
        await this.helper.captureScreenshot(`CAL0101_WeekType_Modified_${weekCode}`);
    }

    // ── View shift type ───────────────────────────────────────────────────────

    /**
     * Selects a shift by its code in the list, opens the View screen,
     * explores the Father Elements tab, then navigates back.
     */
    async viewShift(shiftCode: string): Promise<void> {
        // Row cell at nth(2) — the code cell appears at index 2 in the list grid
        const shiftRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: shiftCode }).nth(2);
        await this.helper.clickElement(shiftRow,                        `Select shift row ${shiftCode}`);
        await this.helper.clickElement(this.cal0101Page.viewButton,     `Click View for shift ${shiftCode}`);
        await this.helper.captureScreenshot(`CAL0101_Shift_View_${shiftCode}`);
        await this.helper.clickElement(this.cal0101Page.fatherElementsTab, `Click Father Elements tab for shift ${shiftCode}`);
        await this.helper.captureScreenshot(`CAL0101_Shift_FatherElements_${shiftCode}`);
        await this.helper.clickElement(this.cal0101Page.backButton,     `Click Back from shift view ${shiftCode}`);
    }

    // ── View day type ─────────────────────────────────────────────────────────

    /**
     * Selects a day type by its code, opens View, checks Father Elements
     * and Shifts tabs (which list the linked shift types), then navigates back.
     */
    async viewDayType(dayCode: string): Promise<void> {
        const dayRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: dayCode }).nth(2);
        await this.helper.clickElement(dayRow,                           `Select day type row ${dayCode}`);
        await this.helper.clickElement(this.cal0101Page.viewButton,      `Click View for day type ${dayCode}`);
        await this.helper.captureScreenshot(`CAL0101_DayType_View_${dayCode}`);
        await this.helper.clickElement(this.cal0101Page.fatherElementsTab, `Click Father Elements tab for day type ${dayCode}`);
        await this.helper.captureScreenshot(`CAL0101_DayType_FatherElements_${dayCode}`);
        await this.helper.clickElement(this.cal0101Page.shiftsTab,       `Click Shifts tab for day type ${dayCode}`);
        await this.helper.captureScreenshot(`CAL0101_DayType_Shifts_${dayCode}`);
        await this.helper.clickElement(this.cal0101Page.backButton,      `Click Back from day type view ${dayCode}`);
    }

    // ── View week type ────────────────────────────────────────────────────────

    /**
     * Selects a week type by its code, opens View, checks Father Elements
     * tab, then navigates back.
     */
    async viewWeekType(weekCode: string): Promise<void> {
        const weekRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: weekCode }).nth(2);
        await this.helper.clickElement(weekRow,                           `Select week type row ${weekCode}`);
        await this.helper.clickElement(this.cal0101Page.viewButton,       `Click View for week type ${weekCode}`);
        await this.helper.captureScreenshot(`CAL0101_WeekType_View_${weekCode}`);
        // Week types are the top of the hierarchy — no "Father Elements" tab exists.
        // Just capture the view and navigate back.
        await this.helper.clickElement(this.cal0101Page.backButton,       `Click Back from week type view ${weekCode}`);
    }

    // ── UI success message assertion ──────────────────────────────────────────

    /**
     * Asserts that a success message is visible in the main frame after an operation.
     * Examples of messages verified by this method:
     *   "The shift FSM has been created"
     *   "The shift FSM has been modified"
     *   "The week WWQ has been created"
     *   "The day WDK has been created"
     *   "The week DWZ has been deleted"
     */
    async assertSuccessMessage(expectedMessage: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        await this.helper.assertElementHasText(
            main.getByText(expectedMessage, { exact: true }),
            expectedMessage,
            `Verify success message: "${expectedMessage}"`
        );
    }
}
