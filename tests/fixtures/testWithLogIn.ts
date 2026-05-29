import { test as base } from '@playwright/test';
import { LoginSteps } from '../../steps/loginSteps';
import { StepHelper } from '../../utils/StepHelper';
import credentials from '../../test-data/credentials.json';

export const test = base.extend({
  page: async ({ browser }, use, testInfo) => {
    const username = credentials.Credentials.username;
    const password = credentials.Credentials.password;

    const context = await browser.newContext({
      httpCredentials: { username, password },
      viewport: null,
    });

    let page = await context.newPage();

    // --- your login block ---
    const helper = new StepHelper(page, testInfo);
    const stepLogin = new LoginSteps(page, testInfo, helper);

    await stepLogin.navigate();
    const nextPagePromise = context.waitForEvent('page', { timeout: 10000 }).catch(() => null);
    await helper.clickButtonInFrame("login", "#buttonUserLogin", "login frame");

    const nextPage = await nextPagePromise;
    if (nextPage) {
      page = nextPage;
    } else if (page.isClosed()) {
      const openPages = context.pages();
      if (openPages.length === 0) {
        throw new Error('Login closed the page and no replacement page was found in the browser context.');
      }
      page = openPages[openPages.length - 1];
    }

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle').catch(() => undefined);

    // expose the page for the test
    await use(page);

    await context.close();
  },
});