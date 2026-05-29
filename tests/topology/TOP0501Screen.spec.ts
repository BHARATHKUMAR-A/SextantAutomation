import { expect } from '@playwright/test';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { TOP401ScreenSteps } from '../../steps/TOP401screenSteps';
import { TOP501ScreenSteps } from '../../steps/TOP501ScreenSteps';
import { Top0501ManageWorkstationsPage } from '../../pages/top0501ManageWorkstationsPage';
import { Top0401ManageProductionAreasPage } from '../../pages/Top0401ManageProductionAreasPage';
import { sampleDemoPage } from '../../pages/sampleDemoPage';



let workshopName: string;

test.describe.serial('Log verification after UI actions', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    if (!workshopName) {
      const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
      workshopName = `Y${await sshHelper.generateRandomAlphanumeric(1)}`;
    }
  });


  test('Validation of field error messages on UI for TOP0501', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const top0501ManageWorkstationsPage = new Top0501ManageWorkstationsPage(page);
    const top0401ManageProductionAreasPage = new Top0401ManageProductionAreasPage(page);
    const sampleDemoPag = new sampleDemoPage(page);


    await top401ScreenSteps.fieldErrorCheck(top0501ManageWorkstationsPage.top0501ManageWorkstations);
    await helper.enterText(top0401ManageProductionAreasPage.workshopField, 'EBAS1', "enter EBAS1 in workshop field");
    await page.waitForTimeout(3000);
    await helper.clickElement(sampleDemoPag.searchButton, "click on Search button");
    await helper.assertElementHasText(top0501ManageWorkstationsPage.zoneIsRequiredErrorMessage, "The zone is mandatory", "The zone is mandatory error message validation");
    await page.waitForTimeout(3000);


  });


  test('Validation of creation abondened error message on  UI for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const top501ScreenSteps = new TOP501ScreenSteps(page, testInfo, helper);
    const top0501ManageWorkstationsPage = new Top0501ManageWorkstationsPage(page);


    await top501ScreenSteps.Search501("SG6", "EBAS1");

    await top401ScreenSteps.creationAbondened(top0501ManageWorkstationsPage.stationAtCreation, top0501ManageWorkstationsPage.labelFieldTop501, workshopName);
    await page.waitForTimeout(3000);


  });

  test('Validation of creation success message on both UI and PuTTy for TOP0501', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const top501ScreenSteps = new TOP501ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top0501ManageWorkstationsPage = new Top0501ManageWorkstationsPage(page);



    await top501ScreenSteps.Search501("SG6", "EBAS1");

    await top401ScreenSteps.creation(top0501ManageWorkstationsPage.stationAtCreation, top0501ManageWorkstationsPage.labelFieldTop501, workshopName);

    const { groups } = await sshHelper.CreationLogAssertion(sshHelper, 'SF75684', workshopName, 'POSTE', 500, 120000, 'TOP0501 topology creation');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Création de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[POSTE])`);

    await page.waitForTimeout(3000);


  });

  test('Validation of view in UI for TOP0501', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top501ScreenSteps = new TOP501ScreenSteps(page, testInfo, helper);




    await top501ScreenSteps.Search501("SG6", "EBAS1");


    await top401ScreenSteps.view(`(//div[text()="${workshopName}"])[2]`);
    await helper.captureScreenshot(`View_Workshop_${workshopName}_Screen`);
    console.log(`View functionality for workshop "${workshopName}" is validated and screenshot is captured.`);


    await page.waitForTimeout(3000);


  });


  test('Validation of modification abondened error message on  UI for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top501ScreenSteps = new TOP501ScreenSteps(page, testInfo, helper);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);


    await top501ScreenSteps.Search501("SG6", "EBAS1");
    await top401ScreenSteps.modifyAbondened(`(//div[text()="${workshopName}"])[2]`);
    await page.waitForTimeout(3000);


  });

  test('Validation of modify  success message on both UI and PuTTy for TOP0501', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top501ScreenSteps = new TOP501ScreenSteps(page, testInfo, helper);




    await top501ScreenSteps.Search501("SG6", "EBAS1");



    await top401ScreenSteps.modify(`(//div[text()="${workshopName}"])[2]`);

    const { groups } = await sshHelper.ModifyLogAssertion(sshHelper, 'SF75684', workshopName, 'POSTE', 500, 120000, 'TOP0501 topology modification');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Modification de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[POSTE])`);

    await page.waitForTimeout(3000);


  });

  test('Validation of deletion abondened error message on  UI for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top501ScreenSteps = new TOP501ScreenSteps(page, testInfo, helper);
    // const top0501ManageWorkstationsPage = new Top0501ManageWorkstationsPage(page);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);


    await top501ScreenSteps.Search501("SG6", "EBAS1");
    await top401ScreenSteps.VerifydeleteAbondenedError(`(//div[text()="${workshopName}"])[2]`);
    await page.waitForTimeout(3000);


  });

  test('Validation of delete  success message on both UI and PuTTy for TOP0501', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top501ScreenSteps = new TOP501ScreenSteps(page, testInfo, helper);




    await top501ScreenSteps.Search501("SG6", "EBAS1");

    await top401ScreenSteps.delete(`(//div[text()="${workshopName}"])[2]`);
    await helper.captureScreenshot(`Delete_Workshop_${workshopName}_Screen`);
    console.log(`Delete functionality for workshop "${workshopName}" is validated and screenshot is captured.`);

    const { groups } = await sshHelper.DeleteLogAssertion(sshHelper, 'SF75684', workshopName, 'POSTE', 500, 120000, 'TOP0501 topology deletion');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Suppression de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[POSTE])`);

    await page.waitForTimeout(3000);


  });

});
