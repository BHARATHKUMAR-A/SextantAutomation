import { Page, Locator } from '@playwright/test';

export class QUA0402Page {
    qualityMonitoring: Locator;
    qua0402Option: Locator;
    reworkStationPen: Locator;
    expertiseCrankWorkstation: Locator;
    // reworkStationCEXP: Locator;
    newSelectionButton: Locator;
    wipFieldPen: Locator;
    submitButton: Locator;
    submitButton2: Locator;
    // wipFieldPenOption: Locator;
    checkPointFieldPen: Locator;
    checkPointFieldPenOption: Locator;
    wip: Locator;
    startDatePicker: Locator;
    endDatePicker: Locator;
    datePickerPreviousMonth: Locator;
    datePickerNextMonth: Locator;
    repereOrgane: Locator;
    repereOrganeOption: Locator;
    productNumList: Locator;
    productNumPen: Locator;
    identifierSequence: Locator;
    identifierTypePen: Locator;
    identifierTypePenOption: Locator;
    beginingIdentifierTextbox: Locator;
    endIdentifierValueTextbox: Locator;

    qualityInformation: Locator;
    areaPen: Locator;
    areaOption: Locator;
    workstationPen: Locator;
    workstationOption: Locator;
    defectPen: Locator;
    defectOption: Locator;
    qualityIndicatorPen: Locator;
    qualityIndicatorOption: Locator;
    partiallyReworkPartsCheckBox: Locator;
    partsWithoutReworkCheckBox: Locator;
    blockedPartsCheckBox: Locator;
    advancedSearch: Locator;
    requestTextbox: Locator;
    helpButton: Locator;
    predicatePen: Locator;
    predicatePenOption: Locator ;
    codeFTextbox: Locator;
    addButton: Locator;
    andButton: Locator;
    orButton: Locator;
    notButton: Locator;
    openingFactorButton: Locator;
    closingFactorButton: Locator;
    endButton: Locator;
    deleteButton: Locator;
    validateButton: Locator;




    constructor(page: Page) {
        const menuFrame = page.locator('frame[name="menu"]').contentFrame();
        const mainFrame = page.locator('frame[name="main"]').contentFrame();

        this.qualityMonitoring = menuFrame.getByText('Quality monitoring', { exact: true });
        this.qua0402Option = menuFrame.getByRole('cell', { name: 'QUA0402 - Manage defects and' });
        this.reworkStationPen = mainFrame.locator('#CombolisteCodePosteRetouche span');
        this.expertiseCrankWorkstation = mainFrame.getByRole('cell', { name: 'EXPERTISE CRANK WORKSTATION' }).nth(2);
        this.submitButton = mainFrame.getByRole('row', { name: 'Rework station : CEXP' }).getByLabel('', { exact: true });
        this.newSelectionButton = mainFrame.getByText('New selection');
        this.wipFieldPen = mainFrame.locator('#comboCodeEncours span');
        this.checkPointFieldPen = mainFrame.locator('#comboCodePointFlux span');
        this.wip = mainFrame.getByRole('cell', { name: 'C015__WP' }).nth(3);
        this.checkPointFieldPenOption = mainFrame.getByRole('cell', { name: 'CPC020B_' }).nth(3);
        this.startDatePicker = mainFrame.locator('#dateDebut_img');
        this.endDatePicker = mainFrame.locator('#dateFin_img');
        this.datePickerPreviousMonth = mainFrame.locator('.ui-datepicker-prev');
        this.datePickerNextMonth = mainFrame.locator('.ui-datepicker-next');
        this.repereOrgane = mainFrame.locator('#comboRepereOrgane span');
        this.repereOrganeOption = mainFrame.getByRole('cell', { name: '10Z1AB' }).nth(3);
        this.productNumPen = mainFrame.locator('#comboCodeProduit span');
        this.productNumList = mainFrame.locator('[ecwkeyname="codeKey"]').nth(5);
        this.submitButton2 = mainFrame.getByText('Submit');


        this.identifierSequence = mainFrame.getByText('Identifier sequence');
        this.identifierTypePen = mainFrame.locator('#comboNatureIdentifiant span');
        this.identifierTypePenOption = mainFrame.getByRole('cell', { name: 'MED', exact: true }).nth(1);
        this.beginingIdentifierTextbox = mainFrame.getByRole('textbox', { name: 'Beginning identifier value :' });
        this.endIdentifierValueTextbox = mainFrame.getByRole('textbox', { name: 'End identifier value :' });

        this.qualityInformation = mainFrame.getByText('Quality information')
        this.areaPen = mainFrame.locator('#comboCodeZone span')
        this.areaOption = mainFrame.getByRole('cell', { name: 'MACHINING CRANK AREA' }).nth(3)
        this.workstationPen = mainFrame.locator('#comboCodePoste span')
        this.workstationOption = mainFrame.getByText('C015').nth(2)
        this.defectPen = mainFrame.locator('#comboDefautAnnonce span')
        this.defectOption = mainFrame.getByText('ANYAGHIANYOS').nth(1)
        this.qualityIndicatorPen = mainFrame.locator('#comboCouleurCarton span')
        this.qualityIndicatorOption = mainFrame.getByRole('cell', { name: 'GREEN' }).nth(3)
        this.partiallyReworkPartsCheckBox = mainFrame.locator('#displayOrganePartiellementRetoucheCheckbox')
        this.partsWithoutReworkCheckBox = mainFrame.locator('#displayOrganeSansRetoucheCheckbox')
        this.blockedPartsCheckBox = mainFrame.locator('#displayOrganeBloqueCheckbox');

         this.advancedSearch = mainFrame.getByText('Advanced search');
    this.requestTextbox = mainFrame.getByRole('textbox', { name: 'Request :' });

     this.helpButton = mainFrame.getByText('Help');
    this.predicatePen = mainFrame.locator('#listPredicatsCombo span');
    this.predicatePenOption = mainFrame.getByRole('cell', { name: 'BLOCQUAL' }).nth(2);
    this.codeFTextbox = mainFrame.getByRole('textbox', { name: 'CODE (F)' });
    this.addButton = mainFrame.getByText('Add');
    this.andButton = mainFrame.getByText('AND.');
    this.orButton = mainFrame.getByText('OR|');
    this.notButton = mainFrame.getByText('NOT!');
    this.openingFactorButton = mainFrame.getByText('Opening factor[');
    this.closingFactorButton = mainFrame.getByText('Closing factor]');
    this.endButton = mainFrame.getByText('End; (B)');
    this.deleteButton = mainFrame.getByText('Delete');
    this.endButton = mainFrame.getByText('End; (B)');
    this.validateButton = mainFrame.getByText('Validate');




    }
}

