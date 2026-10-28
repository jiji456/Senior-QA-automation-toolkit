/**
 * Authentication API Tests
 * การทดสอบ API การยืนยันตัวตน (Authentication)
 * 
 * คำอธิบาย:
 * - ทดสอบการ login ผ่าน API
 * - ทดสอบการ register ผ่าน API
 * - ทดสอบการ logout ผ่าน API
 * - ทดสอบ token refresh
 * - ทดสอบ forgot password
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { APIClient, createAuthenticatedClient } from '../../helpers/api-client';
import { assertAPIResponseSuccess, assertAPIResponseStatus, assertAPIResponseHasData } from '../../helpers/assertion-helper';
import { config } from '../../config/environment';
import { randomEmail, randomPassword, randomThaiName } from '../../utils/data-generator';
import { log } from '../../utils/logger';

describe('Authentication API Tests', () => {
  let apiClient: APIClient;
  let authToken: string;
  let testUser: any;

  beforeAll(() => {
    apiClient = new APIClient();
    log.info('Starting Authentication API Tests');
  });

  afterAll(() => {
    log.info('Authentication API Tests Completed');
  });

  describe('POST /api/auth/register', () => {
    test('should register new user successfully', async () => {
      log.testStart('Register new user successfully');
      
      testUser = {
        email: randomEmail(),
        password: randomPassword(),
        firstName: randomThaiName().split(' ')[0],
        lastName: randomThaiName().split(' ')[1],
      };

      const response = await apiClient.post('/auth/register', testUser);
      
      assertAPIResponseStatus(response, 201);
      assertAPIResponseHasData(response);
      expect(response.data.user).toBeDefined();
      expect(response.data.user.email).toBe(testUser.email);
      
      log.testPass('Register new user successfully');
    });

    test('should fail with duplicate email', async () => {
      log.testStart('Fail with duplicate email');
      
      const response = await apiClient.post('/auth/register', testUser);
      
      assertAPIResponseStatus(response, 409);
      expect(response.data.message).toContain('already exists');
      
      log.testPass('Fail with duplicate email');
    });

    test('should fail with invalid email format', async () => {
      log.testStart('Fail with invalid email format');
      
      const invalidUser = {
        email: 'invalid-email',
        password: randomPassword(),
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await apiClient.post('/auth/register', invalidUser);
      
      assertAPIResponseStatus(response, 400);
      
      log.testPass('Fail with invalid email format');
    });

    test('should fail with weak password', async () => {
      log.testStart('Fail with weak password');
      
      const weakPasswordUser = {
        email: randomEmail(),
        password: '123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await apiClient.post('/auth/register', weakPasswordUser);
      
      assertAPIResponseStatus(response, 400);
      expect(response.data.message).toContain('password');
      
      log.testPass('Fail with weak password');
    });

    test('should fail with missing required fields', async () => {
      log.testStart('Fail with missing required fields');
      
      const incompleteUser = {
        email: randomEmail(),
        // Missing password, firstName, lastName
      };

      const response = await apiClient.post('/auth/register', incompleteUser);
      
      assertAPIResponseStatus(response, 400);
      
      log.testPass('Fail with missing required fields');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login successfully with valid credentials', async () => {
      log.testStart('Login successfully with valid credentials');
      
      const credentials = {
        email: testUser.email,
        password: testUser.password,
      };

      const response = await apiClient.post('/auth/login', credentials);
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      expect(response.data.token).toBeDefined();
      expect(response.data.user).toBeDefined();
      
      authToken = response.data.token;
      
      log.testPass('Login successfully with valid credentials');
    });

    test('should fail with invalid email', async () => {
      log.testStart('Fail with invalid email');
      
      const credentials = {
        email: 'nonexistent@example.com',
        password: testUser.password,
      };

      const response = await apiClient.post('/auth/login', credentials);
      
      assertAPIResponseStatus(response, 401);
      expect(response.data.message).toContain('Invalid');
      
      log.testPass('Fail with invalid email');
    });

    test('should fail with invalid password', async () => {
      log.testStart('Fail with invalid password');
      
      const credentials = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      const response = await apiClient.post('/auth/login', credentials);
      
      assertAPIResponseStatus(response, 401);
      expect(response.data.message).toContain('Invalid');
      
      log.testPass('Fail with invalid password');
    });

    test('should fail with missing credentials', async () => {
      log.testStart('Fail with missing credentials');
      
      const response = await apiClient.post('/auth/login', {});
      
      assertAPIResponseStatus(response, 400);
      
      log.testPass('Fail with missing credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    test('should get current user with valid token', async () => {
      log.testStart('Get current user with valid token');
      
      const authenticatedClient = createAuthenticatedClient(authToken);
      const response = await authenticatedClient.get('/auth/me');
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      expect(response.data.email).toBe(testUser.email);
      
      log.testPass('Get current user with valid token');
    });

    test('should fail without token', async () => {
      log.testStart('Fail without token');
      
      const response = await apiClient.get('/auth/me');
      
      assertAPIResponseStatus(response, 401);
      
      log.testPass('Fail without token');
    });

    test('should fail with invalid token', async () => {
      log.testStart('Fail with invalid token');
      
      const authenticatedClient = createAuthenticatedClient('invalid-token');
      const response = await authenticatedClient.get('/auth/me');
      
      assertAPIResponseStatus(response, 401);
      
      log.testPass('Fail with invalid token');
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('should refresh token successfully', async () => {
      log.testStart('Refresh token successfully');
      
      const authenticatedClient = createAuthenticatedClient(authToken);
      const response = await authenticatedClient.post('/auth/refresh');
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      expect(response.data.token).toBeDefined();
      expect(response.data.token).not.toBe(authToken);
      
      authToken = response.data.token;
      
      log.testPass('Refresh token successfully');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should logout successfully', async () => {
      log.testStart('Logout successfully');
      
      const authenticatedClient = createAuthenticatedClient(authToken);
      const response = await authenticatedClient.post('/auth/logout');
      
      assertAPIResponseSuccess(response);
      
      log.testPass('Logout successfully');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    test('should send reset email for valid email', async () => {
      log.testStart('Send reset email for valid email');
      
      const response = await apiClient.post('/auth/forgot-password', {
        email: testUser.email,
      });
      
      assertAPIResponseSuccess(response);
      
      log.testPass('Send reset email for valid email');
    });

    test('should fail for non-existent email', async () => {
      log.testStart('Fail for non-existent email');
      
      const response = await apiClient.post('/auth/forgot-password', {
        email: 'nonexistent@example.com',
      });
      
      // Should still return success for security (not revealing if email exists)
      assertAPIResponseSuccess(response);
      
      log.testPass('Fail for non-existent email');
    });
  });
});
