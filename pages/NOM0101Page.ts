import { Page, Locator } from '@playwright/test';

export class NOM0101Page {
    referenceDataMenu: Locator;
    billOfMaterialsMenu: Locator;
    nom0101Option: Locator;
    pageTitle: Locator;
    sourceDropdown: Locator;
    sourceDropdownPen: Locator;
    // sourceOption: Locator;
    searchButton: Locator;
    resultTable: Locator;
    tableRows: Locator;
    createButton: Locator;
    sgrNatureProductField: Locator;
    repereOrganeField: Locator;
    generalPropertiesButton: Locator;
    shortLabelField: Locator;
    extendedLabelField: Locator;
    enhancedPartsTraceabilityCheckbox: Locator;
    functionalityCodeField: Locator;
    psaCodeField: Locator;
    ssrCodeField: Locator;
    classificationPenButton: Locator;
    classificationDropdownOptions: Locator;
    nfcRequestCheckbox: Locator;
    decompositionDateField: Locator;
    productionForbiddenCheckbox: Locator;
    commentProhibitedField: Locator;
    validateButton: Locator;
    creationDoneMessage: Locator;
    decompositionDateFieldPen: Locator;
    creationDoneparticularProperties: Locator;
    naturePen: Locator;
    natureOption: Locator;
    valueTextBox: Locator;
    moveToRightArrow: Locator;
    sequenzText: Locator;
    ppfPen: Locator;
    ppfOption: Locator;
    BiwSequencePen: Locator;
    biwSequenceOption: Locator;
    sequenzeRightArrow: Locator;
    localAttributesTab: Locator;
    columnPen: Locator;
    columnOption: Locator;
    localAttriRightArrow: Locator;
    columnsTab: Locator;
    columnKPen: Locator;
    columnKOption: Locator;
    columnKRightArrow: Locator;
    nextPageButton: Locator;
    viewButton: Locator;
    page: Page;
    sg6NatureProductPen: Locator;
    modifyButton: Locator;
    deleteButton: Locator;
    confirmDeletionText: Locator;
    yesButton: Locator;
    modifySuccessMessage: Locator;
    deletionSuccessMessage: Locator;
    duplicationSuccessMessage: Locator;
    duplicateButton: Locator;
    productField: Locator;
    cancelButton: Locator;
    creationAbandonedMessage: Locator;
    modifyAbandonedMessage: Locator;
    tableRowsNom0101: Locator;
    deletionAbandonedMessage: Locator;
    compareButton: Locator;
    comboProduit1: Locator;
    comboProduit2: Locator;
    compareSearchButton: Locator;
    localAttributesTabCompare: Locator;
    compositionTabCompare: Locator;
    dropdownProdCode1: Locator;
    dropdownProdCode2: Locator;

    tableView: Locator;
    dateDemandeImg: Locator;
    // cell10: Locator;
    filterText: Locator;
    treeStructure: Locator;
    treeView: Locator;
    titleNom305: Locator;

    manageCompositionOptionNOM0302: Locator;
    manageComposition: Locator;
    manageComponents: Locator;
    manageCompounds: Locator;


    constructor(page: Page) {
        this.page = page;
        const menu = page.locator('frame[name="menu"]').contentFrame();
        const main = page.locator('frame[name="main"]').contentFrame();

        // Menu navigation
        this.referenceDataMenu = menu.getByText('Reference data', { exact: true });
        this.billOfMaterialsMenu = menu.getByRole('cell', { name: 'Bill of material' });
        this.nom0101Option = menu.getByRole('cell', { name: 'NOM0101 - Manage manufactured products' });

        // Main form elements
        this.pageTitle = main.getByText('Manage the Products (NOM0101)');
        this.sourceDropdown = main.getByRole('combobox', { name: 'Source' });
        this.sourceDropdownPen = main.locator('#listSourceCombo span');
        // this.sourceOption = main.getByRole('cell', { name: 'Source_001' });
        this.searchButton = main.getByRole('row', { name: 'Local attribute Component' }).getByLabel('', { exact: true });

        // Results table
        this.resultTable = main.locator('table');
        this.tableRows = main.locator('table tbody tr');

        // Creation form elements
        this.createButton = main.getByText('Create');
        this.sgrNatureProductField = main.getByRole('textbox', { name: 'Product' });
        this.repereOrganeField = main.getByRole('textbox', { name: 'Repère Organe' });
        this.generalPropertiesButton = main.getByText('General properties');
        this.shortLabelField = main.getByRole('textbox', { name: 'Short label' });
        this.extendedLabelField = main.getByRole('textbox', { name: 'Extended label' });
        this.enhancedPartsTraceabilityCheckbox = main.getByRole('checkbox', { name: 'Enhanced parts traceability(' });
        this.functionalityCodeField = main.getByRole('textbox', { name: 'Functionality code' });
        this.psaCodeField = main.getByRole('textbox', { name: 'PSA Code' });
        this.ssrCodeField = main.getByRole('textbox', { name: 'SSR Code' });

        this.classificationPenButton = main.locator('#listClassificationCombo span');
        this.classificationDropdownOptions = main.getByRole('cell', { name: 'CRANKSHAFT', exact: true }).nth(2);
        this.nfcRequestCheckbox = main.getByRole('checkbox', { name: 'NFC request' });
        this.decompositionDateFieldPen = main.locator('#dateDecomposition_img');
        this.decompositionDateField = main.getByRole('textbox', { name: 'Decomposition date' });
        this.productionForbiddenCheckbox = main.getByRole('checkbox', { name: 'Production forbidden' });
        this.commentProhibitedField = main.getByRole('textbox', { name: 'Comment prohibited' });
        this.validateButton = main.getByText('Validate');
        this.creationDoneMessage = main.getByText('creation done', { exact: true });
        this.creationAbandonedMessage = main.getByText('creation abandoned', { exact: true });

        this.creationDoneparticularProperties = main.getByText('Particular properties');
        this.naturePen = main.locator('#listNatCaractCombo span');
        this.natureOption = main.getByRole('cell', { name: 'TRG', exact: true }).nth(1);
        this.valueTextBox = main.getByRole('textbox', { name: 'Value (G)' });
        this.moveToRightArrow = main.locator('[class="ecwTableAddLine"]');

        this.sequenzText = main.getByText('Sequenz');
        this.ppfPen = main.locator('#listPorteCombo span');
        this.ppfOption = main.getByRole('cell', { name: 'EN1485EB', exact: true }).nth(1);
        this.BiwSequencePen = main.locator('#listSequenceMedailleCombo span');
        this.biwSequenceOption = main.getByTitle('ENGINE10Z1AA');
        this.sequenzeRightArrow = main.locator('[class="ecwTableAddLine"]').nth(1);

        this.localAttributesTab = main.getByText('Local Attributes');
        this.columnPen = main.locator('#listRubriquesAttributCombo span');
        this.columnOption = main.getByTitle('ATYPMOT');
        this.localAttriRightArrow = main.locator('[class="ecwTableAddLine"]').nth(2);

        this.columnsTab = main.getByText('Columns');
        this.columnKPen = main.locator('#comboRubriquesSeulesNonUtilisees span');
        this.columnKOption = main.locator('#listRubriquesSeulesNonUtilisees').getByTitle('ATYPMOT');
        this.columnKRightArrow = main.locator('[class="ecwTableAddLine"]').nth(3);

        // View test locators
        this.nextPageButton = main.getByTitle('Next page');
        this.viewButton = main.getByText('View');

        this.sg6NatureProductPen = main.locator('#listProduitCombo span');
        this.modifyButton = main.getByText('Modify');
        this.deleteButton = main.getByText('Delete');
        this.confirmDeletionText = main.getByText('Do you confirm the deletion ?');
        this.yesButton = main.getByText('Yes');
        this.modifySuccessMessage = main.getByText('Modification done', { exact: true });
        this.deletionSuccessMessage = main.getByText('Deletion done', { exact: true });

        this.duplicateButton = main.getByText('Duplicate');
        this.duplicationSuccessMessage = main.getByText('Duplication done', { exact: true });
        //  this.repereOrganeField = main.getByRole('textbox', { name: 'Repère Organe' });
        this.productField = main.getByRole('textbox', { name: 'Product', exact: true });
        this.cancelButton = main.getByText('Cancel');

        this.tableRowsNom0101 = main.locator('[class="produitWidth"]');
        this.modifyAbandonedMessage = main.getByText('Modification abandoned', { exact: true });
        this.deletionAbandonedMessage = main.getByText('Deletion abandoned', { exact: true });

        this.compareButton = main.getByText('Compare');
        this.comboProduit1 = main.locator('#comboProduit1 span');
        this.comboProduit2 = main.locator('#comboProduit2 span');
        this.compareSearchButton = main.getByLabel('', { exact: true });
        this.localAttributesTabCompare = main.getByText('Local attributes', { exact: true });
        this.compositionTabCompare = main.getByText('Composition');

        this.dropdownProdCode1 = main.locator('[ecwkeyname="identifiantProduit1"]');
        this.dropdownProdCode2 = main.locator('[ecwkeyname="identifiantProduit2"]');

        this.treeStructure = main.getByText('Tree structure');
        this.tableView = main.getByText('Table');
        this.treeView = main.getByText('Tree', { exact: true });
        this.dateDemandeImg = main.locator('#dateDemande_img');
        this.filterText = main.getByText('Filter');
        this.titleNom305 = main.getByText('  View product tree  (NOM0305) ', { exact: true });

        this.manageComposition = main.getByText('Manage Composition');
        this.manageComponents = main.getByText('Manage the components');
        this.manageCompounds = main.getByText('Manage the compounds');
        this.manageCompositionOptionNOM0302 = main.getByText('Manage the composition  (NOM0302)');

    }

    getProductRow(productCode: string): Locator {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        return main.getByRole('cell', { name: `${productCode}`, exact: true }).nth(1);
    }
}
