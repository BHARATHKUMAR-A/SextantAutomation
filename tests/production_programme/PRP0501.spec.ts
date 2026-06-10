import { expect } from '@playwright/test';
import { test } from '../fixtures/testWithLogIn';
import credentials from '../../test-data/credentials.json';
import { StepHelper } from '../../utils/StepHelper';
import { PRP0501Page } from '../../pages/PRP0501Page';
import { PRP0501Steps } from '../../steps/PRP0501Steps';

const USER_ID = credentials.Credentials.username;
let createdRackNumber: string;
let createdProductMarker: string;
let kickoffOffComment: string;
let kickoffPrefix: string;
let reschedulePrefix: string;

function getExpectedRackPrefix(currentDate: Date = new Date()): string {
    const yearDigit = currentDate.getFullYear().toString().slice(-1);
    const startOfYear = new Date(currentDate.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((currentDate.getTime() - startOfYear.getTime()) / 86400000);
    return `P${yearDigit}${dayOfYear.toString().padStart(3, '0')}M`;
}

test.describe.serial('PRP0501 rack creation', () => {
    test('Validation of group by product navigation on UI for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);

        await prp0501Steps.groupByProductAndBack();
    });

    test('Validation of quantity error message on UI for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Page = new PRP0501Page(page);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);

        await prp0501Steps.prepareRackCreation('7');
        await helper.clickElement(prp0501Page.submitButton, 'Click on Submit button for invalid quantity');
        await helper.assertElementHasText(
            prp0501Page.quantityExceedsUcErrorMessage,
            'The quantity to be produced may not exceed the size UC 6',
            'Verify quantity to be produced error message'
        );
    });

    test('Validation of cancel flow on UI for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Page = new PRP0501Page(page);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);

        await prp0501Steps.prepareRackCreation('6');
        await helper.clickElement(prp0501Page.cancelButton, 'Click on Cancel button');
        await expect(prp0501Page.screenTitle).toBeVisible({ timeout: 10000 });
        await expect(prp0501Page.createButton).toBeVisible({ timeout: 10000 });
    });

    test('Validation of create success message on UI and PuTTY for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);
        const expectedRackPrefix = getExpectedRackPrefix();

        const { productMarker } = await prp0501Steps.submitRackCreation('6');
        const { rackNumber } = await prp0501Steps.waitForRackCreationLog(USER_ID, expectedRackPrefix);

        createdRackNumber = rackNumber ?? '';
        createdProductMarker = productMarker;
        console.log(`[PRP0501] Creation log verified for ${createdRackNumber}`);
    });

    test('Validation of reschedule success message on UI and PuTTY for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);

        expect(createdRackNumber, 'Expected a created rack number from the create test').toBeTruthy();

        const rescheduleResult = await prp0501Steps.rescheduleRack(createdRackNumber);
        reschedulePrefix = rescheduleResult.reschedulePrefix;

        expect(reschedulePrefix, 'Expected a dynamic reschedule prefix from the UI message').toBeTruthy();

        await prp0501Steps.waitForRescheduleLog(USER_ID, reschedulePrefix);
    });

    test('Validation of put ban on UI for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);

        expect(createdRackNumber, 'Expected a created rack number from the create test').toBeTruthy();

        await prp0501Steps.putBan(createdRackNumber);
        kickoffPrefix = createdProductMarker;

        await prp0501Steps.waitForPutBanLog(USER_ID, createdRackNumber);
    });

    test('Validation of remove ban on UI for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);

        expect(createdRackNumber, 'Expected a created rack number from the create test').toBeTruthy();

        await prp0501Steps.removeBan(createdRackNumber);

        await prp0501Steps.waitForRemoveBanLog(USER_ID, createdRackNumber);
    });

    test('Validation of kickoff off on UI for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);

        expect(createdRackNumber, 'Expected a created rack number from the create test').toBeTruthy();
        kickoffOffComment = await prp0501Steps.kickoffOff(createdRackNumber);
        expect(kickoffOffComment, 'Expected kickoff off comment to be generated').toBeTruthy();

        // await prp0501Steps.waitForKickoffOffLog(USER_ID, kickoffPrefix, kickoffOffComment);
    });

    test('Validation of kickoff on on UI for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);

        expect(createdRackNumber, 'Expected a created rack number from the create test').toBeTruthy();

        expect(kickoffOffComment, 'Expected kickoff off comment from previous test').toBeTruthy();

        await prp0501Steps.kickoffOn(createdRackNumber);

        // await prp0501Steps.waitForKickoffOnLog(
        //     USER_ID,
        //     kickoffPrefix,
        //     '',
        //     kickoffOffComment
        // );
    });

    test('Validation of delete success message on UI and PuTTY for PRP0501', async ({ page }, testInfo) => {
        const helper = new StepHelper(page, testInfo);
        const prp0501Steps = new PRP0501Steps(page, testInfo, helper);

        expect(createdRackNumber, 'Expected a created rack number from the create test').toBeTruthy();
        expect(createdProductMarker, 'Expected a product marker from the create test').toBeTruthy();

        await prp0501Steps.deleteRack(createdRackNumber);

        await prp0501Steps.waitForRackDeletionLog(
            USER_ID,
            createdProductMarker,
            createdRackNumber
        );
    });
});