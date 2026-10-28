/**
 * Dashboard Page
 * หน้า Dashboard สำหรับ Page Object Model
 * 
 * คำอธิบาย:
 * - จัดการการแสดงผล dashboard
 * - ตรวจสอบ elements บนหน้า dashboard
 * - จัดการ navigation ภายใน dashboard
 * - ตรวจสอบ user information
 */
import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { log } from '../utils/logger';

export class DashboardPage extends BasePage {
  // Page elements
  readonly welcomeMessage: string = '.welcome-message';
  readonly userMenu: string = '.user-menu';
  readonly logoutButton: string = 'button[aria-label="Logout"]';
  readonly sidebar: string = '.sidebar';
  readonly navigationItems: string = '.nav-item';
  readonly contentArea: string = '.content-area';
  readonly notifications: string = '.notifications';
  readonly notificationBadge: string = '.notification-badge';

  constructor(page: Page) {
    super(page, '/dashboard');
  }

  /**
   * Get welcome message
   รับข้อความ welcome
   */
  async getWelcomeMessage(): Promise<string> {
    await this.waitForElementVisible(this.welcomeMessage);
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Click user menu
   คลิกเมนู user
   */
  async clickUserMenu(): Promise<void> {
    await this.click(this.userMenu);
  }

  /**
   * Logout
   ออกจากระบบ
   */
  async logout(): Promise<void> {
    log.step('1', 'Click user menu');
    await this.clickUserMenu();
    
    log.step('2', 'Click logout button');
    await this.click(this.logoutButton);
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to section
   นำทางไปยัง section ที่กำหนด
   */
  async navigateToSection(sectionName: string): Promise<void> {
    const selector = `${this.navigationItems}:has-text("${sectionName}")`;
    await this.click(selector);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get notification count
   รับจำนวน notifications
   */
  async getNotificationCount(): Promise<number> {
    if (await this.isVisible(this.notificationBadge)) {
      const text = await this.getText(this.notificationBadge);
      return parseInt(text, 10);
    }
    return 0;
  }

  /**
   * Check if sidebar is visible
   ตรวจสอบว่า sidebar มองเห็นได้
   */
  async isSidebarVisible(): Promise<boolean> {
    return await this.isVisible(this.sidebar);
  }

  /**
   * Get all navigation items
   รับ navigation items ทั้งหมด
   */
  async getNavigationItems(): Promise<string[]> {
    const items = await this.page.locator(this.navigationItems).allTextContents();
    return items;
  }

  /**
   * Verify dashboard is loaded
   ตรวจสอบว่า dashboard โหลดเสร็จสิ้น
   */
  async isLoaded(): Promise<boolean> {
    return await this.isVisible(this.welcomeMessage) && 
           await this.isVisible(this.contentArea);
  }

  /**
   * Search in dashboard
   ค้นหาใน dashboard
   */
  async search(query: string): Promise<void> {
    const searchInput = 'input[placeholder*="Search"]';
    await this.fill(searchInput, query);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Toggle sidebar
   สลับการแสดง sidebar
   */
  async toggleSidebar(): Promise<void> {
    const toggleButton = '.sidebar-toggle';
    await this.click(toggleButton);
  }

  /**
   * Get current active section
   รับ section ที่กำลัง active
   */
  async getActiveSection(): Promise<string> {
    const activeItem = `${this.navigationItems}.active`;
    return await this.getText(activeItem);
  }
}
