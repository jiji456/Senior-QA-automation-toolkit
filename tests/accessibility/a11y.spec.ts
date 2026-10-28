/**
 * Accessibility Tests
 * การทดสอบ Accessibility (A11y)
 * 
 * คำอธิบาย:
 * - ตรวจสอบ WCAG compliance
 * - ตรวจสอบ keyboard navigation
 * - ตรวจสอบ screen reader compatibility
 * - ตรวจสอบ color contrast
 * - ตรวจสอบ ARIA labels
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { DashboardPage } from '../../pages/dashboard-page';
import { config } from '../../config/environment';
import { log } from '../../utils/logger';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Inject axe-core
    await injectAxe(page);
  });

  test('should have no accessibility violations on login page', async ({ page }) => {
    log.testStart('No accessibility violations on login page');
    
    await loginPage.navigate();
    await loginPage.waitForPageLoad();
    
    // Check accessibility violations
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
    
    log.testPass('No accessibility violations on login page');
  });

  test('should have proper ARIA labels on login form', async ({ page }) => {
    log.testStart('Proper ARIA labels on login form');
    
    await loginPage.navigate();
    
    // Check email input has label
    const emailInput = page.locator(loginPage.emailInput);
    await expect(emailInput).toHaveAttribute('aria-label');
    
    // Check password input has label
    const passwordInput = page.locator(loginPage.passwordInput);
    await expect(passwordInput).toHaveAttribute('aria-label');
    
    // Check login button has label
    const loginButton = page.locator(loginPage.loginButton);
    await expect(loginButton).toHaveAttribute('aria-label');
    
    log.testPass('Proper ARIA labels on login form');
  });

  test('should support keyboard navigation on login page', async ({ page }) => {
    log.testStart('Support keyboard navigation on login page');
    
    await loginPage.navigate();
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    const emailInput = page.locator(loginPage.emailInput);
    await expect(emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    const passwordInput = page.locator(loginPage.passwordInput);
    await expect(passwordInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    const loginButton = page.locator(loginPage.loginButton);
    await expect(loginButton).toBeFocused();
    
    // Submit with Enter
    await page.keyboard.press('Enter');
    
    log.testPass('Support keyboard navigation on login page');
  });

  test('should have no accessibility violations on dashboard', async ({ page }) => {
    log.testStart('No accessibility violations on dashboard');
    
    await loginPage.navigate();
    await loginPage.login(config.testUser.email, config.testUser.password);
    await dashboardPage.waitForPageLoad();
    
    // Re-inject axe after navigation
    await injectAxe(page);
    
    // Check accessibility violations
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
    
    log.testPass('No accessibility violations on dashboard');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    log.testStart('Proper heading hierarchy');
    
    await loginPage.navigate();
    
    // Check for h1
    const h1 = page.locator('h1');
    expect(await h1.count()).toBeGreaterThan(0);
    
    // Check heading order (h1 should come before h2)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.charAt(1));
      expect(level).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = level;
    }
    
    log.testPass('Proper heading hierarchy');
  });

  test('should have sufficient color contrast', async ({ page }) => {
    log.testStart('Sufficient color contrast');
    
    await loginPage.navigate();
    
    // Check color contrast using axe
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
    
    log.testPass('Sufficient color contrast');
  });

  test('should have alt text for images', async ({ page }) => {
    log.testStart('Alt text for images');
    
    await loginPage.navigate();
    
    // Check all images have alt text
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
    
    log.testPass('Alt text for images');
  });

  test('should have proper focus indicators', async ({ page }) => {
    log.testStart('Proper focus indicators');
    
    await loginPage.navigate();
    
    // Focus on email input
    await page.locator(loginPage.emailInput).focus();
    
    // Check if focused element has visible focus style
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return {
        outline: getComputedStyle(el).outline,
        outlineWidth: getComputedStyle(el).outlineWidth,
        boxShadow: getComputedStyle(el).boxShadow,
      };
    });
    
    expect(
      focusedElement.outline !== 'none' || 
      focusedElement.outlineWidth !== '0px' || 
      focusedElement.boxShadow !== 'none'
    ).toBeTruthy();
    
    log.testPass('Proper focus indicators');
  });

  test('should have proper form labels', async ({ page }) => {
    log.testStart('Proper form labels');
    
    await loginPage.navigate();
    
    // Check email input has associated label
    const emailInput = page.locator(loginPage.emailInput);
    const emailId = await emailInput.getAttribute('id');
    if (emailId) {
      const label = page.locator(`label[for="${emailId}"]`);
      await expect(label).toBeVisible();
    }
    
    // Check password input has associated label
    const passwordInput = page.locator(loginPage.passwordInput);
    const passwordId = await passwordInput.getAttribute('id');
    if (passwordId) {
      const label = page.locator(`label[for="${passwordId}"]`);
      await expect(label).toBeVisible();
    }
    
    log.testPass('Proper form labels');
  });

  test('should have proper link descriptions', async ({ page }) => {
    log.testStart('Proper link descriptions');
    
    await loginPage.navigate();
    
    // Check all links have descriptive text
    const links = page.locator('a');
    const count = await links.count();
    
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
    
    log.testPass('Proper link descriptions');
  });
});
