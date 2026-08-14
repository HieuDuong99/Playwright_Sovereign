const path = require('path');
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

const storageStatePath = path.resolve(__dirname, 'storageState.json');

test('authenticate once and save storage state', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  try {
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_EMAIL || 'superadmin-sovereign@yopmail.com',
      process.env.TEST_PASSWORD || 'Vnpt@Si2026'
    );

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/workspaces|dashboard|home/i, { timeout: 30000 });
  } catch (error) {
    console.warn('Auth setup warning:', error.message);
    throw error;
  }

  await context.storageState({ path: storageStatePath });
  await context.close();
});
