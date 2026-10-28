/**
 * Load Test with K6
 * การทดสอบประสิทธิภาพ (Performance Testing) ด้วย K6
 * 
 * คำอธิบาย:
 * - ทดสอบ load ของ API
 * - ทดสอบ response time
 * - ทดสอบ throughput
 * - ทดสอบ error rate
 * - ทดสอบภายใต้ load สูง
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 10 },    // Stay at 10 users
    { duration: '30s', target: 50 },   // Ramp up to 50 users
    { duration: '1m', target: 50 },    // Stay at 50 users
    { duration: '30s', target: 100 },  // Ramp up to 100 users
    { duration: '1m', target: 100 },   // Stay at 100 users
    { duration: '30s', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% of requests should be below 500ms
    errors: ['rate<0.1'], // Error rate should be less than 10%
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000/api';

export default function () {
  // Test 1: Health check
  let healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(1);

  // Test 2: Login
  let loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'test123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
    'login has token': (r) => JSON.parse(r.body).token !== undefined,
  }) || errorRate.add(1);

  let token = loginRes.json().token;

  sleep(1);

  // Test 3: Get users (authenticated)
  let usersRes = http.get(`${BASE_URL}/users`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  check(usersRes, {
    'get users status is 200': (r) => r.status === 200,
    'get users response time < 300ms': (r) => r.timings.duration < 300,
    'get users has data': (r) => JSON.parse(r.body).users !== undefined,
  }) || errorRate.add(1);

  sleep(1);

  // Test 4: Create user
  let createUserRes = http.post(`${BASE_URL}/users`, JSON.stringify({
    email: `test${__VU}@example.com`,
    password: 'test123',
    firstName: 'Test',
    lastName: 'User',
  }), {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  check(createUserRes, {
    'create user status is 201': (r) => r.status === 201,
    'create user response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(2);
}

export function handleSummary(data) {
  return {
    'performance-summary.json': JSON.stringify(data),
  };
}
