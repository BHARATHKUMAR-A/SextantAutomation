import { Page, Locator, expect } from '@playwright/test';
import { RQA0101Page } from '../pages/RQA0101Page';
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

export class RQA0101Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private rqa0101Page: RQA0101Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page       = page;
        this.testInfo   = testInfo;
        this.helper     = stepHelper;
        this.sshHelper  = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.rqa0101Page = new RQA0101Page(page);
    }

    /**
     * Navigate to the RQA0101 screen via the menu.
     * Reference data → Quality → RQA0101 - Manage the measured parameters
     */
    async navigateToRQA0101(): Promise<void> {
        await this.helper.clickElement(this.rqa0101Page.referenceData, 'Click on Reference Data menu');
        await this.helper.clickElement(this.rqa0101Page.qualityMenu,   'Click on Quality submenu');
        await this.helper.clickElement(this.rqa0101Page.rqa0101Option, 'Select RQA0101 - Manage the measured parameters');
    }

    /**
     * Submission — selects workshop, area, fills operation, then clicks submit.
     * @param workshop  Workshop code to select (e.g. 'EBAS1')
     * @param area      Area/zone code to select (e.g. 'C1')
     * @param operation Operation code to type (e.g. 'OP2000')
     */
    async submitRQA0101(workshop: string, area: string, operation: string): Promise<void> {
        await this.navigateToRQA0101();

        // Workshop
        await this.helper.clickElement(this.rqa0101Page.workshopPen,    'Click on Workshop pen');
        await this.helper.clickElement(this.rqa0101Page.workshopOption,  `Select Workshop option ${workshop}`);

        // Area
        await this.helper.clickElement(this.rqa0101Page.areaPen,    'Click on Area pen');
        await this.helper.clickElement(this.rqa0101Page.areaOption,  `Select Area option ${area}`);

        // Operation — open pen then type in the textbox
        await this.helper.clickElement(this.rqa0101Page.operationPen,      'Click on Operation pen');
        await this.helper.enterText(this.rqa0101Page.operationTextbox, operation, `Fill Operation ${operation}`);

        // Submit
        await this.helper.clickElement(this.rqa0101Page.submitButton, 'Click Submit button');
        await this.helper.captureScreenshot('RQA0101_After_Submit');
    }

    /**
     * Add — clicks Add button, fills Parameter, Description, selects Family,
     * Type and Unit pens, then clicks Cancel.
     * @param parameter   Parameter code to fill (e.g. 'TEST')
     * @param description Description text to fill (e.g. 'TEST')
     */
    async addParameterRQA0101(parameter: string, description: string): Promise<void> {
        await this.helper.clickElement(this.rqa0101Page.addButton, 'Click Add button');

        // Parameter
        await this.helper.enterText(this.rqa0101Page.parameterTextbox, parameter, `Fill Parameter ${parameter}`);

        // Family pen — update familyOption locator in RQA0101Page.ts with actual option name
        // await this.helper.clickElement(this.rqa0101Page.familyPen,    'Click on Family pen');
        // await this.helper.clickElement(this.rqa0101Page.familyOption,  'Select Family option');

        // Description
        await this.helper.enterText(this.rqa0101Page.descriptionTextbox, description, `Fill Description ${description}`);
        // Type
        await this.helper.clickElement(this.rqa0101Page.typePen,    'Click on Type pen');
        await this.helper.clickElement(this.rqa0101Page.typeOption,  'Select Type option VALEUR');

        // Unit
        await this.helper.clickElement(this.rqa0101Page.unitPen,    'Click on Unit pen');
        await this.helper.clickElement(this.rqa0101Page.unitOption,  'Select Unit option TXT');

        // Cancel
        await this.page.waitForTimeout(2000); // Wait for a moment to ensure all fields are filled before canceling
        await this.helper.captureScreenshot('RQA0101_After_Add_Cancel');
    }

    /**
     * Update — selects a parameter row by name, clicks Update, changes description, submits.
     * @param parameterName   The parameter code shown in the table (e.g. 'TEST_Z')
     * @param newDescription  New description value (e.g. 'TESTING')
     */
    async updateParameterRQA0101(parameterName: string, newDescription: string): Promise<void> {
        // Select the parameter row dynamically by its name
        const parameterRow = this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: parameterName }).nth(3);
        await this.helper.clickElement(parameterRow, `Select parameter row ${parameterName}`);

        // Click Update
        await this.helper.clickElement(this.rqa0101Page.updateButton, 'Click Update button');

        // Change description
        await this.helper.enterText(this.rqa0101Page.descriptionTextbox, newDescription, `Fill new Description ${newDescription}`);

        // Submit
        await this.helper.clickElement(this.rqa0101Page.submitButtonToAdd, 'Click Submit button to confirm update');
        await this.helper.captureScreenshot('RQA0101_After_Update_Submit');
    }

    /**
     * Delete (cancel) — selects a parameter row by name, clicks Delete, then clicks Cancel.
     * @param parameterName  The parameter code shown in the table (e.g. 'TEST_Z')
     */
    async deleteParameterRQA0101(parameterName: string): Promise<void> {
        // Select the parameter row dynamically by its name
        const parameterRow = this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: parameterName }).nth(3);
        await this.helper.clickElement(parameterRow, `Select parameter row ${parameterName}`);

        // Click Delete
        await this.helper.clickElement(this.rqa0101Page.deleteButton, 'Click Delete button');

        // Cancel the deletion
        await this.helper.captureScreenshot('RQA0101_After_Delete_Cancel');
    }

    /**
     * Verify the UI success message and backend log after a parameter creation.
     * @param verifier       PuttyLogReader instance pointing to the live log file
     * @param userId         The user ID expected in the log (e.g. 'SF75684')
     * @param parameterName  The parameter code that was created
     * @param workshop       Workshop code (e.g. 'EBAS1')
     * @param zone           Zone code (e.g. 'C1')
     * @param operation      Operation code (e.g. 'OP2000')
     * @param description    Description text (e.g. 'TEST')
     * @param tailLines      Number of trailing lines to read (default 80)
     */
    async verifyAddLog(
        verifier: PuttyLogReader,
        userId: string,
        parameterName: string,
        workshop: string,
        zone: string,
        operation: string,
        description: string,
        tailLines = 80
    ): Promise<void> {
        // Validate UI success message
        const workstationNumber = operation.replace(/\D/g, '');
        const successMsg = this.page
            .locator('frame[name="main"]').contentFrame()
            .getByText(`The regulable parameter ${parameterName} was created for the workshop ${workshop}, zone ${zone}, workstation ${workstationNumber}, operation ${operation} with the description ${description}.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0101_Add_Success_Message');

        // Validate backend log entry
        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const addLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Cr\\u00e9ation du param\\u00e8tre mesurable ${parameterName} r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected add log for ${parameterName} by ${userId}`).toMatch(addLogRegex);
        console.log(`[RQA0101] ✔ Log confirmed: Création du paramètre mesurable ${parameterName} réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0101_After_Add_Log_Verified');
    }

    /**
     * Verify the UI success message and backend log after a parameter deletion.
     * @param verifier       PuttyLogReader instance pointing to the live log file
     * @param userId         The user ID expected in the log (e.g. 'SF75684')
     * @param parameterName  The parameter code that was deleted
     * @param tailLines      Number of trailing lines to read (default 80)
     */
    async verifyDeleteLog(verifier: PuttyLogReader, userId: string, parameterName: string, tailLines = 80): Promise<void> {
        // Validate UI success message
        const successMsg = this.page
            .locator('frame[name="main"]').contentFrame()
            .getByText(`The regulable parameter ${parameterName} was deleted.`);
        await successMsg.waitFor({ state: 'visible', timeout: 10000 });
        await this.helper.captureScreenshot('RQA0101_Delete_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const deleteLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Suppression du param\\u00e8tre mesurable ${parameterName} r\\u00e9alis\\u00e9e`
        );
        expect(logOutput, `Expected delete log for ${parameterName} by ${userId}`).toMatch(deleteLogRegex);
        console.log(`[RQA0101] ✔ Log confirmed: Suppression du paramètre mesurable ${parameterName} réalisée by ${userId}`);
        await this.helper.captureScreenshot('RQA0101_After_Delete_Log_Verified');
    }
}
