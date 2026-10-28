/**
 * Dashboard Page Tests
 * การทดสอบหน้า Dashboard
 * 
 * คำอธิบาย:
 * - ทดสอบการแสดงผล dashboard
 * - ทดสอบ navigation
 * - ทดสอบ logout
 * - ทดสอบ notifications
 * - ทดสอบ sidebar
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { DashboardPage } from '../../pages/dashboard-page';
import { config } from '../../config/environment';
import { log } from '../../utils/logger';

test.describe('Dashboard Page Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login(config.testUser.email, config.testUser.password);
  });

  test('should display dashboard correctly', async ({ page }) => {
    log.testStart('Display dashboard correctly');
    
    // Verify dashboard is loaded
    expect(await dashboardPage.isLoaded()).toBeTruthy();
    
    // Verify URL
    expect(page.url()).toContain('/dashboard');
    
    // Verify welcome message
    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toBeTruthy();
    
    log.testPass('Display dashboard correctly');
  });

  test('should display user information', async ({ page }) => {
    log.testStart('Display user information');
    
    // Verify user menu is visible
    expect(await dashboardPage.isVisible(dashboardPage.userMenu)).toBeTruthy();
    
    log.testPass('Display user information');
  });

  test('should logout successfully', async ({ page }) => {
    log.testStart('Logout successfully');
    
    // Logout
    await dashboardPage.logout();
    
    // Verify navigation to login page
    expect(page.url()).toContain('/login');
    
    // Verify login page is loaded
    expect(await loginPage.isLoaded()).toBeTruthy();
    
    log.testPass('Logout successfully');
  });

  test('should navigate to different sections', async ({ page }) => {
    log.testStart('Navigate to different sections');
    
    // Get navigation items
    const navItems = await dashboardPage.getNavigationItems();
    
    if (navItems.length > 0) {
      // Navigate to first section
      await dashboardPage.navigateToSection(navItems[0]);
      
      // Verify navigation
      const activeSection = await dashboardPage.getActiveSection();
      expect(activeSection).toBe(navItems[0]);
    }
    
    log.testPass('Navigate to different sections');
  });

  test('should display notification badge when there are notifications', async ({ page }) => {
    log.testStart('Display notification badge');
    
    // Check notification count
    const count = await dashboardPage.getNotificationCount();
    
    // If there are notifications, verify badge is visible
    if (count > 0) {
      expect(await dashboardPage.isVisible(dashboardPage.notificationBadge)).toBeTruthy();
    }
    
    log.testPass('Display notification badge');
  });

  test('should toggle sidebar visibility', async ({ page }) => {
    log.testStart('Toggle sidebar visibility');
    
    // Check initial state
    const initialVisibility = await dashboardPage.isSidebarVisible();
    
    // Toggle sidebar
    await dashboardPage.toggleSidebar();
    
    // Verify state changed
    const newVisibility = await dashboardPage.isSidebarVisible();
    expect(newVisibility).not.toBe(initialVisibility);
    
    log.testPass('Toggle sidebar visibility');
  });

  test('should search in dashboard', async ({ page }) => {
    log.testStart('Search in dashboard');
    
    // Perform search
    await dashboardPage.search('test');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    log.testPass('Search in dashboard');
  });

  test('should display navigation items', async ({ page }) => {
    log.testStart('Display navigation items');
    
    // Get navigation items
    const navItems = await dashboardPage.getNavigationItems();
    
    // Verify items exist
    expect(navItems.length).toBeGreaterThan(0);
    
    log.testPass('Display navigation items');
  });

  test('should handle user menu click', async ({ page }) => {
    log.testStart('Handle user menu click');
    
    // Click user menu
    await dashboardPage.clickUserMenu();
    
    // Verify logout button is visible
    expect(await dashboardPage.isVisible(dashboardPage.logoutButton)).toBeTruthy();
    
    log.testPass('Handle user menu click');
  });
});
