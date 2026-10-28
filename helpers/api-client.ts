/**
 * API Client Helper
 * Helper สำหรับทำ API Automation Testing
 * 
 * คำอธิบาย:
 * - จัดการ HTTP requests (GET, POST, PUT, DELETE, PATCH)
 * - จัดการ authentication (Bearer token, Basic auth)
 * - จัดการ request/response headers
 * - จัดการ error handling
 * - จัดการ retry logic
 * - จัดการ request/response logging
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { log } from '../utils/logger';
import { config } from '../config/environment';

/**
 * API Client Class
 */
export class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = config.apiBaseURL, timeout: number = config.apiTimeout) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        log.apiRequest(config.method?.toUpperCase() || 'GET', config.url || '', config.data);
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        log.error('Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const duration = response.config.metadata?.duration || 0;
        log.apiResponse(response.status, duration);
        return response;
      },
      (error) => {
        if (error.response) {
          log.error('API Error', {
            status: error.response.status,
            data: error.response.data,
            url: error.config?.url,
          });
        } else if (error.request) {
          log.error('No response received', error.request);
        } else {
          log.error('Request setup error', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   ตั้งค่า authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Clear authentication token
   ลบ authentication token
   */
  clearToken(): void {
    this.token = null;
  }

  /**
   * GET request
 */
  async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const startTime = Date.now();
    try {
      const response = await this.client.get(url, {
        ...config,
        metadata: { duration: Date.now() - startTime },
      });
      return response;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * POST request
   */
  async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const startTime = Date.now();
    try {
      const response = await this.client.post(url, data, {
        ...config,
        metadata: { duration: Date.now() - startTime },
      });
      return response;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * PUT request
   */
  async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const startTime = Date.now();
    try {
      const response = await this.client.put(url, data, {
        ...config,
        metadata: { duration: Date.now() - startTime },
      });
      return response;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * PATCH request
   */
  async patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const startTime = Date.now();
    try {
      const response = await this.client.patch(url, data, {
        ...config,
        metadata: { duration: Date.now() - startTime },
      });
      return response;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * DELETE request
   */
  async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const startTime = Date.now();
    try {
      const response = await this.client.delete(url, {
        ...config,
        metadata: { duration: Date.now() - startTime },
      });
      return response;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Upload file
   อัปโหลดไฟล์
   */
  async upload(url: string, file: File, fieldName: string = 'file'): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    return this.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Download file
   ดาวน์โหลดไฟล์
   */
  async download(url: string): Promise<AxiosResponse> {
    return this.get(url, {
      responseType: 'blob',
    });
  }

  /**
   * Handle API errors
   จัดการข้อผิดพลาด API
   */
  private handleError(error: AxiosError): Error {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      // Custom error messages based on status code
      const errorMessages: Record<number, string> = {
        400: 'Bad Request - Invalid input data',
        401: 'Unauthorized - Authentication required',
        403: 'Forbidden - Insufficient permissions',
        404: 'Not Found - Resource does not exist',
        409: 'Conflict - Resource already exists',
        422: 'Unprocessable Entity - Validation error',
        429: 'Too Many Requests - Rate limit exceeded',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
      };

      const message = data?.message || errorMessages[status] || `HTTP Error ${status}`;
      return new Error(message);
    } else if (error.request) {
      return new Error('No response received from server');
    } else {
      return new Error(error.message || 'Request setup error');
    }
  }

  /**
   * Retry request with exponential backoff
   ลอง request ซ้ำด้วย exponential backoff
   */
  async retryRequest(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    maxRetries: number = config.apiRetryAttempts,
    delay: number = 1000
  ): Promise<AxiosResponse> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        switch (method) {
          case 'get':
            return await this.get(url);
          case 'post':
            return await this.post(url, data);
          case 'put':
            return await this.put(url, data);
          case 'patch':
            return await this.patch(url, data);
          case 'delete':
            return await this.delete(url);
        }
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        log.warn(`Retry ${i + 1}/${maxRetries} for ${method.toUpperCase()} ${url}`);
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    throw new Error('Max retries exceeded');
  }
}

/**
 * Create default API client instance
 * สร้าง instance ของ API client ตัว default
 */
export const apiClient = new APIClient();

/**
 * Create authenticated API client
 * สร้าง instance ของ API client ที่มี authentication
 */
export function createAuthenticatedClient(token: string): APIClient {
  const client = new APIClient();
  client.setToken(token);
  return client;
}
