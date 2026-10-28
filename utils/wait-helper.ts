/**
 * Wait Helper Utility
 * ยูทิลิตี้สำหรับจัดการการรอ (waiting) ในการทดสอบ
 * 
 * คำอธิบาย:
 * - รอให้ element ปรากฏ
 * - รอให้ element หายไป
 * - รอให้ element สามารถคลิกได้
 * - รอตามเวลาที่กำหนด
 * - รอตามเงื่อนไขที่กำหนด
 */
import { Page, Locator } from '@playwright/test';

/**
 * Wait for specified time (ms)
 * รองานเวลาที่กำหนด (มิลลิวินาที)
 */
export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for element to be visible
 * รอให้ element ปรากฏขึ้น
 */
export async function waitForVisible(page: Page, selector: string, timeout: number = 30000): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Wait for element to be hidden
 * รอให้ element หายไป
 */
export async function waitForHidden(page: Page, selector: string, timeout: number = 30000): Promise<void> {
  await page.waitForSelector(selector, { state: 'hidden', timeout });
}

/**
 * Wait for element to be attached to DOM
 * รอให้ element ถูก attached ใน DOM
 */
export async function waitForAttached(page: Page, selector: string, timeout: number = 30000): Promise<void> {
  await page.waitForSelector(selector, { state: 'attached', timeout });
}

/**
 * Wait for element to be detached from DOM
 * รอให้ element ถูก detached จาก DOM
 */
export async function waitForDetached(page: Page, selector: string, timeout: number = 30000): Promise<void> {
  await page.waitForSelector(selector, { state: 'detached', timeout });
}

/**
 * Wait for element to be enabled
 * รอให้ element สามารถใช้งานได้
 */
export async function waitForEnabled(page: Page, selector: string, timeout: number = 30000): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  await page.waitForFunction(
    (sel: string) => {
      const el = document.querySelector(sel) as HTMLElement;
      return el && !el.disabled;
    },
    selector,
    timeout
  );
}

/**
 * Wait for element to be clickable
 * รอให้ element สามารถคลิกได้
 */
export async function waitForClickable(page: Page, selector: string, timeout: number = 30000): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for network idle
 * รอให้ network สงบ (ไม่มี request ที่กำลังทำงาน)
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for navigation to complete
 * รอให้การนำทางเสร็จสิ้น
 */
export async function waitForNavigation(page: Page, timeout: number = 30000): Promise<void> {
  await page.waitForLoadState('domcontentloaded', { timeout });
}

/**
 * Wait for URL to contain specific string
 * รอให้ URL มี string ที่กำหนด
 */
export async function waitForURL(page: Page, url: string, timeout: number = 30000): Promise<void> {
  await page.waitForURL(url, { timeout });
}

/**
 * Wait for custom condition
 * รอตามเงื่อนไขที่กำหนดเอง
 */
export async function waitForCondition(
  page: Page,
  condition: () => boolean | Promise<boolean>,
  timeout: number = 30000,
  polling: number = 100
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await wait(polling);
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Wait for element text to contain specific text
 * รอให้ element มี text ที่กำหนด
 */
export async function waitForText(page: Page, selector: string, text: string, timeout: number = 30000): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  await page.waitForFunction(
    (sel: string, txt: string) => {
      const el = document.querySelector(sel);
      return el && el.textContent && el.textContent.includes(txt);
    },
    selector,
    text
  );
}

/**
 * Wait for element attribute to have specific value
 * รอให้ attribute ของ element มีค่าที่กำหนด
 */
export async function waitForAttribute(
  page: Page,
  selector: string,
  attribute: string,
  value: string,
  timeout: number = 30000
): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  await page.waitForFunction(
    (sel: string, attr: string, val: string) => {
      const el = document.querySelector(sel);
      return el && el.getAttribute(attr) === val;
    },
    selector,
    attribute,
    value
  );
}

/**
 * Wait for page to be fully loaded
 * รอให้หน้าเว็บโหลดเสร็จสมบูรณ์
 */
export async function waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
  await page.waitForLoadState('load', { timeout });
}

/**
 * Retry function with exponential backoff
 * ลองทำฟังก์ชันซ้ำด้วย exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await wait(delay);
    }
  }
  throw new Error('Max retries exceeded');
}

/**
 * Poll for condition with interval
 * ตรวจสอบเงื่อนไขเป็นระยะ
 */
export async function pollForCondition(
  condition: () => boolean | Promise<boolean>,
  interval: number = 1000,
  timeout: number = 30000
): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await wait(interval);
  }
  return false;
}
