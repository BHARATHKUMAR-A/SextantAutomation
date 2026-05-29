import { Page, Locator, expect } from '@playwright/test';
import { PIL0101Page } from '../pages/PIL0101Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: Locator, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, selector: string, expectedText: string, label: string): Promise<void>;
    assertElementVisible(locator: Locator, label: string, timeout?: number): Promise<void>;
    assertElementEnabled(locator: Locator, label: string, timeout?: number): Promise<void>;
    assertElementDisabled(element: any, elementName: string, timeout?: number): Promise<boolean>;
}

export class PIL0101Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private pil0101Page: PIL0101Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.pil0101Page = new PIL0101Page(page);
    }

    // ── Self-healing click helper ─────────────────────────────────────────────
    private async clickWithHeal(primary: Locator, fallbacks: Locator[], label: string): Promise<void> {
        for (const locator of [primary, ...fallbacks]) {
            try {
                await locator.waitFor({ state: 'visible', timeout: 5000 });
                await this.helper.clickElement(locator, label);
                return;
            } catch {
                console.warn(`[HEAL] Locator failed for "${label}", trying next strategy...`);
            }
        }
        throw new Error(`[HEAL] All locator strategies exhausted for "${label}". Check iframe, nth(), or selector.`);
    }

    // ── Navigate to PIL0101 via Process Control menu ──────────────────────────
    async navigateToPIL0101(): Promise<void> {
        const menu = this.page.locator('frame[name="menu"]').contentFrame();

        // Self-healing menu click — try English and French labels
        await this.clickWithHeal(
            this.pil0101Page.processControlMenu,
            [
                menu.getByText('Process Control', { exact: true }),
                menu.getByText('Contrôle des processus', { exact: true }),
                menu.getByText('Pilotage', { exact: true }),
            ],
            'Process Control menu'
        );

        await this.page.waitForTimeout(1000);

        // Self-healing option click — menu row may have full or partial name
        await this.clickWithHeal(
            this.pil0101Page.pil0101Option,
            [
                menu.getByText('PIL0101', { exact: false }),
                menu.getByRole('cell', { name: 'PIL0101' }),
                menu.locator('td').filter({ hasText: 'PIL0101' }).first(),
            ],
            'PIL0101 option'
        );

        await this.page.waitForTimeout(2000);
    }

    // ── Assert the PIL0101 screen header is visible ────────────────────────────
    async validateScreenHeader(): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        await this.clickWithHeal(
            this.pil0101Page.headerText,
            [
                main.getByText('Reinitialize the automaton piles', { exact: false }),
                main.getByText('PIL0101', { exact: false }),
            ],
            'PIL0101 header text'
        );

        await this.helper.assertElementVisible(
            this.pil0101Page.headerText,
            'PIL0101 header — Reinitialize the automaton piles (PIL0101)'
        );
        console.log('[PIL0101] Header text validated successfully.');
    }

    // ── Check Submit button state (enabled / disabled) ────────────────────────
    async checkSubmitButtonState(): Promise<{ isEnabled: boolean }> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        // Resolve submit button with fallbacks
        const submitLocator = this.pil0101Page.submitButton;
        const fallbackSubmit = main.getByText('Submit', { exact: true });

        let resolvedButton: Locator = submitLocator;
        try {
            await submitLocator.waitFor({ state: 'visible', timeout: 5000 });
        } catch {
            console.warn('[HEAL] Primary Submit locator not visible — trying fallback text locator');
            resolvedButton = fallbackSubmit;
            await resolvedButton.waitFor({ state: 'visible', timeout: 5000 });
        }

        const isEnabled = await resolvedButton.isEnabled();
        if (isEnabled) {
            console.log('[PIL0101] Submit button is ENABLED.');
            await this.helper.assertElementEnabled(resolvedButton, 'PIL0101 Submit button');
        } else {
            console.log('[PIL0101] Submit button is DISABLED.');
            await this.helper.assertElementDisabled(resolvedButton, 'PIL0101 Submit button');
        }

        return { isEnabled };
    }
}
