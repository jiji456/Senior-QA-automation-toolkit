/**
 * Assertion Helper
 * Helper สำหรับการตรวจสอบ (assertions) ในการทดสอบ
 * 
 * คำอธิบาย:
 * - ตรวจสอบค่าต่างๆ ด้วย message ที่ชัดเจน
 * - ตรวจสอบ API responses
 * - ตรวจสอบ UI elements
 * - ตรวจสอบข้อมูลที่ซับซ้อน
 * - จัดการ custom assertions
 */

/**
 * Assert that value is truthy
 * ตรวจสอบว่าค่าเป็น truthy
 */
export function assertTruthy(value: any, message: string = 'Expected value to be truthy'): void {
  if (!value) {
    throw new Error(message);
  }
}

/**
 * Assert that value is falsy
 * ตรวจสอบว่าค่าเป็น falsy
 */
export function assertFalsy(value: any, message: string = 'Expected value to be falsy'): void {
  if (value) {
    throw new Error(message);
  }
}

/**
 * Assert that two values are equal
 * ตรวจสอบว่าสองค่าเท่ากัน
 */
export function assertEqual(actual: any, expected: any, message?: string): void {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

/**
 * Assert that two values are not equal
 * ตรวจสอบว่าสองค่าไม่เท่ากัน
 */
export function assertNotEqual(actual: any, expected: any, message?: string): void {
  if (actual === expected) {
    throw new Error(message || `Expected ${actual} to not equal ${expected}`);
  }
}

/**
 * Assert that value is greater than expected
 * ตรวจสอบว่าค่ามากกว่าค่าที่คาดหวัง
 */
export function assertGreaterThan(actual: number, expected: number, message?: string): void {
  if (actual <= expected) {
    throw new Error(message || `Expected ${actual} to be greater than ${expected}`);
  }
}

/**
 * Assert that value is less than expected
 * ตรวจสอบว่าค่าน้อยกว่าค่าที่คาดหวัง
 */
export function assertLessThan(actual: number, expected: number, message?: string): void {
  if (actual >= expected) {
    throw new Error(message || `Expected ${actual} to be less than ${expected}`);
  }
}

/**
 * Assert that value is within range
 * ตรวจสอบว่าค่าอยู่ในช่วงที่กำหนด
 */
export function assertInRange(value: number, min: number, max: number, message?: string): void {
  if (value < min || value > max) {
    throw new Error(message || `Expected ${value} to be between ${min} and ${max}`);
  }
}

/**
 * Assert that string contains substring
 * ตรวจสอบว่า string มี substring ที่กำหนด
 */
export function assertContains(actual: string, expected: string, message?: string): void {
  if (!actual.includes(expected)) {
    throw new Error(message || `Expected "${actual}" to contain "${expected}"`);
  }
}

/**
 * Assert that array contains item
 * ตรวจสอบว่า array มี item ที่กำหนด
 */
export function assertArrayContains(array: any[], item: any, message?: string): void {
  if (!array.includes(item)) {
    throw new Error(message || `Expected array to contain ${item}`);
  }
}

/**
 * Assert that array has specific length
 * ตรวจสอบว่า array มีความยาวตามที่กำหนด
 */
export function assertArrayLength(array: any[], expectedLength: number, message?: string): void {
  if (array.length !== expectedLength) {
    throw new Error(message || `Expected array length to be ${expectedLength} but got ${array.length}`);
  }
}

/**
 * Assert that object has property
 * ตรวจสอบว่า object มี property ที่กำหนด
 */
export function assertHasProperty(obj: any, property: string, message?: string): void {
  if (!(property in obj)) {
    throw new Error(message || `Expected object to have property "${property}"`);
  }
}

/**
 * Assert that object property equals expected value
 * ตรวจสอบว่า property ของ object มีค่าตามที่คาดหวัง
 */
export function assertPropertyEquals(obj: any, property: string, expected: any, message?: string): void {
  if (obj[property()] !== expected) {
    throw new Error(message || `Expected ${property} to be ${expected} but got ${obj[property]}`);
  }
}

/**
 * Assert that API response is successful
 * ตรวจสอบว่า API response สำเร็จ
 */
export function assertAPIResponseSuccess(response: any, message?: string): void {
  if (!response || response.status < 200 || response.status >= 300) {
    throw new Error(message || `Expected successful response but got status ${response?.status}`);
  }
}

/**
 * Assert that API response has specific status
 * ตรวจสอบว่า API response มี status ตามที่กำหนด
 */
export function assertAPIResponseStatus(response: any, expectedStatus: number, message?: string): void {
  if (response.status !== expectedStatus) {
    throw new Error(message || `Expected status ${expectedStatus} but got ${response.status}`);
  }
}

/**
 * Assert that API response has data
 * ตรวจสอบว่า API response มีข้อมูล
 */
export function assertAPIResponseHasData(response: any, message?: string): void {
  if (!response.data) {
    throw new Error(message || 'Expected response to have data');
  }
}

/**
 * Assert that API response data structure matches expected
 * ตรวจสอบว่าโครงสร้างข้อมูล API response ตรงกับที่คาดหวัง
 */
export function assertAPIResponseStructure(response: any, expectedStructure: any, message?: string): void {
  const data = response.data;
  for (const key in expectedStructure) {
    if (!(key in data)) {
      throw new Error(message || `Expected response data to have property "${key}"`);
    }
  }
}

/**
 * Assert that value is valid email
 * ตรวจสอบว่าค่าเป็น email ที่ถูกต้อง
 */
export function assertValidEmail(email: string, message?: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(message || `Expected valid email but got ${email}`);
  }
}

/**
 * Assert that value is valid URL
 * ตรวจสอบว่าค่าเป็น URL ที่ถูกต้อง
 */
export function assertValidURL(url: string, message?: string): void {
  try {
    new URL(url);
  } catch {
    throw new Error(message || `Expected valid URL but got ${url}`);
  }
}

/**
 * Assert that value is valid Thai phone number
 * ตรวจสอบว่าค่าเป็นเบอร์โทรศัพท์ไทยที่ถูกต้อง
 */
export function assertValidThaiPhone(phone: string, message?: string): void {
  const phoneRegex = /^0[689]\d{8}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error(message || `Expected valid Thai phone number but got ${phone}`);
  }
}

/**
 * Assert that value matches regex
 * ตรวจสอบว่าค่าตรงกับ regex ที่กำหนด
 */
export function assertMatchesRegex(value: string, regex: RegExp, message?: string): void {
  if (!regex.test(value)) {
    throw new Error(message || `Expected value to match regex`);
  }
}

/**
 * Assert that value is of specific type
 * ตรวจสอบว่าค่าเป็น type ที่กำหนด
 */
export function assertType(value: any, type: string, message?: string): void {
  if (typeof value !== type) {
    throw new Error(message || `Expected value to be of type ${type} but got ${typeof value}`);
  }
}

/**
 * Assert that value is an instance of specific class
 * ตรวจสอบว่าค่าเป็น instance ของ class ที่กำหนด
 */
export function assertInstanceOf(value: any, className: any, message?: string): void {
  if (!(value instanceof className)) {
    throw new Error(message || `Expected value to be instance of ${className.name}`);
  }
}

/**
 * Assert that value is defined
 * ตรวจสอบว่าค่าถูกกำหนดแล้ว
 */
export function assertDefined(value: any, message?: string): void {
  if (value === undefined) {
    throw new Error(message || 'Expected value to be defined');
  }
}

/**
 * Assert that value is null
 * ตรวจสอบว่าค่าเป็น null
 */
export function assertNull(value: any, message?: string): void {
  if (value !== null) {
    throw new Error(message || `Expected value to be null but got ${value}`);
  }
}

/**
 * Assert that value is not null
 * ตรวจสอบว่าค่าไม่เป็น null
 */
export function assertNotNull(value: any, message?: string): void {
  if (value === null) {
    throw new Error(message || 'Expected value to not be null');
  }
}

/**
 * Assert that arrays are equal (deep comparison)
 * ตรวจสอบว่า arrays เท่ากัน (เปรียบเทียบลึก)
 */
export function assertArraysEqual(arr1: any[], arr2: any[], message?: string): void {
  if (arr1.length !== arr2.length) {
    throw new Error(message || `Arrays have different lengths: ${arr1.length} vs ${arr2.length}`);
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      throw new Error(message || `Arrays differ at index ${i}: ${arr1[i]} vs ${arr2[i]}`);
    }
  }
}

/**
 * Assert that objects are equal (deep comparison)
 * ตรวจสอบว่า objects เท่ากัน (เปรียบเทียบลึก)
 */
export function assertObjectsEqual(obj1: any, obj2: any, message?: string): void {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    throw new Error(message || `Objects have different number of keys`);
  }
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      throw new Error(message || `Objects differ at key "${key}": ${obj1[key]} vs ${obj2[key]}`);
    }
  }
}
