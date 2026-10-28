/**
 * QA Automation Toolkit - Main Entry Point
 * จุดเริ่มต้นหลักของ QA Automation Toolkit
 * 
 * คำอธิบาย:
 * - Export ทุก modules ที่จำเป็น
 * - ให้ใช้งานได้ง่าย
 * - เป็น central point สำหรับ imports
 */

// Config
export { config, getEnvConfig } from './config/environment';

// Utils
export { log } from './utils/logger';
export {
  randomString,
  randomEmail,
  randomPhone,
  randomNumber,
  randomDate,
  randomThaiName,
  randomThaiID,
  randomURL,
  randomPassword,
  randomAddress,
  generateTestUser,
  generateTestUsers,
  edgeCases,
  generateValidData,
} from './utils/data-generator';
export {
  wait,
  waitForVisible,
  waitForHidden,
  waitForAttached,
  waitForDetached,
  waitForEnabled,
  waitForClickable,
  waitForNetworkIdle,
  waitForNavigation,
  waitForURL,
  waitForCondition,
  waitForText,
  waitForAttribute,
  waitForPageLoad,
  retryWithBackoff,
  pollForCondition,
} from './utils/wait-helper';

// Helpers
export { APIClient, apiClient, createAuthenticatedClient } from './helpers/api-client';
export {
  assertTruthy,
  assertFalsy,
  assertEqual,
  assertNotEqual,
  assertGreaterThan,
  assertLessThan,
  assertInRange,
  assertContains,
  assertArrayContains,
  assertArrayLength,
  assertHasProperty,
  assertPropertyEquals,
  assertAPIResponseSuccess,
  assertAPIResponseStatus,
  assertAPIResponseHasData,
  assertAPIResponseStructure,
  assertValidEmail,
  assertValidURL,
  assertValidThaiPhone,
  assertMatchesRegex,
  assertType,
  assertInstanceOf,
  assertDefined,
  assertNull,
  assertNotNull,
  assertArraysEqual,
  assertObjectsEqual,
} from './helpers/assertion-helper';

// Pages
export { BasePage } from './pages/base-page';
export { LoginPage } from './pages/login-page';
export { DashboardPage } from './pages/dashboard-page';

// Test Data
export {
  TestDataManager,
  TestDataFactory,
  TestDataSeeder,
  testDataManager,
} from './test-data/test-data-manager';

// Version
export const VERSION = '1.0.0';
