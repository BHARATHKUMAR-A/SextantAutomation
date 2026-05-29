import { expect } from '@playwright/test';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { TOP401ScreenSteps } from '../../steps/TOP401screenSteps';
import { TOP502ScreenSteps } from '../../steps/TOP502ScreenSteps';
import { sampleDemoPage } from '../../pages/sampleDemoPage';
import { Top0401ManageProductionAreasPage } from '../../pages/Top0401ManageProductionAreasPage';
import { Top0501ManageWorkstationsPage } from '../../pages/top0501ManageWorkstationsPage';
import { Top0502ManageWorkstationTypesPage } from '../../pages/TOP0502ManageWorkStationsTypesPage';



let workshopName: string;
let createdStationTypeTextForView: string | undefined;

test.describe.serial('Log verification after UI actions', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    if (!workshopName) {
      const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
      workshopName = `Y${await sshHelper.generateRandomAlphanumeric(1)}`;
    }
  });

  test('Validation of field error messages on UI for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const top0501ManageWorkstationsPage = new Top0501ManageWorkstationsPage(page);
    const top0401ManageProductionAreasPage = new Top0401ManageProductionAreasPage(page);
    const sampleDemoPag = new sampleDemoPage(page);
    const top0502ManageWorkstationTypesPage = new Top0502ManageWorkstationTypesPage(page);


    await top401ScreenSteps.fieldErrorCheck(top0502ManageWorkstationTypesPage.top0502ManageWorkstationTypes);
    await helper.enterText(top0401ManageProductionAreasPage.workshopField, 'EBAS1', "enter EBAS1 in workshop field");
    await page.waitForTimeout(3000);
    await helper.clickElement(sampleDemoPag.searchButton, "click on Search button");
    await helper.assertElementHasText(top0501ManageWorkstationsPage.zoneIsRequiredErrorMessage, "The zone is mandatory", "The zone is mandatory error message validation");
    await helper.clickElement(top0502ManageWorkstationTypesPage.zonePen, "click on zone pen option button");
    await helper.clickElement(top0501ManageWorkstationsPage.zoneOption, "select C1 zone option");
    await helper.clickElement(sampleDemoPag.searchButton, "click on Search button");
    await helper.assertElementHasText(top0502ManageWorkstationTypesPage.stationRequiredErrorMessage, "The station is required", "The station is required error message ");


    await page.waitForTimeout(3000);


  });


  test('Validation of creation abondened error message on  UI for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top502ScreenSteps = new TOP502ScreenSteps(page, testInfo, helper);
    createdStationTypeTextForView = undefined

    await top502ScreenSteps.Search502("SG6", "2000", "EBAS1");

    await top502ScreenSteps.creationAbondened();
    await page.waitForTimeout(3000);


  });

  test('Validation of creation success message on both UI and PuTTy for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top502ScreenSteps = new TOP502ScreenSteps(page, testInfo, helper);
    createdStationTypeTextForView = undefined

    await top502ScreenSteps.Search502("SG6", "2000", "EBAS1");

    await top502ScreenSteps.creation502();
    createdStationTypeTextForView = top502ScreenSteps.typeOfStationOptionText;

    const { groups } = await sshHelper.CreationLogAssertionFor502(sshHelper, 'SF75684', 'POSTE', 500, 120000, 'TOP0502 topology creation');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Création du poste typé [POSTE_BANC[NumBanc=201;]] associé au poste (Id=[${groups.id}], Code=[${groups.code}], Type=[${groups.Type}])`);

    await page.waitForTimeout(3000);


  });

  test('Validation of Rights functionality add and remove all lines on  UI  for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top502ScreenSteps = new TOP502ScreenSteps(page, testInfo, helper);

    await top502ScreenSteps.Search502("SG6", "2000", "EBAS1");

    await top502ScreenSteps.RightsAddAllLeftRemoveToRight(`(//div[text()="${createdStationTypeTextForView}"])[2]`);




    await page.waitForTimeout(3000);


  });

  test('Validation of view in UI for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top502ScreenSteps = new TOP502ScreenSteps(page, testInfo, helper);

    await top502ScreenSteps.Search502("SG6", "2000", "EBAS1");
    console.log(`✅(//div[text()="${createdStationTypeTextForView}"])[2]`);
    await top401ScreenSteps.view(`(//div[text()="${createdStationTypeTextForView}"])[2]`);
    await helper.captureScreenshot(`View_Workshop_${createdStationTypeTextForView}_Screen`);
    console.log(`View functionality for workshop "${createdStationTypeTextForView}" is validated and screenshot is captured.`);
    await page.waitForTimeout(3000);


  });

  test('Validation of modification abondened error message on  UI for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top502ScreenSteps = new TOP502ScreenSteps(page, testInfo, helper);

    await top502ScreenSteps.Search502("SG6", "2000", "EBAS1");

    await top502ScreenSteps.modifyAbondened(`(//div[text()="${createdStationTypeTextForView}"])[2]`, '666');
    await page.waitForTimeout(3000);


  });

  test('Validation of modify  success message on both UI and PuTTy for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top502ScreenSteps = new TOP502ScreenSteps(page, testInfo, helper);

    await top502ScreenSteps.Search502("SG6", "2000", "EBAS1");

    const newBatchNum = '666';

    await top502ScreenSteps.modify(`(//div[text()="${createdStationTypeTextForView}"])[2]`, newBatchNum);

    const { groups } = await sshHelper.ModifyLogAssertionFor502(sshHelper, 'SF75684', newBatchNum, 'POSTE', 500, 120000, 'TOP0502 topology modification');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);

    await page.waitForTimeout(3000);


  });

  test('Validation of Deletion abondened error message on  UI for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top502ScreenSteps = new TOP502ScreenSteps(page, testInfo, helper);

    await top502ScreenSteps.Search502("SG6", "2000", "EBAS1");

    await top502ScreenSteps.VerifyDeleteAbondenedError(`(//div[text()="${createdStationTypeTextForView}"])[2]`);
    await page.waitForTimeout(3000);


  });

  test('Validation of delete  success message on both UI and PuTTy for TOP0502', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const top502ScreenSteps = new TOP502ScreenSteps(page, testInfo, helper);

    await top502ScreenSteps.Search502("SG6", "2000", "EBAS1");



    await top502ScreenSteps.delete(`(//div[text()="${createdStationTypeTextForView}"])[2]`);
    await helper.captureScreenshot(`Delete_Workshop_${createdStationTypeTextForView}_Screen`);
    console.log(`Delete functionality for workshop "${createdStationTypeTextForView}" is validated and screenshot is captured.`);

    const { groups } = await sshHelper.DeletionLogAssertionFor502(sshHelper, 'SF75684', 'POSTE', 500, 120000, 'TOP0502 topology deletion');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);

    await page.waitForTimeout(3000);


  });



});
