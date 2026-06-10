import { test }   from '../../fixtures/testWithLogIn';
import { expect } from '@playwright/test';
import { StepHelper }    from '../../../utils/StepHelper';
import { SshHelper }     from '../../../utils/sshHelper';
import { CAL0101Steps }  from '../../../steps/CAL0101Steps';
import { CAL0101Page }   from '../../../pages/CAL0101Page';
import * as fs from 'fs';
import envConfig    from '../../../test-data/envConfig.json';
import credentials  from '../../../test-data/credentials.json';
import { calendarTestState } from '../../../utils/calendarTestState';

const USER_ID = credentials.Credentials.username;

// ── Shared test-data (generated once across all serial tests) ─────────────────
let shift1Code: string;
let shift1Label: string;
let shift2Code: string;
let shift2Label: string;
let shift3Code: string;
let shift3Label: string;
let dayCode1: string;
let dayCode2: string;
let dayLabel: string;
let weekCode: string;
let weekLabel: string;
let updatedShift1Label: string;
let updatedShift2Label: string;
let updatedShift3Label: string;
let updatedDayLabel: string;
let updatedWeekLabel: string;
let dupShift1Code: string;
let dupShift1Label: string;
let dupShift2Code: string;
let dupShift2Label: string;
let dupShift3Code: string;
let dupShift3Label: string;
let dupDayCode: string;
let dupDayLabel: string;
let dupWeekCode: string;
let dupWeekLabel: string;

// ─────────────────────────────────────────────────────────────────────────────

test.describe.serial('CAL0101 - Manage calendar element types', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        // Generate all random codes/labels once; reuse for every test in the suite
        if (!shift1Code) {
            const sshHelper = new SshHelper({ host: '127.0.0.1', username: 'local-user' }, page, testInfo);
            shift1Code  = `FS${await sshHelper.generateRandomAlphanumeric(1)}`;
            shift1Label = `FSHIFT_${await sshHelper.generateRandomAlphanumeric(3)}`;
            shift2Code  = `SS${await sshHelper.generateRandomAlphanumeric(1)}`;
            shift2Label = `SSHIFT_${await sshHelper.generateRandomAlphanumeric(3)}`;
            shift3Code  = `TS${await sshHelper.generateRandomAlphanumeric(1)}`;
            shift3Label = `TSHIFT_${await sshHelper.generateRandomAlphanumeric(3)}`;
            dayCode1    = `WD${await sshHelper.generateRandomAlphanumeric(1)}`;
            dayCode2    = `WDD${await sshHelper.generateRandomAlphanumeric(1)}`;
            dayLabel    = `WDAY_${await sshHelper.generateRandomAlphanumeric(3)}`;
            weekCode    = `WW${await sshHelper.generateRandomAlphanumeric(1)}`;
            weekLabel   = `WWEEK_${await sshHelper.generateRandomAlphanumeric(3)}`;
            // Publish weekCode so CAL0102 can select the same week type from its combo
            calendarTestState.weekCode = weekCode;
            updatedShift1Label = `FSHIFT_UPD_${await sshHelper.generateRandomAlphanumeric(3)}`;
            updatedShift2Label = `SSHIFT_UPD_${await sshHelper.generateRandomAlphanumeric(3)}`;
            updatedShift3Label = `TSHIFT_UPD_${await sshHelper.generateRandomAlphanumeric(3)}`;
            updatedDayLabel    = `WDAY_UPD_${await sshHelper.generateRandomAlphanumeric(3)}`;
            updatedWeekLabel   = `WWEEK_UPD_${await sshHelper.generateRandomAlphanumeric(2)}`;
            dupShift1Code  = `FD${await sshHelper.generateRandomAlphanumeric(1)}`;
            dupShift1Label = `FSHIFT_DUP_${await sshHelper.generateRandomAlphanumeric(3)}`;
            dupShift2Code  = `SD${await sshHelper.generateRandomAlphanumeric(1)}`;
            dupShift2Label = `SSHIFT_DUP_${await sshHelper.generateRandomAlphanumeric(3)}`;
            dupShift3Code  = `TD${await sshHelper.generateRandomAlphanumeric(1)}`;
            dupShift3Label = `TSHIFT_DUP_${await sshHelper.generateRandomAlphanumeric(3)}`;
            dupDayCode     = `DD${await sshHelper.generateRandomAlphanumeric(1)}`;
            dupDayLabel    = `WDAY_DUP_${await sshHelper.generateRandomAlphanumeric(3)}`;
            dupWeekCode    = `DW${await sshHelper.generateRandomAlphanumeric(1)}`;
            dupWeekLabel   = `WWEEK_DUP_${await sshHelper.generateRandomAlphanumeric(3)}`;
        }
    });

    // ── Screen title — list screen ────────────────────────────────────────────

    test('Validation of screen title — Manage the elements types (CAL0101)', async ({ page }, testInfo) => {
        const helper      = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);
        const cal0101Page  = new CAL0101Page(page);

        await cal0101Steps.navigateToCAL0101();
        await helper.assertElementHasText(
            cal0101Page.screenTitle,
            'Manage the elements types  (CAL0101)',
            'Verify list screen title for CAL0101'
        );
    });

    // ── Screen title — Create Shift form ──────────────────────────────────────

    test('Validation of screen title after clicking Create Shift — Create a shift type (CAL0101)', async ({ page }, testInfo) => {
        const helper      = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);
        const cal0101Page  = new CAL0101Page(page);

        await cal0101Steps.navigateToCAL0101();
        await helper.clickElement(cal0101Page.createButton,    'Click Create button');
        await helper.clickElement(cal0101Page.shiftTypeButton, 'Select Shift element type');
        await helper.assertElementHasText(
            cal0101Page.createShiftTitle,
            'Create a shift type  (CAL0101)',
            'Verify Create Shift form title'
        );
    });

    // ── Create three shift types ───────────────────────────────────────────────

    test('Validation of creating first shift type', async ({ page }, testInfo) => {
        const helper      = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        
        await cal0101Steps.createShift(shift1Code, shift1Label, '0550', '1350');
        await cal0101Steps.assertSuccessMessage(`The shift ${shift1Code} has been created`);
        console.log(`[CAL0101] First shift created — code: ${shift1Code}, label: ${shift1Label}, user: ${USER_ID}`);
    });

    test('Validation of viewing first shift type', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        await cal0101Steps.viewShift(shift1Code);
        console.log(`[CAL0101] First shift viewed — code: ${shift1Code}, user: ${USER_ID}`);
    });

    test('Validation of creating second shift type', async ({ page }, testInfo) => {
        const helper      = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        await cal0101Steps.createShift(shift2Code, shift2Label, '1350', '2150');
        console.log(`[CAL0101] Second shift created — code: ${shift2Code}, label: ${shift2Label}, user: ${USER_ID}`);
    });

    test('Validation of viewing second shift type', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        await cal0101Steps.viewShift(shift2Code);
        console.log(`[CAL0101] Second shift viewed — code: ${shift2Code}, user: ${USER_ID}`);
    });

    test('Validation of creating third shift type', async ({ page }, testInfo) => {
        const helper      = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        await cal0101Steps.createShift(shift3Code, shift3Label, '2150', '0550');
        console.log(`[CAL0101] Third shift created — code: ${shift3Code}, label: ${shift3Label}, user: ${USER_ID}`);
    });

    test('Validation of viewing third shift type', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        await cal0101Steps.viewShift(shift3Code);
        console.log(`[CAL0101] Third shift viewed — code: ${shift3Code}, user: ${USER_ID}`);
    });

    // ── Create working day with all three shifts linked ───────────────────────

    test('Validation of creating working day with 3 shifts linked', async ({ page }, testInfo) => {
        const helper      = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        await cal0101Steps.createDayType(
            dayCode1,
            dayCode2,
            dayLabel,
            [shift1Label, shift2Label, shift3Label]
        );
        await cal0101Steps.assertSuccessMessage(`The day ${dayCode1} has been created`);
        console.log(`[CAL0101] Working day created — initial code: ${dayCode1}, final code: ${dayCode2}, label: ${dayLabel}, user: ${USER_ID}`);
    });

    test('Validation of viewing working day with 3 shifts linked', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        await cal0101Steps.viewDayType(dayCode1);
        console.log(`[CAL0101] Working day viewed — code: ${dayCode1}, label: ${dayLabel}, user: ${USER_ID}`);
    });

    // ── Create working week with working day linked for all 7 days ────────────

    test('Validation of creating working week with working day linked', async ({ page }, testInfo) => {
        const helper      = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        await cal0101Steps.createWeekType(weekCode, weekLabel, dayCode1);
        await cal0101Steps.assertSuccessMessage(`The week ${weekCode} has been created`);
        console.log(`[CAL0101] Working week created — code: ${weekCode}, label: ${weekLabel}, day type: ${dayCode1}, user: ${USER_ID}`);
    });

    test('Validation of viewing working week with working day linked', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();
        await cal0101Steps.viewWeekType(weekCode);
        console.log(`[CAL0101] Working week viewed — code: ${weekCode}, label: ${weekLabel}, user: ${USER_ID}`);
    });

    // ── Modify all element types in one test (single navigation) ─────────────

    test('Validation of modifying shift types, working day and working week labels', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();

        // Modify three shift types
        await cal0101Steps.modifyShift(shift1Code, shift1Label, updatedShift1Label);
        await cal0101Steps.assertSuccessMessage(`The shift ${shift1Code} has been modified`);
        console.log(`[CAL0101] First shift modified — code: ${shift1Code}, old: ${shift1Label}, new: ${updatedShift1Label}, user: ${USER_ID}`);

        await cal0101Steps.modifyShift(shift2Code, shift2Label, updatedShift2Label);
        console.log(`[CAL0101] Second shift modified — code: ${shift2Code}, old: ${shift2Label}, new: ${updatedShift2Label}, user: ${USER_ID}`);

        await cal0101Steps.modifyShift(shift3Code, shift3Label, updatedShift3Label);
        console.log(`[CAL0101] Third shift modified — code: ${shift3Code}, old: ${shift3Label}, new: ${updatedShift3Label}, user: ${USER_ID}`);

        // Modify working day
        await cal0101Steps.modifyDayType(dayCode1, dayLabel, updatedDayLabel);
        console.log(`[CAL0101] Working day modified — code: ${dayCode1}, old: ${dayLabel}, new: ${updatedDayLabel}, user: ${USER_ID}`);

        // Modify working week
        await cal0101Steps.modifyWeekType(weekCode, weekLabel, updatedWeekLabel);
        console.log(`[CAL0101] Working week modified — code: ${weekCode}, old: ${weekLabel}, new: ${updatedWeekLabel}, user: ${USER_ID}`);
    });

    // ── Duplicate week, day and three shift types ─────────────────────────────
    // Single navigation: duplicate all 5 records in one test, ordered top-down
    // (week → day → shifts) following the application hierarchy.

    test('Validation of duplicating working week, working day and shift types', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();

        // Duplicate working week (source = modified week label / code)
        await cal0101Steps.duplicateWeekType(weekCode, dupWeekCode, dupWeekLabel);
        console.log(`[CAL0101] Week duplicated — source: ${weekCode}, new code: ${dupWeekCode}, new label: ${dupWeekLabel}, user: ${USER_ID}`);

        // Duplicate working day
        await cal0101Steps.duplicateDayType(dayCode1, dupDayCode, dupDayLabel);
        console.log(`[CAL0101] Day duplicated — source: ${dayCode1}, new code: ${dupDayCode}, new label: ${dupDayLabel}, user: ${USER_ID}`);

        // Duplicate three shifts (currentLabel = updatedXxxLabel after modify test)
        await cal0101Steps.duplicateShift(shift1Code, updatedShift1Label, dupShift1Code, dupShift1Label);
        console.log(`[CAL0101] Shift 1 duplicated — source: ${shift1Code}, new code: ${dupShift1Code}, new label: ${dupShift1Label}, user: ${USER_ID}`);

        await cal0101Steps.duplicateShift(shift2Code, updatedShift2Label, dupShift2Code, dupShift2Label);
        console.log(`[CAL0101] Shift 2 duplicated — source: ${shift2Code}, new code: ${dupShift2Code}, new label: ${dupShift2Label}, user: ${USER_ID}`);

        await cal0101Steps.duplicateShift(shift3Code, updatedShift3Label, dupShift3Code, dupShift3Label);
        console.log(`[CAL0101] Shift 3 duplicated — source: ${shift3Code}, new code: ${dupShift3Code}, new label: ${dupShift3Label}, user: ${USER_ID}`);
    });

    // ── Delete all duplicated records ─────────────────────────────────────────
    // Single navigation: delete week → day → shifts (top-down so children of
    // the duplicated week are removed first before the week itself would block).

    test('Validation of deleting duplicated working week, working day and shift types', async ({ page }, testInfo) => {
        const helper       = new StepHelper(page, testInfo);
        const cal0101Steps = new CAL0101Steps(page, testInfo, helper);

        await cal0101Steps.navigateToCAL0101();

        // Delete duplicated week first (top of hierarchy)
        await cal0101Steps.deleteByLabel(dupWeekLabel, 'week');
        await cal0101Steps.assertSuccessMessage(`The week ${dupWeekCode} has been deleted`);
        console.log(`[CAL0101] Duplicated week deleted — label: ${dupWeekLabel}, user: ${USER_ID}`);

        // Delete duplicated day
        await cal0101Steps.deleteByLabel(dupDayLabel, 'day');
        console.log(`[CAL0101] Duplicated day deleted — label: ${dupDayLabel}, user: ${USER_ID}`);

        // Delete duplicated shifts
        await cal0101Steps.deleteByLabel(dupShift1Label, 'shift');
        console.log(`[CAL0101] Duplicated shift 1 deleted — label: ${dupShift1Label}, user: ${USER_ID}`);

        await cal0101Steps.deleteByLabel(dupShift2Label, 'shift');
        console.log(`[CAL0101] Duplicated shift 2 deleted — label: ${dupShift2Label}, user: ${USER_ID}`);

        await cal0101Steps.deleteByLabel(dupShift3Label, 'shift');
        console.log(`[CAL0101] Duplicated shift 3 deleted — label: ${dupShift3Label}, user: ${USER_ID}`);
    });

});

