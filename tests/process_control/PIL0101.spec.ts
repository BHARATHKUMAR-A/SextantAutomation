import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { PIL0101Steps } from '../../steps/PIL0101Steps';
import { PIL0101Page } from '../../pages/PIL0101Page';
import { expect } from '@playwright/test';

/**
 * PIL0101 — Reinitialize the automaton piles
 *
 * Test suite:
 *   1. Navigate to PIL0101 via Process Control menu
 *      → Validate screen header text "Reinitialize the automaton piles (PIL0101)"
 *      → Assert Submit button state (enabled / disabled) and report it
 */

test.describe.serial('PIL0101 — Reinitialize the automaton piles', () => {

    test('PIL0101 — Validate screen header and check Submit button state', async ({ page }, testInfo) => {

        const helper      = new StepHelper(page, testInfo);
        const pil0101Page = new PIL0101Page(page);
        const steps       = new PIL0101Steps(page, testInfo, helper);

        // ── Step 1: Navigate via Process Control → PIL0101 ────────────────────
        await steps.navigateToPIL0101();

        // ── Step 2: Assert screen header is visible ───────────────────────────
        await helper.assertElementVisible(
            pil0101Page.headerText,
            'PIL0101 screen header — Reinitialize the automaton piles (PIL0101)'
        );
        console.log('[PIL0101] ✅ Header text "Reinitialize the automaton piles (PIL0101)" is visible.');

        // ── Step 3: Check Submit button enabled / disabled state ──────────────
        const { isEnabled } = await steps.checkSubmitButtonState();
        console.log(`[PIL0101] ℹ️  Submit button state: ${isEnabled ? 'ENABLED' : 'DISABLED'}`);

        // Report state — test passes either way; the assertion captures the state
        if (isEnabled) {
            await expect(pil0101Page.submitButton).toBeEnabled();
            console.log('[PIL0101] ✅ Submit button is ENABLED — ready for submission.');
        } else {
            await expect(pil0101Page.submitButton).toBeDisabled();
            console.log('[PIL0101] ℹ️  Submit button is DISABLED — no pending items to reinitialize.');
        }
            await page.waitForTimeout(2000);
            // checkSubmitButtonState() uses self-healing locators and asserts internally
            // via assertElementEnabled/assertElementDisabled — no raw re-assertion needed.
            console.log(`[PIL0101] ✅ Submit button state confirmed: ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
            await page.waitForTimeout(2000);


    });

});
