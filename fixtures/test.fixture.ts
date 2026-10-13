import {Page, request as playwrightRequest, test as base} from '@playwright/test';
import {CONFIG} from '../config/env.config';
import {LoginPage} from '../ui/LoginPage';
import {DashboardPage} from '../ui/DashboardPage';
import {AdminPage} from '../ui/AdminPage';
import {PetApiClient} from '../api/PetApiClient';
import {UserApiClient} from '../api/UserApiClient';

type CustomFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
  dashboardPage: DashboardPage;
  adminPage: AdminPage;
  petApi: PetApiClient;
  userApi: UserApiClient;
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
  petApi: async ({}, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: CONFIG.API.BASE_URL,
    });
    await use(new PetApiClient(apiContext));
    await apiContext.dispose();
  },
  userApi: async ({}, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: CONFIG.API.BASE_URL,
    });
    await use(new UserApiClient(apiContext));
    await apiContext.dispose();
  },
});

export {expect} from '@playwright/test';
