/**
 * Frontend Tests - ทดสอบ UI ของ Bookmark Manager
 */
import { test, expect } from '@playwright/test';

test.describe('Frontend Basic Tests', () => {
  test('หน้าแรกโหลดได้', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // ตรวจสอบ URL
    expect(page.url()).toBe('http://localhost:3000/');
    
    // ตรวจสอบ title
    const title = await page.title();
    expect(title).toContain('Bookmark');
  });

  test('หน้ามี elements พื้นฐาน', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // รอให้ page โหลด
    await page.waitForLoadState('networkidle');
    
    // ตรวจสอบว่ามี body
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('ตรวจสอบ responsive design', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // ตรวจสอบว่ายังโหลดได้
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
