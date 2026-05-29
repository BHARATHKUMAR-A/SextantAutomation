import { Page, Locator, expect } from '@playwright/test';
import { RQA0201Page } from '../pages/RQA0201Page';
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

export class RQA0201Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private rqa0201Page: RQA0201Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.sshHelper   = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.rqa0201Page = new RQA0201Page(page);
    }

    /**
     * Navigate to the RQA0201 screen via the menu.
     * Reference data → Quality → RQA0201 - Manage elementary
     */
    async navigateToRQA0201(): Promise<void> {
        await this.helper.clickElement(this.rqa0201Page.referenceData, 'Click on Reference Data menu');
        await this.helper.clickElement(this.rqa0201Page.qualityMenu,   'Click on Quality submenu');
        await this.helper.clickElement(this.rqa0201Page.rqa0201Option, 'Select RQA0201 - Manage elementary');
    }

    /**
     * Submit — selects workshop, picks option, then clicks the search submit.
     * @param workshop  Workshop code to select (e.g. 'EBAS1')
     */
    async submitRQA0201(workshop: string): Promise<void> {
        await this.navigateToRQA0201();
        await this.helper.clickElement(this.rqa0201Page.workshopPen,    'Click on Workshop pen');
        await this.helper.clickElement(this.rqa0201Page.workshopOption, `Select Workshop option ${workshop}`);
        await this.helper.clickElement(this.rqa0201Page.submitButton,   'Click Submit button');
        await this.helper.captureScreenshot('RQA0201_After_Submit');
    }

    /**
     * Create — clicks Add, fills the Label field.
     * @param defectLabel  Label text to fill (e.g. 'TEST_ABC')
     */
    async createDefect(defectCode: string): Promise<void> {
        await this.helper.clickElement(this.rqa0201Page.addButton, 'Click Add button');
        await this.helper.enterText(this.rqa0201Page.codeTextBox, defectCode, `Fill Code ${defectCode}`);
        await this.helper.enterText(this.rqa0201Page.labelTextbox, 'TESTLABEL_', `Fill Label`);
        await this.helper.captureScreenshot('RQA0201_After_Create_Filled');
    }

    /**
     * Update — selects a defect row by its current label, clicks Update, fills new label.
     * @param defectLabel  Current label shown in the table
     * @param newLabel     New label to fill in the form
     */
    async updateDefect(defectCode: string, newLabel: string): Promise<void> {
        const defectRow = this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: defectCode }).nth(3);
        console.log(defectRow);
        await this.page.waitForTimeout(3000);
            if (!await defectRow.isVisible()) {
                for (let i = 0; i < 5; i++) {
                await this.helper.clickElement(this.rqa0201Page.nextPageButton, 'Click Next page to see if created defect is there');
                    if (await defectRow.isVisible()) {                
                        await this.helper.clickElement(defectRow, `Select defect row ${defectCode}`);
                        break;
                    }
                await this.page.waitForTimeout(3000);}
            }else {
                await this.helper.clickElement(defectRow, `Select defect row ${defectCode}`);
            }
        await this.page.waitForTimeout(3000);
        await this.helper.clickElement(this.rqa0201Page.updateButton, 'Click Update button');
        await this.helper.enterText(this.rqa0201Page.labelTextbox, newLabel, `Fill new Label ${newLabel}`);
        await this.helper.captureScreenshot('RQA0201_After_Update_Filled');
    }

    /**
     * Delete — selects a defect row by its code, clicks Delete.
     * @param defectCode  Code of the defect to delete
     */
    async deleteDefect(defectCode: string): Promise<void> {
        const defectRow = this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: defectCode }).nth(3);
        console.log(defectRow);
        await this.page.waitForTimeout(3000);
            if (!await defectRow.isVisible()) {
                for (let i = 0; i < 5; i++) {
                await this.helper.clickElement(this.rqa0201Page.nextPageButton, 'Click Next page to see if created defect is there');
                    if (await defectRow.isVisible()) {                
                        await this.helper.clickElement(defectRow, `Select defect row ${defectCode}`);
                        break;
                    }
                await this.page.waitForTimeout(3000);}
            }else {
                await this.helper.clickElement(defectRow, `Select defect row ${defectCode}`);
            }
        await this.page.waitForTimeout(3000);
        await this.helper.clickElement(this.rqa0201Page.deleteButton, 'Click Delete button');
        await this.helper.captureScreenshot('RQA0201_After_Delete_Clicked');
    }

    /**
     * Verify UI success message and backend log after defect creation.
     * @param verifier     PuttyLogReader instance
     * @param userId       User ID expected in the log (e.g. 'SF75684')
     * @param defectLabel  Label used during creation
     * @param workshop     Workshop code (e.g. 'EBAS1')
     * @param tailLines    Number of trailing log lines to read (default 80)
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
            .getByText(`The declarable elementary defect ${defectCode} / ${defectLabel} was created for the workshop ${workshop}`, { exact: true });
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0201_Create_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const createLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Création du défaut élémentaire annonçable ${defectCode} réalisée`
        );
        expect(logOutput, `Expected create log for defect ${defectCode} by ${userId}`).toMatch(createLogRegex);
        console.log(`[RQA0201] ✔ Log confirmed: Création du défaut élémentaire annonçable ${defectCode} réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0201_After_Create_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after defect update.
     * @param verifier   PuttyLogReader instance
     * @param userId     User ID expected in the log (e.g. 'SF75684')
     * @param newLabel   New label used during update
     * @param workshop   Workshop code (e.g. 'EBAS1')
     * @param tailLines  Number of trailing log lines to read (default 80)
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
            .getByText(`The declarable elementary defect ${defectCode} / ${newLabel} was modified for the workshop ${workshop}`, { exact: true });
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0201_Update_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const updateLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Modification du défaut élémentaire annonçable ${defectCode} réalisée`
        );
        expect(logOutput, `Expected update log for defect ${defectCode} by ${userId}`).toMatch(updateLogRegex);
        console.log(`[RQA0201] ✔ Log confirmed: Modification du défaut élémentaire annonçable ${defectCode} réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0201_After_Update_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after defect deletion.
     * @param verifier     PuttyLogReader instance
     * @param userId       User ID expected in the log (e.g. 'SF75684')
     * @param defectCode   Code of the deleted defect
     * @param workshop     Workshop code (e.g. 'EBAS1')
     * @param tailLines    Number of trailing log lines to read (default 80)
     */
    async verifyDeleteLog(
        verifier: PuttyLogReader,
        userId: string,
        defectCode: string,
        updatedLabel: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The declarable elementary defect ${defectCode} / ${updatedLabel} was deleted for the workshop ${workshop}`, { exact: true });
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0201_Delete_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const deleteLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Suppression du défaut élémentaire annonçable ${defectCode} réalisée`
        );
        expect(logOutput, `Expected delete log for defect ${defectCode} by ${userId}`).toMatch(deleteLogRegex);
        console.log(`[RQA0201] ✔ Log confirmed: Suppression du défaut élémentaire annonçable ${defectCode} réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0201_After_Delete_Log_Verified');
    }
}
