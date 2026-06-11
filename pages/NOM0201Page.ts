import { Page, Locator } from '@playwright/test';

export class NOM0201Page {
    readonly page: Page;
    referenceDataMenu: Locator;
    billOfMaterialsMenu: Locator;
    nom0201Option: Locator;
    pageTitle: Locator;
    sourceDropdown: Locator;
    sourceDropdownPen: Locator;
    searchButton: Locator;
    resultTable: Locator;
    tableRows: Locator;
    createButton: Locator;
    productField: Locator;
    productFieldForDuplicate: Locator;
    repereOrganeField: Locator;
    generalPropertiesButton: Locator;
    shortLabelField: Locator;
    extendedLabelField: Locator;
    validateButton: Locator;
    creationDoneMessage: Locator;
    creationAbandonedMessage: Locator;
    cancelButton: Locator;
    modifyButton: Locator;
    deleteButton: Locator;
    duplicateButton: Locator;
    modifySuccessMessage: Locator;
    deletionSuccessMessage: Locator;
    duplicationSuccessMessage: Locator;
    confirmDeletionText: Locator;
    yesButton: Locator;
    modifyAbandonedMessage: Locator;
    deletionAbandonedMessage: Locator;
    viewButton: Locator;
    tableRowsNom0201: Locator;
    errorMessageProductNumMustBeFilled: Locator;
    rawMaterialProductPen: Locator;
    sgrField: Locator;
    functionalityCodeField: Locator;
    psaCodeField: Locator;
    ssrCodeField: Locator;

        creationDoneparticularProperties: Locator;
    naturePen: Locator;
    natureOption: Locator;
    valueTextBox: Locator;
    moveToRightArrow: Locator;
    classificationCombo: Locator;

    // sequenzText: Locator;
    // ppfPen: Locator;
    // ppfOption: Locator;
    // BiwSequencePen: Locator;    
    // biwSequenceOption: Locator;
    // sequenzeRightArrow: Locator;

    localAttributesTab: Locator;
    columnPen: Locator;
    // columnOption: Locator;
    localAttributesRightArrow: Locator;
    columnsTab: Locator;
    columnKPen: Locator;
    // columnKOption: Locator;
    columnKRightArrow: Locator;

    constructor(page: Page) {
        this.page = page;
        const menu = page.locator('frame[name="menu"]').contentFrame();
        const main = page.locator('frame[name="main"]').contentFrame();

        // Menu navigation
        this.referenceDataMenu = menu.getByText('Reference data', { exact: true });
        this.billOfMaterialsMenu = menu.getByRole('cell', { name: 'Bill of material' });
        this.nom0201Option = menu.getByRole('cell', { name: 'NOM0201 - Manage raw materials' });

        // Main form elements
        this.pageTitle = main.getByText('Manage the supplies  (NOM0201)');
        this.sourceDropdown = main.getByRole('combobox', { name: 'Source' });
        this.sourceDropdownPen = main.locator('#listSourceCombo span');
        this.searchButton = main.getByRole('row', { name: 'Source : column : SGR/ Nature' }).getByLabel('', { exact: true });

        // Results table
        this.resultTable = main.locator('table');
        this.tableRows = main.locator('table tbody tr');

        // CRUD buttons
        this.createButton = main.getByText('Create');
        this.viewButton = main.getByText('View');
        this.modifyButton = main.getByText('Modify');
        this.deleteButton = main.getByText('Delete');
        this.duplicateButton = main.getByText('Duplicate');

        // Form fields
        this.productField = main.getByRole('textbox', { name: 'Product', exact: true });
        this.productFieldForDuplicate = main.getByRole('textbox', { name: 'Product' });
        this.repereOrganeField = main.getByRole('textbox', { name: 'Repère Organe' });
        this.generalPropertiesButton = main.getByText('General properties');
        this.shortLabelField = main.getByRole('textbox', { name: 'Short label' });
        this.extendedLabelField = main.getByRole('textbox', { name: 'Extended label' });
        this.functionalityCodeField = main.getByRole('textbox', { name: 'Functionality Code' });
        this.psaCodeField = main.getByRole('textbox', { name: 'PSA Code' });
        this.ssrCodeField = main.getByRole('textbox', { name: 'SSR Code' });
        this.classificationCombo = main.locator('#listClassificationCombo span');

        // Action buttons
        this.validateButton = main.getByText('Validate');
        this.cancelButton = main.getByText('Cancel');

        // Success/Error messages
        this.creationDoneMessage = main.getByText('creation done', { exact: true });
        this.creationAbandonedMessage = main.getByText('creation abandoned', { exact: true });
        this.modifySuccessMessage = main.getByText('Modification done', { exact: true });
        this.modifyAbandonedMessage = main.getByText('Modification abandoned', { exact: true });
        this.deletionSuccessMessage = main.getByText('Deletion done', { exact: true });
        this.deletionAbandonedMessage = main.getByText('Deletion abandoned', { exact: true });
        this.duplicationSuccessMessage = main.getByText('Duplication done', { exact: true });
        this.confirmDeletionText = main.getByText('Do you confirm the deletion ?');
        this.errorMessageProductNumMustBeFilled = main.getByText('The plant ID must be filled', { exact: true });

        // Deletion confirmation
        this.yesButton = main.getByText('Yes');

        // Table rows
        this.tableRowsNom0201 = main.locator('[ecwkeyname="idNumeroProduit"]');
        this.rawMaterialProductPen = main.locator('#listProduitCombo span');
        this.sgrField = main.getByRole('textbox', { name: 'SGR' });


                this.creationDoneparticularProperties = main.getByText('Particular properties');
        this.naturePen = main.locator('#listNatCaractCombo span');
        this.natureOption = main.getByRole('cell', { name: 'TRG', exact: true }).nth(1);
        this.valueTextBox = main.getByRole('textbox', { name: 'Value (B)' });
        this.moveToRightArrow = main.locator('[class="ecwTableAddLine"]');

        // this.sequenzText = main.getByText('Sequenz');
        // this.ppfPen = main.locator('#listPorteCombo span');
        // this.ppfOption = main.getByRole('cell', { name: 'EN1485EB', exact: true }).nth(1);
        // this.BiwSequencePen = main.locator('#listSequenceMedailleCombo span');
        // this.biwSequenceOption = main.getByTitle('ENGINE10Z1AA');
        // this.sequenzeRightArrow = main.locator('[class="ecwTableAddLine"]').nth(1);

        this.localAttributesTab = main.getByText('Local Attributes');
        this.columnPen = main.locator('#listRubriquesAttributCombo span');
        // this.columnOption = main.getByTitle('ATYPMOT');
        this.localAttributesRightArrow = main.locator('[class="ecwTableAddLine"]').nth(1);

        this.columnsTab = main.getByText('Columns');
        this.columnKPen = main.locator('#comboRubriquesSeulesNonUtilisees span');
        // this.columnKOption = main.locator('#listRubriquesSeulesNonUtilisees').getByTitle('ATYPMOT');
        this.columnKRightArrow = main.locator('[class="ecwTableAddLine"]').nth(2);

    }

    getProductRow(productCode: string): Locator {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        return main.getByRole('cell', { name: `${productCode}`, exact: true }).nth(1);
    }
}
