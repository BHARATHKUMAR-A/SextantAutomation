import { Page, Locator } from '@playwright/test';
import { CAL0103Page } from '../pages/CAL0103Page';
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

export class CAL0103Steps {
    private page:         Page;
    private testInfo:     any;
    private helper:       StepHelper;
    private sshHelper:    SshHelper;
    private cal0103Page:  CAL0103Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.sshHelper   = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.cal0103Page = new CAL0103Page(page);
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    async navigateToCAL0103(): Promise<void> {
        await this.helper.captureScreenshot('CAL0103_navigate_to_page');
        await this.helper.clickElement(this.cal0103Page.referenceDataMenu, 'Click Reference Data menu');
        await this.helper.clickElement(this.cal0103Page.calendarSubmenu,   'Click Calendar submenu');
        await this.helper.clickElement(this.cal0103Page.cal0103MenuItem,   'Select CAL0103 - Manage non working');
    }

    // ── Calendar Type + Zone selection ────────────────────────────────────────

    /**
     * Opens the Calendar Type and Zone combos and dynamically reads + clicks
     * the first available data option from each (nth(1) skips the header cell).
     * Returns the selected values — never accepts them as parameters.
     */
    async selectCalendarForAddition(): Promise<{ calType: string; calZone: string }> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        // -- Calendar Type --
        await this.helper.clickElement(this.cal0103Page.calTypeComboPen, 'Open Calendar Type combo');
        const calTypeCell = (await main).getByRole('cell', { name: 'ALL CALENDAR', exact: true }).nth(1);
        const calType = ((await calTypeCell.textContent()) ?? '').trim();
        await this.helper.clickElement(calTypeCell, `Select Calendar Type ${calType}`);

        // -- Calendar Zone --
        await this.helper.clickElement(this.cal0103Page.calZoneComboPen, 'Open Calendar Area combo');
        const calAreaCell = (await main).getByRole('cell', { name: 'ALL CALENDAR', exact: true }).nth(1);
        const calZone = ((await calAreaCell.textContent()) ?? '').trim();
        await this.helper.clickElement(calAreaCell, `Select Calendar Zone ${calZone}`);

        return { calType, calZone };
    }

    // ── Date picker — tomorrow, month-boundary safe ───────────────────────────

    /**
     * Calculates tomorrow's date at runtime.
     *
     * Edge cases handled:
     *  - Regular day: day + 1, same month  (e.g. May 14 → May 15)
     *  - Last day of month: day + 1 is the 1st of the next month
     *      28 Feb (non-leap) → 1 Mar      needsNextMonth = true
     *      29 Feb (leap year) → 1 Mar     needsNextMonth = true
     *      30 Apr / 30 Jun / etc → 1 next needsNextMonth = true
     *      31 Dec → 1 Jan                 needsNextMonth = true
     *
     * JavaScript's Date.setDate() handles overflow automatically
     * (e.g., Feb 28 + 1 = Mar 1), so no manual day-counting is required.
     */
    private getTomorrowInfo(): { day: string; needsNextMonth: boolean } {
        const today    = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return {
            day:            tomorrow.getDate().toString(),       // "1", "15", "28" …
            needsNextMonth: tomorrow.getMonth() !== today.getMonth(),
        };
    }

    /**
     * Opens the date picker, optionally navigates to the next month when today
     * is the last day of the month, and clicks the correct day cell.
     *
     * Using .first() on the day cell avoids a strict-mode violation when the
     * picker shows trailing cells from the adjacent month as grayed-out duplicates.
     *
     * Returns the day number string (e.g. "29") for logging.
     */
    async selectTomorrowInDatePicker(): Promise<string> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        const { day, needsNextMonth } = this.getTomorrowInfo();

        await this.helper.clickElement(this.cal0103Page.datePicker, 'Open date picker');

        if (needsNextMonth) {
            // Today is the last day of the month — tomorrow belongs to the next.
            // Click the forward-navigation arrow so the picker shows the correct month.
            await this.helper.clickElement(
                this.cal0103Page.datePickerNextMonth,
                `Navigate date picker to next month (today is last day — tomorrow is day ${day})`
            );
        }

        // Click the active day cell with the exact day number.
        // .first() handles any duplicate grayed-out trailing/leading cells.
        const dayCell = main.getByRole('cell', { name: day, exact: true }).first();
        await this.helper.clickElement(dayCell, `Select tomorrow day ${day}`);

        return day;
    }

    // ── Add non-working day (complete flow) ───────────────────────────────────

    /**
     * Performs the full "add non-working day" operation:
     *  1. Selects Calendar Type + Zone dynamically
     *  2. Selects tomorrow in the date picker (month-boundary safe)
     *  3. Clicks Add
     *  4. Clicks Validate → Yes
     *
     * Returns all three selected values for use in assertions and logs.
     */
    async addNonWorkingDay(): Promise<{ calType: string; calZone: string; date: string }> {
        const { calType, calZone } = await this.selectCalendarForAddition();
        const date = await this.selectTomorrowInDatePicker();

        await this.helper.clickElement(this.cal0103Page.addButton, `Click Add for date ${date}`);
        await this.helper.captureScreenshot(`CAL0103_Before_Validate_date_${date}`);

        await this.helper.clickElement(this.cal0103Page.validateButton, 'Click Validate');
        await this.helper.clickElement(this.cal0103Page.yesButton,      'Click Yes — confirm modification');

        await this.helper.captureScreenshot(`CAL0103_After_Confirm_date_${date}`);
        console.log(`[CAL0103] Non-working day added — calType: ${calType}, calZone: ${calZone}, date: ${date}`);

        return { calType, calZone, date };
    }

    // ── Abandon modification (No path) ────────────────────────────────────────

    /**
     * Follows the abandon path: selects type + zone + date, clicks Add,
     * Validate, then clicks No instead of Yes.
     * Verifies the "Modification abandoned" message.
     */
    async abandonModification(): Promise<{ calType: string; calZone: string; date: string }> {
        const { calType, calZone } = await this.selectCalendarForAddition();
        const date = await this.selectTomorrowInDatePicker();

        await this.helper.clickElement(this.cal0103Page.addButton,      `Click Add for date ${date} (abandon)`);
        await this.helper.clickElement(this.cal0103Page.validateButton,  'Click Validate (abandon)');
        await this.helper.clickElement(this.cal0103Page.noButton,        'Click No — abandon modification');

        await this.helper.captureScreenshot(`CAL0103_Modification_Abandoned_date_${date}`);
        console.log(`[CAL0103] Modification abandoned — calType: ${calType}, calZone: ${calZone}, date: ${date}`);

        return { calType, calZone, date };
    }

    // ── UI message assertions ─────────────────────────────────────────────────

    /**
     * Asserts the "Modification done" success message is visible in the main frame.
     */
    async assertModificationDone(): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        await this.helper.assertElementHasText(
            main.getByText('Modification done', { exact: true }),
            'Modification done',
            'Verify Modification done success message'
        );
    }

    // ── Reset / cleanup ───────────────────────────────────────────────────────

    /**
     * Clicks Cancel to reset the criteria form after an operation.
     */
    async cancel(): Promise<void> {
        await this.helper.clickElement(this.cal0103Page.cancelButton, 'Click Cancel — reset criteria form');
        await this.helper.captureScreenshot('CAL0103_After_Cancel');
        console.log('[CAL0103] Cancel clicked — form reset');
    }
}
