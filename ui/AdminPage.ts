import {expect, Locator, Page} from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly usernameSearchInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly userRoleSelect: Locator;
  readonly userStatusSelect: Locator;
  readonly tableRows: Locator;
  readonly addButton: Locator;
  readonly userRoleDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly newUsernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameSearchInput = page.locator('.oxd-input-group:has-text("Username") input');
    this.searchButton = page.locator('button[type="submit"]');
    this.resetButton = page.locator('button:has-text("Reset")');
    this.userRoleSelect = page.locator('.oxd-input-group:has-text("User Role") .oxd-select-wrapper');
    this.userStatusSelect = page.locator('.oxd-input-group:has-text("Status") .oxd-select-wrapper');
    this.tableRows = page.locator('.oxd-table-card');
    this.addButton = page.locator('button:has-text("Add")');

    this.userRoleDropdown = this.page.locator('.oxd-input-group:has-text("User Role") .oxd-select-text');
    this.statusDropdown = this.page.locator('.oxd-input-group:has-text("Status") .oxd-select-text');
    this.employeeNameInput = this.page.locator('input[placeholder="Type for hints..."]');
    this.newUsernameInput = this.page.locator('.oxd-input-group:has-text("Username") input');
    this.passwordInput = this.page.locator('.oxd-input-group:has-text("Password") input').first();
    this.confirmPasswordInput = this.page.locator('.oxd-input-group:has-text("Confirm Password") input');
    this.saveButton = this.page.locator('button[type="submit"]');
  }

  async searchByUsername(username: string): Promise<void> {
    await this.usernameSearchInput.fill(username);
    await this.searchButton.click();
  }

  async resetSearch(): Promise<void> {
    await this.resetButton.click();
  }

  async addUser(firstName: string, fullName: string, username: string, password: string): Promise<void> {
    console.debug(`Adding user ${username}`)

    await this.selectDropdownOption(this.userRoleDropdown, 'Admin');
    await this.selectDropdownOption(this.statusDropdown, 'Enabled');
    await this.selectEmployeeName(firstName, fullName);

    await this.newUsernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);

    await this.saveButton.click();
  }

  async selectDropdownOption(dropdownLocator: Locator, optionText: string): Promise<void> {
    await dropdownLocator.click();
    await this.page.locator('.oxd-select-option', {hasText: optionText}).click();
  }

  async selectEmployeeName(firstName: string, fullName: string): Promise<void> {
    await this.employeeNameInput.fill('');
    await this.employeeNameInput.pressSequentially(firstName, {delay: 100});

    const option = this.page.locator('.oxd-autocomplete-option', {hasText: fullName}).first();
    await option.waitFor({state: 'visible', timeout: 10000});
    await option.click();

    await expect(this.page.locator('.oxd-autocomplete-dropdown')).not.toBeVisible();
  }
}
