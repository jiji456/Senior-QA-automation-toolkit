/**
 * Global Setup for Playwright Tests
 * ตั้งค่าเริ่มต้นก่อนการทดสอบทุกครั้ง
 * 
 * ฟังก์ชันนี้จะทำงานก่อนเริ่มการทดสอบทั้งหมด:
 * - โหลด environment variables
 * - เตรียม test data
 * - เชื่อมต่อ database (ถ้าจำเป็น)
 * - เคลียร์ old test results
 */
import { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';

async function globalSetup(config: FullConfig) {
  // Load environment variables
  dotenv.config();
  
  console.log('🚀 Starting Global Setup...');
  console.log(`📊 Test Environment: ${process.env.TEST_ENV || 'dev'}`);
  console.log(`🌐 Base URL: ${process.env.BASE_URL}`);
  console.log(`🔌 API Base URL: ${process.env.API_BASE_URL}`);
  
  // Additional setup can be added here:
  // - Database seeding
  // - Test data preparation
  // - Starting external services
  // - Cleaning up old test artifacts
  
  console.log('✅ Global Setup Complete');
}

export default globalSetup;
