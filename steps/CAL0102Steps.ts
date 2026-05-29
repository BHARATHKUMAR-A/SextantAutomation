import { Page, Locator, expect } from '@playwright/test';
import { CAL0102Page } from '../pages/CAL0102Page';
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

export class CAL0102Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private cal0102Page: CAL0102Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.cal0102Page = new CAL0102Page(page);
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    async navigateToCAL0102(): Promise<void> {
        await this.helper.captureScreenshot('navigate_to_page');
        await this.helper.clickElement(this.cal0102Page.referenceDataMenu, 'Click Reference Data menu');
        await this.helper.clickElement(this.cal0102Page.calendarSubmenu, 'Click Calendar submenu');
        await this.helper.clickElement(this.cal0102Page.cal0102MenuItem, 'Select CAL0102 - Manage calendars');
    }

    // ── Dynamic helpers ───────────────────────────────────────────────────────

    /**
     * Opens the year combo and returns the first available year by reading
     * the cell text dynamically — no year value is ever hardcoded.
     * Targets the first selectable row in .ecwTableBody (the scrollable body
     * table inside #listAnneeCombo). The onclick handler is on <tr ecwkeyval0>,
     * not on the <td> child, so we click the row directly.
     */
    async selectFirstAvailableYear(): Promise<string> {
        await this.helper.clickElement(this.cal0102Page.yearComboPen, 'Open year combo');
        const main = this.page.locator('frame[name="main"]').contentFrame();
        // The ecwTableV2 combo renders data rows as <tr ecwkeyval0="YYYY" onclick="...">
        // inside a .ecwTableBody div. We click the tr (not the td) so the onclick fires.
        const yearRow = main.locator('#listAnneeCombo .ecwTableBody tr[ecwkeyval0]').first();
        const year = ((await yearRow.locator('td').first().textContent()) ?? '').trim();
        await this.helper.clickElement(yearRow, `Select year ${year}`);
        return year;
    }

    /**
     * Opens the week-type combo and selects a specific week type by code when
     * `targetCode` is provided (e.g. the code created by CAL0101 and shared via
     * calendarTestState).  Falls back to the first available row when omitted.
     * Matching uses Playwright's hasText filter on the row cells so it is
     * independent of the internal ecwkeyval0 attribute value.
     */
    async selectWeekTypeByCode(targetCode?: string): Promise<string> {
        await this.helper.clickElement(this.cal0102Page.weekTypeComboPen, 'Open week type combo');
        const main = this.page.locator('frame[name="main"]').contentFrame();
        const allRows = main.locator('#listSemainesTypesCombo .ecwTableBody tr[ecwkeyval0]');
        // ecwkeyval0 attribute holds the week code directly (e.g. "WWB", "S108")
        const weekTypeRow = targetCode
            ? main.locator(`#listSemainesTypesCombo .ecwTableBody tr[ecwkeyval0="${targetCode}"]`)
            : allRows.first();
        const weekType = ((await weekTypeRow.locator('td').first().textContent()) ?? '').trim(); await this.helper.clickElement(weekTypeRow, `Select week type ${weekType}`);
        return weekType;

    }

    /**
     * Ctrl+clicks a locator — used for multi-select of cycle weeks (S00, S52).
     * StepHelper.clickElement does not support modifier keys, so this internal
     * helper is used exclusively for that case.
     */
    private async ctrlClick(locator: Locator, description: string): Promise<void> {
        console.log(`⌛ Waiting for ${description} to be visible`);
        await locator.waitFor({ state: 'visible' });
        console.log(`🖱️  Ctrl+Clicking on ${description}`);
        await locator.click({ modifiers: ['ControlOrMeta'] });
        console.log(`✅ Successfully ctrl+clicked on ${description}`);
    }

    // ── Create operations ─────────────────────────────────────────────────────

    /**
     * Creates a Per-Cycle calendar for the first available year and week type.
     * Selects the first (S00) and last (S52) cycle weeks, assigns them, validates.
     * Returns the dynamically-chosen year and week type for use in later tests.
     */
    async createPerCycleCalendar(targetWeekCode?: string): Promise<{ year: string; weekType: string }> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        await this.helper.clickElement(this.cal0102Page.addButton, 'Click Add button');
        await this.helper.clickElement(this.cal0102Page.perCycleCreateOption, 'Select Per Cycle creation type');

        const year = await this.selectFirstAvailableYear();
        const weekType = await this.selectWeekTypeByCode(targetWeekCode);

        // Add one cycle row, then Ctrl+click the first (S00) and last (S52) weeks
        await this.helper.clickElement(this.cal0102Page.addCycleButton, 'Add cycle row');

        // S00 = first week of year; S52 = last.  nth(2) per codegen = cycle panel occurrence.
        const s00Cell = main.getByRole('cell', { name: 'S00' }).nth(2);
        const s52Cell = main.getByRole('cell', { name: 'S52' }).nth(2);
        await this.ctrlClick(s00Cell, 'Ctrl+select cycle week S00');
        await this.ctrlClick(s52Cell, 'Ctrl+select cycle week S52');

        await this.helper.clickElement(this.cal0102Page.assignButton, 'Assign weeks to cycle');
        await this.helper.clickElement(this.cal0102Page.validateButton, 'Validate Per Cycle calendar');
        await this.helper.clickElement(this.cal0102Page.yesButton, 'Confirm Per Cycle calendar creation');

        await this.helper.captureScreenshot(`CAL0102_PerCycle_Created_${year}`);
        console.log(`[CAL0102] Per Cycle calendar created — year: ${year}, weekType: ${weekType}`);
        return { year, weekType };
    }

    /**
     * Creates a Per-Week calendar for the next available year and first week type.
     * Uses "Select All" to assign every week of the year.
     * Returns the dynamically-chosen year and week type.
     */
    async createPerWeekCalendar(targetWeekCode?: string): Promise<{ year: string; weekType: string }> {
        await this.helper.clickElement(this.cal0102Page.addButton, 'Click Add button');
        await this.helper.clickElement(this.cal0102Page.perWeekCreateOption, 'Select Per Week creation type');

        const year = await this.selectFirstAvailableYear();
        const weekType = await this.selectWeekTypeByCode(targetWeekCode);

        await this.helper.clickElement(this.cal0102Page.selectAllButton, 'Select All weeks');
        await this.helper.clickElement(this.cal0102Page.assignButton, 'Assign all weeks');
        await this.helper.clickElement(this.cal0102Page.validateButton, 'Validate Per Week calendar');
        await this.helper.clickElement(this.cal0102Page.yesButton, 'Confirm Per Week calendar creation');

        await this.helper.captureScreenshot(`CAL0102_PerWeek_Created_${year}`);
        console.log(`[CAL0102] Per Week calendar created — year: ${year}, weekType: ${weekType}`);
        return { year, weekType };
    }

    // ── View operations ───────────────────────────────────────────────────────

    /**
     * Selects the calendar row for the given year and opens all four view types
     * (Per day, Per week, Per month, Per year) in sequence, quitting after each.
     */
    async viewCalendarAllViews(year: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        const yearRow = main.getByRole('cell', { name: year }).nth(2);

        // Per day
        await this.helper.clickElement(yearRow, `Select calendar year row ${year}`);
        await this.helper.clickElement(this.cal0102Page.consultButton, 'Click Consult button');
        await this.helper.clickElement(this.cal0102Page.perDayConsultOption, 'Select Per day view');
        await this.helper.captureScreenshot(`CAL0102_View_PerDay_${year}`);
        await this.helper.clickElement(this.cal0102Page.quitButton, 'Quit Per day view');

        // Per week
        await this.helper.clickElement(yearRow, `Re-select year row ${year}`);
        await this.helper.clickElement(this.cal0102Page.consultButton, 'Click Consult button');
        await this.helper.clickElement(this.cal0102Page.perWeekConsultOption, 'Select Per week view');
        await this.helper.captureScreenshot(`CAL0102_View_PerWeek_${year}`);
        await this.helper.clickElement(this.cal0102Page.quitButton, 'Quit Per week view');

        // Per month
        await this.helper.clickElement(yearRow, `Re-select year row ${year}`);
        await this.helper.clickElement(this.cal0102Page.consultButton, 'Click Consult button');
        await this.helper.clickElement(this.cal0102Page.perMonthConsultOption, 'Select Per month view');
        await this.helper.captureScreenshot(`CAL0102_View_PerMonth_${year}`);
        await this.helper.clickElement(this.cal0102Page.backButton, 'Back from Per month view');

        // Per year
        await this.helper.clickElement(yearRow, `Re-select year row ${year}`);
        await this.helper.clickElement(this.cal0102Page.consultButton, 'Click Consult button');
        await this.helper.clickElement(this.cal0102Page.perYearConsultOption, 'Select Per year view');
        await this.helper.captureScreenshot(`CAL0102_View_PerYear_${year}`);
        // The per-year calendar view keeps an EcwUnderLay overlay visible that intercepts
        // pointer events on the Quit button.  dispatchEvent fires the onclick handler
        // directly on the span, bypassing the overlay entirely.
        const mainFrame = this.page.locator('frame[name="main"]').contentFrame();
        await mainFrame.getByTitle('Quit(ESC)').dispatchEvent('click');
        console.log('[CAL0102] ✅ Dispatched click on Quit Per year view (bypassed EcwUnderLay)');

        console.log(`[CAL0102] Calendar viewed (all views) — year: ${year}`);
    }

    // ── Modify operations ─────────────────────────────────────────────────────

    /**
     * Selects the row for the given year, opens Modify → Per Cycle,
     * validates and confirms.  The modification re-assigns the same cycle
     * (no data change needed — the intent is exercising the modify flow).
     */
    async modifyPerCycleCalendar(year: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        const yearRow = main.getByRole('cell', { name: year }).nth(2);

        await this.helper.clickElement(yearRow, `Select year row ${year} for modify`);
        await this.helper.clickElement(this.cal0102Page.modifyButton, 'Click Modify button');
        await this.helper.clickElement(this.cal0102Page.perCycleModifyOption, 'Select Per Cycle modify type');
        await this.helper.captureScreenshot(`CAL0102_Modify_PerCycle_${year}`);
        await this.helper.clickElement(this.cal0102Page.validateButton, 'Validate Per Cycle modify');
        await this.helper.clickElement(this.cal0102Page.yesButton, 'Confirm Per Cycle modify');

        await this.helper.captureScreenshot(`CAL0102_PerCycle_Modified_${year}`);
        console.log(`[CAL0102] Per Cycle calendar modified — year: ${year}`);
    }

    /**
     * Selects the row for the given year, opens Modify → Per week,
     * validates and confirms.
     */
    async modifyPerWeekCalendar(year: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        const yearRow = main.getByRole('cell', { name: year }).nth(2);

        await this.helper.clickElement(yearRow, `Select year row ${year} for modify`);
        await this.helper.clickElement(this.cal0102Page.modifyButton, 'Click Modify button');
        await this.helper.clickElement(this.cal0102Page.perWeekModifyOption, 'Select Per week modify type');
        await this.helper.captureScreenshot(`CAL0102_Modify_PerWeek_${year}`);
        await this.helper.clickElement(this.cal0102Page.validateButton, 'Validate Per Week modify');
        await this.helper.clickElement(this.cal0102Page.yesButton, 'Confirm Per Week modify');

        await this.helper.captureScreenshot(`CAL0102_PerWeek_Modified_${year}`);
        console.log(`[CAL0102] Per Week calendar modified — year: ${year}`);
    }

    // ── Duplicate operation ───────────────────────────────────────────────────

    /**
     * Duplicates the currently selected calendar into a new Calendar Type with
     * the supplied dynamic code and label.
     * Returns the code and label so the spec can use them for the delete test.
     */
    async duplicateCalendar(newCode: string, newLabel: string): Promise<void> {
        await this.helper.clickElement(this.cal0102Page.duplicateButton, 'Click Duplicate button');
        await this.helper.enterText(this.cal0102Page.dupCalendarTypeInput, newCode, `Fill duplicate Calendar Type code ${newCode}`);
        await this.helper.enterText(this.cal0102Page.dupCalendarLabelInput, newLabel, `Fill duplicate Calendar label ${newLabel}`);
        await this.helper.clickElement(this.cal0102Page.validateButton, 'Validate duplication');
        await this.helper.clickElement(this.cal0102Page.yesButton, 'Confirm duplication');

        await this.helper.captureScreenshot(`CAL0102_Duplicated_${newCode}`);
        console.log(`[CAL0102] Calendar duplicated — code: ${newCode}, label: ${newLabel}`);
    }

    // ── Delete operation ──────────────────────────────────────────────────────

    /**
     * Selects the duplicated calendar entry by its label, then selects the
     * given year row within it, and deletes that year entry.
     */
    async deleteDuplicatedCalendarYear(calLabel: string, year: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        // Select the duplicated Calendar Type row (by label)
        const calRow = main.getByRole('cell', { name: calLabel }).nth(2);
        await this.helper.clickElement(calRow, `Select duplicated calendar row by label ${calLabel}`);

        // Within it, select the year entry
        const yearRow = main.getByRole('cell', { name: year }).nth(2);
        await this.helper.clickElement(yearRow, `Select year ${year} within duplicated calendar`);

        // Delete
        await this.helper.clickElement(this.cal0102Page.deleteButton, `Click Delete for year ${year}`);
        await this.helper.clickElement(this.cal0102Page.validateButton, `Validate deletion of ${year}`);
        await this.helper.clickElement(this.cal0102Page.yesButton, `Confirm deletion of ${year}`);

        await this.helper.captureScreenshot(`CAL0102_Year_Deleted_${year}_from_${calLabel}`);
        console.log(`[CAL0102] Year ${year} deleted from duplicated calendar ${calLabel}`);
    }

    // ── Negative scenario helper ───────────────────────────────────────────────

    /**
     * Attempts to create a Per-Cycle calendar for a year that is already in use.
     * Opens the creation form, opens the year dropdown, and checks whether the
     * given year is still selectable.
     * Returns `{ yearStillPresent: boolean }` so the spec can assert.
     * Closes the form without saving regardless of outcome.
     */
    async checkYearAvailabilityForPerCycle(year: string): Promise<{ yearStillPresent: boolean }> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        await this.helper.clickElement(this.cal0102Page.addButton, 'Click Add (negative test)');
        await this.helper.clickElement(this.cal0102Page.perCycleCreateOption, 'Select Per Cycle (negative test)');
        await this.helper.clickElement(this.cal0102Page.yearComboPen, 'Open year combo (negative test)');

        // Look for the already-used year inside the dropdown container
        const usedYearCell = main
            .locator('#listAnneeCombo')
            .getByRole('cell')
            .filter({ hasText: year });

        const yearStillPresent = (await usedYearCell.count()) > 0;
        await this.helper.captureScreenshot(`CAL0102_Negative_YearCheck_${year}`);

        // Close the form without saving
        await this.helper.clickElement(this.cal0102Page.quitButton, 'Quit creation form (negative test cleanup)');

        console.log(`[CAL0102] Negative check — year ${year} still in dropdown: ${yearStillPresent}`);
        return { yearStillPresent };
    }

    // ── UI message assertion ──────────────────────────────────────────────────

    /**
     * Asserts that a message (success or abandoned) is visible in the main frame.
     */
    async assertMessage(expectedMessage: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        await this.helper.assertElementHasText(
            main.getByText(expectedMessage, { exact: true }),
            expectedMessage,
            `Verify message: "${expectedMessage}"`
        );
    }

    // ── Abandon flows ─────────────────────────────────────────────────────────

    /**
     * Starts a Per-Cycle calendar creation, reaches the Yes/No confirmation,
     * clicks No, and verifies the "creation abandoned" message.
     */
    async abandonCreation(): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        await this.helper.clickElement(this.cal0102Page.addButton, 'Click Add (abandon creation)');
        await this.helper.clickElement(this.cal0102Page.perCycleCreateOption, 'Select Per Cycle (abandon creation)');
        await this.selectFirstAvailableYear();
        await this.selectWeekTypeByCode(undefined);
        await this.helper.clickElement(this.cal0102Page.addCycleButton, 'Add cycle row (abandon creation)');
        const s00Cell = main.getByRole('cell', { name: 'S00' }).nth(2);
        await this.ctrlClick(s00Cell, 'Ctrl+select S00 (abandon creation)');
        await this.helper.clickElement(this.cal0102Page.assignButton, 'Assign weeks (abandon creation)');
        await this.helper.clickElement(this.cal0102Page.validateButton, 'Validate (abandon creation)');
        await this.helper.clickElement(this.cal0102Page.noButton, 'Click No — abandon creation');
        await this.assertMessage('creation abandoned');
        await this.helper.captureScreenshot('CAL0102_Creation_Abandoned');
        console.log('[CAL0102] creation abandoned — message verified');
    }

    /**
     * Selects the given year row, starts a Per-Cycle modification,
     * clicks No on the confirmation, and verifies "Modification abandoned".
     */
    async abandonModification(year: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        const yearRow = main.getByRole('cell', { name: year }).nth(2);
        await this.helper.clickElement(yearRow, `Select year row ${year} (abandon modification)`);
        await this.helper.clickElement(this.cal0102Page.modifyButton, 'Click Modify (abandon modification)');
        await this.helper.clickElement(this.cal0102Page.perCycleModifyOption, 'Select Per Cycle (abandon modification)');
        await this.helper.clickElement(this.cal0102Page.validateButton, 'Validate (abandon modification)');
        await this.helper.clickElement(this.cal0102Page.noButton, 'Click No — abandon modification');
        await this.assertMessage('Modification abandoned');
        await this.helper.captureScreenshot(`CAL0102_Modification_Abandoned_${year}`);
        console.log(`[CAL0102] Modification abandoned — year: ${year}, message verified`);
    }

    /**
     * Selects the given year row, starts a deletion, clicks No on the
     * confirmation, and verifies "Deletion abandoned".
     */
    async abandonDeletion(year: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        const yearRow = main.getByRole('cell', { name: year }).nth(2);
        await this.helper.clickElement(yearRow, `Select year row ${year} (abandon deletion)`);
        await this.helper.clickElement(this.cal0102Page.deleteButton, 'Click Delete (abandon deletion)');
        await this.helper.clickElement(this.cal0102Page.validateButton, 'Validate (abandon deletion)');
        await this.helper.clickElement(this.cal0102Page.noButton, 'Click No — abandon deletion');
        await this.assertMessage('Deletion abandoned');
        await this.helper.captureScreenshot(`CAL0102_Deletion_Abandoned_${year}`);
        console.log(`[CAL0102] Deletion abandoned — year: ${year}, message verified`);
    }

    /**
     * Selects the given year row, starts a duplication with temporary (never-
     * persisted) code and label, clicks No on the confirmation, and verifies
     * "Duplication abandoned".
     */
    async abandonDuplication(year: string, tempCode: string, tempLabel: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        const yearRow = main.getByRole('cell', { name: year }).nth(2);
        await this.helper.clickElement(yearRow, `Select year row ${year} (abandon duplication)`);
        await this.helper.clickElement(this.cal0102Page.duplicateButton, 'Click Duplicate (abandon duplication)');
        await this.helper.enterText(this.cal0102Page.dupCalendarTypeInput, tempCode, `Fill temp code ${tempCode} (abandon duplication)`);
        await this.helper.enterText(this.cal0102Page.dupCalendarLabelInput, tempLabel, `Fill temp label ${tempLabel} (abandon duplication)`);
        await this.helper.clickElement(this.cal0102Page.validateButton, 'Validate (abandon duplication)');
        await this.helper.clickElement(this.cal0102Page.noButton, 'Click No — abandon duplication');
        await this.assertMessage('Duplication abandoned');
        await this.helper.captureScreenshot(`CAL0102_Duplication_Abandoned_${year}`);
        console.log(`[CAL0102] Duplication abandoned — year: ${year}, tempCode: ${tempCode}, message verified`);
    }

    // ── Selection criteria ────────────────────────────────────────────────────

    /**
     * Opens the Calendar Type criteria combo and dynamically reads + clicks the
     * first available data option (row 0 = header, row 1 = first data entry).
     * Returns the selected Calendar Type text so the spec can log it.
     */
    async applyCriteriaCalTypeFilter(): Promise<string> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        await this.helper.clickElement(this.cal0102Page.criteriaCalTypePen, 'Open Calendar Type criteria combo');
        // #codeCalTypeTable renders one row per type; nth(1) skips the header row
        const calTypeCell = main.locator('#codeCalTypeTable').getByRole('cell').nth(1);
        const calType = ((await calTypeCell.textContent()) ?? '').trim();
        await this.helper.clickElement(calTypeCell, `Select criteria Calendar Type: ${calType}`);
        console.log(`[CAL0102] Calendar Type filter applied: ${calType}`);
        return calType;
    }

    /**
     * Opens the Year criteria combo and selects the exact year passed in.
     * The year is always a runtime variable (e.g. year1 from Test 1) — never
     * hardcoded — so the filter is deterministic within the serial test sequence.
     */
    async applyCriteriaYearFilter(targetYear: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        await this.helper.clickElement(this.cal0102Page.criteriaYearPen, 'Open Year criteria combo');
        // The year filter combo renders rows with the year as cell text
        const yearCell = main.locator('#anneeCodeBox').getByRole('cell', { name: targetYear, exact: true }).first();
        await this.helper.clickElement(yearCell, `Select criteria Year: ${targetYear}`);
        console.log(`[CAL0102] Year filter applied: ${targetYear}`);
    }

    /**
     * Clicks the Reset button to clear all selection criteria and restore the
     * complete, unfiltered calendar list.
     */
    async resetSelectionCriteria(): Promise<void> {
        await this.helper.clickElement(this.cal0102Page.resetButton, 'Click Reset selection criteria');
        console.log('[CAL0102] Selection criteria reset — full list restored');
    }
}
