# QA Automation Toolkit 🧪

เครื่องมือ QA Automation ที่ครบถ้วนสำหรับ Senior QA Automation Engineer

## 📋 สารบัญ

- [ภาพรวม](#ภาพรวม)
- [คุณสมบัติหลัก](#คุณสมบัติหลัก)
- [การติดตั้ง](#การติดตั้ง)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [การใช้งาน](#การใช้งาน)
- [Web Automation](#web-automation)
- [API Automation](#api-automation)
- [Performance Testing](#performance-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Accessibility Testing](#accessibility-testing)
- [Test Data Management](#test-data-management)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## 🎯 ภาพรวม

QA Automation Toolkit เป็นเครื่องมือที่ครบถ้วนสำหรับ QA Automation Engineer ระดับอาวุโส ที่ออกแบบมาเพื่อให้ใช้งานคนเดียวได้อย่างมีประสิทธิภาพ ครอบคลุมทุกด้านของการทดสอบอัตโนมัติ

## ✨ คุณสมบัติหลัก

### 🌐 Web Automation
- **Playwright Framework** - เทคโนโลยีที่ทันสมัยและเร็วกว่า Selenium
- **Page Object Model** - การจัดการ page objects ที่เป็นระเบียบ
- **Cross-browser Testing** - รองรับ Chrome, Firefox, Safari, Edge
- **Mobile Testing** - รองรับการทดสอบบนมือถือ
- **Parallel Execution** - รัน tests แบบ parallel เพื่อเพิ่มความเร็ว

### 🔌 API Automation
- **REST API Testing** - ทดสอบ RESTful APIs อย่างครบถ้วน
- **GraphQL Support** - รองรับ GraphQL API testing
- **Authentication Management** - จัดการการยืนยันตัวตนอัตโนมัติ
- **Request/Response Validation** - ตรวจสอบ request และ response
- **Retry Logic** - จัดการ retry เมื่อเกิด error

### ⚡ Performance Testing
- **Load Testing** - ทดสอบภายใต้ load สูง
- **Stress Testing** - ทดสอบภายใต้สภาวะ stress
- **Response Time Monitoring** - ติดตาม response time
- **Throughput Testing** - ทดสอบ throughput
- **K6 Integration** - ใช้ K6 สำหรับ performance testing

### 👁️ Visual Regression Testing
- **Screenshot Comparison** - เปรียบเทียบ screenshots
- **Baseline Management** - จัดการ baseline images
- **Responsive Testing** - ทดสอบ responsive design
- **Cross-browser Visual** - ทดสอบ visual ข้าม browsers

### ♿ Accessibility Testing
- **WCAG Compliance** - ตรวจสอบ WCAG standards
- **Keyboard Navigation** - ทดสอบ keyboard navigation
- **Screen Reader Support** - ทดสอบ screen reader compatibility
- **Color Contrast** - ตรวจสอบ color contrast
- **ARIA Labels** - ตรวจสอบ ARIA labels

### 📊 Test Data Management
- **Data Factories** - สร้างข้อมูลทดสอบอัตโนมัติ
- **Data Seeding** - seed ข้อมูลลง database
- **Data Cleanup** - ล้างข้อมูลหลังทดสอบ
- **JSON Data Files** - จัดการข้อมูลด้วย JSON

### 🚀 CI/CD Integration
- **GitHub Actions** - template สำหรับ GitHub Actions
- **Jenkins Pipeline** - template สำหรับ Jenkins
- **Docker Support** - รองรับ Docker
- **Parallel Execution** - รัน tests แบบ parallel ใน CI/CD
- **Report Generation** - สร้างรายงานอัตโนมัติ

## 📦 การติดตั้ง

### ข้อกำหนดเบื้องต้น (Prerequisites)
- Node.js >= 20.0.0
- npm หรือ yarn
- Git

### ขั้นตอนการติดตั้ง

1. **Clone repository**
```bash
git clone <repository-url>
cd qa-automation
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npx playwright install
```

4. **Setup environment variables**
```bash
cp .env.example .env
# แก้ไข .env ตามความต้องการ
```

5. **Run setup script**
```bash
npm run setup
```

## 🏗️ โครงสร้างโปรเจกต์

```
qa-automation/
├── config/                    # Configuration files
│   ├── environment.ts         # Environment configuration
│   ├── global-setup.ts        # Global test setup
│   ├── global-teardown.ts     # Global test teardown
│   └── jest-setup.ts          # Jest setup for API tests
├── helpers/                   # Helper functions
│   ├── api-client.ts          # API client helper
│   └── assertion-helper.ts    # Assertion helper
├── pages/                     # Page Object Model
│   ├── base-page.ts           # Base page class
│   ├── login-page.ts          # Login page
│   └── dashboard-page.ts      # Dashboard page
├── tests/                     # Test files
│   ├── web/                   # Web automation tests
│   │   ├── login.spec.ts
│   │   └── dashboard.spec.ts
│   ├── api/                   # API automation tests
│   │   ├── auth-api.test.ts
│   │   └── users-api.test.ts
│   ├── performance/           # Performance tests
│   │   └── load-test.js
│   ├── visual/                # Visual regression tests
│   │   └── visual-regression.spec.ts
│   └── accessibility/         # Accessibility tests
│       └── a11y.spec.ts
├── test-data/                 # Test data files
│   ├── users.json
│   └── products.json
├── utils/                     # Utility functions
│   ├── logger.ts              # Logger utility
│   ├── data-generator.ts      # Data generator
│   └── wait-helper.ts         # Wait helper
├── .env.example               # Environment variables example
├── jest-api.config.js          # Jest configuration for API tests
├── package.json               # Project dependencies
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🚀 การใช้งาน

### รันทุก tests
```bash
npm test
```

### รัน web tests
```bash
npm run test:web
```

### รัน web tests แบบ headed (มีหน้าต่าง)
```bash
npm run test:web:headed
```

### รัน web tests แบบ debug
```bash
npm run test:web:debug
```

### รัน API tests
```bash
npm run test:api
```

### รัน API tests แบบ watch
```bash
npm run test:api:watch
```

### รัน performance tests
```bash
npm run test:performance
```

### รัน visual regression tests
```bash
npm run test:visual
```

### รัน accessibility tests
```bash
npm run test:accessibility
```

### สร้างรายงาน
```bash
npm run report:generate
npm run report:open
```

## 🌐 Web Automation

### การเขียน Web Tests

ใช้ Playwright framework สำหรับ web automation:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('test@example.com', 'password123');
  
  expect(page.url()).toContain('/dashboard');
});
```

### Page Object Model

ใช้ Page Object Model เพื่อจัดการ page elements:

```typescript
export class LoginPage extends BasePage {
  readonly emailInput: string = 'input[name="email"]';
  readonly passwordInput: string = 'input[name="password"]';
  readonly loginButton: string = 'button[type="submit"]';

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}
```

## 🔌 API Automation

### การเขียน API Tests

ใช้ Jest และ Axios สำหรับ API automation:

```typescript
import { APIClient } from '../../helpers/api-client';
import { assertAPIResponseSuccess } from '../../helpers/assertion-helper';

test('should get users', async () => {
  const apiClient = new APIClient();
  const response = await apiClient.get('/users');
  
  assertAPIResponseSuccess(response);
  expect(response.data.users).toBeDefined();
});
```

### Authentication

จัดการ authentication อัตโนมัติ:

```typescript
const authenticatedClient = createAuthenticatedClient(token);
const response = await authenticatedClient.get('/protected-endpoint');
```

## ⚡ Performance Testing

### การเขียน Performance Tests

ใช้ K6 สำหรับ performance testing:

```javascript
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const response = http.get('https://api.example.com/users');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## 👁️ Visual Regression Testing

### การเขียน Visual Tests

ใช้ Playwright screenshot comparison:

```typescript
test('should match screenshot', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## ♿ Accessibility Testing

### การเขียน Accessibility Tests

ใช้ axe-playwright สำหรับ accessibility testing:

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('should have no a11y violations', async ({ page }) => {
  await page.goto('https://example.com');
  await injectAxe(page);
  await checkA11y(page);
});
```

## 📊 Test Data Management

### การใช้ Test Data Manager

```typescript
import { testDataManager, TestDataFactory } from '../test-data/test-data-manager';

// ใช้ข้อมูลจากไฟล์ JSON
const userData = testDataManager.get('validUser');

// สร้างข้อมูลใหม่
const newUser = TestDataFactory.createUser();
```

## 🚀 CI/CD Integration

### GitHub Actions

มี template สำหรับ GitHub Actions ใน `.github/workflows/ci-cd.yml`

### Environment Variables

ตั้งค่า environment variables ใน repository secrets:
- `BASE_URL`
- `API_BASE_URL`
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

## 📝 Best Practices

### 1. การเขียน Tests
- เขียน tests ที่เป็นอิสระ (independent)
- ใช้ descriptive test names
- จัดระเบียบ tests ด้วย test suites
- ใช้ Page Object Model สำหรับ web tests

### 2. การจัดการ Test Data
- ใช้ data factories สำหรับสร้างข้อมูล
- ล้างข้อมูลหลังทดสอบ
- ใช้ environment-specific data

### 3. การจัดการ Assertions
- ใช้ assertions ที่ชัดเจน
- ใช้ custom assertions helpers
- ตรวจสอบทั้ง positive และ negative cases

### 4. การจัดการ Errors
- ใช้ retry logic สำหรับ flaky tests
- บันทึก logs อย่างละเอียด
- ถ่าย screenshots เมื่อ test fail

### 5. การรัน Tests
- รัน tests แบบ parallel เมื่อเป็นไปได้
- ใช้ test tags สำหรับ grouping
- รัน critical tests ก่อน

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [K6 Documentation](https://k6.io/docs/)
- [Axe Documentation](https://www.deque.com/axe/)

## 🤝 Contributing

เนื่องจากเป็นเครื่องมือสำหรับใช้งานคนเดียว การ contribute อาจไม่จำเป็น แต่คุณสามารถปรับปรุงได้ตามความต้องการ

## 📄 License

MIT

---

สร้างโดย Senior QA Automation Engineer เพื่อใช้งานคนเดียว 🚀
