/**
 * Users API Tests
 * การทดสอบ API จัดการผู้ใช้ (Users)
 * 
 * คำอธิบาย:
 * - ทดสอบการดึงข้อมูลผู้ใช้
 * - ทดสอบการสร้างผู้ใช้
 * - ทดสอบการอัปเดตผู้ใช้
 * - ทดสอบการลบผู้ใช้
 * - ทดสอบ pagination และ filtering
 */
import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { APIClient, createAuthenticatedClient } from '../../helpers/api-client';
import { assertAPIResponseSuccess, assertAPIResponseStatus, assertAPIResponseHasData, assertArrayLength } from '../../helpers/assertion-helper';
import { config } from '../../config/environment';
import { randomEmail, randomPassword, randomThaiName, randomPhone } from '../../utils/data-generator';
import { log } from '../../utils/logger';

describe('Users API Tests', () => {
  let apiClient: APIClient;
  let authenticatedClient: APIClient;
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    apiClient = new APIClient();
    
    // Login to get auth token
    const loginResponse = await apiClient.post('/auth/login', {
      email: config.testUser.email,
      password: config.testUser.password,
    });
    
    authToken = loginResponse.data.token;
    authenticatedClient = createAuthenticatedClient(authToken);
    
    log.info('Starting Users API Tests');
  });

  afterAll(() => {
    log.info('Users API Tests Completed');
  });

  describe('GET /api/users', () => {
    test('should get all users', async () => {
      log.testStart('Get all users');
      
      const response = await authenticatedClient.get('/users');
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      expect(Array.isArray(response.data.users)).toBeTruthy();
      
      log.testPass('Get all users');
    });

    test('should support pagination', async () => {
      log.testStart('Support pagination');
      
      const response = await authenticatedClient.get('/users?page=1&limit=10');
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      expect(response.data.pagination).toBeDefined();
      expect(response.data.pagination.page).toBe(1);
      expect(response.data.pagination.limit).toBe(10);
      
      log.testPass('Support pagination');
    });

    test('should support filtering by name', async () => {
      log.testStart('Support filtering by name');
      
      const response = await authenticatedClient.get('/users?search=test');
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      
      log.testPass('Support filtering by name');
    });

    test('should support sorting', async () => {
      log.testStart('Support sorting');
      
      const response = await authenticatedClient.get('/users?sort=name&order=asc');
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      
      log.testPass('Support sorting');
    });
  });

  describe('GET /api/users/:id', () => {
    test('should get user by ID', async () => {
      log.testStart('Get user by ID');
      
      // First get a user ID from the list
      const usersResponse = await authenticatedClient.get('/users');
      const userId = usersResponse.data.users[0].id;
      
      const response = await authenticatedClient.get(`/users/${userId}`);
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      expect(response.data.id).toBe(userId);
      
      log.testPass('Get user by ID');
    });

    test('should fail with invalid user ID', async () => {
      log.testStart('Fail with invalid user ID');
      
      const response = await authenticatedClient.get('/users/invalid-id');
      
      assertAPIResponseStatus(response, 404);
      
      log.testPass('Fail with invalid user ID');
    });
  });

  describe('POST /api/users', () => {
    test('should create new user', async () => {
      log.testStart('Create new user');
      
      const newUser = {
        email: randomEmail(),
        password: randomPassword(),
        firstName: randomThaiName().split(' ')[0],
        lastName: randomThaiName().split(' ')[1],
        phone: randomPhone(),
      };

      const response = await authenticatedClient.post('/users', newUser);
      
      assertAPIResponseStatus(response, 201);
      assertAPIResponseHasData(response);
      expect(response.data.email).toBe(newUser.email);
      testUserId = response.data.id;
      
      log.testPass('Create new user');
    });

    test('should fail with duplicate email', async () => {
      log.testStart('Fail with duplicate email');
      
      const duplicateUser = {
        email: config.testUser.email,
        password: randomPassword(),
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await authenticatedClient.post('/users', duplicateUser);
      
      assertAPIResponseStatus(response, 409);
      
      log.testPass('Fail with duplicate email');
    });

    test('should fail with invalid data', async () => {
      log.testStart('Fail with invalid data');
      
      const invalidUser = {
        email: 'invalid-email',
        password: '123',
      };

      const response = await authenticatedClient.post('/users', invalidUser);
      
      assertAPIResponseStatus(response, 400);
      
      log.testPass('Fail with invalid data');
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update user', async () => {
      log.testStart('Update user');
      
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const response = await authenticatedClient.put(`/users/${testUserId}`, updateData);
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      expect(response.data.firstName).toBe(updateData.firstName);
      expect(response.data.lastName).toBe(updateData.lastName);
      
      log.testPass('Update user');
    });

    test('should fail with invalid user ID', async () => {
      log.testStart('Fail with invalid user ID');
      
      const response = await authenticatedClient.put('/users/invalid-id', {
        firstName: 'Test',
      });
      
      assertAPIResponseStatus(response, 404);
      
      log.testPass('Fail with invalid user ID');
    });
  });

  describe('PATCH /api/users/:id', () => {
    test('should partially update user', async () => {
      log.testStart('Partially update user');
      
      const response = await authenticatedClient.patch(`/users/${testUserId}`, {
        phone: randomPhone(),
      });
      
      assertAPIResponseSuccess(response);
      assertAPIResponseHasData(response);
      
      log.testPass('Partially update user');
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should delete user', async () => {
      log.testStart('Delete user');
      
      const response = await authenticatedClient.delete(`/users/${testUserId}`);
      
      assertAPIResponseStatus(response, 204);
      
      // Verify user is deleted
      const getResponse = await authenticatedClient.get(`/users/${testUserId}`);
      assertAPIResponseStatus(getResponse, 404);
      
      log.testPass('Delete user');
    });

    test('should fail with invalid user ID', async () => {
      log.testStart('Fail with invalid user ID');
      
      const response = await authenticatedClient.delete('/users/invalid-id');
      
      assertAPIResponseStatus(response, 404);
      
      log.testPass('Fail with invalid user ID');
    });
  });
});
