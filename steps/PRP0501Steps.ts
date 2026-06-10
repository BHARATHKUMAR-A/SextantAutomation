import { Page, Locator, FrameLocator, expect } from '@playwright/test';
import { SshHelper } from '../utils/sshHelper';
import { PRP0501Page } from '../pages/PRP0501Page';

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
    private page: Page;
    private testInfo: any;
    private helper: StepHelper;
    private sshHelper: SshHelper;
    private prp0501Page: PRP0501Page;

    constructor(page: Page, testInfo: any, stepHelper: StepHelper) {
        this.page = page;
        this.testInfo = testInfo;
        this.helper = stepHelper;
        this.sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
        this.prp0501Page = new PRP0501Page(page);
    }

    async openPRP0501(): Promise<void> {
        await this.helper.clickElement(this.prp0501Page.productionProgrammeManagement, 'Click on Production programme management');
        await this.helper.clickElement(this.prp0501Page.prp0501Option, 'Click on PRP0501 - Manage the racks');
        await expect(this.prp0501Page.screenTitle).toBeVisible({ timeout: 15000 });
    }

    async prepareRackCreation(requiredQuantity: string): Promise<{ productMarker: string }> {
        await this.openPRP0501();
        await this.helper.clickElement(this.prp0501Page.createButton, 'Click on Create button');
        await expect(this.prp0501Page.requiredQuantityField).toBeVisible({ timeout: 10000 });

        await this.helper.clickElement(this.prp0501Page.productMarkerPen, 'Click on product marker pen');
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
        const productMarker = await this.prp0501Page.productMarkerField.inputValue();

        // await this.helper.clickElement(this.prp0501Page.managementProductPen, 'Click on management product pen');
        // await this.page.keyboard.press('ArrowDown');
        // await this.page.keyboard.press('Enter');
        // const ProductMarker = await this.prp0501Page.managementProductField.inputValue();
        // console.log(`[PRP0501] Selected management product ${ProductMarker}`);
        await this.helper.clickElement(this.prp0501Page.currentDateCalendarButton, 'Click on DHEF calendar');

        const currentDay = `${new Date().getDate()}`;
        const currentDateCell = this.prp0501Page.currentDateCalendarContainer.getByRole('cell', { name: currentDay, exact: true });
        await this.helper.clickElement(currentDateCell, `Select current day ${currentDay}`);
        await this.helper.enterText(this.prp0501Page.requiredQuantityField, requiredQuantity, `Enter required quantity ${requiredQuantity}`);

        return { productMarker };
    }

    async submitRackCreation(requiredQuantity: string): Promise<{ productMarker: string }> {
        const { productMarker } = await this.prepareRackCreation(requiredQuantity);
        await this.helper.clickElement(this.prp0501Page.submitButton, 'Click on Submit button');
        return { productMarker };
    }

    async groupByProductAndBack(): Promise<void> {
        await this.openPRP0501();
        await this.helper.clickElement(this.prp0501Page.groupByProductButton, 'Click on Group By Product button');
        await expect(this.prp0501Page.screenTitle).toBeVisible({ timeout: 10000 });
        await this.helper.clickElement(this.prp0501Page.backButton, 'Click on Back button');
        await expect(this.prp0501Page.screenTitle).toBeVisible({ timeout: 10000 });
        await expect(this.prp0501Page.createButton).toBeVisible({ timeout: 10000 });
    }

    async rescheduleRack(rackNumber: string): Promise<{ reschedulePrefix: string }> {
        await this.selectRack(rackNumber);
        await expect(this.prp0501Page.unlockedLabel).toBeVisible({ timeout: 10000 });
        await this.helper.clickElement(this.prp0501Page.rescheduleButton, 'Click on Reschedule button');
        await this.helper.clickElement(this.prp0501Page.moveBottomLineButton, 'Click on Move bottom the line button');
        await this.helper.clickElement(this.prp0501Page.moveTopLineButton, 'Click on Move on top the line button');
        await this.helper.clickElement(this.prp0501Page.moveDownLineButton, 'Click on Move down the line button');
        await this.helper.clickElement(this.prp0501Page.moveUpLineButton, 'Click on Move up the line button');
        await expect(this.prp0501Page.unlockedLabel).toBeVisible({ timeout: 10000 });
        await this.helper.clickElement(this.prp0501Page.submitButton, 'Click on Submit button for reschedule');
        await expect(this.prp0501Page.rescheduleSuccessMessage).toBeVisible({ timeout: 10000 });

        const successMessage = ((await this.prp0501Page.rescheduleSuccessMessage.textContent()) ?? '').trim();
        const rescheduleMatch = successMessage.match(/^(?<prefix>[A-Z0-9]+) : Rescheduling of the sequence production realized$/);
        const reschedulePrefix = rescheduleMatch?.groups?.prefix;

        expect(reschedulePrefix, `Expected reschedule prefix in UI message "${successMessage}"`).toBeTruthy();
        console.log(`[PRP0501] Reschedule UI verified for ${reschedulePrefix}`);
        return { reschedulePrefix: reschedulePrefix ?? '' };
    }

    private async selectRack(rackNumber: string): Promise<void> {
        await this.openPRP0501();

        const frame = this.page.locator('frame[name="main"]').contentFrame();
        let rackRow: Locator | undefined;

        for (let index = 0; index < 25; index++) {
            rackRow = await this.findVisibleRackCell(frame, rackNumber);

            if (rackRow) {
                break;
            }

            await this.helper.clickElement(this.prp0501Page.nextPageButton, `Click on Next page ${index + 1}`);
        }

        if (!rackRow) {
            throw new Error(`Expected to find visible rack ${rackNumber} in PRP0501 table`);
        }

        await expect(rackRow, `Expected to find rack ${rackNumber} in PRP0501 table`).toBeVisible({ timeout: 10000 });
        await this.helper.clickElement(rackRow, `Select rack ${rackNumber}`);
    }

    private async findVisibleRackCell(frame: FrameLocator, rackNumber: string): Promise<Locator | undefined> {
        const rackCells = frame.getByRole('cell', { name: rackNumber, exact: true });
        const matchCount = await rackCells.count();

        for (let index = matchCount - 1; index >= 0; index--) {
            const candidate = rackCells.nth(index);
            const boundingBox = await candidate.boundingBox();

            if (boundingBox) {
                return candidate;
            }
        }

        return undefined;
    }

    async putBan(rackNumber: string): Promise<void> {
        await this.selectRack(rackNumber);
        await this.helper.clickElement(this.prp0501Page.putBanButton, 'Click on To put a ban button');
        await this.helper.clickElement(this.prp0501Page.yesButton, 'Click on Yes button for put ban');
    }

    async removeBan(rackNumber: string): Promise<void> {
        await this.selectRack(rackNumber);
        await this.helper.clickElement(this.prp0501Page.removeBanButton, 'Click on To remove a ban button');
        await this.helper.clickElement(this.prp0501Page.yesButton, 'Click on Yes button for remove ban');
    }

    async kickoffOff(rackNumber: string): Promise<string> {
        const comment = `TEST_${await this.sshHelper.generateRandomAlphanumeric(4)}`;
        await this.selectRack(rackNumber);
        await this.helper.clickElement(this.prp0501Page.kickoffOffButton, 'Click on Kickoff off button');
        await this.helper.enterText(this.prp0501Page.commentField, comment, `Enter kickoff off comment ${comment}`);
        await this.helper.clickElement(this.prp0501Page.submitButton, 'Click on Submit button for kickoff off');
        return comment;
    }

    async kickoffOn(rackNumber: string): Promise<void> {
        await this.selectRack(rackNumber);
        await this.helper.clickElement(this.prp0501Page.kickoffOnButton, 'Click on Kickoff on button');
        await this.helper.clickElement(this.prp0501Page.submitButton, 'Click on Submit button for kickoff on');
    }

    async deleteRack(rackNumber: string): Promise<void> {
        await this.selectRack(rackNumber);
        await this.helper.clickElement(this.prp0501Page.deleteButton, 'Click on Delete button');
        await this.helper.clickElement(this.prp0501Page.yesButton, 'Click on Yes button');
    }

    async waitForRackExceedLog(userId: string): Promise<{ logOutput: string; rackNumber: string | undefined }> {
        const exceedLogRegex = new RegExp(
            `\\[WARN\\][\\s\\S]*?` +
            `\\(${this.escapeRegExp(userId)}\\)[\\s\\S]*?` +
            `(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3})[\\s\\S]*?` +
            `#PRP-CU5-S2-004 \\$\\$PRP0501[\\s\\S]*?` +
            `(?<warningMessage>La quantité à produire ne peut être supérieure à la taille UC 6)`
        );

        const logOutput = await this.sshHelper.waitForLog(exceedLogRegex, 500, 120000);
        expect(logOutput, `Expected PRP0501 exceed-quantity warning log for user ${userId}`).toMatch(exceedLogRegex);
        console.log(`[PRP0501] Exceed-quantity warning log verified for user ${userId}`);
        return { logOutput, rackNumber: undefined };
    }

    async waitForRackCreationLog(userId: string, rackPrefix: string): Promise<{ logOutput: string; rackNumber: string | undefined }> {
        const creationLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${this.escapeRegExp(userId)}\\)[\\s\\S]*?` +
            `#PRP-CU5-S2-006 \\$\\$PRP0501[\\s\\S]*?` +
            `La palette (?<rackNumber>${this.escapeRegExp(rackPrefix)}\\d+) a été créée`
        );

        const logOutput = await this.sshHelper.waitForLog(creationLogRegex, 500, 120000);
        expect(logOutput, `Expected PRP0501 creation log for prefix ${rackPrefix}`).toMatch(creationLogRegex);
        const logMatch = creationLogRegex.exec(logOutput);
        const rackNumber = logMatch?.groups?.rackNumber;
        console.log(`[PRP0501] PuTTY creation log verified for ${rackNumber ?? rackPrefix} by user ${userId}`);
        return { logOutput, rackNumber };
    }

    async waitForRackDeletionLog(userId: string, deletionPrefix: string, rackNumber: string): Promise<{ logOutput: string }> {
        const deletionLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${this.escapeRegExp(userId)}\\)[\\s\\S]*?` +
            `#PRP-CU5-S5-002 \\$\\$PRP0501[\\s\\S]*?` +
            `${this.escapeRegExp(deletionPrefix)} : Suppression de la palette ${this.escapeRegExp(rackNumber)} et des OF associés réalisée`
        );

        const logOutput = await this.sshHelper.waitForLog(deletionLogRegex, 500, 120000);
        expect(logOutput, `Expected PRP0501 deletion log for rack ${rackNumber}`).toMatch(deletionLogRegex);
        console.log(`[PRP0501] Deletion log verified for ${rackNumber} and prefix ${deletionPrefix}`);
        return { logOutput };
    }

    async waitForRescheduleLog(userId: string, reschedulePrefix: string): Promise<{ logOutput: string }> {
        const rescheduleLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${this.escapeRegExp(userId)}\\)[\\s\\S]*?` +
            `#PRP-CU5-S3-001 \\$\\$PRP0501[\\s\\S]*?` +
            `${this.escapeRegExp(reschedulePrefix)} : Réordonnancement du film réalisé`
        );

        const logOutput = await this.sshHelper.waitForLog(rescheduleLogRegex, 500, 120000);
        expect(logOutput, `Expected PRP0501 reschedule log for prefix ${reschedulePrefix} by ${userId}`).toMatch(rescheduleLogRegex);
        console.log(`[PRP0501] Reschedule log verified for ${reschedulePrefix} by user ${userId}`);
        return { logOutput };
    }

    async waitForPutBanLog(userId: string, rackNumber: string): Promise<{ logOutput: string }> {
        const putBanLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${this.escapeRegExp(userId)}\\)[\\s\\S]*?` +
            `#SFA-CU9-S5-001 \\$\\$PRP0501[\\s\\S]*?` +
            `Un interdit a été posé sur la palette ${this.escapeRegExp(rackNumber)}`
        );

        const logOutput = await this.sshHelper.waitForLog(putBanLogRegex, 500, 120000);
        expect(logOutput, `Expected PRP0501 put ban log for rack ${rackNumber}`).toMatch(putBanLogRegex);
        console.log(`[PRP0501] Put ban log verified for ${rackNumber} by user ${userId}`);
        return { logOutput };
    }

    async waitForRemoveBanLog(userId: string, rackNumber: string): Promise<{ logOutput: string }> {
        const removeBanLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${this.escapeRegExp(userId)}\\)[\\s\\S]*?` +
            `#SFA-CU9-S6-001 \\$\\$PRP0501[\\s\\S]*?` +
            `Un interdit a été levé sur la palette ${this.escapeRegExp(rackNumber)}`
        );

        const logOutput = await this.sshHelper.waitForLog(removeBanLogRegex, 500, 120000);
        expect(logOutput, `Expected PRP0501 remove ban log for rack ${rackNumber}`).toMatch(removeBanLogRegex);
        console.log(`[PRP0501] Remove ban log verified for ${rackNumber} by user ${userId}`);
        return { logOutput };
    }

    async waitForKickoffOffLog(userId: string, prefix: string, reason: string): Promise<{ logOutput: string }> {
        const kickoffOffLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${this.escapeRegExp(userId)}\\)[\\s\\S]*?` +
            `#PIL-CU1-S5-001 \\$\\$PRP0501[\\s\\S]*?` +
            `${this.escapeRegExp(prefix)} : Pose d[’']un verrou à l'engagement par ${this.escapeRegExp(userId)} pour le besoin de ${this.escapeRegExp(reason)}`
        );

        const logOutput = await this.sshHelper.waitForLog(kickoffOffLogRegex, 500, 120000);
        expect(logOutput, `Expected PRP0501 kickoff off log for prefix ${prefix}`).toMatch(kickoffOffLogRegex);
        console.log(`[PRP0501] Kickoff off log verified for ${prefix} with reason ${reason}`);
        return { logOutput };
    }

    async waitForKickoffOnLog(userId: string, prefix: string, lockTimestamp: string, reason: string): Promise<{ logOutput: string }> {
        const kickoffOnLogRegex = new RegExp(
            `\\[INFO\\][\\s\\S]*?` +
            `\\(${this.escapeRegExp(userId)}\\)[\\s\\S]*?` +
            `#PIL-CU1-S5-002 \\$\\$PRP0501[\\s\\S]*?` +
            `${this.escapeRegExp(prefix)} : Levée d[’']un verrou à l'engagement par ${this.escapeRegExp(userId)} qui avait été posé par ${this.escapeRegExp(userId)} le ${this.escapeRegExp(lockTimestamp)} pour le besoin de ${this.escapeRegExp(reason)}`
        );

        const logOutput = await this.sshHelper.waitForLog(kickoffOnLogRegex, 500, 120000);
        expect(logOutput, `Expected PRP0501 kickoff on log for prefix ${prefix}`).toMatch(kickoffOnLogRegex);
        console.log(`[PRP0501] Kickoff on log verified for ${prefix} with reason ${reason}`);
        return { logOutput };
    }

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}