/**
 * 错误处理工具
 */

/**
 * 自定义错误类
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = '网络错误', details?: any) {
    super(message, 'NETWORK_ERROR', 0, details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = '资源未找到', details?: any) {
    super(message, 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权', details?: any) {
    super(message, 'UNAUTHORIZED', 401, details);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 错误处理函数
 */
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500, {
      stack: error.stack,
    });
  }

  return new AppError('未知错误', 'UNKNOWN_ERROR', 500, { error });
}

/**
 * 判断是否为网络错误
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;

  if (error instanceof Error) {
    return (
      error.message.includes('Network Error') ||
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND')
    );
  }

  return false;
}

/**
 * 判断是否为验证错误
 */
export function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError;
}

/**
 * 判断是否为未找到错误
 */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof NotFoundError;
}

/**
 * 判断是否为未授权错误
 */
export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof UnauthorizedError;
}

/**
 * 获取错误消息
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return '未知错误';
}

/**
 * 获取用户友好的错误消息
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return '网络连接失败，请检查您的网络设置';
  }

  if (isValidationError(error)) {
    return '输入的数据格式不正确，请检查后重试';
  }

  if (isNotFoundError(error)) {
    return '请求的资源不存在';
  }

  if (isUnauthorizedError(error)) {
    return '您没有权限执行此操作';
  }

  return '发生了一个错误，请稍后重试';
}

export default {
  AppError,
  NetworkError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  handleError,
  isNetworkError,
  isValidationError,
  isNotFoundError,
  isUnauthorizedError,
  getErrorMessage,
  getUserFriendlyMessage,
};
