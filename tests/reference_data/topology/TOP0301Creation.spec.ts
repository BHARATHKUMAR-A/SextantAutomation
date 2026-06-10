import { expect } from '@playwright/test';
import { test } from '../../fixtures/testWithLogIn';
import { PuttyLogReader } from '../../../utils/puttyLogReader';
import envConfig from '../../../test-data/envConfig.json';
import { StepHelper } from '../../../utils/StepHelper';
import { sampleDemoPage } from '../../../pages/sampleDemoPage';
import * as fs from 'fs';

// ── Configuration ────────────────────────────────────────────────────────────

const DEFAULT_PUTTY_LOG_FILE = 'C:\\Users\\SF75684\\Sextent_Automation_Workspace\\Sextent\\logs\\putty.log';
const PUTTY_LOG_FILE = fs.existsSync(envConfig.logFilePath.puttyLogFile)
  ? envConfig.logFilePath.puttyLogFile
  : DEFAULT_PUTTY_LOG_FILE;
const TAIL_LINES = 50; /** Number of trailing lines to read after each UI action. */

// ── Shared reader (created once for the whole file) ──────────────────────────

let verifier: PuttyLogReader;
test.beforeAll(() => {
  // PuttyLogReader reads the local file – no async connection needed.
  verifier = new PuttyLogReader(PUTTY_LOG_FILE);
});




// ── Helper function for random alphanumeric generation ──────────────────────

function generateRandomAlphanumeric(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ── Tests ────────────────────────────────────────────────────────────────────

test.describe('Log verification after UI actions', () => {

  test('Login flow should produce an auth log entry', async ({ page }, testInfo) => {

    const helper = new StepHelper(page, testInfo);
    const sampleDemo = new sampleDemoPage(page);


    await helper.clickElement(sampleDemo.tt, "click on Reference data");
    await helper.clickElement(sampleDemo.topology, "click on Topology");
    await helper.clickElement(sampleDemo.top0301ManageWokshops, "click on TOP0301 - Manage workshops");
    await helper.clickElement(sampleDemo.penPlant, "click on Pen Plant");
    await helper.clickElement(sampleDemo.plantOptionSelection, "select SZENTGOTTHARD plant option");
    await helper.clickElement(sampleDemo.sgrPen, "click on SGR Pen");
    await helper.enterText(sampleDemo.sgrPenOptionField, "SG6", "enter SG6 in pen selection field");
    await helper.clickElement(sampleDemo.searchButton, "click on Search button");
    await helper.clickElement(sampleDemo.createButton, "click on Create button");
    const workshopName = `UU${generateRandomAlphanumeric(2)}`;
    console.log(`Generated workshop name: ${workshopName}`);
    await helper.enterText(sampleDemo.workshopField, workshopName, "enter Test Workshop in workshop field");
    const today = new Date();
    const formattedDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const labelName = `Test Label ${formattedDate}`;
    console.log(`Generated label name: ${labelName}`);
    await helper.enterText(sampleDemo.labelField, labelName, "enter Test Label in label field");
    await helper.clickElement(sampleDemo.validateButton, "click on Validate button");

    // Validate TOP0301 topology creation entry in PuTTY log.
    await page.waitForTimeout(1000);
    const logAfterLogin = verifier.tail(TAIL_LINES);


    const topologyCreationRegex = new RegExp(
      `\\[INFO\\][\\s\\S]*?` +
      `\\((?<userId>SF75684)\\)[\\s\\S]*?` +
      `(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3})[\\s\\S]*?` +
      `(?<successMessage>` +
      `Création de l'élément de topologie ` +
      `\\(Id=\\[(?<id>\\d+)\\], Code=\\[${workshopName}\\], Type=\\[ATELIER\\]\\)` +
      `)`
    );


    verifier.assertContains(logAfterLogin, topologyCreationRegex, 'TOP0301 topology creation');

    const groups = verifier.extractGroups(logAfterLogin, topologyCreationRegex, 'Login entry validation');
    expect(groups.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(groups.successMessage).toMatch(`Création de l'élément de topologie (Id=[${groups.id}], Code=[${workshopName}], Type=[ATELIER])`);

    await page.waitForTimeout(3000);


  });



});

