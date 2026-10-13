import {Locator, Page} from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly headerTitle: Locator;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;
  readonly navAdmin: Locator;
  readonly navPim: Locator;
  readonly navLeave: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerTitle = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.locator('a[href*="logout"]');
    this.navAdmin = page.locator('.oxd-main-menu-item:has-text("Admin")');
    this.navPim = page.locator('.oxd-main-menu-item:has-text("PIM")');
    this.navLeave = page.locator('.oxd-main-menu-item:has-text("Leave")');
    this.searchInput = page.locator('input[placeholder="Search"]');
  }

  async navigateToAdmin(): Promise<void> {
    await this.navAdmin.click();
  }

  async navigateToPim(): Promise<void> {
    await this.navPim.click();
  }

  async navigateToLeave(): Promise<void> {
    await this.navLeave.click();
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutButton.click();
  }
}
