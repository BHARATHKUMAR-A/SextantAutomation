import { Page, Locator, expect } from '@playwright/test';
import { RQA0203Page } from '../pages/RQA0203Page';
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

export class RQA0203Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private rqa0203Page: RQA0203Page;

    private static readonly FAMILY_CODE = 'RGFAM';

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.sshHelper   = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.rqa0203Page = new RQA0203Page(page);
    }

    /**
     * Navigate to the RQA0203 screen via the menu.
     */
    async navigateToRQA0203(): Promise<void> {
        await this.helper.clickElement(this.rqa0203Page.referenceData, 'Click on Reference Data menu');
        await this.helper.clickElement(this.rqa0203Page.qualityMenu,   'Click on Quality submenu');
        await this.helper.clickElement(this.rqa0203Page.rqa0203Option, 'Select RQA0203 - Manage reworks');
    }

    /**
     * Submit — selects all dropdowns (workshop, zone, poste, defect) and submits.
     * Returns the dynamically read defect code and zone value.
     */
    async submitRQA0203(): Promise<{ defect: string; zone: string }> {
        await this.navigateToRQA0203();
        await this.helper.clickElement(this.rqa0203Page.workshopPen,    'Click on Workshop pen');
        await this.helper.clickElement(this.rqa0203Page.workshopOption, 'Select Workshop option');
        await this.helper.clickElement(this.rqa0203Page.zonePen,        'Click on Zone pen');
        const zone   = ((await this.rqa0203Page.zoneOption.textContent())   ?? '').trim();
        await this.helper.clickElement(this.rqa0203Page.zoneOption,     `Select Zone option ${zone}`);
        await this.helper.clickElement(this.rqa0203Page.postePen,       'Click on Poste pen');
        await this.helper.clickElement(this.rqa0203Page.posteOption,    'Select Poste option');
        await this.helper.clickElement(this.rqa0203Page.defectPen,      'Click on Defect pen');
        const defect = ((await this.rqa0203Page.defectOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0203Page.defectOption,   `Select Defect option ${defect}`);
        await this.helper.clickElement(this.rqa0203Page.submitButton,   'Click Submit button');
        await this.helper.captureScreenshot('RQA0203_After_Submit');
        return { defect, zone };
    }

    /**
     * Create — clicks Add, fills all rework form fields.
     * Dropdown values (action, piece, resp, carton) are read dynamically from the UI.
     */
    async createRework(description: string): Promise<void> {
        await this.helper.clickElement(this.rqa0203Page.addButton, 'Click Add button');
        await this.helper.clickElement(this.rqa0203Page.actionPen, 'Click on Action pen');
        const action = ((await this.rqa0203Page.actionOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0203Page.actionOption, `Select Action option ${action}`);
        await this.helper.clickElement(this.rqa0203Page.piecePen, 'Click on Piece pen');
        const piece = ((await this.rqa0203Page.pieceOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0203Page.pieceOption, `Select Piece option ${piece}`);
        await this.helper.clickElement(this.rqa0203Page.famillePen, 'Click on Famille pen');
        await this.helper.enterText(this.rqa0203Page.familyTextbox, RQA0203Steps.FAMILY_CODE, `Fill Family code ${RQA0203Steps.FAMILY_CODE}`);
        await this.helper.clickElement(this.rqa0203Page.respPen, 'Click on Resp pen');
        const resp = ((await this.rqa0203Page.respOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0203Page.respOption, `Select Resp option ${resp}`);
        await this.helper.clickElement(this.rqa0203Page.cartonPen, 'Click on Carton pen');
        const carton = ((await this.rqa0203Page.cartonOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0203Page.cartonOption, `Select Carton option ${carton}`);
        await this.helper.enterText(this.rqa0203Page.drDescriptionTextbox, description, `Fill DR Description ${description}`);
        await this.helper.captureScreenshot('RQA0203_After_Create_Filled');
    }

    /**
     * Update — selects the rework row by zone in the results table, clicks Update,
     * fills the new DR Description.
     */
    async updateRework(zone: string, newDescription: string): Promise<void> {
        const reworkRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: zone, exact: true }).nth(4);
        await this.page.waitForTimeout(3000);
        await this.helper.clickElement(reworkRow, `Select rework row ${zone}`);
        await this.helper.clickElement(this.rqa0203Page.updateButton, 'Click Update button');
        await this.helper.enterText(this.rqa0203Page.drDescriptionTextbox, newDescription, `Fill new DR Description ${newDescription}`);
        await this.helper.captureScreenshot('RQA0203_After_Update_Filled');
    }

    /**
     * Delete — selects the rework row by zone in the results table, clicks Delete.
     */
    async deleteRework(zone: string): Promise<void> {
        const reworkRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: zone, exact: true }).nth(4);
        await this.page.waitForTimeout(3000);
        await this.helper.clickElement(reworkRow, `Select rework row ${zone}`);
        await this.helper.clickElement(this.rqa0203Page.deleteButton, 'Click Delete button');
        await this.helper.captureScreenshot('RQA0203_After_Delete_Clicked');
    }

    /**
     * Verify UI success message and backend log after rework creation.
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
            .getByText(`The reworkable defect ${defectCode} / ${defectLabel} was created for the workshop ${workshop}`, { exact: false });
        await successMsg.waitFor({ state: 'visible', timeout: 30000 });
        await this.helper.captureScreenshot('RQA0203_Create_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const createLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Création du défaut retouchable ${defectCode} réalisée`
        );
        expect(logOutput, `Expected create log for rework ${defectCode} by ${userId}`).toMatch(createLogRegex);
        console.log(`[RQA0203] Create log verified for rework ${defectCode} by user ${userId}`);
        await this.helper.captureScreenshot('RQA0203_After_Create_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after rework update.
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
            .getByText(`The reworkable defect ${defectCode} / ${newLabel} was modified for the workshop ${workshop}`, { exact: false });
        await successMsg.waitFor({ state: 'visible', timeout: 30000 });
        await this.helper.captureScreenshot('RQA0203_Update_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const updateLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Modification du défaut retouchable ${defectCode} réalisée`
        );
        expect(logOutput, `Expected update log for rework ${defectCode} by ${userId}`).toMatch(updateLogRegex);
        console.log(`[RQA0203] Update log verified for rework ${defectCode} by user ${userId}`);
        await this.helper.captureScreenshot('RQA0203_After_Update_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after rework deletion.
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
            .getByText(`The reworkable defect ${defectCode} / ${lastLabel} was deleted for the workshop ${workshop}`, { exact: false });
        await successMsg.waitFor({ state: 'visible', timeout: 30000 });
        await this.helper.captureScreenshot('RQA0203_Delete_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const deleteLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Suppression du défaut retouchable ${defectCode} réalisée`
        );
        expect(logOutput, `Expected delete log for rework ${defectCode} by ${userId}`).toMatch(deleteLogRegex);
        console.log(`[RQA0203] Delete log verified for rework ${defectCode} by user ${userId}`);
        await this.helper.captureScreenshot('RQA0203_After_Delete_Log_Verified');
    }
}
