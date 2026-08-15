// pages/base.page.ts
import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Hàm chặn quảng cáo để test run mượt hơn
  async blockAds() {
    await this.page.route('**/*google*/**', route => route.abort());
    await this.page.route('**/*doubleclick*/**', route => route.abort());
    await this.page.route('**/*adservice*/**', route => route.abort());
  }

  async navigateTo(path: string = '') {
    await this.blockAds();
    await this.page.goto(path);
  }
}