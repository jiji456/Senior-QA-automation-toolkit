/**
 * Login Page
 * หน้า Login สำหรับ Page Object Model
 * 
 * คำอธิบาย:
 * - จัดการการ login เข้าสู่ระบบ
 * - ตรวจสอบ elements บนหน้า login
 * - จัดการ validation errors
 * - จัดการ forgot password
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { log } from '../utils/logger';

export class LoginPage extends BasePage {
  // Page elements
  readonly emailInput: string = 'input[name="email"]';
  readonly passwordInput: string = 'input[name="password"]';
  readonly loginButton: string = 'button[type="submit"]';
  readonly forgotPasswordLink: string = 'a[href*="forgot-password"]';
  readonly registerLink: string = 'a[href*="register"]';
  readonly errorMessage: string = '.error-message';
  readonly successMessage: string = '.success-message';
  readonly rememberMeCheckbox: string = 'input[name="remember"]';

  constructor(page: Page) {
    super(page, '/login');
  }

  /**
   * Login with email and password
   ล็อกอินด้วย email และ password
   */
  async login(email: string, password: string): Promise<void> {
    log.step('1', 'Enter email');
    await this.fill(this.emailInput, email);
    
    log.step('2', 'Enter password');
    await this.fill(this.passwordInput, password);
    
    log.step('3', 'Click login button');
    await this.click(this.loginButton);
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login with remember me
   ล็อกอินพร้อมเลือก remember me
   */
  async loginWithRememberMe(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.check(this.rememberMeCheckbox);
    await this.click(this.loginButton);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get error message
   รับข้อความ error
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if error message is displayed
   ตรวจสอบว่ามี error message แสดงหรือไม่
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Check if success message is displayed
   ตรวจสอบว่ามี success message แสดงหรือไม่
   */
  async hasSuccessMessage(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  /**
   * Click forgot password link
   คลิกลิงก์ forgot password
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click register link
   คลิกลิงก์ register
   */
  async clickRegister(): Promise<void> {
    await this.click(this.registerLink);
  }

  /**
   * Verify login page is loaded
   ตรวจสอบว่าหน้า login โหลดเสร็จสิ้น
   */
  async isLoaded(): Promise<boolean> {
    return await this.isVisible(this.emailInput) && 
           await this.isVisible(this.passwordInput) && 
           await this.isVisible(this.loginButton);
  }

  /**
   * Clear form
   ล้างฟอร์ม
   */
  async clearForm(): Promise<void> {
    await this.fill(this.emailInput, '');
    await this.fill(this.passwordInput, '');
  }

  /**
   * Get email input value
   รับค่าในช่อง email
   */
  async getEmailValue(): Promise<string> {
    return await this.getValue(this.emailInput);
  }

  /**
   * Get password input value
   รับค่าในช่อง password
   */
  async getPasswordValue(): Promise<string> {
    return await this.getValue(this.passwordInput);
  }

  /**
   * Check if login button is enabled
   ตรวจสอบว่าปุ่ม login สามารถกดได้หรือไม่
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.loginButton);
  }

  /**
   * Press Enter on password field to submit
   กด Enter ที่ช่อง password เพื่อ submit
   */
  async submitWithEnter(): Promise<void> {
    await this.page.press(this.passwordInput, 'Enter');
    await this.page.waitForLoadState('networkidle');
  }
}
