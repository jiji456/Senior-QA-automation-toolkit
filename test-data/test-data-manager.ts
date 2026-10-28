/**
 * Test Data Manager
 * จัดการข้อมูลทดสอบ (Test Data Management)
 * 
 * คำอธิบาย:
 * - จัดการข้อมูลทดสอบจากไฟล์ JSON
 * - จัดการข้อมูลทดสอบจาก database
 * - สร้างและลบข้อมูลทดสอบ
 * - จัดการ test data factories
 * - จัดการ test data cleanup
 */
import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger';

export interface TestData {
  [key: string]: any;
}

export class TestDataManager {
  private testDataPath: string;
  private testData: Map<string, TestData> = new Map();

  constructor(testDataPath: string = './test-data') {
    this.testDataPath = testDataPath;
    this.loadAllTestData();
  }

  /**
   * Load all test data from JSON files
   โหลดข้อมูลทดสอบทั้งหมดจากไฟล์ JSON
   */
  private loadAllTestData(): void {
    try {
      if (!fs.existsSync(this.testDataPath)) {
        fs.mkdirSync(this.testDataPath, { recursive: true });
        log.info(`Created test data directory: ${this.testDataPath}`);
        return;
      }

      const files = fs.readdirSync(this.testDataPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      for (const file of jsonFiles) {
        const filePath = path.join(this.testDataPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const key = file.replace('.json', '');
        this.testData.set(key, data);
        log.info(`Loaded test data: ${key}`);
      }
    } catch (error) {
      log.error('Error loading test data', error);
    }
  }

  /**
   * Get test data by key
   รับข้อมูลทดสอบตาม key
   */
  get(key: string): TestData | undefined {
    return this.testData.get(key);
  }

  /**
   * Set test data
   ตั้งค่าข้อมูลทดสอบ
   */
  set(key: string, data: TestData): void {
    this.testData.set(key, data);
    this.saveTestData(key, data);
  }

  /**
   * Save test data to file
   บันทึกข้อมูลทดสอบลงไฟล์
   */
  private saveTestData(key: string, data: TestData): void {
    try {
      const filePath = path.join(this.testDataPath, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      log.info(`Saved test data: ${key}`);
    } catch (error) {
      log.error(`Error saving test data: ${key}`, error);
    }
  }

  /**
   * Delete test data
   ลบข้อมูลทดสอบ
   */
  delete(key: string): void {
    this.testData.delete(key);
    const filePath = path.join(this.testDataPath, `${key}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      log.info(`Deleted test data: ${key}`);
    }
  }

  /**
   * Get all test data keys
   รับ keys ของข้อมูลทดสอบทั้งหมด
   */
  getAllKeys(): string[] {
    return Array.from(this.testData.keys());
  }

  /**
   * Clear all test data
   ล้างข้อมูลทดสอบทั้งหมด
   */
  clearAll(): void {
    this.testData.clear();
    const files = fs.readdirSync(this.testDataPath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(this.testDataPath, file));
      }
    }
    log.info('Cleared all test data');
  }

  /**
   * Reload test data from files
   โหลดข้อมูลทดสอบใหม่จากไฟล์
   */
  reload(): void {
    this.testData.clear();
    this.loadAllTestData();
    log.info('Reloaded all test data');
  }
}

/**
 * Test Data Factory
 * Factory สำหรับสร้างข้อมูลทดสอบ
 */
export class TestDataFactory {
  /**
   * Create user test data
   สร้างข้อมูลผู้ใช้ทดสอบ
   */
  static createUser(overrides: Partial<any> = {}): any {
    const { randomEmail, randomPassword, randomThaiName, randomPhone } = require('../utils/data-generator');
    
    return {
      email: randomEmail(),
      password: randomPassword(),
      firstName: randomThaiName().split(' ')[0],
      lastName: randomThaiName().split(' ')[1],
      phone: randomPhone(),
      ...overrides,
    };
  }

  /**
   * Create admin user test data
   สร้างข้อมูล admin ทดสอบ
   */
  static createAdminUser(overrides: Partial<any> = {}): any {
    return {
      ...this.createUser(),
      role: 'admin',
      permissions: ['read', 'write', 'delete'],
      ...overrides,
    };
  }

  /**
   * Create product test data
   สร้างข้อมูลสินค้าทดสอบ
   */
  static createProduct(overrides: Partial<any> = {}): any {
    return {
      name: `Test Product ${Date.now()}`,
      description: 'Test product description',
      price: 100.00,
      quantity: 10,
      category: 'test',
      ...overrides,
    };
  }

  /**
   * Create order test data
   สร้างข้อมูลคำสั่งซื้อทดสอบ
   */
  static createOrder(overrides: Partial<any> = {}): any {
    return {
      userId: 'test-user-id',
      items: [
        {
          productId: 'test-product-id',
          quantity: 1,
          price: 100.00,
        },
      ],
      total: 100.00,
      status: 'pending',
      ...overrides,
    };
  }

  /**
   * Create multiple test data
   สร้างข้อมูลทดสอบหลายชุด
   */
  static createMany<T>(factory: () => T, count: number): T[] {
    return Array.from({ length: count }, () => factory());
  }
}

/**
 * Test Data Seeder
 * สำหรับ seed ข้อมูลทดสอบลง database
 */
export class TestDataSeeder {
  /**
   * Seed user data
   Seed ข้อมูลผู้ใช้
   */
  static async seedUsers(count: number = 10): Promise<any[]> {
    const users = TestDataFactory.createMany(() => TestDataFactory.createUser(), count);
    log.info(`Seeding ${count} users`);
    // TODO: Implement database seeding logic
    return users;
  }

  /**
   * Seed product data
   Seed ข้อมูลสินค้า
   */
  static async seedProducts(count: number = 20): Promise<any[]> {
    const products = TestDataFactory.createMany(() => TestDataFactory.createProduct(), count);
    log.info(`Seeding ${count} products`);
    // TODO: Implement database seeding logic
    return products;
  }

  /**
   * Seed order data
   Seed ข้อมูลคำสั่งซื้อ
   */
  static async seedOrders(count: number = 50): Promise<any[]> {
    const orders = TestDataFactory.createMany(() => TestDataFactory.createOrder(), count);
    log.info(`Seeding ${count} orders`);
    // TODO: Implement database seeding logic
    return orders;
  }

  /**
   * Clean all seeded data
   ล้างข้อมูลที่ seed ทั้งหมด
   */
  static async cleanup(): Promise<void> {
    log.info('Cleaning up seeded data');
    // TODO: Implement database cleanup logic
  }
}

// Create global instance
export const testDataManager = new TestDataManager();
