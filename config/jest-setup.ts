/**
 * Jest Setup for API Testing
 * ตั้งค่าเริ่มต้นก่อนการทดสอบ API
 * 
 * ฟังก์ชันนี้จะทำงานก่อนเริ่มการทดสอบ API:
 * - โหลด environment variables
 * - ตั้งค่า axios defaults
 * - เตรียม test data
 */
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Global test timeout
jest.setTimeout(30000);

// Setup global test data
global.testConfig = {
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
  retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10),
};

console.log('🔧 Jest API Test Setup Complete');
console.log(`📡 API Base URL: ${global.testConfig.baseURL}`);
