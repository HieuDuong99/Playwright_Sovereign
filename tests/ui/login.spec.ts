import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { HeaderComponent } from '../../pages/HeaderComponent';
import {userData} from '../../utils/testData';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let header: HeaderComponent;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    header = new HeaderComponent(page);

    await loginPage.goto();
  });

  test('TC01 - Đăng nhập thành công với tài khoản hợp lệ', async ({page}) => {
    // 1. Chuyển sang trang Login và thực hiện đăng nhập
    
    await loginPage.login(userData.validUser.email, userData.validUser.password);

    // 2. Verify đăng nhập thành công hiển thị "Logged in as <username>"
    await header.verifyLoggedInUser(userData.validUser.username);

    // 3. Click xóa tài khoản (nếu cần trong kịch bản)
   // await header.clickDeleteAccount();
  });
  test('TC01 - Đăng nhập  với tài khoản không hợp lệ', async ({page}) => {
    
    
    await loginPage.login(userData.inValidUser.email, userData.inValidUser.password);
    await loginPage.verifyinlineMessageDisplay();
  });
})