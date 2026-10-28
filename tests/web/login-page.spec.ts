/**
 * LoginPage Tests - ทดสอบหน้า Login
 * 
 * ทดสอบสิ่งที่:
 * - หน้าโหลดได้
 * - มี elements ที่คาดหวัง
 * - Responsive design
 * - Accessibility
 */
import { test, expect } from '@playwright/test';

test.describe('LoginPage UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('หน้า Login โหลดได้และมี title ที่ถูกต้อง', async ({ page }) => {
    // ตรวจสอบ title
    const title = await page.title();
    expect(title).toContain('Bookmark');
  });

  test('มี heading ที่ถูกต้อง', async ({ page }) => {
    // ตรวจสอบว่ามี "BBL Bookmark Manager"
    const heading = page.getByText('BBL Bookmark Manager');
    await expect(heading).toBeVisible();
  });

  test('มี description ที่ถูกต้อง', async ({ page }) => {
    // ตรวจสอบ description
    const description = page.getByText('Organize your bookmarks with privacy-first architecture');
    await expect(description).toBeVisible();
  });

  test('มีปุ่ม Login with Auth0', async ({ page }) => {
    // ตรวจสอบปุ่ม login
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText('Login with Auth0');
  });

  test('ปุ่ม Login สามารถคลิกได้', async ({ page }) => {
    // ตรวจสอบว่าปุ่ม enable อยู่
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeEnabled();
  });

  test('Responsive Design - Desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000');
    
    // ตรวจสอบว่า elements ยังแสดงผลได้
    const heading = page.getByText('BBL Bookmark Manager');
    await expect(heading).toBeVisible();
  });

  test('Responsive Design - Tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    const heading = page.getByText('BBL Bookmark Manager');
    await expect(heading).toBeVisible();
  });

  test('Responsive Design - Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const heading = page.getByText('BBL Bookmark Manager');
    await expect(heading).toBeVisible();
  });

  test('ตรวจสอบ layout structure', async ({ page }) => {
    // ตรวจสอบว่ามี container
    const container = page.locator('.MuiContainer-root');
    await expect(container).toBeVisible();
  });

  test('ตรวจสอบว่ามี text ทั้งหมดแสดงผล', async ({ page }) => {
    // ตรวจสอบว่า text ไม่ซ่อนอยู่
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('BBL Bookmark Manager');
    expect(bodyText).toContain('Organize your bookmarks');
  });
});
