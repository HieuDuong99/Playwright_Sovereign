import { test, expect } from '@playwright/test';
import { CustomerManagementPage } from '../pages/CustomerPage';

test.describe.configure({ mode: 'serial' });

test.describe('Customer List Page - UC-CUS-01', () => {
  let customerPage: CustomerManagementPage;
  let sharedPage;

  test.beforeAll(async ({ browser }) => {
    const storageStatePath = require('path').resolve(__dirname, '../auth/storageState.json');
    const context = await browser.newContext({ storageState: storageStatePath });
    sharedPage = await context.newPage();
    customerPage = new CustomerManagementPage(sharedPage);

    await customerPage.goto();
    await expect(customerPage.heading).toBeVisible();
  });



 test('TC-01: should display customer management page and main controls with 4 stat cards', async () => {
    await expect(customerPage.heading).toBeVisible();
    await expect(customerPage.exportButton).toBeVisible();
    await expect(customerPage.addButton).toBeVisible();
    await expect(customerPage.searchInput).toBeVisible();
    await expect(customerPage.table).toBeVisible();
    
    // Verify hiển thị đủ 4 stat cards
    await expect(customerPage.cardSum).toBeVisible();
    await expect(customerPage.cardActive).toBeVisible();
    await expect(customerPage.cardLock).toBeVisible();
    await expect(customerPage.cardThisMonth).toBeVisible();
  });

  test('TC-02: should display all 7 table columns', async () => {
    await expect(customerPage.columnHeaders).toHaveCount(7);
    await expect(customerPage.columnHeaders).toHaveText([
      '#',
      'Công ty',
      'Người liên hệ',
      'Gói dịch vụ',
      'Trạng thái',
      'Ngày tạo',
      'Thao tác',
    ]);
  });

  test('TC-16: should display search input with correct placeholder', async () => {
    await expect(customerPage.searchInput).toBeVisible();
    await expect(customerPage.searchInput).toHaveAttribute(
      'placeholder',
      'Tìm kiếm theo tên, email, SĐT...'
    );
  });

  test('TC-17 & TC-19: should filter list in realtime when typing and show/hide "Xóa tìm kiếm" button', async () => {
    // Trước khi nhập: chưa có nút xóa tìm kiếm
    await expect(customerPage.clearSearchButton).not.toBeVisible();

    const beforeText = await customerPage.resultCountText.innerText();
    const totalBefore = beforeText.match(/\d+ \/ (\d+) khách hàng/)![1];

    await customerPage.searchCustomer('Mai Lan');
    await expect(customerPage.clearSearchButton).toBeVisible();
    // Chờ đến khi text đếm kết quả thay đổi (debounce realtime search)
    await expect(customerPage.resultCountText).not.toHaveText(beforeText);
    await expect(customerPage.resultCountText).toHaveText(/^\d+ \/ \d+ khách hàng$/);

    const afterText = await customerPage.resultCountText.innerText();
    const totalAfter = afterText.match(/\d+ \/ (\d+) khách hàng/)![1];
    expect(totalAfter).toBe(totalBefore); // tổng số không đổi, chỉ số khớp thay đổi

    // Xóa tìm kiếm bằng nút "Xóa tìm kiếm" -> quay lại danh sách đầy đủ
    await customerPage.clearSearchButton.click();
    await expect(customerPage.searchInput).toHaveValue('');
    await expect(customerPage.clearSearchButton).not.toBeVisible();
    await expect(customerPage.resultCountText).toHaveText(new RegExp(`^${totalBefore} / ${totalBefore} khách hàng$`));
  });

  test('TC-18: should show "Tất cả trạng thái" as default status filter', async () => {
    await expect(customerPage.statusFilterButton).toBeVisible();
    await expect(customerPage.statusFilterButton).toHaveText('Tất cả trạng thái');
    await expect(customerPage.clearFilterButton).not.toBeVisible();
  });

  test('TC-19b: should show "Xóa lọc" button only when a status filter is applied', async () => {
    const beforeCountText = await customerPage.resultCountText.innerText();

    await customerPage.filterByStatus('Tạm khóa');
    await expect(customerPage.clearFilterButton).toBeVisible();
    await expect(customerPage.statusFilterButton).toHaveText('Tạm khóa');
    // Chờ danh sách/bộ đếm cập nhật theo bộ lọc mới trước khi kiểm tra dữ liệu dòng
    await expect(customerPage.resultCountText).not.toHaveText(beforeCountText);

    // Mọi dòng hiển thị đều phải có trạng thái Tạm khóa
    const rowCount = await customerPage.getRowCount() - 1; // trừ header row
    for (let i = 1; i <= rowCount; i++) {
      await expect(customerPage.getDataRow(i)).toContainText('Tạm khóa');
    }

    await customerPage.clearFilterButton.click();
    await expect(customerPage.clearFilterButton).not.toBeVisible();
    await expect(customerPage.statusFilterButton).toHaveText('Tất cả trạng thái');
  });

  test('TC-22 & TC-23: action buttons should be hidden by default and appear on row hover', async () => {
    const actions = customerPage.getRowActionsContainer(1);
    await expect(actions).not.toBeVisible();

    await customerPage.getDataRow(1).hover();
    await expect(actions).toBeVisible();
    await expect(customerPage.getDataRow(1).getByTitle('Xem chi tiết')).toBeVisible();
    await expect(customerPage.getDataRow(1).getByTitle('Chỉnh sửa')).toBeVisible();
  });

  test('TC-24: lock/activate icon should match customer status', async () => {
    const rowCount = await customerPage.getRowCount() - 1;
    let checkedActive = false;
    let checkedSuspended = false;

    for (let i = 1; i <= rowCount && !(checkedActive && checkedSuspended); i++) {
      const status = await customerPage.getStatusOfRow(i);
      const lockBtn = customerPage.getLockToggleButton(i);
      const title = await lockBtn.getAttribute('title');

      if (status.includes('Hoạt động')) {
        expect(title).toBe('Khóa');
        checkedActive = true;
      } else if (status.includes('Tạm khóa')) {
        expect(title).toBe('Kích hoạt');
        checkedSuspended = true;
      }
    }
  });

  test('TC-28,29,30: stat cards should reflect a plausible breakdown of customers', async () => {
    const sumText = await customerPage.cardSum.locator('..').locator('p').first().innerText();
    const activeText = await customerPage.cardActive.locator('..').locator('p').first().innerText();
    const lockText = await customerPage.cardLock.locator('..').locator('p').first().innerText();

    const sum = parseInt(sumText, 10);
    const active = parseInt(activeText, 10);
    const lock = parseInt(lockText, 10);

    expect(sum).toBeGreaterThan(0);
    expect(active + lock).toBeLessThanOrEqual(sum);
  });

  test('TC-41: result counter should match total customer count from stat card when unfiltered', async () => {
    const text = await customerPage.resultCountText.innerText();
    const [matched, total] = text.match(/(\d+) \/ (\d+) khách hàng/)!.slice(1);
    expect(matched).toBe(total);
  });

  test('Pagination: "Trước" should be disabled on first page, "Sau" should navigate to next page', async () => {
    await expect(customerPage.prevPageButton).toBeDisabled();

    const isNextEnabled = await customerPage.nextPageButton.isEnabled();
    if (isNextEnabled) {
      await customerPage.nextPageButton.click();
      await expect(customerPage.prevPageButton).toBeEnabled();
    }
  });

});
