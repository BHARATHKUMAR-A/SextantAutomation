import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { CPT0202Page } from '../../pages/CPT0202Page';
import { CPT0202ScreenSteps } from '../../steps/CPT0202Steps';



let counterName: string;
let selectedCounterText: string | undefined;
let frameLocCommon: any;


test.describe.serial('Log verification after UI actions', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        frameLocCommon = page.locator('frame[name="main"]').contentFrame();
        if (!counterName) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            counterName = `TEST_${await sshHelper.generateRandomAlphanumeric(1)}`;
        }
    });

    test('Validation of CPT0202 title on main screen UI for CPT0202', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0202Page = new CPT0202Page(page);
        const cpt0202Steps = new CPT0202ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;


        await cpt0202Steps.navigateToCPT0202Screen();
        await page.waitForTimeout(3000);

    });
    test('Validation of CPT0202 screen filter and new selection on UI for CPT0202', async ({ page }, testInfo) => {

        const helper = new StepHelper(page, testInfo);
        const cpt0202Page = new CPT0202Page(page);
        const cpt0202Steps = new CPT0202ScreenSteps(page, testInfo, helper);
        selectedCounterText = undefined;


        await cpt0202Steps.navigateToCPT0202Screen();
        await cpt0202Steps.CPT0202ScreenCheck();
        await page.waitForTimeout(3000);

    });

});