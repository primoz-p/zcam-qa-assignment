import {expect, test} from '../../fixtures/ui.test.fixture';
import {CONFIG} from '../../config/env.config';

test.describe('OrangeHRM UI: Admin', () => {

      test('UI-ADMIN-01: Search existing user by username in Admin module', async ({authenticatedPage, dashboardPage, adminPage}) => {
        await dashboardPage.navigateToAdmin();
        await authenticatedPage.waitForURL(/.*admin\/viewSystemUsers/);
        await adminPage.searchByUsername(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME);

        await expect(adminPage.tableRows.first()).toContainText(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME);
      });

      test('UI-ADMIN-02: Reset search filters in Admin user list', async ({authenticatedPage, dashboardPage, adminPage}) => {
        await dashboardPage.navigateToAdmin();
        await authenticatedPage.waitForURL(/.*admin\/viewSystemUsers/);
        await adminPage.usernameSearchInput.fill(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME);
        await adminPage.resetSearch();

        await expect(adminPage.usernameSearchInput).toHaveValue('');
      });

      test('UI-ADMIN-03: Verify "Add User" button navigates to add user form', async ({authenticatedPage, dashboardPage, adminPage}) => {
        await dashboardPage.navigateToAdmin();
        await authenticatedPage.waitForURL(/.*admin\/viewSystemUsers/);
        await adminPage.addButton.click();

        await expect(authenticatedPage).toHaveURL(/.*admin\/saveSystemUser/);
      });

      test('UI-ADMIN-04: Validate required fields when saving empty user form', async ({authenticatedPage, dashboardPage, adminPage}) => {
        await dashboardPage.navigateToAdmin();
        await authenticatedPage.waitForURL(/.*admin\/viewSystemUsers/);
        await adminPage.addButton.click();
        await authenticatedPage.locator('button[type="submit"]').click();
        const errors = authenticatedPage.locator('.oxd-input-group__message');

        await expect(errors.first()).toBeVisible();
      });

      test('UI-ADMIN-05: User Management page header title is visible', async ({authenticatedPage, dashboardPage}) => {
        await dashboardPage.navigateToAdmin();
        await authenticatedPage.waitForURL(/.*admin\/viewSystemUsers/);
        const headerTitle = authenticatedPage.locator('.oxd-topbar-header-breadcrumb-module');

        await expect(headerTitle).toHaveText(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME);
      });
    }
);
