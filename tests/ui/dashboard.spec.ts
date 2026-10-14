import {expect, test} from '../../fixtures/ui.test.fixture';
import {CONFIG} from '../../config/env.config';

test.describe('OrangeHRM UI: Dashboard', () => {

  test('UI-DASHBOARD-01: Dashboard elements render properly upon login', async ({authenticatedPage, dashboardPage}) => {
    await expect(dashboardPage.headerTitle).toHaveText('Dashboard');
  });

  test('UI-DASHBOARD-02: Collapse and expand sidebar navigation', async ({authenticatedPage}) => {
    const toggleButton = authenticatedPage.locator('.oxd-main-menu-button');
    await toggleButton.click();

    await expect(authenticatedPage.locator('.oxd-sidepanel')).toHaveClass(/toggled/);

    await toggleButton.click();

    await expect(authenticatedPage.locator('.oxd-sidepanel')).not.toHaveClass(/toggled/);
  });

  test('UI-DASHBOARD-03: Filter left sidebar menu using search bar', async ({authenticatedPage, dashboardPage}) => {
    await dashboardPage.searchInput.fill(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME);
    const menuItems = authenticatedPage.locator('.oxd-main-menu-item');

    await expect(menuItems).toHaveCount(1);
    await expect(menuItems.first()).toContainText(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME);
  });

  test('UI-DASHBOARD-04: Sidebar search shows no results for non-matching query', async ({authenticatedPage, dashboardPage}) => {
    await dashboardPage.searchInput.fill('NonExistingModule');
    const menuItems = authenticatedPage.locator('.oxd-main-menu-item');

    await expect(menuItems).toHaveCount(0);
  });

  test('UI-DASHBOARD-05: Navigate to Admin module successfully', async ({authenticatedPage, dashboardPage}) => {
    await dashboardPage.navigateToAdmin();

    await expect(authenticatedPage).toHaveURL(/.*admin\/viewSystemUsers/);
  });

  test('UI-DASHBOARD-06: Navigate to PIM module successfully', async ({authenticatedPage, dashboardPage}) => {
    await dashboardPage.navigateToPim();

    await expect(authenticatedPage).toHaveURL(/.*pim\/viewEmployeeList/);
  });

  test('UI-DASHBOARD-07: Navigate to Leave module successfully', async ({authenticatedPage, dashboardPage}) => {
    await dashboardPage.navigateToLeave();

    await expect(authenticatedPage).toHaveURL(/.*leave\/viewLeaveList/);
  });
});
