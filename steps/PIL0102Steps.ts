import { Page, Locator, expect } from '@playwright/test';
import { PIL0102Page } from '../pages/PIL0102Page';

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

export class PIL0102Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private pil0102Page: PIL0102Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.pil0102Page = new PIL0102Page(page);
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

    // ── Navigate to PIL0102 via Process Control menu ──────────────────────────
    async navigateToPIL0102(): Promise<void> {
        const menu = this.page.locator('frame[name="menu"]').contentFrame();

        await this.clickWithHeal(
            this.pil0102Page.processControlMenu,
            [
                menu.getByText('Process Control', { exact: true }),
                menu.getByText('Contrôle des processus', { exact: true }),
                menu.getByText('Pilotage', { exact: true }),
            ],
            'Process Control menu'
        );

        // Wait for menu expansion and any page transitions to settle
        await this.page.waitForLoadState('networkidle').catch(() => undefined);
        await this.page.waitForTimeout(1500);

        await this.clickWithHeal(
            this.pil0102Page.pil0102Option,
            [
                // Exact name confirmed from live app
                menu.getByRole('cell', { name: 'PIL0102 - Lock/unlock production kick-off' }),
                menu.getByText('PIL0102 - Lock/unlock production kick-off', { exact: false }),
                menu.getByText('PIL0102', { exact: false }),
                menu.locator('td').filter({ hasText: 'PIL0102' }).first(),
            ],
            'PIL0102 option'
        );

        await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
        await this.page.waitForTimeout(2000);
    }

    // ── Assert the PIL0102 screen header ─────────────────────────────────────
    async validateScreenHeader(): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        await this.helper.assertElementVisible(
            this.pil0102Page.headerText,
            'PIL0102 header — Set/Remove a lock on engagement (PIL0102)'
        );

        // Also assert the exact text content
        await this.helper.assertElementHasText(
            this.pil0102Page.headerText,
            'Set/Remove a lock on engagement (PIL0102)',
            'PIL0102 header text content'
        );

        console.log('[PIL0102] Header text validated successfully.');
    }

    // ── Open the Set/Remove lock dialog ──────────────────────────────────────
    private async openSetRemoveLockDialog(): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        await this.clickWithHeal(
            this.pil0102Page.setRemoveLockButton,
            [
                main.getByText('Set/Remove lock', { exact: false }),
                main.getByRole('link', { name: 'Set/Remove lock' }),
                main.locator('input[value*="lock"]'),
                main.locator('button').filter({ hasText: /lock/i }),
            ],
            'Set/Remove lock button'
        );

        await this.page.waitForTimeout(1500);
    }

    // ── POSITIVE: Click Set/Remove lock → Submit (no comment) ─────────────────
    async setLockAndSubmit(): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        await this.openSetRemoveLockDialog();

        await this.clickWithHeal(
            this.pil0102Page.submitButton,
            [
                main.getByText('Submit', { exact: true }),
                main.getByRole('button', { name: 'Submit' }),
                main.locator('input[type="submit"]'),
            ],
            'Submit button'
        );

        await this.page.waitForTimeout(2000);
        console.log('[PIL0102] Lock set — submit completed (no comment).');
    }

    // ── NEGATIVE: Click Set/Remove lock → Cancel ──────────────────────────────
    async setLockAndCancel(): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        await this.openSetRemoveLockDialog();

        await this.clickWithHeal(
            this.pil0102Page.cancelButton,
            [
                main.getByText('Cancel', { exact: true }),
                main.getByRole('button', { name: 'Cancel' }),
            ],
            'Cancel button'
        );

        await this.page.waitForTimeout(2000);
        console.log('[PIL0102] Lock dialog cancelled — negative scenario completed.');
    }

    // ── POSITIVE with comment: Click Set/Remove lock → enter comment → Submit ─
    async setLockWithCommentAndSubmit(comment: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        await this.openSetRemoveLockDialog();

        // Enter the comment in the comment field (self-healing)
        const commentLocator = this.pil0102Page.commentField;
        const fallbackComment = main.getByLabel('Comment');
        let resolvedComment: Locator = commentLocator;
        try {
            await commentLocator.waitFor({ state: 'visible', timeout: 5000 });
        } catch {
            console.warn('[HEAL] Primary comment field not found — trying fallback label locator');
            resolvedComment = fallbackComment;
            await resolvedComment.waitFor({ state: 'visible', timeout: 5000 });
        }

        await this.helper.enterText(resolvedComment, comment, 'Comment field');

        await this.clickWithHeal(
            this.pil0102Page.submitButton,
            [
                main.getByText('Submit', { exact: true }),
                main.getByRole('button', { name: 'Submit' }),
                main.locator('input[type="submit"]'),
            ],
            'Submit button after comment entry'
        );

        await this.page.waitForTimeout(2000);
        console.log(`[PIL0102] Lock set with comment "${comment}" — submit completed.`);
    }

    // ── UNLOCK: Navigate back to PIL0102 and submit again to remove lock ───────
    // In Sextent PIL0102 the same "Set/Remove lock" action toggles the lock state.
    async removeLockWithComment(comment: string): Promise<void> {
        const main = this.page.locator('frame[name="main"]').contentFrame();

        await this.openSetRemoveLockDialog();

        // The comment field may or may not be required for unlock — fill if visible
        try {
            const commentLocator = this.pil0102Page.commentField;
            await commentLocator.waitFor({ state: 'visible', timeout: 3000 });
            await this.helper.enterText(commentLocator, comment, 'Unlock comment field');
        } catch {
            console.log('[PIL0102] Comment field not visible for unlock — skipping comment entry.');
        }

        await this.clickWithHeal(
            this.pil0102Page.submitButton,
            [
                main.getByText('Submit', { exact: true }),
                main.getByRole('button', { name: 'Submit' }),
                main.locator('input[type="submit"]'),
            ],
            'Submit button for unlock'
        );

        await this.page.waitForTimeout(2000);
        console.log(`[PIL0102] Lock removed (unlock) with comment "${comment}".`);
    }
}
