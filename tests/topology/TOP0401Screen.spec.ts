import { expect } from '@playwright/test';
import { test } from '../fixtures/testWithLogIn';
import { StepHelper } from '../../utils/StepHelper';
import { SshHelper } from '../../utils/sshHelper';
import { TOP401ScreenSteps } from '../../steps/TOP401screenSteps';
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


  test('Validation of field error messages on UI for TOP0401', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const TOP0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);

    await top401ScreenSteps.fieldErrorCheck(TOP0401ManageProductionAreas.top0401ManageProductionAreas);
    await page.waitForTimeout(3000);


  });

  test('Validation of creation abondened error message on  UI for TOP0401', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const TOP0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);

    await top401ScreenSteps.Search("SG6", "EBAS1");
    await top401ScreenSteps.creationAbondened(TOP0401ManageProductionAreas.zoneFieldTop401, TOP0401ManageProductionAreas.labelFieldTop401, workshopName);
    await page.waitForTimeout(3000);


  });

  test('Validation of creation success message on both UI and PuTTy', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
    const TOP0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);



    await top401ScreenSteps.Search("SG6", "EBAS1");

    await top401ScreenSteps.creation(TOP0401ManageProductionAreas.zoneFieldTop401, TOP0401ManageProductionAreas.labelFieldTop401, workshopName);

    const { groups } = await sshHelper.CreationLogAssertion(sshHelper, 'SF75684', workshopName, 'ZONE', 500, 120000, 'TOP0401 topology creation');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Création de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[ZONE])`);

    await page.waitForTimeout(3000);


  });

  test('Validation of view in UI', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);



    await top401ScreenSteps.Search("SG6", "EBAS1");


    await top401ScreenSteps.view(`(//td[text()="${workshopName}"])[2]`);
    await helper.captureScreenshot(`View_Workshop_${workshopName}_Screen`);
    console.log(`View functionality for workshop "${workshopName}" is validated and screenshot is captured.`);


    await page.waitForTimeout(3000);


  });

  test('Validation of modification abondened error message on  UI for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const TOP0401ManageProductionAreas = new Top0401ManageProductionAreasPage(page);



    await top401ScreenSteps.Search("SG6", "EBAS1");

    await top401ScreenSteps.modifyAbondened(`(//td[text()="${workshopName}"])[2]`);
    await page.waitForTimeout(3000);


  });

  test('Validation of modify  success message on both UI and PuTTy', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);



    await top401ScreenSteps.Search("SG6", "EBAS1");


    await top401ScreenSteps.modify(`(//td[text()="${workshopName}"])[2]`);

    const { groups } = await sshHelper.ModifyLogAssertion(sshHelper, 'SF75684', workshopName, 'ZONE', 500, 120000, 'TOP0401 topology modification');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Modification de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[ZONE])`);

    await page.waitForTimeout(3000);


  });

  test('Validation of deletion abondened error message on  UI for TOP0601', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);



    await top401ScreenSteps.Search("SG6", "EBAS1");

    await top401ScreenSteps.VerifydeleteAbondenedError(`(//td[text()="${workshopName}"])[2]`);
    await page.waitForTimeout(3000);


  });

  test('Validation of delete  success message on both UI and PuTTy', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const top401ScreenSteps = new TOP401ScreenSteps(page, testInfo, helper);
    const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);



    await top401ScreenSteps.Search("SG6", "EBAS1");


    await top401ScreenSteps.delete(`(//td[text()="${workshopName}"])[2]`);
    await helper.captureScreenshot(`Delete_Workshop_${workshopName}_Screen`);
    console.log(`Delete functionality for workshop "${workshopName}" is validated and screenshot is captured.`);

    const { groups } = await sshHelper.DeleteLogAssertion(sshHelper, 'SF75684', workshopName, 'ZONE', 500, 120000, 'TOP0401 topology deletion');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toContain(`Suppression de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[ZONE])`);

    await page.waitForTimeout(3000);


  });







});
