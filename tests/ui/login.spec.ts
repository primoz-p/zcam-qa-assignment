import {expect, test} from '../../fixtures/ui.test.fixture';
import {CONFIG} from '../../config/env.config';

test.describe('OrangeHRM UI: Login', () => {
  test.beforeEach(async ({loginPage}) => {
    await loginPage.navigate();
  });

  test('UI-LOGIN-01: Successful login with valid credentials', async ({loginPage, page}) => {
    await loginPage.login(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME, CONFIG.UI.CREDENTIALS.ADMIN.PASSWORD);

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('UI-LOGIN-02: Login failure with invalid password', async ({loginPage}) => {
    await loginPage.login(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME, 'wrongpassword');

    await loginPage.assertErrorMessage('Invalid credentials');
  });

  test('UI-LOGIN-03: Login failure with invalid username', async ({loginPage}) => {
    await loginPage.login('WrongUser', CONFIG.UI.CREDENTIALS.ADMIN.PASSWORD);

    await loginPage.assertErrorMessage('Invalid credentials');
  });

  test('UI-LOGIN-04: Login validation error on empty credentials submit', async ({page}) => {
    await page.locator('button[type="submit"]').click();
    const requiredMessages = page.locator('.oxd-input-group__message');

    await expect(requiredMessages).toHaveCount(2);
  });

  test('UI-LOGIN-05: Single field validation on missing password', async ({loginPage, page}) => {
    await loginPage.usernameInput.fill(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME);
    await loginPage.loginButton.click();

    await expect(page.locator('.oxd-input-group__message')).toHaveText('Required');
  });

  test('UI-LOGIN-06: Navigate to Forgot Password page', async ({loginPage, page}) => {
    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL(/.*requestPasswordResetCode/);
  });

  test('UI-LOGIN-07: Cancel password reset returns to login', async ({loginPage, page}) => {
    await loginPage.clickForgotPassword();
    await page.locator('button:has-text("Cancel")').click();

    await expect(page).toHaveURL(/.*login/);
  });

  test('UI-LOGIN-08: Successful user logout', async ({loginPage, dashboardPage, page}) => {
    await loginPage.login(CONFIG.UI.CREDENTIALS.ADMIN.USERNAME, CONFIG.UI.CREDENTIALS.ADMIN.PASSWORD);
    await dashboardPage.logout();

    await expect(page).toHaveURL(/.*login/);
  });
});
