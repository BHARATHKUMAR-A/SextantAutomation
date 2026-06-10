// 
import { test } from '../../fixtures/testWithLogIn'
import { demoSteps } from '../../../steps/demoSteps';
import { StepHelper } from '../../../utils/StepHelper';
import * as allure from 'allure-js-commons';

test('Verify touchScreen', async ({ page }, testInfo) => {
    
allure.severity('critical');  //  label added

  const helper = new StepHelper(page, testInfo);
  const demoStep = new demoSteps(page, testInfo, helper);

  await demoStep.Test1(page.context());

  // Your actual test logic
});
