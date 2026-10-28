import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Mobile Testing
 * คอนฟิกูเรชันสำหรับ Mobile Automation Testing
 * 
 * คำอธิบาย:
 * - กำหนด device emulators สำหรับ mobile testing
 * - รองรับ iOS และ Android
 * - ตั้งค่า viewport และ device pixel ratio
 * - จัดการ touch events
 */
export default defineConfig({
  testDir: './tests/mobile',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  retries: 0,
  workers: 1,
  
  reporter: [
    ['html', { outputFolder: './playwright-report-mobile' }],
    ['json', { outputFile: './test-results-mobile/results.json' }],
    ['allure-playwright'],
  ],
  
  outputDir: './test-results-mobile/',
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: process.env.HEADLESS !== 'false',
    viewport: null, // Use device viewport
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    locale: 'th-TH',
    timezoneId: 'Asia/Bangkok',
  },
  
  projects: [
    // iPhone 12
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] },
    },
    
    // iPhone 12 Pro Max
    {
      name: 'iPhone 12 Pro Max',
      use: { ...devices['iPhone 12 Pro Max'] },
    },
    
    // iPhone SE
    {
      name: 'iPhone SE',
      use: { ...devices['iPhone SE'] },
    },
    
    // iPad Pro 11
    {
      name: 'iPad Pro 11',
      use: { ...devices['iPad Pro 11'] },
    },
    
    // Pixel 5
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
    
    // Galaxy S21
    {
      name: 'Galaxy S21',
      use: {
        ...devices['Galaxy S21+'],
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
      },
    },
  ],
});
