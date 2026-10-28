/**
 * Login Page Tests
 * การทดสอบหน้า Login
 * 
 * คำอธิบาย:
 * - ทดสอบการ login ที่ปกติ
 * - ทดสอบการ login ด้วยข้อมูลไม่ถูกต้อง
 * - ทดสอบ validation
 * - ทดสอบ forgot password
 * - ทดสอบ remember me
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { DashboardPage } from '../../pages/dashboard-page';
import { config } from '../../config/environment';
import { log } from '../../utils/logger';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('should display login page correctly', async ({ page }) => {
    log.testStart('Display login page correctly');
    
    // Verify page is loaded
    expect(await loginPage.isLoaded()).toBeTruthy();
    
    // Verify URL
    expect(page.url()).toContain('/login');
    
    // Verify page title
    const title = await loginPage.getTitle();
    expect(title).toContain('Login');
    
    log.testPass('Display login page correctly');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    log.testStart('Login successfully with valid credentials');
    
    // Login with valid credentials
    await loginPage.login(config.testUser.email, config.testUser.password);
    
    // Verify navigation to dashboard
    expect(page.url()).toContain('/dashboard');
    
    // Verify dashboard is loaded
    expect(await dashboardPage.isLoaded()).toBeTruthy();
    
    log.testPass('Login successfully with valid credentials');
  });

  test('should show error with invalid email', async ({ page }) => {
    log.testStart('Show error with invalid email');
    
    // Login with invalid email
    await loginPage.login('invalid@email.com', config.testUser.password);
    
    // Verify error message
    expect(await loginPage.hasErrorMessage()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid');
    
    // Verify still on login page
    expect(page.url()).toContain('/login');
    
    log.testPass('Show error with invalid email');
  });

  test('should show error with invalid password', async ({ page }) => {
    log.testStart('Show error with invalid password');
    
    // Login with invalid password
    await loginPage.login(config.testUser.email, 'wrongpassword');
    
    // Verify error message
    expect(await loginPage.hasErrorMessage()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid');
    
    // Verify still on login page
    expect(page.url()).toContain('/login');
    
    log.testPass('Show error with invalid password');
  });

  test('should show error with empty fields', async ({ page }) => {
    log.testStart('Show error with empty fields');
    
    // Try to login with empty fields
    await loginPage.login('', '');
    
    // Verify error message
    expect(await loginPage.hasErrorMessage()).toBeTruthy();
    
    // Verify still on login page
    expect(page.url()).toContain('/login');
    
    log.testPass('Show error with empty fields');
  });

  test('should show error with invalid email format', async ({ page }) => {
    log.testStart('Show error with invalid email format');
    
    // Login with invalid email format
    await loginPage.login('invalid-email', config.testUser.password);
    
    // Verify error message
    expect(await loginPage.hasErrorMessage()).toBeTruthy();
    
    log.testPass('Show error with invalid email format');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    log.testStart('Navigate to forgot password page');
    
    // Click forgot password link
    await loginPage.clickForgotPassword();
    
    // Verify navigation
    expect(page.url()).toContain('/forgot-password');
    
    log.testPass('Navigate to forgot password page');
  });

  test('should navigate to register page', async ({ page }) => {
    log.testStart('Navigate to register page');
    
    // Click register link
    await loginPage.clickRegister();
    
    // Verify navigation
    expect(page.url()).toContain('/register');
    
    log.testPass('Navigate to register page');
  });

  test('should login with remember me checked', async ({ page }) => {
    log.testStart('Login with remember me checked');
    
    // Login with remember me
    await loginPage.loginWithRememberMe(config.testUser.email, config.testUser.password);
    
    // Verify navigation to dashboard
    expect(page.url()).toContain('/dashboard');
    
    // Verify cookie is set
    const cookies = await loginPage.getCookies();
    const rememberMeCookie = cookies.find(c => c.name === 'remember_me');
    expect(rememberMeCookie).toBeDefined();
    
    log.testPass('Login with remember me checked');
  });

  test('should submit form with Enter key', async ({ page }) => {
    log.testStart('Submit form with Enter key');
    
    // Fill form
    await loginPage.fill(loginPage.emailInput, config.testUser.email);
    await loginPage.fill(loginPage.passwordInput, config.testUser.password);
    
    // Submit with Enter
    await loginPage.submitWithEnter();
    
    // Verify navigation
    expect(page.url()).toContain('/dashboard');
    
    log.testPass('Submit form with Enter key');
  });

  test('should clear form fields', async ({ page }) => {
    log.testStart('Clear form fields');
    
    // Fill form
    await loginPage.fill(loginPage.emailInput, config.testUser.email);
    await loginPage.fill(loginPage.passwordInput, config.testUser.password);
    
    // Clear form
    await loginPage.clearForm();
    
    // Verify fields are empty
    expect(await loginPage.getEmailValue()).toBe('');
    expect(await loginPage.getPasswordValue()).toBe('');
    
    log.testPass('Clear form fields');
  });

  test('should disable login button when form is invalid', async ({ page }) => {
    log.testStart('Disable login button when form is invalid');
    
    // Verify button is disabled initially
    expect(await loginPage.isLoginButtonEnabled()).toBeFalsy();
    
    // Fill only email
    await loginPage.fill(loginPage.emailInput, config.testUser.email);
    
    // Verify button is still disabled
    expect(await loginPage.isLoginButtonEnabled()).toBeFalsy();
    
    log.testPass('Disable login button when form is invalid');
  });

  test('should enable login button when form is valid', async ({ page }) => {
    log.testStart('Enable login button when form is valid');
    
    // Fill both fields
    await loginPage.fill(loginPage.emailInput, config.testUser.email);
    await loginPage.fill(loginPage.passwordInput, config.testUser.password);
    
    // Verify button is enabled
    expect(await loginPage.isLoginButtonEnabled()).toBeTruthy();
    
    log.testPass('Enable login button when form is valid');
  });
});
