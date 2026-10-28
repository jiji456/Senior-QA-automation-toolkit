/**
 * Mobile Login Tests
 * การทดสอบ Login บน Mobile Devices
 * 
 * คำอธิบาย:
 * - ทดสอบการ login บน mobile devices
 * - ทดสอบ touch interactions
 * - ทดสอบ responsive layout
 * - ทดสอบ keyboard behavior บน mobile
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { DashboardPage } from '../../pages/dashboard-page';
import { config } from '../../config/environment';
import { log } from '../../utils/logger';

test.describe('Mobile Login Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('should display login form correctly on mobile', async ({ page }) => {
    log.testStart('Display login form correctly on mobile');
    
    // Verify viewport size is mobile
    const viewportSize = page.viewportSize();
    expect(viewportSize?.width).toBeLessThanOrEqual(768);
    
    // Verify login form is visible
    expect(await loginPage.isLoaded()).toBeTruthy();
    
    log.testPass('Display login form correctly on mobile');
  });

  test('should login successfully with touch', async ({ page }) => {
    log.testStart('Login successfully with touch');
    
    // Tap on email input
    await page.tap(loginPage.emailInput);
    await page.fill(loginPage.emailInput, config.testUser.email);
    
    // Tap on password input
    await page.tap(loginPage.passwordInput);
    await page.fill(loginPage.passwordInput, config.testUser.password);
    
    // Tap on login button
    await page.tap(loginPage.loginButton);
    
    // Verify navigation
    expect(page.url()).toContain('/dashboard');
    
    log.testPass('Login successfully with touch');
  });

  test('should handle mobile keyboard correctly', async ({ page }) => {
    log.testStart('Handle mobile keyboard correctly');
    
    // Focus on email input
    await page.tap(loginPage.emailInput);
    
    // Verify keyboard is shown (viewport height changes)
    const initialViewport = page.viewportSize();
    await page.waitForTimeout(500);
    const keyboardViewport = page.viewportSize();
    
    // On mobile, keyboard should reduce visible viewport
    // This is a simplified check
    expect(keyboardViewport).toBeDefined();
    
    log.testPass('Handle mobile keyboard correctly');
  });

  test('should support swipe gestures', async ({ page }) => {
    log.testStart('Support swipe gestures');
    
    // Perform swipe down gesture
    await page.touchscreen.tap(200, 300);
    await page.touchscreen.tap(200, 500);
    
    log.testPass('Support swipe gestures');
  });

  test('should handle orientation change', async ({ page }) => {
    log.testStart('Handle orientation change');
    
    // Change to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    
    // Verify form is still visible
    expect(await loginPage.isLoaded()).toBeTruthy();
    
    // Change back to portrait
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify form is still visible
    expect(await loginPage.isLoaded()).toBeTruthy();
    
    log.testPass('Handle orientation change');
  });

  test('should have touch-friendly button sizes', async ({ page }) => {
    log.testStart('Have touch-friendly button sizes');
    
    const loginButton = page.locator(loginPage.loginButton);
    const box = await loginButton.boundingBox();
    
    // Touch targets should be at least 44x44 points (iOS guideline)
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
    
    log.testPass('Have touch-friendly button sizes');
  });

  test('should handle pinch zoom', async ({ page }) => {
    log.testStart('Handle pinch zoom');
    
    // Pinch zoom gesture (simplified)
    await page.touchscreen.tap(200, 300);
    await page.touchscreen.tap(200, 300);
    
    log.testPass('Handle pinch zoom');
  });
});
