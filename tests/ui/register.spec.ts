import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';   // 👈 Khớp tên Class HomePage và đường dẫn lùi 2 cấp
import { LoginPage } from '../../pages/LoginPage'; // 👈 Khớp tên Class LoginPage và đường dẫn lùi 2 cấp
import {userData} from '../../utils/testData';
test.use({ storageState: { cookies: [], origins: [] } });
test.describe('Automation Exercise - Registration Flow', () => {

  test('TC01: Register User and Delete Account (POM Standard)', async ({ page }) => {
    // Khởi tạo các Page Object (Tên biến camelCase khác tên Class PascalCase)
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // Tạo dữ liệu tài khoản động để không bao giờ bị trùng khi rerun
    const timestamp = Date.now();
    const userName = `Tester_${timestamp}`;
    const userEmail = `tester_${timestamp}@example.com`;

    // 1 - 3. Mở trang chủ & verify
    await homePage.goto();
    await homePage.verifyPageLoaded();

    // 4. Click 'Signup / Login'
    await homePage.navigateToSignupLogin();

    // 5 - 7. Điền tên & email đăng ký ban đầu
    await loginPage.fillInitialSignup(userName, userEmail);

    // Chờ hệ thống điều hướng sang URL /signup
    await expect(page).toHaveURL(/.*signup/);

    // 8 - 11. Điền thông tin mật khẩu & ngày sinh & checkbox
    await loginPage.fillAccountInformation('Password123!', '15', '5', '1995');

    // 12 - 13. Điền địa chỉ & bấm Tạo tài khoản
    await loginPage.fillAddressDetails({
      firstName: 'Hieu',
      lastName: 'Duong',
      company: 'Sovereign Corp',
      address1: '123 Testing Street',
      address2: 'Suite 400',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      zipcode: '90001',
      mobile: '0123456789'
    });

    // 14 - 15. Verify 'ACCOUNT CREATED!' và bấm Continue
    await loginPage.verifyAccountCreatedAndContinue();

    // 16. Verify hiển thị 'Logged in as username'
    await loginPage.verifyLoggedInUser(userName);

    // 17 - 18. Bấm 'Delete Account' & Verify 'ACCOUNT DELETED!' thành công
    await loginPage.deleteAccountAndContinue();
  });
  test('TC02: Register email đã tồn tại', async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.register(userData.validUser.username, userData.validUser.email);
      await expect(loginPage.existingUserMessage).toBeVisible();

  });


});