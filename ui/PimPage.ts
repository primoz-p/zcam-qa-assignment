import {Locator, Page} from '@playwright/test';

export class PimPage {
  readonly page: Page;
  readonly addEmployeeButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addEmployeeButton = page.locator('button:has-text("Add")');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.saveButton = page.locator('button[type="submit"]');
  }

  async addEmployee(firstName: string, lastName: string): Promise<void> {
    console.debug(`Adding employee: ${firstName} ${lastName}`)

    await this.addEmployeeButton.click();
    await this.page.waitForURL(/.*pim\/addEmployee/);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
    await this.page.waitForURL(/.*pim\/viewPersonalDetails/);
  }
}
