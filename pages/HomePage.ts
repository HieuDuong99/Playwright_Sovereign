import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage
 {
  readonly logo: Locator;
  readonly signupLoginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.logo');
    this.signupLoginLink = page.getByRole('link', { name: ' Signup / Login' });
  }

  async goto() {
    await this.blockAds();
    await this.page.goto('http://automationexercise.com');
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveTitle(/Automation Exercise/);
    await expect(this.logo).toBeVisible();
  }

  async navigateToSignupLogin() {
    await this.signupLoginLink.click();
  }
}