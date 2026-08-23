import { test, expect } from '@playwright/test';

test.describe('Chức năng Đăng xuất', () => {

  test('TC-OUT-01: Logout từ trạng thái đã đăng nhập', async ({ page }) => {
    // 1. Truy cập trực tiếp vào trang chủ (đã có sẵn session login)
  // Sửa dòng 8 trong file logout.spec.ts của bạn:
    await page.goto('http://automationexercise.com', { waitUntil: 'domcontentloaded' });

    // 2. Xác nhận đã đăng nhập thành công từ trước
    await expect(page.getByText(/logged in as/i)).toBeVisible();

    // 3. Bấm nút Logout
    await page.getByRole('link', { name: /logout/i }).click();

    // 4. Verify chuyển hướng thành công về trang Login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  });
                                   
});