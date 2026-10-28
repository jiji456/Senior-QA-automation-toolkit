/**
 * Logger Utility
 * ยูทิลิตี้สำหรับบันทึก log การทำงานของระบบทดสอบ
 * 
 * คำอธิบาย:
 * - บันทึก log หลายระดับ (error, warn, info, debug)
 * - บันทึกลงไฟล์และ console
 * - จัดรูปแบบ log ให้อ่านง่าย
 * - รองรับ timestamp และ context
 */
import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure log directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logDir, 'automation.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * Logger methods with context support
 */
export const log = {
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  
  // Test-specific logging
  testStart: (testName: string) => logger.info(`🧪 Test Started: ${testName}`),
  testPass: (testName: string) => logger.info(`✅ Test Passed: ${testName}`),
  testFail: (testName: string, error: any) => logger.error(`❌ Test Failed: ${testName}`, { error }),
  testSkip: (testName: string, reason?: string) => logger.warn(`⏭️ Test Skipped: ${testName}`, { reason }),
  
  // Step logging
  step: (step: string, description: string) => logger.info(`📌 Step ${step}: ${description}`),
  
  // API logging
  apiRequest: (method: string, url: string, data?: any) => {
    logger.info(`📡 API Request: ${method} ${url}`, data ? { body: data } : undefined);
  },
  apiResponse: (status: number, duration: number) => {
    logger.info(`📡 API Response: ${status} (${duration}ms)`);
  },
  
  // UI logging
  uiAction: (action: string, element: string) => logger.info(`🖱️ UI Action: ${action} on ${element}`),
  uiNavigation: (page: string) => logger.info(`🔄 Navigation: ${page}`),
};

export default logger;
