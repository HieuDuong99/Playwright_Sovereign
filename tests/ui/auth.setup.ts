import { test as setup, expect } from '@playwright/test';
import {userData} from '../../utils/testData';
import { LoginPage } from '../../pages/LoginPage';
// Đường dẫn lưu file trạng thái đăng nhập
const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
    const loginPage  = new LoginPage(page);
  // 1. Điều hướng tới trang Login
  await page.goto('http://automationexercise.com/login');

 await loginPage.login(userData.validUser.email, userData.validUser.password);
  await expect(page.getByText(/logged in as/i)).toBeVisible();

  // 4. Lưu Cookie và LocalStorage ra file
  await page.context().storageState({ path: authFile });
});