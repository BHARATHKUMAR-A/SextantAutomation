import { test }   from '../../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper }   from '../../../utils/StepHelper';
import { SshHelper }    from '../../../utils/sshHelper';
import { CAL0102Steps } from '../../../steps/CAL0102Steps';
import { CAL0102Page }  from '../../../pages/CAL0102Page';
import envConfig   from '../../../test-data/envConfig.json';
import credentials from '../../../test-data/credentials.json';
import { calendarTestState } from '../../../utils/calendarTestState';

// ── Architecture note ─────────────────────────────────────────────────────────
// CAL0102 is intentionally a STANDALONE spec file (not embedded in CAL0101).
// Rationale: test isolation — CAL0102 must be runnable independently.
// When the full suite runs (cal-setup → firefox projects), CAL0101 writes its
// generated weekCode into calendarTestState.weekCode so CAL0102 can select that
// exact week type from the combo.  If CAL0102 runs standalone, calendarTestState
// .weekCode is empty and selectWeekTypeByCode falls back to the first available.
// ─────────────────────────────────────────────────────────────────────────────

const USER_ID = credentials.Credentials.username;

// ── Shared test-data (generated once across all serial tests) ─────────────────
let year1:    string;   // Year selected dynamically for Per Cycle creation
let year2:    string;   // Year selected dynamically for Per Week creation
let weekType: string;   // Week type read dynamically from combo (e.g. CAL0101 output)
let dupCode:  string;   // Unique duplicate Calendar Type code — e.g. CDxxx
let dupLabel: string;   // Unique duplicate Calendar label     — e.g. CAL_DUP_xxx
// ─────────────────────────────────────────────────────────────────────────────

test.describe.serial('CAL0102 - Manage calendars', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        // Generate codes/labels once; the if-guard ensures reuse across all tests
        if (!dupCode) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            const rand = await sshHelper.generateRandomAlphanumeric(3);
            dupCode  = `CD${rand}`;       // 5 chars total — matches CAL0102 Calendar Type format
            dupLabel = `CAL_DUP_${rand}`; // e.g. CAL_DUP_XYZ
        }
    });

    // ── Test 1: Create Per Cycle calendar ─────────────────────────────────────

    test('Validation of creating Per Cycle calendar', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        const result = await steps.createPerCycleCalendar(calendarTestState.weekCode || undefined);
        year1    = result.year;
        weekType = result.weekType;

        console.log(`[CAL0102] Test 1 complete — Per Cycle calendar created. year1=${year1}, weekType=${weekType}, user=${USER_ID}`);
    });

    // ── Test 2: Create Per Week calendar ─────────────────────────────────────

    test('Validation of creating Per Week calendar', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        // The year combo now offers the NEXT available year (year1 is already used),
        // so selectFirstAvailableYear() naturally returns year2 without any hardcoding.
        const result = await steps.createPerWeekCalendar(calendarTestState.weekCode || undefined);
        year2 = result.year;

        console.log(`[CAL0102] Test 2 complete — Per Week calendar created. year2=${year2}, weekType=${result.weekType}, user=${USER_ID}`);
    });

    // ── Test 3: View calendar (all view types) ─────────────────────────────────

    test('Validation of viewing calendar — Per day, Per week, Per month, Per year', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        // View the Per Cycle calendar created in Test 1
        await steps.viewCalendarAllViews(year1);

        console.log(`[CAL0102] Test 3 complete — all views verified for year=${year1}, user=${USER_ID}`);
    });

    // ── Test 4: Modify Per Cycle calendar ─────────────────────────────────────

    test('Validation of modifying Per Cycle calendar', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        await steps.modifyPerCycleCalendar(year1);

        console.log(`[CAL0102] Test 4 complete — Per Cycle calendar modified. year=${year1}, user=${USER_ID}`);
    });

    // ── Test 5: Modify Per Week calendar ─────────────────────────────────────

    test('Validation of modifying Per Week calendar', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        await steps.modifyPerWeekCalendar(year2);

        console.log(`[CAL0102] Test 5 complete — Per Week calendar modified. year=${year2}, user=${USER_ID}`);
    });

    // ── Test 6: Duplicate calendar ────────────────────────────────────────────

    test('Validation of duplicating calendar', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);
        const cal0102Page = new CAL0102Page(page);

        await steps.navigateToCAL0102();

        // Select the Per Cycle calendar row (year1) before duplicating
        const main    = page.locator('frame[name="main"]').contentFrame();
        const yearRow = main.getByRole('cell', { name: year1 }).nth(2);
        await stepHelper.clickElement(yearRow, `Select year ${year1} row before duplicate`);

        await steps.duplicateCalendar(dupCode, dupLabel);

        console.log(`[CAL0102] Test 6 complete — calendar duplicated. dupCode=${dupCode}, dupLabel=${dupLabel}, user=${USER_ID}`);
    });

    // ── Test 7: Delete duplicated calendar year ───────────────────────────────

    test('Validation of deleting duplicated calendar year entry', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        // Select duplicated Calendar Type by label, then select year1 within it, then delete
        await steps.deleteDuplicatedCalendarYear(dupLabel, year1);

        console.log(`[CAL0102] Test 7 complete — year ${year1} deleted from duplicated calendar ${dupLabel}, user=${USER_ID}`);
    });

    // ── Test 8 (Negative): Year already in use should not be available ─────────

    test('Negative — year used for Per Week calendar is not available in Per Cycle creation combo', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        // year2 was used in Test 2 for Per WEEK creation.
        // In Sextent the Per Cycle year combo excludes years that already have
        // a Per Week calendar assigned — so year2 must NOT appear in the combo.
        const { yearStillPresent } = await steps.checkYearAvailabilityForPerCycle(year2);

        expect(yearStillPresent, `year ${year2} (used for Per Week) should NOT be available in the Per Cycle combo`).toBe(false);
        console.log(`[CAL0102] Test 8 (negative) complete — year ${year2} correctly absent from Per Cycle combo, user=${USER_ID}`);
    });

    // ── Test 9: Creation abandoned ────────────────────────────────────────────

    test('Validation of creation abandoned', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        await steps.abandonCreation();

        console.log(`[CAL0102] Test 9 complete — creation abandoned message verified, user=${USER_ID}`);
    });

    // ── Test 10: Modification abandoned ──────────────────────────────────────

    test('Validation of modification abandoned', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        await steps.abandonModification(year1);

        console.log(`[CAL0102] Test 10 complete — modification abandoned message verified, year=${year1}, user=${USER_ID}`);
    });

    // ── Test 11: Deletion abandoned ───────────────────────────────────────────

    test('Validation of deletion abandoned', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0102();
        await steps.abandonDeletion(year1);

        console.log(`[CAL0102] Test 11 complete — deletion abandoned message verified, year=${year1}, user=${USER_ID}`);
    });

    // ── Test 12: Duplication abandoned ───────────────────────────────────────

    test('Validation of duplication abandoned', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);
        const sshHelper  = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);

        const tempRand  = await sshHelper.generateRandomAlphanumeric(3);
        const tempCode  = `CA${tempRand}`;
        const tempLabel = `CAL_ABN_${tempRand}`;

        await steps.navigateToCAL0102();
        await steps.abandonDuplication(year1, tempCode, tempLabel);

        console.log(`[CAL0102] Test 12 complete — duplication abandoned message verified, year=${year1}, tempCode=${tempCode}, user=${USER_ID}`);
    });

    // ── Test 13: Selection criteria filtering and reset ───────────────────────
    //
    // Strategy: apply Calendar Type (first available, dynamic) + Year (= year1,
    // known to be in the list from Test 1) criteria.  After filtering:
    //   • year2 must NOT be visible  → proves year filter is active
    // After reset:
    //   • year2 MUST be visible again → proves Reset restores the full list
    //
    // Screenshots: initial state, before reset (filtered), after reset.

    test('Validation of selection criteria — filtering and reset', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0102Steps(page, testInfo, stepHelper);
        const main       = page.locator('frame[name="main"]').contentFrame();

        await steps.navigateToCAL0102();

        // ── Initial state ────────────────────────────────────────────────────
        await stepHelper.captureScreenshot('CAL0102_Selection_Criteria_Initial');
        // year2 row must be visible before any filter (sanity check)
        const year2Cell = main.getByRole('cell', { name: year2 }).nth(2);
        await expect(year2Cell, `year2 (${year2}) should be visible in the unfiltered list`).toBeVisible();

        // ── Apply criteria (Calendar Type + Year) ────────────────────────────
        const calType = await steps.applyCriteriaCalTypeFilter();
        await steps.applyCriteriaYearFilter(year1);

        // ── Screenshot: filtered state — BEFORE reset ────────────────────────
        await stepHelper.captureScreenshot('CAL0102_Selection_Criteria_Before_Reset');

        // ── Verify list changed: year2 must be absent after year1 filter ─────
        await expect(
            year2Cell,
            `year2 (${year2}) should NOT be visible when year filter = year1 (${year1})`
        ).not.toBeVisible();
        console.log(`[CAL0102] Criteria applied — calType: ${calType}, year: ${year1}. year2 (${year2}) correctly hidden.`);

        // ── Reset all criteria ───────────────────────────────────────────────
        await steps.resetSelectionCriteria();

        // ── Screenshot: restored state — AFTER reset ─────────────────────────
        await stepHelper.captureScreenshot('CAL0102_Selection_Criteria_After_Reset');

        // ── Verify list restored: year2 must reappear ────────────────────────
        await expect(
            year2Cell,
            `year2 (${year2}) should be visible again after criteria reset`
        ).toBeVisible();
        console.log(`[CAL0102] Test 13 complete — selection criteria and reset verified. calType=${calType}, year1=${year1}, year2=${year2}, user=${USER_ID}`);
    });

});

