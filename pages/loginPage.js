import { expect } from '@playwright/test';
import { getBaseUrl } from '../utils/config';

export class LoginPage {

  constructor(page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'name@company.com' });
    this.passwordInput = page.getByRole('textbox', { name: '••••••••' });
    this.loginButton = page.getByRole('button', { name: /Đăng nhập/i });
    //this.errorMessage = page.getByRole('alert').or(page.locator('.error-message'));
  }

  async goto() {
    await this.page.goto('http://10.168.6.147:8083/login');
    await expect(this.loginButton).toBeVisible();
  }

  async login(email, pass) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}