import { Page, Locator, expect } from '@playwright/test';
import { QUA0402Page } from '../pages/QUA0402Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    randomClickFromTable(tableLocator: Locator, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class QUA0402Steps {
    private helper: StepHelper;
    private qua0402Page: QUA0402Page;
    private page: Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        void testInfo;
        this.page = page;
        this.helper = stepHelper;
        this.qua0402Page = new QUA0402Page(page);
    }

    /*     private async selectRandomOption(optionLocator: Locator, label: string): Promise<void> {
            const optionCount = await optionLocator.count();
            const visibleOptionIndices: number[] = [];
    
            if (optionCount === 0) {
                throw new Error(`No options found for ${label}`);
            }
    
            for (let index = 0; index < optionCount; index++) {
                if (await optionLocator.nth(index).isVisible()) {
                    visibleOptionIndices.push(index);
                }
            }
    
            if (visibleOptionIndices.length === 0) {
                throw new Error(`No visible options found for ${label}`);
            }
    
            const randomVisibleIndex = Math.floor(Math.random() * visibleOptionIndices.length);
            const selectedIndex = visibleOptionIndices[randomVisibleIndex];
            await this.helper.clickElement(optionLocator.nth(selectedIndex), `${label} option ${selectedIndex + 1}`);
        }
     */
    private async selectDateFromPicker(datePicker: Locator, offsetDays: number, label: string): Promise<void> {
        const mainFrame = this.page.locator('frame[name="main"]').contentFrame();
        const today = new Date();
        today.setHours(12, 0, 0, 0);

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + offsetDays);

        await this.helper.clickElement(datePicker, `Open ${label} date picker`);

        const monthOffset =
            targetDate.getFullYear() * 12 + targetDate.getMonth() - (today.getFullYear() * 12 + today.getMonth());

        if (monthOffset < 0) {
            for (let index = 0; index < Math.abs(monthOffset); index++) {
                await this.helper.clickElement(this.qua0402Page.datePickerPreviousMonth, `Navigate ${label} picker to previous month`);
            }
        }

        if (monthOffset > 0) {
            for (let index = 0; index < monthOffset; index++) {
                await this.helper.clickElement(this.qua0402Page.datePickerNextMonth, `Navigate ${label} picker to next month`);
            }
        }

        const dayCell = mainFrame.getByRole('cell', { name: targetDate.getDate().toString(), exact: true }).first();
        await this.helper.clickElement(dayCell, `Select ${label} day ${targetDate.getDate()}`);
    }

    async selectTwoDaysBackToTodayDateRange(): Promise<void> {
        await this.selectDateFromPicker(this.qua0402Page.startDatePicker, -2, 'start');
        await this.selectDateFromPicker(this.qua0402Page.endDatePicker, 0, 'end');

    }

    async qua0402SelectionCriteriaSubmit(): Promise<void> {
        await this.helper.clickElement(this.qua0402Page.qualityMonitoring, 'Click on Quality monitoring');
        await this.helper.clickElement(this.qua0402Page.qua0402Option, 'Click on QUA0402 - Manage defects and follow up');
        await this.helper.clickElement(this.qua0402Page.reworkStationPen, 'Click on Rework station pen dropdown');
        await this.helper.clickElement(this.qua0402Page.expertiseCrankWorkstation, 'Select EXPERTISE CRANK WORKSTATION option');
        await this.helper.clickElement(this.qua0402Page.submitButton, 'Click on Submit button');
    }

    async workStationSelectionSubmit(): Promise<void> {
        await this.qua0402SelectionCriteriaSubmit();
        await this.helper.clickElement(this.qua0402Page.wipFieldPen, 'Enter value in wip field pen');
        await this.helper.clickElement(this.qua0402Page.wip, 'Select the option in wip field pen dropdown');
        await this.helper.clickElement(this.qua0402Page.checkPointFieldPen, 'Select the option in wip field pen dropdown');
        await this.helper.clickElement(this.qua0402Page.checkPointFieldPenOption, 'Check point field');
        await this.selectTwoDaysBackToTodayDateRange();
        await this.helper.clickElement(this.qua0402Page.repereOrgane, 'Click on Repere Organe dropdown');
        await this.helper.clickElement(this.qua0402Page.repereOrganeOption, 'Select the option in Repere Organe dropdown');
        await this.helper.clickElement(this.qua0402Page.productNumPen, 'Click on product number dropdown');
        await this.helper.clickElement(this.qua0402Page.productNumList, 'Click on product number');
        await this.page.waitForTimeout(2000);
        await this.helper.clickElement(this.qua0402Page.submitButton2, 'Click on Submit button');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('QUA0402_Submission');

    }

    async identifierSequenceValidation(): Promise<void> {
        await this.qua0402SelectionCriteriaSubmit();
        await this.helper.clickElement(this.qua0402Page.identifierSequence, 'Click on Identifier sequence');
        await this.helper.clickElement(this.qua0402Page.identifierTypePen, 'Click on Identifier type dropdown');
        await this.helper.clickElement(this.qua0402Page.identifierTypePenOption, 'Select the option in Identifier type dropdown');
        await this.helper.enterText(this.qua0402Page.beginingIdentifierTextbox, '1we', 'Enter value in Beginning identifier value textbox');
        await this.helper.enterText(this.qua0402Page.endIdentifierValueTextbox, 'fe', 'Enter value in End identifier value textbox');
        await this.helper.clickElement(this.qua0402Page.submitButton2, 'Click on Submit button');
        await this.page.waitForTimeout(4000);
        await this.helper.captureScreenshot('QUA0402_Identifier_Sequence_Submission');
    }

    async qualityInformationValidation(): Promise<void> {
        await this.qua0402SelectionCriteriaSubmit();
        await this.helper.clickElement(this.qua0402Page.qualityInformation, 'Click on Quality information');
        await this.helper.clickElement(this.qua0402Page.areaPen, 'Click on Area dropdown');
        await this.helper.clickElement(this.qua0402Page.areaOption, 'Select the option in Area dropdown');
        await this.helper.clickElement(this.qua0402Page.workstationPen, 'Click on Workstation dropdown');
        await this.helper.clickElement(this.qua0402Page.workstationOption, 'Select the option in Workstation dropdown');
        await this.helper.clickElement(this.qua0402Page.defectPen, 'Click on Defect dropdown');
        await this.helper.clickElement(this.qua0402Page.defectOption, 'Select the option in Defect dropdown');
        await this.helper.clickElement(this.qua0402Page.qualityIndicatorPen, 'Click on Quality indicator dropdown');
        await this.helper.clickElement(this.qua0402Page.qualityIndicatorOption, 'Select the option in Quality indicator dropdown');
        await this.helper.clickElement(this.qua0402Page.partiallyReworkPartsCheckBox, 'Check Partially rework parts checkbox');
        await this.helper.clickElement(this.qua0402Page.partsWithoutReworkCheckBox, 'Check Parts without rework checkbox');
        await this.helper.clickElement(this.qua0402Page.blockedPartsCheckBox, 'Check Blocked parts checkbox');
        await this.helper.clickElement(this.qua0402Page.submitButton2, 'Click on Submit button');
        // await this.qua0402Page.newSelectionButton.waitFor({ state: 'visible', timeout: 5000 });
        // await this.page.waitForTimeout(5000);
        await this.helper.captureScreenshot('QUA0402_Quality_Information_Submission');
    }

    async advancedSearchRequestSubmission(): Promise<void> {
        await this.qua0402SelectionCriteriaSubmit();
        await this.helper.clickElement(this.qua0402Page.advancedSearch, 'Click on Advanced search');
        // await this.helper.enterText(this.qua0402Page.requestTextbox, 'Test request', 'Enter value in Request textbox');
        // await this.helper.clickElement(this.qua0402Page.submitButton2, 'Click on Submit button');
        await this.helper.clickElement(this.qua0402Page.helpButton, 'Click on Help button to open advanced search request form');
        await this.helper.clickElement(this.qua0402Page.predicatePen, 'Click on Predicate dropdown');
        await this.helper.clickElement(this.qua0402Page.predicatePenOption, 'Select the option in Predicate dropdown');
        await this.helper.enterText(this.qua0402Page.codeFTextbox, 'TestCodeF', 'Enter value in CODE (F) textbox');
        await this.helper.clickElement(this.qua0402Page.addButton, 'Click on Add button to add the condition');
        await this.helper.clickElement(this.qua0402Page.andButton, 'Click on AND button to add another condition');
        await this.helper.clickElement(this.qua0402Page.orButton, 'Click on OR button to add another condition');
        await this.helper.clickElement(this.qua0402Page.notButton, 'Click on NOT button to add another condition');
        await this.helper.clickElement(this.qua0402Page.openingFactorButton, 'Click on Opening factor button to add another condition');
        await this.helper.clickElement(this.qua0402Page.closingFactorButton, 'Click on Closing factor button to add another condition');
        await this.helper.clickElement(this.qua0402Page.endButton, 'Click on End button to add another condition');

        await this.helper.clickElement(this.qua0402Page.deleteButton, 'Click on Delete button to remove the conditions');
        await this.helper.clickElement(this.qua0402Page.addButton, 'Click on Add button to add a new condition');
        await this.helper.clickElement(this.qua0402Page.endButton, 'Click on End button to add another condition');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('QUA0402_Advanced_Search_Submission');
        await this.helper.clickElement(this.qua0402Page.validateButton, 'Click on Validate button to submit the advanced search request');
        await this.page.waitForTimeout(2000);

    }
}