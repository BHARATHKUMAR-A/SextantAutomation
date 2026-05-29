import { test }   from '../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper }   from '../../utils/StepHelper';
import { CAL0103Steps } from '../../steps/CAL0103Steps';
import credentials from '../../test-data/credentials.json';

// ── Architecture note ─────────────────────────────────────────────────────────
// CAL0103 manages non-working days for a given calendar type + zone.
// The key engineering challenge is the date picker: it must always select
// TOMORROW, which requires handling month-boundary edge cases:
//   • Regular day      → same month, day + 1
//   • Last of month    → 1st of next month (navigate picker forward one month)
//   • 28 Feb non-leap  → 1 Mar  (needsNextMonth = true)
//   • 29 Feb leap year → 1 Mar  (needsNextMonth = true)
//   • 31 Dec           → 1 Jan  (needsNextMonth = true)
// All date math is done in CAL0103Steps.getTomorrowInfo() using JavaScript's
// built-in Date.setDate() overflow — no manual day-counting.
// ─────────────────────────────────────────────────────────────────────────────

const USER_ID = credentials.Credentials.username;

// ── Shared state (populated by Test 1, used by later tests) ──────────────────
let addedCalType: string;
let addedCalZone: string;
let addedDate:    string;
// ─────────────────────────────────────────────────────────────────────────────

test.describe.serial('CAL0103 - Manage non-working days', () => {

    // ── Test 1: Add a non-working day (happy path) ────────────────────────────

    test('Validation of adding a non-working day for tomorrow\'s date', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0103Steps(page, testInfo, stepHelper);

        await steps.navigateToCAL0103();

        // All values (calType, calZone, date) are read from the UI at runtime —
        // no value is hardcoded in this spec file.
        const result = await steps.addNonWorkingDay();
        addedCalType = result.calType;
        addedCalZone = result.calZone;
        addedDate    = result.date;

        // ── Verify "Modification done" success message ────────────────────────
        await steps.assertModificationDone();
        console.log(`[CAL0103] Test 1 complete — non-working day added: calType=${addedCalType}, calZone=${addedCalZone}, date=${addedDate}, user=${USER_ID}`);

        // Reset the form for a clean state
        await steps.cancel();
    });

    // ── Test 2: Cancel a modification (No path) ──────────────────────────────
    //
    // CAL0103 does NOT display a visible "abandoned" message when clicking No.
    // The confirmation dialog is simply dismissed and the form stays open.
    // Correct assertion: verify "Modification done" is NOT visible
    // (proving the operation was cancelled and not committed).

    test('Validation of clicking No cancels the modification — Modification done not shown', async ({ page }, testInfo) => {
        const stepHelper = new StepHelper(page, testInfo);
        const steps      = new CAL0103Steps(page, testInfo, stepHelper);
        const main       = page.locator('frame[name="main"]').contentFrame();

        await steps.navigateToCAL0103();

        // Follow the add flow but click No instead of Yes
        const { calType, calZone, date } = await steps.abandonModification();

        // ── Verify "Modification done" is NOT visible ─────────────────────────
        // The dialog was dismissed — no change was committed.
        await expect(
            main.getByText('Modification done', { exact: true }),
            '"Modification done" must NOT appear when the user clicks No'
        ).not.toBeVisible();
        console.log(`[CAL0103] Test 2 complete — clicking No cancelled the modification: calType=${calType}, calZone=${calZone}, date=${date}, user=${USER_ID}`);
    });

});
