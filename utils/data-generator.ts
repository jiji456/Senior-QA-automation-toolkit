/**
 * Data Generator Utility
 * ยูทิลิตี้สำหรับสร้างข้อมูลทดสอบอัตโนมัติ
 * 
 * คำอธิบาย:
 * - สร้างข้อมูลสุ่มสำหรับการทดสอบ
 * - สร้างข้อมูลที่ถูกต้องตาม format
 * - สร้างข้อมูล edge cases
 * - สร้างข้อมูลที่ซ้ำกันและไม่ซ้ำกัน
 */

/**
 * Generate random string
 * สร้าง string สุ่ม
 */
export function randomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random email
 * สร้าง email สุ่ม
 */
export function randomEmail(): string {
  return `test${randomString(8)}@example.com`;
}

/**
 * Generate random phone number (Thai format)
 * สร้างเบอร์โทรศัพท์สุ่ม (รูปแบบไทย)
 */
export function randomPhone(): string {
  return `08${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
}

/**
 * Generate random number
 * สร้างตัวเลขสุ่ม
 */
export function randomNumber(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random date
 * สร้างวันที่สุ่ม
 */
export function randomDate(start: Date = new Date(2020, 0, 1), end: Date = new Date()): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate random Thai name
 * สร้างชื่อไทยสุ่ม
 */
export function randomThaiName(): string {
  const firstNames = ['สมชาย', 'สมหญิง', 'วิชัย', 'นฤมล', 'สุดา', 'อนุชิต', 'กนกวรรณ', 'ประยุทธ์', 'ธนพล', 'วิภา'];
  const lastNames = ['ใจดี', 'รักษ์ดี', 'มีสุข', 'เจริญ', 'สุขสันต์', 'รื่นรมย์', 'มั่นคง', 'เจริญรุ่งเรือง'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

/**
 * Generate random Thai ID (13 digits)
 * สร้างเลขบัตรประชาชนสุ่ม (13 หลัก)
 */
export function randomThaiID(): string {
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += Math.floor(Math.random() * 10);
  }
  // Calculate checksum (simplified)
  const checksum = (13 - (id.split('').reduce((sum, digit, index) => sum + parseInt(digit) * (13 - index), 0) % 11)) % 10;
  return id + checksum;
}

/**
 * Generate random URL
 * สร้าง URL สุ่ม
 */
export function randomURL(): string {
  return `https://example.com/${randomString(8)}`;
}

/**
 * Generate random password
 * สร้างรหัสผ่านสุ่ม
 */
export function randomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random address
 * สร้างที่อยู่สุ่ม
 */
export function randomAddress(): string {
  const streets = ['สุขุมวิท', 'สีลม', 'พระราม 1', 'พระราม 2', 'พระราม 3', 'พระราม 4', 'พระราม 5', 'พระราม 9'];
  const areas = ['กรุงเทพมหานคร', 'ปทุมธานี', 'นนทบุรี', 'สมุทรปราการ', 'พระนครศรีอยุธยา'];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const number = randomNumber(1, 999);
  const area = areas[Math.floor(Math.random() * areas.length)];
  return `${number} ถนน${street}, ${area}`;
}

/**
 * Generate test user data
 * สร้างข้อมูลผู้ใช้ทดสอบ
 */
export function generateTestUser() {
  return {
    email: randomEmail(),
    password: randomPassword(),
    firstName: randomThaiName().split(' ')[0],
    lastName: randomThaiName().split(' ')[1],
    phone: randomPhone(),
    address: randomAddress(),
    thaiID: randomThaiID(),
  };
}

/**
 * Generate array of test users
 * สร้างข้อมูลผู้ใช้ทดสอบหลายคน
 */
export function generateTestUsers(count: number) {
  return Array.from({ length: count }, () => generateTestUser());
}

/**
 * Generate edge case data
 * สร้างข้อมูล edge cases
 */
export const edgeCases = {
  emptyString: '',
  veryLongString: 'a'.repeat(10000),
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  unicode: 'ทดสอบภาษาไทย🇹🇭😀',
  sqlInjection: "'; DROP TABLE users; --",
  xss: '<script>alert("XSS")</script>',
  null: null,
  undefined: undefined,
  zero: 0,
  negative: -1,
  veryLargeNumber: Number.MAX_SAFE_INTEGER,
  verySmallNumber: Number.MIN_SAFE_INTEGER,
};

/**
 * Generate valid data by type
 * สร้างข้อมูลที่ถูกตามประเภท
 */
export function generateValidData(type: string): any {
  switch (type) {
    case 'email':
      return randomEmail();
    case 'phone':
      return randomPhone();
    case 'name':
      return randomThaiName();
    case 'password':
      return randomPassword();
    case 'url':
      return randomURL();
    case 'number':
      return randomNumber(1, 100);
    case 'date':
      return randomDate();
    default:
      return randomString();
  }
}
