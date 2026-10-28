# ตัวอย่างการใช้งาน QA Automation Toolkit

## 📋 สารบัญ

1. [Web Automation Examples](#web-automation-examples)
2. [API Automation Examples](#api-automation-examples)
3. [Performance Testing Examples](#performance-testing-examples)
4. [Visual Regression Examples](#visual-regression-examples)
5. [Accessibility Testing Examples](#accessibility-testing-examples)
6. [Mobile Testing Examples](#mobile-testing-examples)
7. [Test Data Examples](#test-data-examples)

---

## 🌐 Web Automation Examples

### ตัวอย่าง 1: การทดสอบ Flow การล็อกอิน

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { DashboardPage } from '../../pages/dashboard-page';
import { config } from '../../config/environment';

test('complete login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // 1. นำทางไปหน้า login
  await loginPage.navigate();
  expect(await loginPage.isLoaded()).toBeTruthy();
  
  // 2. กรอกข้อมูล
  await loginPage.fill(loginPage.emailInput, config.testUser.email);
  await loginPage.fill(loginPage.passwordInput, config.testUser.password);
  
  // 3. คลิกปุ่ม login
  await loginPage.click(loginPage.loginButton);
  
  // 4. ตรวจสอบว่า login สำเร็จ
  expect(page.url()).toContain('/dashboard');
  expect(await dashboardPage.isLoaded()).toBeTruthy();
  
  // 5. ตรวจสอบ welcome message
  const welcomeMessage = await dashboardPage.getWelcomeMessage();
  expect(welcomeMessage).toContain('ยินดีต้อนรับ');
});
```

### ตัวอย่าง 2: การทดสอบ Form Validation

```typescript
test('form validation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  
  // ทดสอบ empty email
  await loginPage.fill(loginPage.emailInput, '');
  await loginPage.click(loginPage.loginButton);
  expect(await loginPage.hasErrorMessage()).toBeTruthy();
  expect(await loginPage.getErrorMessage()).toContain('email');
  
  // ทดสอบ invalid email format
  await loginPage.fill(loginPage.emailInput, 'invalid-email');
  await loginPage.click(loginPage.loginButton);
  expect(await loginPage.hasErrorMessage()).toBeTruthy();
  
  // ทดสอบ short password
  await loginPage.fill(loginPage.emailInput, 'test@example.com');
  await loginPage.fill(loginPage.passwordInput, '123');
  await loginPage.click(loginPage.loginButton);
  expect(await loginPage.hasErrorMessage()).toBeTruthy();
  expect(await loginPage.getErrorMessage()).toContain('password');
});
```

### ตัวอย่าง 3: การทดสอบ Navigation

```typescript
test('navigation between pages', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Login
  await loginPage.navigate();
  await loginPage.login(config.testUser.email, config.testUser.password);
  
  // Navigate to different sections
  const navItems = await dashboardPage.getNavigationItems();
  
  for (const item of navItems) {
    await dashboardPage.navigateToSection(item);
    expect(await dashboardPage.getActiveSection()).toBe(item);
  }
});
```

### ตัวอย่าง 4: การทดสอบ Dynamic Content

```typescript
test('dynamic content loading', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Wait for content to load
  await page.waitForSelector('.data-loaded', { state: 'visible' });
  
  // Verify content is present
  const content = await page.locator('.data-content').textContent();
  expect(content).toBeTruthy();
  expect(content?.length).toBeGreaterThan(0);
});
```

---

## 🔌 API Automation Examples

### ตัวอย่าง 1: การทดสอบ CRUD Operations

```typescript
import { APIClient, createAuthenticatedClient } from '../../helpers/api-client';
import { assertAPIResponseStatus, assertAPIResponseHasData } from '../../helpers/assertion-helper';

test('CRUD operations for users', async () => {
  const apiClient = new APIClient();
  
  // Login to get token
  const loginResponse = await apiClient.post('/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  });
  const token = loginResponse.data.token;
  
  const authClient = createAuthenticatedClient(token);
  
  // CREATE
  const createResponse = await authClient.post('/users', {
    email: 'newuser@example.com',
    name: 'New User',
  });
  assertAPIResponseStatus(createResponse, 201);
  const userId = createResponse.data.id;
  
  // READ
  const readResponse = await authClient.get(`/users/${userId}`);
  assertAPIResponseStatus(readResponse, 200);
  assertAPIResponseHasData(readResponse);
  expect(readResponse.data.email).toBe('newuser@example.com');
  
  // UPDATE
  const updateResponse = await authClient.put(`/users/${userId}`, {
    name: 'Updated User',
  });
  assertAPIResponseStatus(updateResponse, 200);
  expect(updateResponse.data.name).toBe('Updated User');
  
  // DELETE
  const deleteResponse = await authClient.delete(`/users/${userId}`);
  assertAPIResponseStatus(deleteResponse, 204);
});
```

### ตัวอย่าง 2: การทดสอบ Pagination

```typescript
test('pagination', async () => {
  const authClient = createAuthenticatedClient(token);
  
  // Get first page
  const page1 = await authClient.get('/users?page=1&limit=10');
  assertAPIResponseStatus(page1, 200);
  expect(page1.data.users.length).toBeLessThanOrEqual(10);
  expect(page1.data.pagination.page).toBe(1);
  
  // Get second page
  const page2 = await authClient.get('/users?page=2&limit=10');
  assertAPIResponseStatus(page2, 200);
  expect(page2.data.pagination.page).toBe(2);
  
  // Verify different data
  const page1Ids = page1.data.users.map((u: any) => u.id);
  const page2Ids = page2.data.users.map((u: any) => u.id);
  expect(page1Ids).not.toEqual(page2Ids);
});
```

### ตัวอย่าง 3: การทดสอบ Error Handling

```typescript
test('error handling', async () => {
  const apiClient = new APIClient();
  
  // Test 404 Not Found
  const notFoundResponse = await apiClient.get('/users/nonexistent-id');
  assertAPIResponseStatus(notFoundResponse, 404);
  expect(notFoundResponse.data.message).toContain('not found');
  
  // Test 401 Unauthorized
  const unauthorizedResponse = await apiClient.get('/protected-endpoint');
  assertAPIResponseStatus(unauthorizedResponse, 401);
  
  // Test 400 Bad Request
  const badRequestResponse = await apiClient.post('/users', {
    email: 'invalid-email',
  });
  assertAPIResponseStatus(badRequestResponse, 400);
  expect(badRequestResponse.data.errors).toBeDefined();
});
```

### ตัวอย่าง 4: การทดสอบ Rate Limiting

```typescript
test('rate limiting', async () => {
  const apiClient = new APIClient();
  
  // Make many requests quickly
  const requests = Array.from({ length: 100 }, () => 
    apiClient.get('/users')
  );
  
  const responses = await Promise.allSettled(requests);
  
  // Check for rate limit errors
  const rateLimitErrors = responses.filter(r => 
    r.status === 'fulfilled' && r.value.status === 429
  );
  
  expect(rateLimitErrors.length).toBeGreaterThan(0);
});
```

---

## ⚡ Performance Testing Examples

### ตัวอย่าง 1: Load Testing

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const response = http.get('https://api.example.com/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has data': (r) => JSON.parse(r.body).users !== undefined,
  });
  
  sleep(1);
}
```

### ตัวอย่าง 2: Stress Testing

```javascript
export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 200 },  // High load
    { duration: '1m', target: 500 },  // Extreme load
    { duration: '2m', target: 500 },  // Sustained extreme load
    { duration: '1m', target: 0 },
  ],
};
```

### ตัวอย่าง 3: Spike Testing

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '10s', target: 1000 },  // Sudden spike
    { duration: '30s', target: 1000 },
    { duration: '10s', target: 10 },
    { duration: '30s', target: 0 },
  ],
};
```

---

## 👁️ Visual Regression Examples

### ตัวอย่าง 1: Full Page Screenshot

```typescript
test('homepage visual regression', async ({ page }) => {
  await page.goto('https://example.com');
  await page.waitForLoadState('networkidle');
  
  await expect(page).toHaveScreenshot('homepage-full.png', {
    fullPage: true,
    maxDiffPixels: 100,
  });
});
```

### ตัวอย่าง 2: Element Screenshot

```typescript
test('component visual regression', async ({ page }) => {
  await page.goto('https://example.com');
  
  const component = page.locator('.hero-section');
  await expect(component).toHaveScreenshot('hero-section.png', {
    maxDiffPixels: 50,
  });
});
```

### ตัวอย่าง 3: Responsive Screenshots

```typescript
test.describe('Responsive Visual Tests', () => {
  const viewports = [
    { width: 375, height: 667 },   // Mobile
    { width: 768, height: 1024 },  // Tablet
    { width: 1280, height: 720 },  // Desktop
  ];
  
  viewports.forEach(({ width, height }) => {
    test(`viewport ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('https://example.com');
      
      await expect(page).toHaveScreenshot(`homepage-${width}x${height}.png`, {
        fullPage: true,
      });
    });
  });
});
```

---

## ♿ Accessibility Testing Examples

### ตัวอย่าง 1: Full Page Accessibility Check

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('full page accessibility', async ({ page }) => {
  await page.goto('https://example.com');
  await injectAxe(page);
  
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
});
```

### ตัวอย่าง 2: Component Accessibility Check

```typescript
test('form accessibility', async ({ page }) => {
  await page.goto('https://example.com/login');
  await injectAxe(page);
  
  await checkA11y(page, '.login-form', {
    detailedReport: true,
  });
});
```

### ตัวอย่าง 3: Keyboard Navigation Test

```typescript
test('keyboard navigation', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Tab through interactive elements
  const interactiveElements = page.locator('a, button, input, select');
  const count = await interactiveElements.count();
  
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT']).toContain(focusedElement);
  }
});
```

---

## 📱 Mobile Testing Examples

### ตัวอย่าง 1: Touch Interactions

```typescript
test.use({ ...devices['iPhone 12'] });

test('touch interactions', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Tap instead of click
  await page.tap('button.submit');
  
  // Swipe gesture
  await page.touchscreen.tap(200, 300);
  await page.touchscreen.tap(200, 500);
  
  // Pinch zoom
  await page.touchscreen.tap(200, 300);
  await page.touchscreen.tap(200, 300);
});
```

### ตัวอย่าง 2: Orientation Change

```typescript
test('orientation change', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Portrait
  await page.setViewportSize({ width: 375, height: 667 });
  expect(await page.isVisible('.mobile-nav')).toBeTruthy();
  
  // Landscape
  await page.setViewportSize({ width: 667, height: 375 });
  expect(await page.isVisible('.mobile-nav')).toBeTruthy();
});
```

---

## 📊 Test Data Examples

### ตัวอย่าง 1: การใช้ Test Data Manager

```typescript
import { testDataManager, TestDataFactory } from '../test-data/test-data-manager';

test('use test data from file', async () => {
  const userData = testDataManager.get('validUser');
  
  expect(userData.email).toBe('test@example.com');
  expect(userData.password).toBe('Test123!');
});
```

### ตัวอย่าง 2: การสร้าง Test Data ด้วย Factory

```typescript
test('generate test data', async () => {
  const user = TestDataFactory.createUser({
    email: 'custom@example.com',
    role: 'admin',
  });
  
  expect(user.email).toBe('custom@example.com');
  expect(user.role).toBe('admin');
});
```

### ตัวอย่าง 3: การสร้าง Test Data หลายชุด

```typescript
test('generate multiple test data', async () => {
  const users = TestDataFactory.createMany(
    () => TestDataFactory.createUser(),
    10
  );
  
  expect(users.length).toBe(10);
  expect(users[0].email).not.toBe(users[1].email);
});
```

---

## 🎯 Tips และ Best Practices

### Web Automation
- ใช้ data-testid attributes สำหรับ selectors
- รอให้ element พร้อมก่อนทำ action
- ใช้ Page Object Model
- เขียน tests ที่ independent

### API Automation
- ตรวจสอบทั้ง status code และ response body
- ทดสอบทั้ง positive และ negative cases
- ใช้ environment variables สำหรับ URLs
- จัดการ authentication อย่างเหมาะสม

### Performance Testing
- เริ่มจาก load ต่ำแล้วค่อยเพิ่ม
- ตั้งค่า thresholds ที่เหมาะสม
- ตรวจสอบ resource usage
- รันบน environment ที่ใกล้เคียง production

### Visual Regression
- อัปเดต baseline เมื่อจำเป็น
- ใช้ maxDiffPixels ที่เหมาะสม
- ทดสอบหลาย viewports
- ตรวจสอบ dynamic content อย่างระมัดระวัง

### Accessibility
- ทดสอบ keyboard navigation
- ตรวจสอบ color contrast
- ใช้ ARIA labels อย่างถูกต้อง
- ตรวจสอบ screen reader compatibility

---

สร้างโดย Senior QA Automation Engineer 🚀
