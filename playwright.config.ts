import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config'; // Load file .env ở local
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['./telegram-reporter.ts']// Khai báo reporter Telegram
  ],
  use: {
    baseURL: 'https://automationexercise.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // 1. Setup Project: Chạy file auth.setup.ts đầu tiên
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2. Main Test Project: Sử dụng storageState từ bước setup
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Nạp tự động storageState cho mọi bài test trong project này
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'], // Ép Playwright phải chạy 'setup' hoàn tất trước
    },
  ],
});