export class CustomerManagementPage {
  constructor(page) {
    this.page = page;
    this.customerManagementMenu = page.getByRole('link', { name: 'Quản lý khách hàng (Workspace)' });
    this.heading = page.getByRole('heading', { name: 'Quản lý khách hàng' });
    this.exportButton = page.getByRole('button', { name: 'Xuất Excel' });
    this.addButton = page.getByRole('button', { name: 'Thêm' });
    this.searchInput = page.getByPlaceholder('Tìm kiếm theo tên, email, SĐT...');
    this.table = page.getByRole('table');
    this.tableRows = this.table.getByRole('row');

    // Bộ lọc trạng thái + phân trang
    // Dùng class CSS đặc trưng vì text của nút thay đổi theo trạng thái đã chọn
    this.statusFilterButton = page.locator('button.min-w-\\[140px\\]');
    this.clearSearchButton = page.getByRole('button', { name: 'Xóa tìm kiếm' });
    this.clearFilterButton = page.getByRole('button', { name: 'Xóa lọc' });
    this.resultCountText = page.getByText(/\d+ \/ \d+ khách hàng/);
    this.prevPageButton = page.getByRole('button', { name: 'Trước' });
    this.nextPageButton = page.getByRole('button', { name: 'Sau' });
    this.columnHeaders = this.table.locator('thead tr').first().locator('th, td');

    // Định nghĩa 4 thẻ thống kê (stat cards)
    this.cardSum = page.getByText('Tổng khách hàng');
    this.cardActive = page.getByText('Đang hoạt động');
    this.cardLock = page.getByText('Tạm khóa', { exact: true });
    this.cardThisMonth = page.getByText('Thêm tháng này', { exact: true });
  }

  // Lấy dòng dữ liệu theo số thứ tự (1-based) trong bảng
  getDataRow(index) {
    return this.table.locator('tbody tr').nth(index - 1);
  }

  async viewCustomer(index) {
    await this.getDataRow(index).getByTitle('Xem chi tiết').click();
  }

  async editCustomer(index) {
    await this.getDataRow(index).getByTitle('Chỉnh sửa').click();
  }

  async toggleLockCustomer(index) {
    // Nút có title "Khóa" (khi đang Hoạt động) hoặc "Kích hoạt" (khi đang Tạm khóa)
    await this.getDataRow(index).locator('button[title="Khóa"], button[title="Kích hoạt"]').click();
  }

  getLockToggleButton(index) {
    return this.getDataRow(index).locator('button[title="Khóa"], button[title="Kích hoạt"]');
  }

  // Container chứa 3 nút thao tác (Xem chi tiết/Chỉnh sửa/Khóa), chỉ hiện khi hover dòng
  getRowActionsContainer(index) {
    return this.getDataRow(index).locator('td').last().locator('div').first();
  }

  async getStatusOfRow(index) {
    return (await this.getDataRow(index).locator('td').nth(4).innerText()).trim();
  }

  async filterByStatus(statusName) {
    await this.statusFilterButton.click();
    // Các lựa chọn trong dropdown là các button riêng lẻ (không có role option)
    await this.page.getByRole('button', { name: statusName, exact: true }).click();
  }

  async goto() {
    await this.page.goto('http://10.168.6.147:8083/workspaces');
  }

  async searchCustomer(keyword) {
    await this.searchInput.fill(keyword);
  }

  async clickAddCustomer() {
    await this.addButton.click();
  }

  async clickExportExcel() {
    await this.exportButton.click();
  }

  async getRowCount() {
    return await this.tableRows.count();
  }
}