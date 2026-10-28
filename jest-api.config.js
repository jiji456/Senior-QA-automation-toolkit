/**
 * Jest Configuration for API Testing
 * คอนฟิกูเรชันสำหรับ API Automation Testing ด้วย Jest
 * 
 * คำอธิบาย:
 * - กำหนด test environment
 * - ตั้งค่า coverage reporting
 * - กำหนด test matchers
 * - ตั้งค่า timeout สำหรับ API tests
 */
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test files
  testMatch: ['**/tests/api/**/*.test.ts', '**/tests/api/**/*.spec.ts'],
  
  // Coverage
  collectCoverage: true,
  coverageDirectory: './coverage/api',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'utils/**/*.{ts,js}',
    'helpers/**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  
  // Module resolution
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  
  // Timeout for API tests
  testTimeout: 30000,
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/config/jest-setup.ts'],
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
