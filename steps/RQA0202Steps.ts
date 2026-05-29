import { Page, Locator, expect } from '@playwright/test';
import { RQA0202Page } from '../pages/RQA0202Page';
import { SshHelper } from '../utils/sshHelper';
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

export class RQA0202Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private rqa0202Page: RQA0202Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.sshHelper   = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.rqa0202Page = new RQA0202Page(page);
    }

    /**
     * Navigate to the RQA0202 screen via the menu.
     */
    async navigateToRQA0202(): Promise<void> {
        await this.helper.clickElement(this.rqa0202Page.referenceData, 'Click on Reference Data menu');
        await this.helper.clickElement(this.rqa0202Page.qualityMenu,   'Click on Quality submenu');
        await this.helper.clickElement(this.rqa0202Page.rqa0202Option, 'Select RQA0202 - Manage defects');
    }

    /**
     * Submit — selects all dropdowns and submits.
     */
    async submitRQA0202(): Promise<{ defect: string; zone: string }> {
        await this.navigateToRQA0202();
        await this.helper.clickElement(this.rqa0202Page.workshopPen,    'Click on Workshop pen');
        await this.helper.clickElement(this.rqa0202Page.workshopOption, 'Select Workshop option');
        await this.helper.clickElement(this.rqa0202Page.zonePen,        'Click on Zone pen');
        const zone   = ((await this.rqa0202Page.zoneOption.textContent())   ?? '').trim();
        await this.helper.clickElement(this.rqa0202Page.zoneOption,     `Select Zone option ${zone}`);
        await this.helper.clickElement(this.rqa0202Page.postePen,       'Click on Poste pen');
        await this.helper.clickElement(this.rqa0202Page.posteOption,    'Select Poste option');
        await this.helper.clickElement(this.rqa0202Page.defectPen,      'Click on Defect pen');
        const defect = ((await this.rqa0202Page.defectOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0202Page.defectOption,   `Select Defect option ${defect}`);
        await this.helper.clickElement(this.rqa0202Page.submitButton,   'Click Submit button');
        await this.helper.captureScreenshot('RQA0202_After_Submit');
        return { defect, zone };
    }

    /**
     * Create — clicks Add, fills DA Description.
     */
    async createDefect(description: string): Promise<void> {
        await this.helper.clickElement(this.rqa0202Page.addButton, 'Click Add button');
        await this.helper.enterText(this.rqa0202Page.daDescriptionTextbox, description, `Fill DA Description ${description}`);
        await this.helper.captureScreenshot('RQA0202_After_Create_Filled');
    }

    /**
     * Update — selects a row by zone, clicks Update, fills new DA Description.
     */
    async updateDefect(zone: string, newDescription: string): Promise<void> {
        const defectRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: zone, exact: true }).nth(2);
        await this.page.waitForTimeout(3000);
        await this.helper.clickElement(defectRow, `Select defect row ${zone}`);
        await this.helper.clickElement(this.rqa0202Page.updateButton, 'Click Update button');
        await this.helper.enterText(this.rqa0202Page.daDescriptionTextbox, newDescription, `Fill new DA Description ${newDescription}`);
        await this.helper.captureScreenshot('RQA0202_After_Update_Filled');
    }

    /**
     * Delete — selects a row by zone, clicks Delete.
     */
    async deleteDefect(zone: string): Promise<void> {
        const defectRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: zone, exact: true }).nth(2);
        await this.page.waitForTimeout(3000);
        await this.helper.clickElement(defectRow, `Select defect row ${zone}`);
        await this.helper.clickElement(this.rqa0202Page.deleteButton, 'Click Delete button');
        await this.helper.captureScreenshot('RQA0202_After_Delete_Clicked');
    }

    /**
     * Verify UI success message and backend log after defect creation.
     */
    async verifyCreateLog(
        verifier: PuttyLogReader,
        userId: string,
        defectCode: string,
        defectLabel: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The declarable defect ${defectCode} / ${defectLabel} was created for the workshop ${workshop}`, { exact: false });
        await successMsg.waitFor({ state: 'visible', timeout: 30000 });
        await this.helper.captureScreenshot('RQA0202_Create_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const createLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Création du défaut annonçable ${defectCode} réalisée`
        );
        expect(logOutput, `Expected create log for defect ${defectCode} by ${userId}`).toMatch(createLogRegex);
        console.log(`[RQA0202] Create log verified for defect ${defectCode} by user ${userId}`);
        await this.helper.captureScreenshot('RQA0202_After_Create_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after defect update.
     */
    async verifyUpdateLog(
        verifier: PuttyLogReader,
        userId: string,
        defectCode: string,
        newLabel: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The declarable defect ${defectCode} / ${newLabel} was modified for the workshop ${workshop}`, { exact: false });
        await successMsg.waitFor({ state: 'visible', timeout: 30000 });
        await this.helper.captureScreenshot('RQA0202_Update_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const updateLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Modification du défaut annonçable ${defectCode} réalisée`
        );
        expect(logOutput, `Expected update log for defect ${defectCode} by ${userId}`).toMatch(updateLogRegex);
        console.log(`[RQA0202] Update log verified for defect ${defectCode} by user ${userId}`);
        await this.helper.captureScreenshot('RQA0202_After_Update_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after defect deletion.
     */
    async verifyDeleteLog(
        verifier: PuttyLogReader,
        userId: string,
        defectCode: string,
        lastLabel: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The declarable defect ${defectCode} / ${lastLabel} was deleted for the workshop ${workshop}`, { exact: false });
        await successMsg.waitFor({ state: 'visible', timeout: 30000 });
        await this.helper.captureScreenshot('RQA0202_Delete_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const deleteLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Suppression du défaut annonçable ${defectCode} réalisée`
        );
        expect(logOutput, `Expected delete log for defect ${defectCode} by ${userId}`).toMatch(deleteLogRegex);
        console.log(`[RQA0202] Delete log verified for defect ${defectCode} by user ${userId}`);
        await this.helper.captureScreenshot('RQA0202_After_Delete_Log_Verified');
    }
}
