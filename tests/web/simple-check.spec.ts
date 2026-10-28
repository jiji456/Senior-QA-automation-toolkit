/**
 * Simple Test - ตรวจสอบว่า application ทำงานได้
 */
import { test, expect } from '@playwright/test';

test('ตรวจสอบว่า frontend ทำงานได้', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // ตรวจสอบว่าหน้าโหลดได้
  expect(page.url()).toBe('http://localhost:3000/');
  
  // ตรวจสอบ title
  const title = await page.title();
  console.log('Page title:', title);
});

test('ตรวจสอบว่า backend ทำงานได้', async ({ page }) => {
  const response = await page.request.get('http://localhost:3001');
  
  // ตรวจสอบว่า backend ตอบกลับ
  expect(response.status()).toBe(200);
});
