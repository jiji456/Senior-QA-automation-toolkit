/**
 * Base Page Class
 * คลาสพื้นฐานสำหรับ Page Object Model
 * 
 * คำอธิบาย:
 * - ให้ฟังก์ชันพื้นฐานสำหรับทุกหน้าเว็บ
 * - จัดการ navigation
 * - จัดการ waiting
 * - จัดการ screenshot
 * - จัดการ logging
 */
import { Page, Locator } from '@playwright/test';
import { log } from '../utils/logger';
import { waitForVisible, waitForHidden, waitForClickable, waitForNavigation } from '../utils/wait-helper';

export class BasePage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page, path: string = '/') {
    this.page = page;
    this.path = path;
  }

  /**
   * Navigate to the page
   นำทางไปยังหน้าเว็บ
   */
  async navigate(): Promise<void> {
    const url = `${process.env.BASE_URL}${this.path}`;
    log.uiNavigation(url);
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to fully load
   รอให้หน้าเว็บโหลดเสร็จสมบูรณ์
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get current URL
   รับ URL ปัจจุบัน
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Refresh the page
   รีเฟรชหน้าเว็บ
   */
  async refresh(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Go back
 * ย้อนกลับ
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Go forward
   ไปข้างหน้า
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  /**
   * Click on element
   คลิกที่ element
   */
  async click(selector: string): Promise<void> {
    log.uiAction('Click', selector);
    await waitForClickable(this.page, selector);
    await this.page.click(selector);
  }

  /**
   * Double click on element
   ดับเบิลคลิกที่ element
   */
  async doubleClick(selector: string): Promise<void> {
    log.uiAction('Double Click', selector);
    await waitForClickable(this.page, selector);
    await this.page.dblclick(selector);
  }

  /**
   * Right click on element
   คลิกขวาที่ element
   */
  async rightClick(selector: string): Promise<void> {
    log.uiAction('Right Click', selector);
    await waitForClickable(this.page, selector);
    await this.page.click(selector, { button: 'right' });
  }

  /**
   * Type text into element
   พิมพ์ข้อความลงใน element
   */
  async type(selector: string, text: string, clear: boolean = true): Promise<void> {
    log.uiAction('Type', selector);
    await waitForVisible(this.page, selector);
    
    if (clear) {
      await this.page.fill(selector, '');
    }
    
    await this.page.type(selector, text);
  }

  /**
   * Fill text into element
 * กรอกข้อความลงใน element
   */
  async fill(selector: string, text: string): Promise<void> {
    log.uiAction('Fill', selector);
    await waitForVisible(this.page, selector);
    await this.page.fill(selector, text);
  }

  /**
   * Select option from dropdown
   เลือก option จาก dropdown
   */
  async selectOption(selector: string, value: string | string[]): Promise<void> {
    log.uiAction('Select Option', selector);
    await waitForVisible(this.page, selector);
    await this.page.selectOption(selector, value);
  }

  /**
   * Check checkbox
   ติ๊ก checkbox
   */
  async check(selector: string): Promise<void> {
    log.uiAction('Check', selector);
    await waitForVisible(this.page, selector);
    await this.page.check(selector);
  }

  /**
   * Uncheck checkbox
   ยกเลิกการติ๊ก checkbox
   */
  async uncheck(selector: string): Promise<void> {
    log.uiAction('Uncheck', selector);
    await waitForVisible(this.page, selector);
    await this.page.uncheck(selector);
  }

  /**
   * Upload file
   อัปโหลดไฟล์
   */
  async uploadFile(selector: string, filePath: string): Promise<void> {
    log.uiAction('Upload File', selector);
    await waitForVisible(this.page, selector);
    await this.page.setInputFiles(selector, filePath);
  }

  /**
   * Get text from element
   รับข้อความจาก element
   */
  async getText(selector: string): Promise<string> {
    await waitForVisible(this.page, selector);
    return await this.page.textContent(selector) || '';
  }

  /**
   * Get attribute from element
   รับ attribute จาก element
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    await waitForVisible(this.page, selector);
    return await this.page.getAttribute(selector, attribute);
  }

  /**
   * Get value from input element
   รับค่าจาก input element
   */
  async getValue(selector: string): Promise<string> {
    await waitForVisible(this.page, selector);
    return await this.page.inputValue(selector);
  }

  /**
   * Check if element is visible
   ตรวจสอบว่า element มองเห็นได้
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element exists
   ตรวจสอบว่า element มีอยู่
   */
  async exists(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'attached', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   ตรวจสอบว่า element สามารถใช้งานได้
   */
  async isEnabled(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isEnabled();
  }

  /**
   * Check if element is checked
   ตรวจสอบว่า element ถูกติ๊กอยู่
   */
  async isChecked(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isChecked();
  }

  /**
   * Hover over element
   วางเมาส์เหนือ element
   */
  async hover(selector: string): Promise<void> {
    log.uiAction('Hover', selector);
    await waitForVisible(this.page, selector);
    await this.page.hover(selector);
  }

  /**
   * Scroll to element
   เลื่อนไปยัง element
   */
  async scrollToElement(selector: string): Promise<void> {
    await waitForVisible(this.page, selector);
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to top of page
   เลื่อนไปด้านบนสุดของหน้า
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to bottom of page
   เลื่อนไปด้านล่างสุดของหน้า
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Take screenshot
   ถ่าย screenshot
   */
  async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ path: `./screenshots/${filename}.png`, fullPage: true });
    log.info(`Screenshot saved: ${filename}.png`);
  }

  /**
   * Wait for element to be visible
   รอให้ element มองเห็นได้
   */
  async waitForElementVisible(selector: string, timeout: number = 30000): Promise<void> {
    await waitForVisible(this.page, selector, timeout);
  }

  /**
   * Wait for element to be hidden
   รอให้ element หายไป
   */
  async waitForElementHidden(selector: string, timeout: number = 30000): Promise<void> {
    await waitForHidden(this.page, selector, timeout);
  }

  /**
   * Execute JavaScript in page
   รัน JavaScript ในหน้าเว็บ
   */
  async executeScript(script: string, ...args: any[]): Promise<any> {
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Get page title
   รับ title ของหน้าเว็บ
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Switch to iframe
   สลับไปยัง iframe
   */
  async switchToIframe(selector: string): Promise<void> {
    const frame = this.page.frameLocator(selector);
    // Store frame reference for future use
    (this as any).currentFrame = frame;
  }

  /**
   * Switch back to main content
   สลับกลับไปยัง main content
   */
  async switchToMainContent(): Promise<void> {
    (this as any).currentFrame = null;
  }

  /**
   * Handle alert
   จัดการ alert
   */
  async handleAlert(accept: boolean = true, promptText?: string): Promise<void> {
    this.page.on('dialog', async dialog => {
      if (promptText) {
        await dialog.accept(promptText);
      } else if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Get all cookies
   รับ cookies ทั้งหมด
   */
  async getCookies(): Promise<any[]> {
    return await this.page.context().cookies();
  }

  /**
   * Set cookie
   ตั้งค่า cookie
   */
  async setCookie(name: string, value: string, url?: string): Promise<void> {
    await this.page.context().addCookies([{ name, value, url }]);
  }

  /**
   * Clear all cookies
   ลบ cookies ทั้งหมด
   */
  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  /**
   * Get local storage
   รับ local storage
   */
  async getLocalStorage(): Promise<any> {
    return await this.page.evaluate(() => {
      const storage: any = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          storage[key] = localStorage.getItem(key);
        }
      }
      return storage;
    });
  }

  /**
   * Set local storage
   ตั้งค่า local storage
   */
  async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate((k, v) => localStorage.setItem(k, v), key, value);
  }

  /**
   * Clear local storage
   ลบ local storage
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }
}
