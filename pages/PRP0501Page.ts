import { Page, Locator } from '@playwright/test';

export class PRP0501Page {
    productionProgrammeManagement: Locator;
    prp0501Option: Locator;
    screenTitle: Locator;
    createButton: Locator;
    groupByProductButton: Locator;
    backButton: Locator;
    unlockedLabel: Locator;
    nextPageButton: Locator;
    productMarkerField: Locator;
    productMarkerPen: Locator;
    managementProductField: Locator;
    managementProductPen: Locator;
    currentDateCalendarButton: Locator;
    currentDateCalendarContainer: Locator;
    requiredQuantityField: Locator;
    submitButton: Locator;
    cancelButton: Locator;
    deleteButton: Locator;
    rescheduleButton: Locator;
    putBanButton: Locator;
    removeBanButton: Locator;
    kickoffOffButton: Locator;
    kickoffOnButton: Locator;
    yesButton: Locator;
    commentField: Locator;
    moveBottomLineButton: Locator;
    moveTopLineButton: Locator;
    moveDownLineButton: Locator;
    moveUpLineButton: Locator;
    quantityExceedsUcErrorMessage: Locator;
    creationSuccessMessage: Locator;
    rescheduleSuccessMessage: Locator;
    putBanSuccessMessage: Locator;
    removeBanSuccessMessage: Locator;
    kickoffOffSuccessMessage: Locator;
    kickoffOnSuccessMessage: Locator;
    deletionSuccessMessage: Locator;

    constructor(page: Page) {
        this.productionProgrammeManagement = page.locator('frame[name="menu"]').contentFrame().getByText('Production programme management', { exact: true });
        this.prp0501Option = page.locator('frame[name="menu"]').contentFrame().getByRole('cell', { name: 'PRP0501 - Manage the racks' });
        this.screenTitle = page.locator('frame[name="main"]').contentFrame().getByText('Manage the racks sequence (');
        this.createButton = page.locator('frame[name="main"]').contentFrame().getByText('Create', { exact: true });
        this.groupByProductButton = page.locator('frame[name="main"]').contentFrame().getByText('Group By Product', { exact: true });
        this.backButton = page.locator('frame[name="main"]').contentFrame().getByText('Back', { exact: true });
        this.unlockedLabel = page.locator('frame[name="main"]').contentFrame().getByText('Unlocked', { exact: true });
        this.nextPageButton = page.locator('frame[name="main"]').contentFrame().getByTitle('Next page');
        this.productMarkerField = page.locator('frame[name="main"]').contentFrame().locator('#comboBoxRepereOrgane input').nth(1);
        this.productMarkerPen = page.locator('frame[name="main"]').contentFrame().locator('#comboBoxRepereOrgane span');
        this.managementProductField = page.locator('frame[name="main"]').contentFrame().locator('#comboBoxClient input').nth(1);
        this.managementProductPen = page.locator('frame[name="main"]').contentFrame().locator('#comboBoxClient span').nth(1);
        this.currentDateCalendarButton = page.locator('frame[name="main"]').contentFrame().locator('#jspDatePrelevementFournisseur_img');
        this.currentDateCalendarContainer = page.locator('frame[name="main"]').contentFrame().locator('#jspDatePrelevementFournisseur_cal_container');
        this.requiredQuantityField = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Required quantity' });
        this.submitButton = page.locator('frame[name="main"]').contentFrame().getByText('Submit', { exact: true });
        this.cancelButton = page.locator('frame[name="main"]').contentFrame().getByText('Cancel', { exact: true });
        this.deleteButton = page.locator('frame[name="main"]').contentFrame().getByText('Delete', { exact: true });
        this.rescheduleButton = page.locator('frame[name="main"]').contentFrame().getByText('Reschedule', { exact: true });
        this.putBanButton = page.locator('frame[name="main"]').contentFrame().getByText('To put a ban', { exact: true });
        this.removeBanButton = page.locator('frame[name="main"]').contentFrame().getByText('To remove a ban', { exact: true });
        this.kickoffOffButton = page.locator('frame[name="main"]').contentFrame().getByText('Kickoff off', { exact: true });
        this.kickoffOnButton = page.locator('frame[name="main"]').contentFrame().getByText('Kickoff on', { exact: true });
        this.yesButton = page.locator('frame[name="main"]').contentFrame().getByText('Yes', { exact: true });
        this.commentField = page.locator('frame[name="main"]').contentFrame().getByRole('textbox', { name: 'Comment :' });
        this.moveBottomLineButton = page.locator('frame[name="main"]').contentFrame().getByTitle('Move bottom the line');
        this.moveTopLineButton = page.locator('frame[name="main"]').contentFrame().getByTitle('Move on top the line');
        this.moveDownLineButton = page.locator('frame[name="main"]').contentFrame().getByTitle('Move down the line');
        this.moveUpLineButton = page.locator('frame[name="main"]').contentFrame().getByTitle('Move up the line');
        this.quantityExceedsUcErrorMessage = page.locator('frame[name="main"]').contentFrame().getByText('The quantity to be produced may not exceed the size UC 6');
        this.creationSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText(/The rack P\d{4}M\d+ has been created/);
        this.rescheduleSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText(/.+ : Rescheduling of the sequence production realized/);
        this.putBanSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText(/.+ : The Kick-off of the rack P\d{4}M\d+ is now forbidden/);
        this.removeBanSuccessMessage = page
            .locator('frame[name="main"]')
            .contentFrame()
            .getByText(/.+ : The Kick-off of the rack P\d{4}M\d+ is now authorized/);
             this.kickoffOffSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText(/.+ : Kick-off lock by [A-Z0-9]+ for the reason .+/);
        this.kickoffOnSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText(/.+ : Kick-off unlock by [A-Z0-9]+ which has been locked by [A-Z0-9]+ on \d{2}\/\d{2}\/\d{4} \d{2}:\d{2} for the reason .+/);
        this.deletionSuccessMessage = page.locator('frame[name="main"]').contentFrame().getByText(/.+ : The deletion of the rack P\d{4}M\d+ and the associated OF is realized/);
    }
}