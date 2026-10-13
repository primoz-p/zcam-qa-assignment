import {Locator, Page} from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly usernameSearchInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly userRoleSelect: Locator;
  readonly userStatusSelect: Locator;
  readonly tableRows: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameSearchInput = page.locator('.oxd-input-group:has-text("Username") input');
    this.searchButton = page.locator('button[type="submit"]');
    this.resetButton = page.locator('button:has-text("Reset")');
    this.userRoleSelect = page.locator('.oxd-input-group:has-text("User Role") .oxd-select-wrapper');
    this.userStatusSelect = page.locator('.oxd-input-group:has-text("Status") .oxd-select-wrapper');
    this.tableRows = page.locator('.oxd-table-card');
    this.addButton = page.locator('button:has-text("Add")');
  }

  async searchByUsername(username: string): Promise<void> {
    await this.usernameSearchInput.fill(username);
    await this.searchButton.click();
  }

  async resetSearch(): Promise<void> {
    await this.resetButton.click();
  }
}
