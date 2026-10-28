# Quick Start Guide - คู่มือเริ่มต้นใช้งานอย่างรวดเร็ว

## 🚀 เริ่มต้นใช้งานภายใน 5 นาที

### 1. ติดตั้ง (2 นาที)

```bash
cd qa-automation
npm install
npx playwright install
```

### 2. ตั้งค่า Environment (1 นาที)

```bash
cp .env.example .env
# แก้ไขไฟล์ .env ตามความต้องการ
```

### 3. รัน Tests ครั้งแรก (2 นาที)

```bash
# รัน web tests
npm run test:web

# รัน API tests
npm run test:api
```

---

## 📝 การเขียน Test แรกของคุณ

### Web Test Example

สร้างไฟล์ `tests/web/my-first-test.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('my first test', async ({ page }) => {
  // นำทางไปยังเว็บไซต์
  await page.goto('https://example.com');
  
  // ตรวจสอบ title
  expect(await page.title()).toContain('Example');
  
  // คลิกปุ่ม
  await page.click('a');
  
  // ตรวจสอบ URL
  expect(page.url()).toContain('iana');
});
```

รัน test:
```bash
npm run test:web -- tests/web/my-first-test.spec.ts
```

### API Test Example

สร้างไฟล์ `tests/api/my-first-api.test.ts`:

```typescript
import { test, expect } from '@jest/globals';
import { APIClient } from '../../helpers/api-client';

test('my first API test', async () => {
  const apiClient = new APIClient('https://api.example.com');
  
  const response = await apiClient.get('/users');
  
  expect(response.status).toBe(200);
  expect(response.data.users).toBeDefined();
});
```

รัน test:
```bash
npm run test:api -- tests/api/my-first-api.test.ts
```

---

## 🎯 สิ่งที่คุณสามารถทำได้ทันที

### Web Testing
- ✅ ทดสอบ UI อัตโนมัติ
- ✅ ทดสอบ cross-browser
- ✅ ทดสอบบน mobile devices
- ✅ ทดสอบ visual regression

### API Testing
- ✅ ทดสอบ REST APIs
- ✅ ทดสอบ authentication
- ✅ ทดสอบ CRUD operations
- ✅ ทดสอบ error handling

### Performance Testing
- ✅ ทดสอบ load
- ✅ ทดสอบ stress
- ✅ ทดสอบ response time
- ✅ ทดสอบ throughput

### Accessibility Testing
- ✅ ตรวจสอบ WCAG compliance
- ✅ ทดสอบ keyboard navigation
- ✅ ตรวจสอบ color contrast
- ✅ ทดสอบ screen reader

---

## 📚 เอกสารเพิ่มเติม

- [คู่มือฉบับสมบูรณ์ (ภาษาไทย)](GUIDE-THAI.md)
- [ตัวอย่างการใช้งาน](EXAMPLES.md)
- [README หลัก](../README.md)

---

## ❓ คำถามที่พบบ่อย

### Q: ต้องติดตั้งอะไรบ้างก่อนใช้?
A: Node.js >= 20.0.0 และ npm หรือ yarn

### Q: รัน tests ได้บน browsers อะไรบ้าง?
A: Chrome, Firefox, Safari, Edge และ mobile browsers

### Q: สามารถรัน tests แบบ parallel ได้ไหม?
A: ได้ ระบบรองรับ parallel execution โดย default

### Q: มีรายงานผลการทดสอบไหม?
A: มี ใช้ Allure Report สำหรับรายงานที่ครบถ้วน

### Q: สามารถใช้กับ CI/CD ได้ไหม?
A: ได้ มี template สำหรับ GitHub Actions พร้อมใช้

---

เริ่มต้นสร้าง automation ของคุณวันนี้! 🚀
