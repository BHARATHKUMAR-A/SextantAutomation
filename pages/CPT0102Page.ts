import { Page, Locator } from '@playwright/test';


export class CPT0102Page {
    productionGoals: Locator;
    CPT0102: Locator;
    createButton: Locator;
    counterCp_Redeb: Locator;
    // counterGateSelection: Locator
    add: Locator;
    associateCounterOption: Locator;
    delete: Locator;
    dayTypePen: Locator;
    dayTypePenForDuplicate: Locator;
    dayTypeOptionWorkingDay: Locator;
    dayTypeOptionHalfWorkingDay: Locator;
    dateEntry: Locator;
    day20: Locator;
    shift1Field: Locator;
    shift2Field: Locator;
    shift3Field: Locator;
    validateButton: Locator;
    cancelButton: Locator;
    noResultErrorMessage: Locator;
    creationSuccessMessage: Locator;
    creationAbondenedMessage: Locator;
    deletionSuccessMessage: Locator;
    viewButton: Locator;
    goalPen1: Locator;
    goalPen2: Locator;
    goalPen3: Locator;
    modifyErrorMessage: Locator;
    workingDayOption: Locator;
    modifyButton: Locator;
    shift1FieldMin: Locator;
    shift2FieldMin: Locator;
    shift3FieldMin: Locator;
    shift1FieldMax: Locator;
    shift2FieldMax: Locator;
    shift3FieldMax: Locator;
    dayFieldMin: Locator;
    dayFieldMax: Locator;
    yesButton: Locator;
    duplicateErrorMessage: Locator;
    duplicateButton: Locator;
    duplicateSuccessMessage: Locator;
    deleteButton: Locator;
    deleteErrorMessage: Locator;
    deleteSuccessMessage: Locator;
    noCounterAssociatedErrorMessage: Locator;
    fieldRequiredErrorMessage: Locator;




    constructor(page: Page) {

        //initial step locators

        // const frameSameLoc = page.locator('frame[name="menu"]').contentFrame()

        this.productionGoals = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'Production goals', exact: true });
        this.CPT0102 = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'CPT0102 - Manage production' });
        this.createButton = page.locator('frame[name="main"]').contentFrame().getByText('Create');
        this.counterCp_Redeb = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'CP_REDEB' }).nth(2);
        this.add = page.locator('frame[name="main"]').contentFrame().locator('#add');
        this.associateCounterOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'CP_REDEB' }).nth(1);
        this.delete = page.locator('frame[name="main"]').contentFrame().locator('#del');
        this.dayTypePen = page.locator('frame[name="main"]').contentFrame().locator('#jourTypeCombo span');
        this.dayTypePenForDuplicate = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'WD' }).locator('span').nth(1);

        this.dayTypeOptionWorkingDay = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'Working day', exact: true }).nth(1);
        this.dayTypeOptionHalfWorkingDay = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'Half working day', exact: true }).nth(1);
        this.dateEntry = page.locator('frame[name="main"]').contentFrame().locator('#dateDebutDataEntry_img');
        this.day20 = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: '20', exact: true }).nth(1)
        this.shift1Field = page.locator('frame[name="main"]').contentFrame().locator('#objTour1ValueDataEntry');
        this.shift2Field = page.locator('frame[name="main"]').contentFrame().locator('#objTour2ValueDataEntry');
        this.shift3Field = page.locator('frame[name="main"]').contentFrame().locator('#objTour3ValueDataEntry');
        this.validateButton = page.locator('frame[name="main"]').contentFrame().getByText('Validate');
        this.cancelButton = page.locator('frame[name="main"]').contentFrame().getByText('Cancel');
        this.noResultErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('No result');
        this.creationAbondenedMessage = page.locator('frame[name="main"]').contentFrame().getByText('creation abandoned');
        this.creationSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText('creation done');
        this.deletionSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText('Deletion done');
        this.viewButton = page.locator('frame[name="main"]').contentFrame().getByText('View');
        this.goalPen1 = page.locator('frame[name="main"]').contentFrame().locator('#compteurCombo span').first();
        this.goalPen2 = page.locator('frame[name="main"]').contentFrame().locator('//input[@name="codeEltTopo"]/following-sibling::span');
        this.goalPen3 = page.locator('frame[name="main"]').contentFrame().locator('#jourTypeCombo span')
        this.workingDayOption = page.locator('frame[name="main"]').contentFrame().getByRole('cell', { name: 'Working day', exact: true }).nth(2);
        this.modifyButton = page.locator('frame[name="main"]').contentFrame().getByText('Modify');

        this.shift1FieldMin = page.locator('frame[name="main"]').contentFrame().locator('#minTour1ValueDataEntry');
        this.shift2FieldMin = page.locator('frame[name="main"]').contentFrame().locator('#minTour2ValueDataEntry');
        this.shift3FieldMin = page.locator('frame[name="main"]').contentFrame().locator('#minTour3ValueDataEntry');

        this.shift1FieldMax = page.locator('frame[name="main"]').contentFrame().locator('#maxiTour1ValueDataEntry');
        this.shift2FieldMax = page.locator('frame[name="main"]').contentFrame().locator('#maxiTour2ValueDataEntry');
        this.shift3FieldMax = page.locator('frame[name="main"]').contentFrame().locator('#maxiTour3ValueDataEntry');


        this.dayFieldMin = page.locator('frame[name="main"]').contentFrame().locator('#minJourValueDataEntry')
        this.dayFieldMax = page.locator('frame[name="main"]').contentFrame().locator('#maxiJourValueDataEntry');

        this.yesButton = page.locator('frame[name="main"]').contentFrame().getByText('Yes');
        this.modifyErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('Modification abandoned');
        this.duplicateButton = page.locator('frame[name="main"]').contentFrame().getByText('Duplicate');
        this.duplicateErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('Duplication abandoned');
        this.duplicateSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText('Duplication done');
        this.deleteButton = page.locator('frame[name="main"]').contentFrame().getByText('Delete');
        this.deleteErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('Deletion abandoned');
        this.deleteSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText('Deletion done');
        this.noCounterAssociatedErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('No counter associated');
        this.fieldRequiredErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('This field  is required');

    }
}

