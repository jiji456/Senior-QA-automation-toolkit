# คู่มือการใช้งาน QA Automation Toolkit (ภาษาไทย)

## 📚 สารบัญ

1. [การเริ่มต้น](#การเริ่มต้น)
2. [Web Automation](#web-automation)
3. [API Automation](#api-automation)
4. [Performance Testing](#performance-testing)
5. [Visual Regression Testing](#visual-regression-testing)
6. [Accessibility Testing](#accessibility-testing)
7. [Mobile Testing](#mobile-testing)
8. [Test Data Management](#test-data-management)
9. [CI/CD Integration](#cicd-integration)
10. [การแก้ไขปัญหา](#การแก้ไขปัญหา)

---

## 🚀 การเริ่มต้น

### การติดตั้ง

1. **ติดตั้ง dependencies**
```bash
cd qa-automation
npm install
```

2. **ติดตั้ง Playwright browsers**
```bash
npx playwright install
```

3. **ตั้งค่า environment variables**
```bash
cp .env.example .env
# แก้ไขไฟล์ .env ตามความต้องการ
```

### การรัน tests ครั้งแรก

```bash
# รัน web tests
npm run test:web

# รัน API tests
npm run test:api
```

---

## 🌐 Web Automation

### แนวคิด Page Object Model

Page Object Model (POM) เป็น pattern ที่ช่วยให้จัดการ page elements และ actions ได้เป็นระเบียบ

**ข้อดี:**
- ลด code duplication
- ง่ายต่อการบำรุงรักษา
- แยก business logic จาก test logic
- ง่ายต่อการ reuse

### การสร้าง Page Object

```typescript
// pages/login-page.ts
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  // กำหนด selectors
  readonly emailInput: string = 'input[name="email"]';
  readonly passwordInput: string = 'input[name="password"]';
  readonly loginButton: string = 'button[type="submit"]';

  // สร้าง methods สำหรับ actions
  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}
```

### การเขียน Web Tests

```typescript
// tests/web/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // นำทางไปหน้า login
  await loginPage.navigate();
  
  // ทำการ login
  await loginPage.login('test@example.com', 'password123');
  
  // ตรวจสอบผล
  expect(page.url()).toContain('/dashboard');
});
```

### Best Practices สำหรับ Web Automation

1. **ใช้ selectors ที่เสถียร**
   - หลีกเลี่ยง selectors ที่ขึ้นกับ index
   - ใช้ data-testid attributes เมื่อเป็นไปได้
   - ใช้ semantic selectors (role, aria-label)

2. **รอให้ element พร้อม**
   ```typescript
   await waitForVisible(page, selector);
   await waitForClickable(page, selector);
   ```

3. **ใช้ assertions ที่ชัดเจน**
   ```typescript
   expect(await loginPage.isLoaded()).toBeTruthy();
   expect(page.url()).toContain('/dashboard');
   ```

4. **จัดการ timeout อย่างเหมาะสม**
   ```typescript
   test.setTimeout(60000); // เพิ่ม timeout สำหรับ test ที่ยาว
   ```

---

## 🔌 API Automation

### แนวคิด API Testing

API Testing คือการทดสอบ backend โดยตรงโดยไม่ต้องผ่าน UI

**ข้อดี:**
- เร็วกว่า UI testing
- ตรวจสอบ logic ได้ลึกกว่า
- ง่ายต่อการ debug
- รันได้บนหลาย environment

### การใช้ APIClient

```typescript
import { APIClient, createAuthenticatedClient } from '../../helpers/api-client';

// สร้าง client
const apiClient = new APIClient('https://api.example.com');

// ทำ GET request
const response = await apiClient.get('/users');

// ทำ POST request
const createResponse = await apiClient.post('/users', {
  email: 'test@example.com',
  name: 'Test User',
});

// ใช้ authenticated client
const authClient = createAuthenticatedClient(token);
const protectedResponse = await authClient.get('/protected-endpoint');
```

### การเขียน API Tests

```typescript
import { test, expect } from '@jest/globals';
import { APIClient } from '../../helpers/api-client';
import { assertAPIResponseSuccess, assertAPIResponseStatus } from '../../helpers/assertion-helper';

test('should get users successfully', async () => {
  const apiClient = new APIClient();
  const response = await apiClient.get('/users');
  
  // ตรวจสอบ response
  assertAPIResponseSuccess(response);
  assertAPIResponseStatus(response, 200);
  
  // ตรวจสอบ data
  expect(response.data.users).toBeDefined();
  expect(Array.isArray(response.data.users)).toBeTruthy();
});
```

### Best Practices สำหรับ API Automation

1. **ตรวจสอบ status codes**
   ```typescript
   assertAPIResponseStatus(response, 200);
   ```

2. **ตรวจสอบ response structure**
   ```typescript
   assertAPIResponseStructure(response, { users: [], total: 0 });
   ```

3. **ทดสอบทั้ง positive และ negative cases**
   - Valid inputs
   - Invalid inputs
   - Missing fields
   - Edge cases

4. **ใช้ retry logic สำหรับ flaky APIs**
   ```typescript
   await apiClient.retryRequest('get', '/users');
   ```

---

## ⚡ Performance Testing

### แนวคิด Performance Testing

Performance Testing คือการทดสอบประสิทธิภาพของระบบภายใต้ load ต่างๆ

**ประเภทของ Performance Testing:**
- **Load Testing** - ทดสอบภายใต้ load ปกติ
- **Stress Testing** - ทดสอบภายใต้ load สูงเกินไป
- **Spike Testing** - ทดสอบ load ที่เพิ่มขึ้นอย่างรวดเร็ว
- **Endurance Testing** - ทดสอบ load ต่อเนื่องเป็นเวลานาน

### การเขียน Performance Tests ด้วย K6

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up
    { duration: '1m', target: 10 },    // Stay
    { duration: '30s', target: 50 },   // Ramp up
    { duration: '1m', target: 50 },    // Stay
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% ของ requests ต้อง < 500ms
  },
};

export default function () {
  const response = http.get('https://api.example.com/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

### Metrics ที่สำคัญ

- **Response Time** - เวลาที่ใช้ในการตอบสนอง
- **Throughput** - จำนวน requests ต่อวินาที
- **Error Rate** - อัตราความผิดพลาด
- **Resource Usage** - การใช้ CPU, Memory, Network

---

## 👁️ Visual Regression Testing

### แนวคิด Visual Regression Testing

Visual Regression Testing คือการเปรียบเทียบ screenshots เพื่อตรวจสอบการเปลี่ยนแปลงทาง visual

**ข้อดี:**
- ตรวจสอบการเปลี่ยนแปลงที่ UI testing ไม่เจอ
- ตรวจสอบ responsive design
- ตรวจสอบ cross-browser consistency

### การเขียน Visual Tests

```typescript
import { test, expect } from '@playwright/test';

test('should match homepage screenshot', async ({ page }) => {
  await page.goto('https://example.com');
  
  // เปรียบเทียบกับ baseline
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixels: 100,  // อนุญาตให้มีความต่างไม่เกิน 100 pixels
  });
});
```

### การจัดการ Baselines

1. **สร้าง baseline ครั้งแรก**
```bash
npx playwright test --update-snapshots
```

2. **อัปเดต baseline**
```bash
npx playwright test --update-snapshots
```

3. **ตรวจสอบ differences**
```bash
npx playwright test
```

---

## ♿ Accessibility Testing

### แนวคิด Accessibility Testing

Accessibility Testing คือการทดสอบว่าเว็บแอปพลิเคชันสามารถใช้งานได้โดยผู้ที่มีความพิการ

**มาตรฐานที่สำคัญ:**
- **WCAG 2.1** - Web Content Accessibility Guidelines
- **Section 508** - มาตรฐานของรัฐบาลสหรัฐ
- **ADA** - Americans with Disabilities Act

### การเขียน Accessibility Tests

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('should have no accessibility violations', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Inject axe-core
  await injectAxe(page);
  
  // Check accessibility violations
  await checkA11y(page, null, {
    detailedReport: true,
  });
});
```

### สิ่งที่ต้องตรวจสอบ

1. **Keyboard Navigation**
   - สามารถ navigate ด้วย keyboard ได้
   - มี focus indicators ชัดเจน
   - Tab order ถูกต้อง

2. **Screen Reader Support**
   - มี alt text สำหรับ images
   - มี ARIA labels
   - Heading hierarchy ถูกต้อง

3. **Color Contrast**
   - Contrast ratio ตรงตามมาตรฐาน
   - ไม่ใช้สีเพียงอย่างเดียวในการสื่อความ

4. **Form Labels**
   - ทุก input มี label ที่เชื่อมโยง
   - Error messages ชัดเจน

---

## 📱 Mobile Testing

### แนวคิด Mobile Testing

Mobile Testing คือการทดสอบบน mobile devices และ viewports

**ข้อดี:**
- ตรวจสอบ responsive design
- ทดสอบ touch interactions
- ตรวจสอบ performance บน mobile

### การเขียน Mobile Tests

```typescript
import { test, expect } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test('should work on mobile', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Tap แทน click
  await page.tap('button');
  
  // Swipe gesture
  await page.touchscreen.tap(200, 300);
});
```

### Devices ที่รองรับ

- **iPhone 12**
- **iPhone 12 Pro Max**
- **iPhone SE**
- **iPad Pro 11**
- **Pixel 5**
- **Galaxy S21**

---

## 📊 Test Data Management

### แนวคิด Test Data Management

Test Data Management คือการจัดการข้อมูลทดสอบอย่างเป็นระบบ

**ข้อดี:**
- ลดการ hardcode ข้อมูล
- ง่ายต่อการบำรุงรักษา
- สามารถ reuse ได้
- แยก data จาก logic

### การใช้ Test Data Manager

```typescript
import { testDataManager, TestDataFactory } from '../test-data/test-data-manager';

// ใช้ข้อมูลจากไฟล์ JSON
const userData = testDataManager.get('validUser');

// สร้างข้อมูลใหม่
const newUser = TestDataFactory.createUser({
  email: 'custom@example.com',
  role: 'admin',
});

// สร้างข้อมูลหลายชุด
const users = TestDataFactory.createMany(
  () => TestDataFactory.createUser(),
  10
);
```

### โครงสร้าง Test Data Files

```json
{
  "validUser": {
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "สมชาย",
    "lastName": "ใจดี"
  },
  "invalidUser": {
    "email": "invalid-email",
    "password": "123"
  }
}
```

---

## 🚀 CI/CD Integration

### GitHub Actions

มี template สำหรับ GitHub Actions ใน `.github/workflows/ci-cd.yml`

**Features:**
- รัน web tests
- รัน API tests
- รัน performance tests
- รัน visual regression tests
- รัน accessibility tests
- อัปโหลด test results
- สร้างรายงาน

### การตั้งค่า Secrets

ใน GitHub repository settings:

1. **BASE_URL** - URL ของ application
2. **API_BASE_URL** - URL ของ API
3. **TEST_USER_EMAIL** - Email สำหรับทดสอบ
4. **TEST_USER_PASSWORD** - Password สำหรับทดสอบ

### การรันใน CI/CD

```yaml
- name: Run web tests
  run: npm run test:web
  env:
    BASE_URL: ${{ secrets.BASE_URL }}
```

---

## 🔧 การแก้ไขปัญหา

### Test ล้มเหลวบน CI แต่ผ่านบน local

**สาเหตุที่เป็นไปได้:**
- Environment ต่างกัน
- Timing issues
- Network latency
- Browser versions ต่างกัน

**วิธีแก้:**
- เพิ่ม retry logic
- ใช้ proper waits
- ตั้งค่า environment variables ให้ตรงกัน
- ใช้ docker เพื่อให้ environment เหมือนกัน

### Flaky Tests

**สาเหตุที่เป็นไปได้:**
- Race conditions
- Network issues
- External dependencies
- Timing issues

**วิธีแก้:**
- เพิ่ม retries
- ใช้ proper waits
- Mock external dependencies
- แยก tests ให้ independent

### Performance Issues

**สาเหตุที่เป็นไปได้:**
- Tests ช้าเกินไป
- ไม่ใช้ parallel execution
- มี unnecessary waits

**วิธีแก้:**
- ใช้ parallel execution
- ลบ unnecessary waits
- Optimize selectors
- ใช้ test tags เพื่อรันเฉพาะ tests ที่จำเป็น

---

## 📚 เอกสารเพิ่มเติม

- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [K6 Documentation](https://k6.io/docs/)
- [Axe Documentation](https://www.deque.com/axe/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

สร้างโดย Senior QA Automation Engineer 🚀
