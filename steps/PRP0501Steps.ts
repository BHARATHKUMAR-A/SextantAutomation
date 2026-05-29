import { Page, Locator, expect } from '@playwright/test';
import { PRP0501Page }    from '../pages/PRP0501Page';
import { SshHelper }      from '../utils/sshHelper';
import { PuttyLogReader } from '../utils/puttyLogReader';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class PRP0501Steps {
    private page:        Page;
    private testInfo:    any;
    private helper:      StepHelper;
    private sshHelper:   SshHelper;
    private prp0501Page: PRP0501Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.sshHelper   = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.prp0501Page = new PRP0501Page(page);
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    async navigateToPRP0501(): Promise<void> {
        await this.helper.captureScreenshot('PRP0501_navigate_to_page');
        await this.helper.clickElement(this.prp0501Page.productionProgrammeMenu, 'Click Production Programme Management menu');
        await this.helper.clickElement(this.prp0501Page.prp0501MenuItem,         'Select PRP0501 - Manage the racks');
    }

    // ── Organ Reference selection ─────────────────────────────────────────────

    /**
     * Opens the Organ Reference combo and dynamically reads + clicks the first
     * available data row (ecwTableV2 pattern: tr[ecwkeyval0] inside ecwTableBody).
     * Returns the selected organ reference text for use in log assertions and logs.
     *
     * Never hardcoded — value is always read from the live DOM at runtime.
     */
    async selectOrganReference(): Promise<string> {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        await this.helper.clickElement(this.prp0501Page.organRefComboPen, 'Open Organ Reference combo');

        // ecwTableV2 renders selectable rows as <tr ecwkeyval0="CODE" onclick="...">
        // inside a .ecwTableBody div.  Click the <tr> (not <td>) so onclick fires.
        const firstRow = main.locator('.ecwTableBody tr[ecwkeyval0]').first();
        const organRef = ((await firstRow.locator('td').first().textContent()) ?? '').trim();
        await this.helper.clickElement(firstRow, `Select organ reference: ${organRef}`);

        console.log(`[PRP0501] Organ reference selected: ${organRef}`);
        return organRef;
    }

    // ── Create rack — Submit path ─────────────────────────────────────────────

    /**
     * Complete rack creation flow:
     *  1. Navigate to PRP0501
     *  2. Click Create
     *  3. Select first available organ reference (dynamic)
     *  4. Enter required quantity
     *  5. Click Submit
     *
     * Returns the selected organ reference for log verification.
     */
    async createRack(quantity: string): Promise<string> {
        await this.navigateToPRP0501();
        await this.helper.clickElement(this.prp0501Page.createButton, 'Click Create button');
        const organRef = await this.selectOrganReference();
        await this.helper.enterText(this.prp0501Page.requiredQuantityInput, quantity, `Enter required quantity: ${quantity}`);
        await this.helper.captureScreenshot(`PRP0501_Before_Submit_qty_${quantity}`);
        await this.helper.clickElement(this.prp0501Page.submitButton, 'Click Submit to create rack');
        await this.helper.captureScreenshot(`PRP0501_After_Submit_${organRef}`);
        console.log(`[PRP0501] Rack creation submitted — organRef: ${organRef}, quantity: ${quantity}`);
        return organRef;
    }

    // ── Cancel rack creation ──────────────────────────────────────────────────

    /**
     * Cancel flow: navigates to PRP0501, opens the create form, selects an organ
     * reference, fills the quantity, then clicks Cancel.
     * Returns the organ reference so the spec can log it.
     */
    async cancelRackCreation(quantity: string): Promise<string> {
        await this.navigateToPRP0501();
        await this.helper.clickElement(this.prp0501Page.createButton, 'Click Create button (cancel flow)');
        const organRef = await this.selectOrganReference();
        await this.helper.enterText(this.prp0501Page.requiredQuantityInput, quantity, `Enter required quantity: ${quantity} (cancel flow)`);
        await this.helper.captureScreenshot(`PRP0501_Before_Cancel_${organRef}`);
        await this.helper.clickElement(this.prp0501Page.cancelButton, 'Click Cancel — abandon creation');
        await this.helper.captureScreenshot(`PRP0501_After_Cancel_${organRef}`);
        console.log(`[PRP0501] Rack creation cancelled — organRef: ${organRef}, quantity: ${quantity}`);
        return organRef;
    }

    // ── UI assertions ─────────────────────────────────────────────────────────

    /**
     * Asserts the 'creation done' success message after a successful Submit.
     */
    async assertCreationDone(): Promise<void> {
        await this.helper.assertElementHasText(
            this.prp0501Page.creationDoneMessage,
            'creation done',
            'Verify "creation done" success message is displayed'
        );
    }

    /**
     * Asserts the 'creation abandoned' message after clicking Cancel.
     */
    async assertCreationAbandoned(): Promise<void> {
        await this.helper.assertElementHasText(
            this.prp0501Page.creationAbandonedMessage,
            'creation abandoned',
            'Verify "creation abandoned" message is displayed'
        );
    }

    // ── PuTTY log verification ────────────────────────────────────────────────

    /**
     * Reads the local PuTTY log and asserts that the rack creation log entry is
     * present for the given organ reference and user.
     *
     * Log regex pattern:
     *   [INFO] ... (userId) ... YYYY-MM-DD HH:MM:SS.mmm ... Création du casier <organRef> réalisée
     *
     * ⚠️  IMPORTANT: Verify the exact French log message by inspecting the PuTTY
     * log after the first test run and update the regex literal if it differs.
     * Common alternatives:
     *   - 'Création du rack ${organRef} réalisée'
     *   - 'Création du support ${organRef} réalisée'
     *   - 'Création du repère organe ${organRef} réalisée'
     */
    async verifyCreateLog(
        verifier:  PuttyLogReader,
        userId:    string,
        organRef:  string,
        tailLines = 80
    ): Promise<void> {
        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);

        const createLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Création du casier ${organRef} réalisée`
        );
        expect(
            logOutput,
            `Expected rack creation log for organRef=${organRef} by user ${userId}`
        ).toMatch(createLogRegex);
        console.log(`[PRP0501] Create log verified for organRef=${organRef} by user ${userId}`);
        await this.helper.captureScreenshot('PRP0501_After_Log_Verified');
    }
}
