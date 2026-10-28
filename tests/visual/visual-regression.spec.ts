/**
 * Visual Regression Tests
 * การทดสอบ Visual Regression
 * 
 * คำอธิบาย:
 * - เปรียบเทียบ screenshot กับ baseline
 * - ตรวจสอบการเปลี่ยนแปลงทาง visual
 * - ตรวจสอบ responsive design
 * - ตรวจสอบ cross-browser consistency
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { DashboardPage } from '../../pages/dashboard-page';
import { config } from '../../config/environment';
import { log } from '../../utils/logger';

test.describe('Visual Regression Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('should match login page screenshot', async ({ page }) => {
    log.testStart('Match login page screenshot');
    
    await loginPage.navigate();
    
    // Wait for page to fully load
    await loginPage.waitForPageLoad();
    
    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
    
    log.testPass('Match login page screenshot');
  });

  test('should match dashboard page screenshot', async ({ page }) => {
    log.testStart('Match dashboard page screenshot');
    
    // Login first
    await loginPage.navigate();
    await loginPage.login(config.testUser.email, config.testUser.password);
    
    // Wait for dashboard to load
    await dashboardPage.waitForPageLoad();
    
    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('dashboard-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
    
    log.testPass('Match dashboard page screenshot');
  });

  test('should match login form on mobile viewport', async ({ page }) => {
    log.testStart('Match login form on mobile viewport');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginPage.navigate();
    await loginPage.waitForPageLoad();
    
    await expect(page).toHaveScreenshot('login-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
    
    log.testPass('Match login form on mobile viewport');
  });

  test('should match login form on tablet viewport', async ({ page }) => {
    log.testStart('Match login form on tablet viewport');
    
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await loginPage.navigate();
    await loginPage.waitForPageLoad();
    
    await expect(page).toHaveScreenshot('login-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
    
    log.testPass('Match login form on tablet viewport');
  });

  test('should match login form with filled data', async ({ page }) => {
    log.testStart('Match login form with filled data');
    
    await loginPage.navigate();
    await loginPage.fill(loginPage.emailInput, config.testUser.email);
    await loginPage.fill(loginPage.passwordInput, config.testUser.password);
    
    await expect(page.locator('body')).toHaveScreenshot('login-filled.png', {
      maxDiffPixels: 100,
    });
    
    log.testPass('Match login form with filled data');
  });

  test('should match login form with error state', async ({ page }) => {
    log.testStart('Match login form with error state');
    
    await loginPage.navigate();
    await loginPage.login('invalid@email.com', 'wrongpassword');
    
    // Wait for error message
    await loginPage.waitForElementVisible(loginPage.errorMessage);
    
    await expect(page.locator('body')).toHaveScreenshot('login-error.png', {
      maxDiffPixels: 100,
    });
    
    log.testPass('Match login form with error state');
  });

  test('should match dashboard sidebar', async ({ page }) => {
    log.testStart('Match dashboard sidebar');
    
    await loginPage.navigate();
    await loginPage.login(config.testUser.email, config.testUser.password);
    await dashboardPage.waitForPageLoad();
    
    await expect(page.locator(dashboardPage.sidebar)).toHaveScreenshot('dashboard-sidebar.png', {
      maxDiffPixels: 50,
    });
    
    log.testPass('Match dashboard sidebar');
  });

  test('should match dashboard content area', async ({ page }) => {
    log.testStart('Match dashboard content area');
    
    await loginPage.navigate();
    await loginPage.login(config.testUser.email, config.testUser.password);
    await dashboardPage.waitForPageLoad();
    
    await expect(page.locator(dashboardPage.contentArea)).toHaveScreenshot('dashboard-content.png', {
      maxDiffPixels: 100,
    });
    
    log.testPass('Match dashboard content area');
  });
});
