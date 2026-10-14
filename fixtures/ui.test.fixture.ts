import {Page, test as base} from '@playwright/test';
import {CONFIG} from '../config/env.config';

import {LoginPage} from '../ui/LoginPage';
import {DashboardPage} from '../ui/DashboardPage';
import {AdminPage} from '../ui/AdminPage';
import {PimPage} from "../ui/PimPage";

type CustomFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
  dashboardPage: DashboardPage;
  adminPage: AdminPage;
  pimPage: PimPage
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({page}, use) => {
    await use(new LoginPage(page));
  },
  authenticatedPage: async ({page, loginPage}, use) => {
    await loginPage.navigate();
    await loginPage.login(
        CONFIG.UI.CREDENTIALS.ADMIN.USERNAME,
        CONFIG.UI.CREDENTIALS.ADMIN.PASSWORD
    );

    // Crucial: Wait for redirect and header render before passing page to tests
    await page.waitForURL(/.*dashboard/);
    await page.locator('.oxd-topbar-header-breadcrumb-module').waitFor({state: 'visible'});

    await use(page);
  },
  dashboardPage: async ({page}, use) => {
    await use(new DashboardPage(page));
  },
  adminPage: async ({page}, use) => {
    await use(new AdminPage(page));
  },
  pimPage: async ({page}, use) => {
    await use(new PimPage(page));
  }
});

export {expect} from '@playwright/test';
