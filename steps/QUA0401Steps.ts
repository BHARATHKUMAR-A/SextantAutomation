import { Page, Locator, expect } from '@playwright/test';
import { QUA0401Page } from '../pages/QUA0401Page';

interface StepHelper {
    navigateTo(url: string): Promise<void>;
    enterText(selector: Locator, text: string, description: string): Promise<void>;
    clickElement(selector: Locator, description: string): Promise<void>;
    clickButtonInFrame(frameName: string, buttonSelector: string, label: string): Promise<void>;
    captureScreenshot(label: string): Promise<void>;
    assertElementHasText(locator: any, expectedText: string, label: string): Promise<void>;
    assertElementHasTextInFrame(frameName: string, errorInFrame: string, expectedText: string, label: string): Promise<void>;
}

export class QUA0401Steps {
    private helper: StepHelper;
    private qua0401Page: QUA0401Page;
    private page: Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        void testInfo;
        this.page = page;
        this.helper = stepHelper;
        this.qua0401Page = new QUA0401Page(page);
    }

    async qualityFollowUp(value: string): Promise<void> {
        await this.helper.clickElement(this.qua0401Page.qualityMonitoring, 'Click on Quality monitoring');
        await this.helper.clickElement(this.qua0401Page.qua0401Option, 'Click on QUA0401 - Manage defects and follow up');
        await this.helper.clickElement(this.qua0401Page.reworkStationPen, 'Click on Rework station pen dropdown');
        await this.helper.clickElement(this.qua0401Page.reworkStationPenOptionCrank, 'Select EXPERTISE CRANK WORKSTATION option');
        await this.helper.enterText(this.qua0401Page.valueField, value, 'Enter value in value field');
        await this.helper.captureScreenshot('QUA0401_Quality_Follow_Up');
        await this.helper.clickElement(this.qua0401Page.submitButton, 'Click on Submit button');
    }

    async switchQualityIndicator(indicator: Locator, cranklineValue: string): Promise<void> {
        await this.qualityFollowUp(cranklineValue);
        await this.helper.clickElement(indicator, 'Click on Quality follow up button');
        await this.page.waitForTimeout(2000);
        await this.helper.clickElement(this.qua0401Page.qualityIndicator, 'Click on Switch quality indicator');
        await this.helper.clickElement(this.qua0401Page.YellowCard, 'Select Yellow card');
        await this.helper.assertElementHasText(this.qua0401Page.Yellow, 'YELLOW', 'Verify quality indicator is Switch quality indicator');
        let yellowChangeSuccessMessage = this.page.locator('frame[name="main"]').contentFrame().getByText(`Changement de couleur de carton de GREEN à YELLOW for the part MED ${cranklineValue} CRANK CRANKSHAFT `);

        await this.helper.assertElementHasText(yellowChangeSuccessMessage, `Changement de couleur de carton de GREEN à YELLOW for the part MED ${cranklineValue} CRANK CRANKSHAFT `, 'Verify yellow change success message');
        await this.page.waitForTimeout(2000);

        await this.helper.captureScreenshot('yellow_card_selected');
        await this.helper.clickElement(this.qua0401Page.qualityIndicator, 'Click on Switch quality indicator');

        await this.helper.clickElement(this.qua0401Page.OrangeCard, 'Select Orange card');
        await this.helper.assertElementHasText(this.qua0401Page.Orange, 'ORANGE', 'Verify quality indicator is Switch quality indicator');
        let orangeChangeSuccessMessage = this.page.locator('frame[name="main"]').contentFrame().getByText(`Changement de couleur de carton de YELLOW à ORANGE for the part MED ${cranklineValue} CRANK CRANKSHAFT `);

        await this.helper.assertElementHasText(orangeChangeSuccessMessage, `Changement de couleur de carton de YELLOW à ORANGE for the part MED ${cranklineValue} CRANK CRANKSHAFT `, 'Verify orange change success message');
        await this.page.waitForTimeout(2000);

        await this.helper.captureScreenshot('orange_card_selected');
        await this.helper.clickElement(this.qua0401Page.qualityIndicator, 'Click on Switch quality indicator');

        await this.helper.clickElement(this.qua0401Page.GreenCard, 'Select Green card');
        await this.helper.assertElementHasText(this.qua0401Page.Green, 'GREEN', 'Verify quality indicator is Switch quality indicator');
        let greenChangeSuccessMessage = this.page.locator('frame[name="main"]').contentFrame().getByText(`Changement de couleur de carton de ORANGE à GREEN for the part MED ${cranklineValue} CRANK CRANKSHAFT `);

        await this.helper.assertElementHasText(greenChangeSuccessMessage, `Changement de couleur de carton de ORANGE à GREEN for the part MED ${cranklineValue} CRANK CRANKSHAFT `, 'Verify green change success message');

        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('green_card_selected');
    }

    async manageDefects(indicator: Locator, cranklineValue: string): Promise<void> {
        await this.qualityFollowUp(cranklineValue);
        await this.helper.clickElement(indicator, `Click on ${indicator} button`);
        await this.page.waitForTimeout(2000);
        await this.helper.clickElement(this.qua0401Page.manageDefects, 'Click on Manage defects');
        await this.helper.clickElement(this.qua0401Page.addDefect, 'Click on Add defect');
        await this.helper.clickElement(this.qua0401Page.firstTableCell, 'Click on Machining Crank Area option in the table');
        await this.helper.clickElement(this.qua0401Page.submitButton, 'Click on Submit button');
        await this.helper.captureScreenshot('defect_added');

        await this.helper.clickElement(this.qua0401Page.manageDefects, 'Click on Manage defects');
        await this.helper.clickElement(this.qua0401Page.reworkDefects, 'Click on Rework defects');

        await this.helper.clickElement(this.qua0401Page.backButton, 'Click on Back button');
        await this.page.waitForTimeout(2000);
        await this.helper.clickElement(this.qua0401Page.manageDefects, 'Click on Manage defects');
        await this.page.waitForTimeout(2000);
        await this.helper.clickElement(this.qua0401Page.deleteDefect, 'Click on Delete defect');
        await this.helper.clickElement(this.qua0401Page.submitButton, 'Click on Submit button');
        await this.helper.captureScreenshot('defect_deleted');
        await this.helper.clickElement(this.qua0401Page.qualityIndicator, 'Click on Switch quality indicator');

        await this.helper.clickElement(this.qua0401Page.GreenCard, 'Select Green card');
        await this.helper.assertElementHasText(this.qua0401Page.Green, 'GREEN', 'Verify quality indicator is Switch quality indicator');

    }

    async manageBlockings(indicator: Locator, cranklineValue: string): Promise<void> {
        await this.qualityFollowUp(cranklineValue);
         await this.page.waitForTimeout(2000);
        await this.helper.clickElement(indicator, `Click on ${indicator} button`);
        await this.page.waitForTimeout(2000);
        await this.helper.clickElement(this.qua0401Page.manageBlockings, 'Click on Manage blockings');
        await this.helper.clickElement(this.qua0401Page.setBlocking, 'Click on Set blocking');
        let blockingCodeAtAddBlocking = this.page.locator('frame[name="main"]').contentFrame().locator('[ecwkeyname="codeKey"]').nth(1);
        await this.helper.clickElement(blockingCodeAtAddBlocking, 'Click on Blocking code field at Add blocking table');

        await this.helper.clickElement(this.qua0401Page.submitButton, 'Click on Submit button');
        await this.helper.captureScreenshot('blocking_set');
        let textCode = await blockingCodeAtAddBlocking.innerText();
        let blockingSuccessMessage = this.page.locator('frame[name="main"]').contentFrame().getByText(`CEXP : set blocking ${textCode} on part MED ${cranklineValue} CRANK CRANKSHAFT - passing to ORANGE indicator`);
        await this.helper.assertElementHasText(blockingSuccessMessage, `CEXP : set blocking ${textCode} on part MED ${cranklineValue} CRANK CRANKSHAFT - passing to ORANGE indicator`, 'Verify blocking set success message');
        await this.page.waitForTimeout(2000);
        await this.helper.clickElement(this.qua0401Page.manageBlockings, 'Click on manage blockings');
        await this.helper.clickElement(this.qua0401Page.cancelBlocking, 'Click on Cancel blocking');
        await this.helper.clickElement(this.qua0401Page.submitButton, 'Click on Submit button');
        let blockingCancelSuccessMessage = this.page.locator('frame[name="main"]').contentFrame().getByText(`CEXP : delete the blocking ${textCode} on the part MED ${cranklineValue} CRANK CRANKSHAFT `);
        await this.helper.assertElementHasText(blockingCancelSuccessMessage, `CEXP : delete the blocking ${textCode} on the part MED ${cranklineValue} CRANK CRANKSHAFT `, 'Verify blocking cancel success message');
        await this.page.waitForTimeout(2000);
        await this.helper.captureScreenshot('blocking_cancelled');

        await this.helper.clickElement(this.qua0401Page.qualityIndicator, 'Click on Switch quality indicator');
        await this.helper.clickElement(this.qua0401Page.GreenCard, 'Select Green card');
        await this.helper.assertElementHasText(this.qua0401Page.Green, 'GREEN', 'Verify quality indicator is Switch quality indicator');


    }
}