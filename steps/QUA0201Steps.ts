import { Page, Locator, expect } from '@playwright/test';
import { QUA0201Page } from '../pages/QUA0201Page';
import { PuttyLogReader } from '../utils/puttyLogReader';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    randomClickFromTable(tableLocator: Locator, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
    randomClickFromDropdown(tableLocator: Locator, label: string): Promise<void>;
}

export class QUA0201Steps {
    private helper: StepHelper;
    private qua0201Page: QUA0201Page;
    private page: Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        void testInfo;
        this.page = page;
        this.helper = stepHelper;
        this.qua0201Page = new QUA0201Page(page);
    }

    async submitWithoutTestBenchToSeeError(): Promise<void> {
        await this.helper.clickElement(this.qua0201Page.qualityMonitoring, 'Click on Quality monitoring menu');
        await this.helper.clickElement(this.qua0201Page.qua0201Option, 'Select QUA0201 - Update part option');
        await this.helper.clickElement(this.qua0201Page.submitButton, 'Click on submit button after selecting Test bench number option');
        await this.helper.assertElementHasText(this.qua0201Page.inputMandatoryErrorMSG, 'Input mandatory', 'Test bench number error message');
    }
    async submitWithoutPartIdToSeeError(benchNum: string): Promise<void> {
        await this.helper.clickElement(this.qua0201Page.qualityMonitoring, 'Click on Quality monitoring menu');
        await this.helper.clickElement(this.qua0201Page.qua0201Option, 'Select QUA0201 - Update part option');

        await this.helper.clickElement(this.qua0201Page.testBenchNumPen, 'Click on Test bench number dropdown');
        let testBenchNumOption = this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: `${benchNum}` }).nth(3);
        await this.helper.clickElement(testBenchNumOption, `Select ${benchNum} option from Test bench number dropdown`);

        await this.helper.clickElement(this.qua0201Page.submitButton, 'Click on submit button after selecting Test bench number option');
        await this.helper.clickElement(this.qua0201Page.submitButton2, 'Click on submit button without selecting Part ID option');

        await this.helper.assertElementHasText(this.qua0201Page.inputMandatoryErrorMSG, 'Input mandatory', 'Part ID error message');
    }

    async submitWithoutResultToSeeError(benchNum: string, partId: string): Promise<void> {
        await this.helper.clickElement(this.qua0201Page.qualityMonitoring, 'Click on Quality monitoring menu');
        await this.helper.clickElement(this.qua0201Page.qua0201Option, 'Select QUA0201 - Update part option');
        await this.helper.clickElement(this.qua0201Page.testBenchNumPen, 'Click on Test bench number dropdown');
        let testBenchNumOption = this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: `${benchNum}` }).nth(3);
        await this.helper.clickElement(testBenchNumOption, `Select ${benchNum} option from Test bench number dropdown`);
        await this.helper.clickElement(this.qua0201Page.submitButton, 'Click on submit button after selecting Test bench number option');

        await this.helper.clickElement(this.qua0201Page.partIdPen, 'Click on Part ID dropdown');
        let partIdOption = this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: `${partId}` }).nth(2);
        await this.helper.clickElement(partIdOption, `Select ${partId} option from Part ID dropdown`);
        await this.helper.clickElement(this.qua0201Page.submitButton2, 'Click on submit button after selecting Test bench number option');
        await this.helper.assertElementHasText(this.qua0201Page.inputMandatoryErrorMSG, 'Input mandatory', 'Result error message');
    }



    async testBenchResult(benchNum: string, partId: string, result: string): Promise<void> {
        await this.helper.clickElement(this.qua0201Page.qualityMonitoring, 'Click on Quality monitoring menu');
        await this.helper.clickElement(this.qua0201Page.qua0201Option, 'Select QUA0201 - Update part option');
        await this.helper.clickElement(this.qua0201Page.testBenchNumPen, 'Click on Test bench number dropdown');
        let testBenchNumOption = this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: `${benchNum}` }).nth(3);
        let partIdOption = this.page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: `${partId}` }).nth(2);
        await this.helper.clickElement(testBenchNumOption, `Select ${benchNum} option from Test bench number dropdown`);

        let selectedTestBench = benchNum;
        console.log('Selected Test Bench:', selectedTestBench);
        await this.helper.clickElement(this.qua0201Page.submitButton, 'Click on submit button after selecting Test bench number option');
        await this.helper.clickElement(this.qua0201Page.partIdPen, 'Click on Part ID dropdown');
        // await this.helper.randomClickFromDropdown(this.qua0201Page.partIdOption, 'Random Selection option from Part ID dropdown');
        await this.helper.clickElement(partIdOption, `Select ${partId} option from Part ID dropdown`);
        let selectedPartId = partId;
        console.log('Selected Part ID:', selectedPartId);
        await this.helper.clickElement(this.qua0201Page.submitButton, 'Click on submit button after selecting Part ID option');
        await this.helper.clickElement(this.qua0201Page.resultPen, 'Click on Result dropdown');
        if (result === 'Good') {
            await this.helper.clickElement(this.qua0201Page.resultOptionGood, 'Select Good option from Result dropdown');
        } else if (result === 'Bad') {
            await this.helper.clickElement(this.qua0201Page.resultOptionBad, 'Select Bad option from Result dropdown');
        }
        // await this.helper.clickElement(this.qua0201Page.submitButton, 'Click on submit button after selecting Result option');

    }

    async verifyPassageLog(
        verifier: PuttyLogReader,
        userId: string,
        benchNum: string,
        partId: string,
        resultCode: string,
        tailLines = 120
    ): Promise<void> {
        const logOutput = verifier.tail(tailLines);
        const passageLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${userId}\\)[\\s\\S]*?` +
            `\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}[\\s\\S]*?` +
            `#QUA-CU2-S1-TRC-001 \\$\\$QUA0201[\\s\\S]*?` +
            `Déclaration Passage au banc effectuée \\(poste : ${benchNum}, organe : MED ${partId}, user : ${userId}, resultat : ${resultCode},\\s+nbPassage : \\d+\\)`
        );

        expect(logOutput, `Expected QUA0201 log for ${benchNum}/${partId} by ${userId}`).toMatch(passageLogRegex);
        console.log(`[QUA0201] Passage log verified for ${benchNum}/${partId} by user ${userId}`);
    }
}