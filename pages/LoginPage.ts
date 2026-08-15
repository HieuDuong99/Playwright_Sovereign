import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // --- FORM SIGNUP BƯỚC 1 (Tại /login) ---
  readonly signupHeading: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  // --- FORM SIGNUP BƯỚC 2 (Tại /signup) ---
  readonly enterAccountInfoHeading: Locator;
  readonly genderMrRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly optinCheckbox: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly addressInput: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;
  readonly createAccountButton: Locator;

  // --- THÔNG BÁO XÁC NHẬN & XÓA TÀI KHOẢN ---
  readonly accountCreatedHeading: Locator;
  readonly accountDeletedHeading: Locator;
  readonly continueButton: Locator;
  readonly deleteAccountLink: Locator;

  constructor(page: Page) {
    super(page);

    // Locators Signup Bước 1
    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');

    // Locators Signup Bước 2 (Thông tin cá nhân)
    this.enterAccountInfoHeading = page.getByText('Enter Account Information');
    this.genderMrRadio = page.locator('#id_gender1');
    this.passwordInput = page.locator('input[data-qa="password"]');
    this.daysSelect = page.locator('select[data-qa="days"]');
    this.monthsSelect = page.locator('select[data-qa="months"]');
    this.yearsSelect = page.locator('select[data-qa="years"]');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');

    // Locators Địa chỉ & Nút Tạo tài khoản
    this.firstNameInput = page.locator('input[data-qa="first_name"]');
    this.lastNameInput = page.locator('input[data-qa="last_name"]');
    this.companyInput = page.locator('input[data-qa="company"]');
    this.addressInput = page.locator('input[data-qa="address"]');
    this.address2Input = page.locator('input[data-qa="address2"]');
    this.countrySelect = page.locator('select[data-qa="country"]');
    this.stateInput = page.locator('input[data-qa="state"]');
    this.cityInput = page.locator('input[data-qa="city"]');
    this.zipcodeInput = page.locator('input[data-qa="zipcode"]');
    this.mobileInput = page.locator('input[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');

    // Locators Trạng thái & Xóa tài khoản
    this.accountCreatedHeading = page.locator('b', { hasText: 'ACCOUNT CREATED!' });
    this.accountDeletedHeading = page.locator('b', { hasText: 'ACCOUNT DELETED!' });
    this.continueButton = page.locator('a[data-qa="continue-button"]');
    this.deleteAccountLink = page.getByRole('link', { name: ' Delete Account' });
  }

  // 1. Điền thông tin Signup bước 1 (Name & Email)
  async fillInitialSignup(name: string, email: string) {
    await expect(this.signupHeading).toBeVisible();
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  // 2. Điền thông tin mật khẩu, ngày sinh & checkbox
  async fillAccountInformation(password: string, day: string, month: string, year: string) {
    await expect(this.enterAccountInfoHeading).toBeVisible();
    await this.genderMrRadio.check();
    await this.passwordInput.fill(password);
    await this.daysSelect.selectOption(day);
    await this.monthsSelect.selectOption(month);
    await this.yearsSelect.selectOption(year);
    await this.newsletterCheckbox.check();
    await this.optinCheckbox.check();
  }

  // 3. Điền thông tin địa chỉ & bấm Tạo tài khoản
  async fillAddressDetails(addressData: {
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile: string;
  }) {
    await this.firstNameInput.fill(addressData.firstName);
    await this.lastNameInput.fill(addressData.lastName);
    await this.companyInput.fill(addressData.company);
    await this.addressInput.fill(addressData.address1);
    await this.address2Input.fill(addressData.address2);
    await this.countrySelect.selectOption(addressData.country);
    await this.stateInput.fill(addressData.state);
    await this.cityInput.fill(addressData.city);
    await this.zipcodeInput.fill(addressData.zipcode);
    await this.mobileInput.fill(addressData.mobile);
    await this.createAccountButton.click();
  }

  // 4. Verify thông báo "ACCOUNT CREATED!" và nhấn nút Continue
  async verifyAccountCreatedAndContinue() {
    await expect(this.accountCreatedHeading).toBeVisible();
    await this.continueButton.click();
  }

  // 5. Verify thông báo đăng nhập "Logged in as <username>"
  async verifyLoggedInUser(username: string) {
    const loggedInText = this.page.locator('li', { hasText: `Logged in as ${username}` });
    await expect(loggedInText).toBeVisible();
  }

  // 6. Nhấn nút Xóa tài khoản, Verify "ACCOUNT DELETED!" và bấm Continue
  async deleteAccountAndContinue() {
    await this.deleteAccountLink.click();
    await expect(this.accountDeletedHeading).toBeVisible();
    await this.continueButton.click();
  }
}