import { defineConfig, devices } from '@playwright/test';
import { AllureReporter } from 'allure-playwright';
import path from 'path';

/**
 * Playwright Configuration
 * คอนฟิกูเรชันหลักสำหรับ Web Automation Testing
 * 
 * คำอธิบาย:
 * - กำหนด browser ที่จะใช้ทดสอบ (Chrome, Firefox, Safari, Edge)
 * - ตั้งค่า timeout, retry, และ parallel execution
 * - กำหนดการบันทึก screenshot, video, และ trace
 * - เชื่อมต่อกับ Allure Reporter สำหรับรายงานผลการทดสอบ
 */
export default defineConfig({
  // Test Directory
  testDir: './tests/web',
  
  // Timeout Settings
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 5 * 1000, // 5 seconds for assertions
  },
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Parallel execution
  workers: process.env.CI ? 2 : undefined,
  
  // Reporter Configuration
  reporter: [
    ['html', { outputFolder: './playwright-report' }],
    ['json', { outputFile: './test-results/results.json' }],
    ['junit', { outputFile: './test-results/junit.xml' }],
    ['allure-playwright'],
  ],
  
  // Output Directories
  outputDir: './test-results/',
  
  // Global Setup and Teardown
  globalSetup: require.resolve('./config/global-setup.ts'),
  globalTeardown: require.resolve('./config/global-teardown.ts'),
  
  use: {
    // Base URL for navigation
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Browser settings
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Screenshot settings
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Trace settings (for debugging)
    trace: 'on-first-retry',
    
    // Action settings
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    
    // Locale and timezone
    locale: 'th-TH',
    timezoneId: 'Asia/Bangkok',
    
    // User agent
    userAgent: 'QA-Automation-Toolkit/1.0',
  },
  
  // Projects for different browsers and devices
  projects: [
    // Desktop Chrome
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Desktop Firefox
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    // Desktop Safari
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile Chrome
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    // Mobile Safari
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Tablet
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro 11'] },
    },
  ],
  
  // Web Server (optional - to start app before tests)
  webServer: {
    command: 'npm run start:backend',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
