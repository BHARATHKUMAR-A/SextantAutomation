import { Page, Locator } from '@playwright/test';

export class NOM0102Page {
    readonly page: Page;
    referenceDataMenu: Locator;
    billOfMaterialsMenu: Locator;
    nom0102Option: Locator;
    compareTwoProductsNom0102Title: Locator;


    constructor(page: Page) {
        this.page = page;
        const menu = page.locator('frame[name="menu"]').contentFrame();
        const main = page.locator('frame[name="main"]').contentFrame();

        // Menu navigation
        this.referenceDataMenu = menu.getByText('Reference data', { exact: true });
        this.billOfMaterialsMenu = menu.getByRole('cell', { name: 'Bill of material' });
        this.nom0102Option = menu.getByRole('cell', { name: 'NOM0102 - Compare manufactured products' });        
        
        this.compareTwoProductsNom0102Title = main.getByText('Compare two Product  (NOM0102)', { exact: true });

    }

    getProductRow(productCode: string): Locator {
        const main = this.page.locator('frame[name="main"]').contentFrame();
        return main.getByRole('cell', { name: `${productCode}`, exact: true }).nth(1);
    }
}
