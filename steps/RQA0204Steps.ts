import { Page, Locator, expect } from '@playwright/test';
import { RQA0204Page } from '../pages/RQA0204Page';
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

export class RQA0204Steps {
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private rqa0204Page: RQA0204Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page        = page;
        this.testInfo    = testInfo;
        this.helper      = stepHelper;
        this.sshHelper   = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.rqa0204Page = new RQA0204Page(page);
    }

    /**
     * Navigate to the RQA0204 screen via the menu.
     */
    async navigateToRQA0204(): Promise<void> {
        await this.helper.clickElement(this.rqa0204Page.referenceData, 'Click on Reference Data menu');
        await this.helper.clickElement(this.rqa0204Page.qualityMenu,   'Click on Quality submenu');
        await this.helper.clickElement(this.rqa0204Page.rqa0204Option, 'Select RQA0204 - Link reworks to');
    }

    /**
     * Submit — selects all filter dropdowns (workshop, zone DEA, poste DEA, zone DER, poste DER)
     * and clicks the Submit (search) button.
     * Returns the dynamically read zone DEA and zone DER values.
     */
    async submitRQA0204(): Promise<{ zoneDea: string; zoneDer: string }> {
        await this.navigateToRQA0204();
        await this.helper.clickElement(this.rqa0204Page.workshopPen,    'Click on Workshop pen');
        await this.helper.clickElement(this.rqa0204Page.workshopOption, 'Select Workshop option');
        await this.helper.clickElement(this.rqa0204Page.zoneDeaPen,     'Click on Zone DEA pen');
        const zoneDea = ((await this.rqa0204Page.zoneDeaOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0204Page.zoneDeaOption,  `Select Zone DEA option ${zoneDea}`);
        await this.helper.clickElement(this.rqa0204Page.posteDeaPen,    'Click on Poste DEA pen');
        await this.helper.clickElement(this.rqa0204Page.posteDeaOption, 'Select Poste DEA option');
        await this.helper.clickElement(this.rqa0204Page.zoneDerPen,     'Click on Zone DER pen');
        const zoneDer = ((await this.rqa0204Page.zoneDerOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0204Page.zoneDerOption,  `Select Zone DER option ${zoneDer}`);
        await this.helper.clickElement(this.rqa0204Page.posteDerPen,    'Click on Poste DER pen');
        await this.helper.clickElement(this.rqa0204Page.posteDerOption, 'Select Poste DER option');
        await this.helper.clickElement(this.rqa0204Page.submitButton,   'Click Submit button');
        await this.helper.captureScreenshot('RQA0204_After_Submit');
        return { zoneDea, zoneDer };
    }

    /**
     * Add association — clicks Add, then selects DEA and DER defect dropdowns.
     * Dropdown values are read dynamically from the UI before clicking.
     * Returns the selected DEA code and DER code.
     */
    async addAssociation(): Promise<{ deaCode: string; derCode: string }> {
        await this.helper.clickElement(this.rqa0204Page.addButton, 'Click Add button');
        await this.helper.clickElement(this.rqa0204Page.deaPen,    'Click on DEA pen');
        const deaCode = ((await this.rqa0204Page.deaOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0204Page.deaOption, `Select DEA option ${deaCode}`);
        await this.helper.clickElement(this.rqa0204Page.derPen,    'Click on DER pen');
        const derCode = ((await this.rqa0204Page.derOption.textContent()) ?? '').trim();
        await this.helper.clickElement(this.rqa0204Page.derOption, `Select DER option ${derCode}`);
        await this.helper.captureScreenshot('RQA0204_After_Add_Filled');
        return { deaCode, derCode };
    }

    /**
     * Delete association — selects the row in the association table by the DEA zone value,
     * then clicks Delete.
     */
    async deleteAssociation(zoneDea: string): Promise<void> {
        const associationRow = this.page.locator('frame[name="main"]').contentFrame()
            .locator('#tableAssociation').getByRole('cell', { name: zoneDea, exact: true }).nth(2);
        await this.page.waitForTimeout(3000);
        await this.helper.clickElement(associationRow, `Select association row with zone ${zoneDea}`);
        await this.helper.clickElement(this.rqa0204Page.deleteButton, 'Click Delete button');
        await this.helper.captureScreenshot('RQA0204_After_Delete_Clicked');
    }

    /**
     * Verify UI success message and backend log after adding an association.
     */
    async verifyAddLog(
        verifier: PuttyLogReader,
        userId: string,
        deaCode: string,
        derCode: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The association between ${deaCode} and ${derCode} was created for the workshop ${workshop}`, { exact: false });
        await successMsg.waitFor({ state: 'visible', timeout: 30000 });
        await this.helper.captureScreenshot('RQA0204_Add_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const addLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Association du défaut annonçable ${deaCode} avec le défaut retouchable ${derCode} réalisée`
        );
        expect(logOutput, `Expected add association log for DEA=${deaCode}, DER=${derCode} by ${userId}`).toMatch(addLogRegex);
        console.log(`[RQA0204] Add association log verified for DEA=${deaCode}, DER=${derCode} by user ${userId}`);
        await this.helper.captureScreenshot('RQA0204_After_Add_Log_Verified');
    }

    /**
     * Verify UI success message and backend log after deleting an association.
     */
    async verifyDeleteLog(
        verifier: PuttyLogReader,
        userId: string,
        deaCode: string,
        derCode: string,
        workshop: string,
        tailLines = 80
    ): Promise<void> {
        const successMsg = this.page.locator('frame[name="main"]').contentFrame()
            .getByText(`The association between ${deaCode} and ${derCode} was deleted for the workshop ${workshop}`, { exact: false });
        await successMsg.waitFor({ state: 'visible', timeout: 30000 });
        await this.helper.captureScreenshot('RQA0204_Delete_Success_Message');

        await this.page.waitForTimeout(2000);
        const logOutput = verifier.tail(tailLines);
        const deleteLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `Suppression de l'association du défaut annonçable ${deaCode} avec le défaut retouchable ${derCode} réalisée`
        );
        expect(logOutput, `Expected delete association log for DEA=${deaCode}, DER=${derCode} by ${userId}`).toMatch(deleteLogRegex);
        console.log(`[RQA0204] Delete association log verified for DEA=${deaCode}, DER=${derCode} by user ${userId}`);
        await this.helper.captureScreenshot('RQA0204_After_Delete_Log_Verified');
    }
}
