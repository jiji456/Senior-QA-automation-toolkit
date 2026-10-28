/**
 * Environment Configuration
 * จัดการคอนฟิกูเรชันต่างๆ ของระบบทดสอบ
 * 
 * ใช้สำหรับ:
 * - โหลดค่าจาก environment variables
 * - จัดการคอนฟิกตาม environment (dev, staging, production)
 * - ให้ค่า default ถ้าไม่มีการตั้งค่า
 */
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Environment
  env: process.env.TEST_ENV || 'dev',
  
  // URLs
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  apiBaseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  
  // Browser Settings
  defaultBrowser: process.env.DEFAULT_BROWSER || 'chromium',
  headless: process.env.HEADLESS !== 'false',
  slowMo: parseInt(process.env.SLOW_MO || '0', 10),
  
  // API Settings
  apiTimeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
  apiRetryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10),
  
  // Paths
  testDataPath: process.env.TEST_DATA_PATH || './test-data',
  screenshotPath: process.env.SCREENSHOT_PATH || './screenshots',
  videoPath: process.env.VIDEO_PATH || './videos',
  
  // Reporting
  allureResultsDir: process.env.ALLURE_RESULTS_DIR || './allure-results',
  allureReportDir: process.env.ALLURE_REPORT_DIR || './allure-report',
  
  // Performance Testing
  k6VUs: parseInt(process.env.K6_VUS || '10', 10),
  k6Duration: process.env.K6_DURATION || '30s',
  
  // Mobile Testing
  devicePixelRatio: parseInt(process.env.DEVICE_PIXEL_RATIO || '2', 10),
  deviceWidth: parseInt(process.env.DEVICE_WIDTH || '375', 10),
  deviceHeight: parseInt(process.env.DEVICE_HEIGHT || '667', 10),
  
  // Visual Regression
  visualThreshold: parseFloat(process.env.VISUAL_THRESHOLD || '0.2'),
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || './logs/automation.log',
  
  // Database
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  dbName: process.env.DB_NAME || 'test_db',
  dbUser: process.env.DB_USER || 'test_user',
  dbPassword: process.env.DB_PASSWORD || 'test_password',
  
  // External Services
  emailServiceURL: process.env.EMAIL_SERVICE_URL,
  smsServiceURL: process.env.SMS_SERVICE_URL,
  
  // Test Credentials
  testUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'test123',
  },
  testAdmin: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'admin123',
  },
  
  // Feature Flags
  features: {
    apiTests: process.env.ENABLE_API_TESTS !== 'false',
    webTests: process.env.ENABLE_WEB_TESTS !== 'false',
    performanceTests: process.env.ENABLE_PERFORMANCE_TESTS !== 'false',
    visualTests: process.env.ENABLE_VISUAL_TESTS !== 'false',
    accessibilityTests: process.env.ENABLE_ACCESSIBILITY_TESTS !== 'false',
  },
};

/**
 * Get configuration based on environment
 * รับคอนฟิกตาม environment ที่ระบุ
 */
export function getEnvConfig(env: string = config.env) {
  const envConfigs: Record<string, Partial<typeof config>> = {
    dev: {
      baseURL: 'http://localhost:3000',
      apiBaseURL: 'http://localhost:3000/api',
    },
    staging: {
      baseURL: 'https://staging.example.com',
      apiBaseURL: 'https://staging-api.example.com',
    },
    production: {
      baseURL: 'https://example.com',
      apiBaseURL: 'https://api.example.com',
    },
  };
  
  return { ...config, ...envConfigs[env] };
}
