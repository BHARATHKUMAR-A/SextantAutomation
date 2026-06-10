import { expect } from '@playwright/test';
import { test } from '../../fixtures/testWithLogIn';
import { StepHelper } from '../../../utils/StepHelper';
import { SshHelper } from '../../../utils/sshHelper';
import { TOP401ScreenSteps } from '../../../steps/TOP401screenSteps';
import { TOP501ScreenSteps } from '../../../steps/TOP501ScreenSteps';
import { Top0501ManageWorkstationsPage } from '../../../pages/top0501ManageWorkstationsPage';
import { TOP502ScreenSteps } from '../../../steps/TOP502ScreenSteps';
import { TOP601ScreenSteps } from '../../../steps/TOP601ScreenSteps';
import { Top0601ManageWorkOperationsPage } from '../../../pages/TOP601ManageWorkOperationsPage';
import { Top0401ManageProductionAreasPage } from '../../../pages/Top0401ManageProductionAreasPage';
import { sampleDemoPage } from '../../../pages/sampleDemoPage';
import { Top0502ManageWorkstationTypesPage } from '../../../pages/TOP0502ManageWorkStationsTypesPage';
import * as allure from 'allure-js-commons';



let workshopName: string;

test.describe.serial('Log verification after UI actions For TOP0601', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    if (!workshopName) {
      const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
      workshopName = `Y${await sshHelper.generateRandomAlphanumeric(1)}`;
    }
  });


  test('Validation of field error messages on UI for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const top0501ManageWorkstationsPage = new Top0501ManageWorkstationsPage(page);
    const top0401ManageProductionAreasPage = new Top0401ManageProductionAreasPage(page);
    const sampleDemoPag = new sampleDemoPage(page);
    const top0502ManageWorkstationTypesPage = new Top0502ManageWorkstationTypesPage(page);
    const top0601ManageWorkOperationsPage = new Top0601ManageWorkOperationsPage(page);


    await top401ScreenSteps.fieldErrorCheck(top0601ManageWorkOperationsPage.top0601ManageWorkOperations);
    await helper.enterText(top0401ManageProductionAreasPage.workshopField, 'EBAS1', "enter EBAS1 in workshop field");
    await page.waitForTimeout(3000);
    await helper.clickElement(sampleDemoPag.searchButton, "click on Search button");
    await helper.assertElementHasText(top0501ManageWorkstationsPage.zoneIsRequiredErrorMessage, "The zone is mandatory", "The zone is mandatory error message validation");
    await helper.clickElement(top0601ManageWorkOperationsPage.zonePen, "click on zone pen option button");
    await helper.clickElement(top0501ManageWorkstationsPage.zoneOption, "select C1 zone option");
    await helper.clickElement(sampleDemoPag.searchButton, "click on Search button");
    await helper.assertElementHasText(top0502ManageWorkstationTypesPage.stationRequiredErrorMessage, "The station is required", "The station is required error message ");
    await page.waitForTimeout(3000);

  });


  test('Validation of creation abondened error message on  UI for TOP0601', async ({ page }, testInfo) => {
    allure.severity('normal');

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const top0601ScreenSteps = new TOP601ScreenSteps(page, testInfo, helper);
    const top0601ManageWorkOperationsPage = new Top0601ManageWorkOperationsPage(page);


    await top0601ScreenSteps.Search601("SG6", "2000", "EBAS1");

    await top401ScreenSteps.creationAbondened(top0601ManageWorkOperationsPage.OperationField, top0601ManageWorkOperationsPage.labelField, workshopName);
    await page.waitForTimeout(3000);


  });

  test('Validation of creation success message on both UI and PuTTy for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top0601ScreenSteps = new TOP601ScreenSteps(page, testInfo, helper);
    const top0601ManageWorkOperationsPage = new Top0601ManageWorkOperationsPage(page);


    await top0601ScreenSteps.Search601("SG6", "2000", "EBAS1");

    await top401ScreenSteps.creation(top0601ManageWorkOperationsPage.OperationField, top0601ManageWorkOperationsPage.labelField, workshopName);

    const { groups } = await sshHelper.CreationLogAssertion(sshHelper, 'SF75684', workshopName, 'OPERAT', 500, 120000, 'TOP0601 topology creation');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Création de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[OPERAT])`);

    await page.waitForTimeout(3000);


  });

  test('Validation of view in UI for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const top0601ScreenSteps = new TOP601ScreenSteps(page, testInfo, helper);


    await top0601ScreenSteps.Search601("SG6", "2000", "EBAS1");


    await top401ScreenSteps.view(`(//div[text()="${workshopName}"])[2]`);
    await helper.captureScreenshot(`View_Workshop_${workshopName}_Screen`);
    console.log(`View functionality for workshop "${workshopName}" is validated and screenshot is captured.`);


    await page.waitForTimeout(3000);


  });

  test('Validation of modification abondened error message on  UI for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const top0601ScreenSteps = new TOP601ScreenSteps(page, testInfo, helper);


    await top0601ScreenSteps.Search601("SG6", "2000", "EBAS1");

    await top401ScreenSteps.modifyAbondened(`(//div[text()="${workshopName}"])[2]`);
    await page.waitForTimeout(3000);


  });

  test('Validation of modify  success message on both UI and PuTTy for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top0601ScreenSteps = new TOP601ScreenSteps(page, testInfo, helper);

    await top0601ScreenSteps.Search601("SG6", "2000", "EBAS1");

    await top401ScreenSteps.modify(`(//div[text()="${workshopName}"])[2]`);

    const { groups } = await sshHelper.ModifyLogAssertion(sshHelper, 'SF75684', workshopName, 'OPERAT', 500, 120000, 'TOP0601 topology modification');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Modification de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[OPERAT])`);

    await page.waitForTimeout(3000);


  });


  test('Validation of deletion abondened error message on  UI for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top502ScreenSteps = new TOP502ScreenSteps(page, testInfo, helper);
    const top0601ScreenSteps = new TOP601ScreenSteps(page, testInfo, helper);


    await top0601ScreenSteps.Search601("SG6", "2000", "EBAS1");


    await top502ScreenSteps.VerifyDeleteAbondenedError(`(//div[text()="${workshopName}"])[2]`);
    await page.waitForTimeout(3000);


  });

  test('Validation of delete  success message on both UI and PuTTy for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);


    const top0601ScreenSteps = new TOP601ScreenSteps(page, testInfo, helper);

    await top0601ScreenSteps.Search601("SG6", "2000", "EBAS1");

    await top401ScreenSteps.delete(`(//div[text()="${workshopName}"])[2]`);
    await helper.captureScreenshot(`Delete_Workshop_${workshopName}_Screen`);
    console.log(`Delete functionality for workshop "${workshopName}" is validated and screenshot is captured.`);

    const { groups } = await sshHelper.DeleteLogAssertion(sshHelper, 'SF75684', workshopName, 'OPERAT', 500, 120000, 'TOP0601 topology deletion');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Suppression de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[OPERAT])`);

    await page.waitForTimeout(3000);


  });

});

