import { Page, Locator, expect } from '@playwright/test';
import { HomePage } from './HomePage';
export class HeaderComponent {
  readonly page: Page;
  readonly loggedInUserText: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly signupLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loggedInUserText = page.getByText(/Logged in as/i);
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
  }

  async verifyLoggedInUser(username: string) {
    await expect(this.loggedInUserText).toBeVisible();
    await expect(this.loggedInUserText).toContainText(`Logged in as ${username}`);
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async clickDeleteAccount() {
    await this.deleteAccountLink.click();
  }
}