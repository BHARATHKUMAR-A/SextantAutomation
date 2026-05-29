import { Page, Locator, expect } from '@playwright/test';
import { RQA0102Page } from '../pages/RQA0102Page';
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

export class RQA0102Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private rqa0102Page: RQA0102Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.sshHelper   = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.rqa0102Page = new RQA0102Page(page);
    }

    /**
     * Navigate to the RQA0102 screen via the menu.
     * Reference data → Quality → RQA0102
     */
    async navigateToRQA0102(): Promise<void> {
        await this.helper.clickElement(this.rqa0102Page.referenceData, 'Click on Reference Data menu');
        await this.helper.clickElement(this.rqa0102Page.qualityMenu,   'Click on Quality submenu');
        await this.helper.clickElement(this.rqa0102Page.rqa0102Option, 'Select RQA0102');
    }

    /**
     * Submit — selects workshop pen, picks an option, then clicks submit.
     * @param workshop  Workshop code to select (e.g. 'EBAS1')
     */
    async submitRQA0102(workshop: string): Promise<void> {
        await this.navigateToRQA0102();

        await this.helper.clickElement(this.rqa0102Page.workshopPen,   'Click on Workshop pen');
        await this.helper.clickElement(this.rqa0102Page.workshopOption, `Select Workshop option ${workshop}`);
        await this.helper.clickElement(this.rqa0102Page.submitButton,  'Click Submit button');
        await this.helper.captureScreenshot('RQA0102_After_Submit');
    }

    /**
     * Add — clicks Add, fills description, stops before form submit (caller decides submit or cancel).
     * @param description  Description text to fill (e.g. 'TEST_Z')
     */
    async addAttributeRQA0102(attribute:string,description: string): Promise<void> {
        await this.helper.clickElement(this.rqa0102Page.addButton,          'Click Add button');
        await this.helper.enterText(this.rqa0102Page.attributeNameTextbox, attribute, `Fill Attribute ${attribute}`);
        await this.helper.enterText(this.rqa0102Page.descriptionTextbox, description, `Fill Description ${description}`);
        await this.helper.captureScreenshot('RQA0102_After_Add_Filled');
    }

    /**
     * Update — selects an attribute row by name, clicks Update, fills new description,
     * stops before form submit (caller decides submit or cancel).
     * @param attributeName   The attribute code shown in the table (e.g. 'TEST_Z')
     * @param newDescription  New description value (e.g. 'TESTING')
     */
    async updateAttributeRQA0102(attributeName: string, newDescription: string): Promise<void> {
        const attributeRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: attributeName }).nth(3);
            await this.page.waitForTimeout(3000); // Wait for the table to be fully interactive
        await this.helper.clickElement(attributeRow,`Select attribute row ${attributeName}`);
        await this.helper.clickElement(this.rqa0102Page.updateButton,      'Click Update button');
        await this.helper.enterText(this.rqa0102Page.descriptionTextbox, newDescription, `Fill new Description ${newDescription}`);
        await this.helper.captureScreenshot('RQA0102_After_Update_Filled');
    }

    /**
     * Delete — selects an attribute row by name, clicks Delete,
     * stops before confirm (caller decides submit or cancel).
     * @param attributeName  The attribute code shown in the table (e.g. 'TEST_Z')
     */
    async deleteAttributeRQA0102(attributeName: string): Promise<void> {
        const attributeRow = this.page.locator('frame[name="main"]').contentFrame()
            .getByRole('cell', { name: attributeName }).nth(3);
            await this.page.waitForTimeout(3000); // Wait for the table to be fully interactive
        await this.helper.clickElement(attributeRow,                  `Select attribute row ${attributeName}`);
        await this.helper.clickElement(this.rqa0102Page.deleteButton, 'Click Delete button');
        await this.helper.captureScreenshot('RQA0102_After_Delete_Clicked');
    }

    /**
     * Verify UI success message and backend log after attribute creation.
     * @param verifier        PuttyLogReader instance
     * @param userId          User ID expected in the log (e.g. 'SF75684')
     * @param attributeName   The attribute code that was created (e.g. 'TEST_Z')
     * @param workshop        Workshop code (e.g. 'EBAS1')
     * @param tailLines       Number of trailing log lines to read (default 80)
     */
    async verifyAddLog(
        verifier: PuttyLogReader,
        userId: string,
        attributeName: string,
        description: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        // UI success message
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The attribute of regulable parameter ${attributeName} / ${description} with type FAMILLE was created for the workshop ${workshop}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0102_Add_Success_Message');

        // Backend log validation
        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const addLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Cr\\u00e9ation de l'attribut de param\\u00e8tre mesurable ${attributeName} de type FAMILLE r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected add log for attribute ${attributeName} by ${userId}`).toMatch(addLogRegex);
        console.log(`[RQA0102] ✔ Log confirmed: Création de l'attribut de paramètre mesurable ${attributeName} de type FAMILLE réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0102_After_Add_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after attribute update.
     * @param verifier        PuttyLogReader instance
     * @param userId          User ID expected in the log (e.g. 'SF75684')
     * @param attributeName   The attribute code (unchanged, e.g. 'TEST_Z')
     * @param newDescription  The new description after update (e.g. 'TESTING')
     * @param workshop        Workshop code (e.g. 'EBAS1')
     * @param tailLines       Number of trailing log lines to read (default 80)
     */
    async verifyUpdateLog(
        verifier: PuttyLogReader,
        userId: string,
        attributeName: string,
        newDescription: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        // UI success message
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The attribute of regulable parameter ${attributeName} / ${newDescription} with type FAMILLE was modified for the workshop ${workshop}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0102_Update_Success_Message');

        // Backend log validation
        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const updateLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Modification de l'attribut de param\\u00e8tre mesurable ${attributeName} de type FAMILLE r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected update log for attribute ${attributeName} by ${userId}`).toMatch(updateLogRegex);
        console.log(`[RQA0102] ✔ Log confirmed: Modification de l'attribut de paramètre mesurable ${attributeName} de type FAMILLE réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0102_After_Update_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after attribute deletion.
     * @param verifier           PuttyLogReader instance
     * @param userId             User ID expected in the log (e.g. 'SF75684')
     * @param attributeName      The attribute code (e.g. 'TEST_Z')
     * @param lastDescription    The last known description before deletion (e.g. 'TESTING')
     * @param workshop           Workshop code (e.g. 'EBAS1')
     * @param tailLines          Number of trailing log lines to read (default 80)
     */
    async verifyDeleteLog(
        verifier: PuttyLogReader,
        userId: string,
        attributeName: string,
        lastDescription: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        // UI success message
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The attribute of regulable parameter ${attributeName} / ${lastDescription} with type FAMILLE was deleted for the workshop ${workshop}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0102_Delete_Success_Message');

        // Backend log validation
        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const deleteLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Suppression de l'attribut de param\\u00e8tre mesurable ${attributeName} de type FAMILLE r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected delete log for attribute ${attributeName} by ${userId}`).toMatch(deleteLogRegex);
        console.log(`[RQA0102] ✔ Log confirmed: Suppression de l'attribut de param\u00e8tre mesurable ${attributeName} de type FAMILLE r\u00e9alis\u00e9e by ${userId}`);
        await this.helper.captureScreenshot('RQA0102_After_Delete_Log_Verified');
    }

    /**
     * Submit with Type radio — navigates, selects workshop, checks the
     * "Measurable parameters types" radio button, then clicks submit.
     * @param workshop  Workshop code to select (e.g. 'EBAS1')
     */
    async submitRQA0102WithType(workshop: string): Promise<void> {
        await this.navigateToRQA0102();

        await this.helper.clickElement(this.rqa0102Page.workshopPen,    'Click on Workshop pen');
        await this.helper.clickElement(this.rqa0102Page.workshopOption, `Select Workshop option ${workshop}`);
        await this.rqa0102Page.typeRadioButton.check();
        await this.helper.captureScreenshot('RQA0102_Type_Radio_Checked');
        await this.helper.clickElement(this.rqa0102Page.submitButton,   'Click Submit button');
        await this.helper.captureScreenshot('RQA0102_After_Submit_With_Type');
    }

    /**
     * Verify UI success message and backend log after attribute creation (TYPE).
     */
    async verifyAddLogType(
        verifier: PuttyLogReader,
        userId: string,
        attributeName: string,
        description: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The attribute of regulable parameter ${attributeName} / ${description} with type TYPE was created for the workshop ${workshop}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0102_Type_Add_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const addLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Cr\\u00e9ation de l'attribut de param\\u00e8tre mesurable ${attributeName} de type TYPE r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected add log for attribute ${attributeName} (TYPE) by ${userId}`).toMatch(addLogRegex);
        console.log(`[RQA0102] ✔ Log confirmed: Création de l'attribut de paramètre mesurable ${attributeName} de type TYPE réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0102_After_Type_Add_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after attribute update (TYPE).
     */
    async verifyUpdateLogType(
        verifier: PuttyLogReader,
        userId: string,
        attributeName: string,
        newDescription: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The attribute of regulable parameter ${attributeName} / ${newDescription} with type TYPE was modified for the workshop ${workshop}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0102_Type_Update_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const updateLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Modification de l'attribut de param\\u00e8tre mesurable ${attributeName} de type TYPE r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected update log for attribute ${attributeName} (TYPE) by ${userId}`).toMatch(updateLogRegex);
        console.log(`[RQA0102] ✔ Log confirmed: Modification de l'attribut de paramètre mesurable ${attributeName} de type TYPE réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0102_After_Type_Update_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after attribute deletion (TYPE).
     */
    async verifyDeleteLogType(
        verifier: PuttyLogReader,
        userId: string,
        attributeName: string,
        lastDescription: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The attribute of regulable parameter ${attributeName} / ${lastDescription} with type TYPE was deleted for the workshop ${workshop}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0102_Type_Delete_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const deleteLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Suppression de l'attribut de param\\u00e8tre mesurable ${attributeName} de type TYPE r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected delete log for attribute ${attributeName} (TYPE) by ${userId}`).toMatch(deleteLogRegex);
        console.log(`[RQA0102] ✔ Log confirmed: Suppression de l'attribut de paramètre mesurable ${attributeName} de type TYPE réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0102_After_Type_Delete_Log_Verified');
    }

    /**
     * Submit with Unit radio — navigates, selects workshop, checks the
     * "Measurable parameters units" radio button, then clicks submit.
     * @param workshop  Workshop code to select (e.g. 'EBAS1')
     */
    async submitRQA0102WithUnit(workshop: string): Promise<void> {
        await this.navigateToRQA0102();

        await this.helper.clickElement(this.rqa0102Page.workshopPen,    'Click on Workshop pen');
        await this.helper.clickElement(this.rqa0102Page.workshopOption, `Select Workshop option ${workshop}`);
        await this.rqa0102Page.unitRadioButton.check();
        await this.helper.captureScreenshot('RQA0102_Unit_Radio_Checked');
        await this.helper.clickElement(this.rqa0102Page.submitButton,   'Click Submit button');
        await this.helper.captureScreenshot('RQA0102_After_Submit_With_Unit');
    }

    /**
     * Verify UI success message and backend log after attribute creation (UNITE).
     */
    async verifyAddLogUnit(
        verifier: PuttyLogReader,
        userId: string,
        attributeName: string,
        description: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The attribute of regulable parameter ${attributeName} / ${description} with type UNITE was created for the workshop ${workshop}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0102_Unit_Add_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const addLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Cr\\u00e9ation de l'attribut de param\\u00e8tre mesurable ${attributeName} de type UNITE r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected add log for attribute ${attributeName} (UNITE) by ${userId}`).toMatch(addLogRegex);
        console.log(`[RQA0102] ✔ Log confirmed: Création de l'attribut de paramètre mesurable ${attributeName} de type UNITE réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0102_After_Unit_Add_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after attribute update (UNITE).
     */
    async verifyUpdateLogUnit(
        verifier: PuttyLogReader,
        userId: string,
        attributeName: string,
        newDescription: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The attribute of regulable parameter ${attributeName} / ${newDescription} with type UNITE was modified for the workshop ${workshop}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0102_Unit_Update_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const updateLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Modification de l'attribut de param\\u00e8tre mesurable ${attributeName} de type UNITE r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected update log for attribute ${attributeName} (UNITE) by ${userId}`).toMatch(updateLogRegex);
        console.log(`[RQA0102] ✔ Log confirmed: Modification de l'attribut de paramètre mesurable ${attributeName} de type UNITE réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0102_After_Unit_Update_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after attribute deletion (UNITE).
     */
    async verifyDeleteLogUnit(
        verifier: PuttyLogReader,
        userId: string,
        attributeName: string,
        lastDescription: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The attribute of regulable parameter ${attributeName} / ${lastDescription} with type UNITE was deleted for the workshop ${workshop}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0102_Unit_Delete_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const deleteLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Suppression de l'attribut de param\\u00e8tre mesurable ${attributeName} de type UNITE r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected delete log for attribute ${attributeName} (UNITE) by ${userId}`).toMatch(deleteLogRegex);
        console.log(`[RQA0102] ✔ Log confirmed: Suppression de l'attribut de paramètre mesurable ${attributeName} de type UNITE réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0102_After_Unit_Delete_Log_Verified');
    }
}
