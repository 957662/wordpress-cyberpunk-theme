/**
 * 错误处理中间件
 * 统一处理应用程序中的错误
 */

import { ERROR_MESSAGES } from '../config/constants';

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
  }
}

/**
 * 网络错误
 */
export class NetworkError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NETWORK_ERROR, details?: any) {
    super(message, 'NETWORK_ERROR', 0, details);
    this.name = 'NetworkError';
  }
}

/**
 * 服务器错误
 */
export class ServerError extends AppError {
  constructor(message: string = ERROR_MESSAGES.SERVER_ERROR, details?: any) {
    super(message, 'SERVER_ERROR', 500, details);
    this.name = 'ServerError';
  }
}

/**
 * 认证错误
 */
export class AuthError extends AppError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'AuthError';
  }
}

/**
 * 权限错误
 */
export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * 资源未找到错误
 */
export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * 验证错误
 */
export class ValidationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.VALIDATION_ERROR, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * 错误类型
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  AUTH = 'AUTH',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 错误信息接口
 */
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

/**
 * 解析错误信息
 */
export function parseError(error: any): ErrorInfo {
  // AppError 实例
  if (error instanceof AppError) {
    return {
      type: getErrorType(error),
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    };
  }
  
  // Fetch API 错误
  if (error instanceof Response) {
    return {
      type: ErrorType.SERVER,
      message: error.statusText || ERROR_MESSAGES.SERVER_ERROR,
      statusCode: error.status,
    };
  }
  
  // 标准错误对象
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      details: error,
    };
  }
  
  // 字符串错误
  if (typeof error === 'string') {
    return {
      type: ErrorType.UNKNOWN,
      message: error,
    };
  }
  
  // 未知错误
  return {
    type: ErrorType.UNKNOWN,
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    details: error,
  };
}

/**
 * 获取错误类型
 */
function getErrorType(error: AppError): ErrorType {
  if (error instanceof NetworkError) return ErrorType.NETWORK;
  if (error instanceof ServerError) return ErrorType.SERVER;
  if (error instanceof AuthError) return ErrorType.AUTH;
  if (error instanceof ForbiddenError) return ErrorType.FORBIDDEN;
  if (error instanceof NotFoundError) return ErrorType.NOT_FOUND;
  if (error instanceof ValidationError) return ErrorType.VALIDATION;
  return ErrorType.UNKNOWN;
}

/**
 * 错误处理器
 */
export type ErrorHandler = (error: ErrorInfo) => void;

/**
 * 全局错误处理器
 */
let globalErrorHandler: ErrorHandler | null = null;

/**
 * 设置全局错误处理器
 */
export function setErrorHandler(handler: ErrorHandler): void {
  globalErrorHandler = handler;
}

/**
 * 获取全局错误处理器
 */
export function getErrorHandler(): ErrorHandler {
  return (
    globalErrorHandler ||
    ((error: ErrorInfo) => {
      console.error('[Error Handler]', error);
    })
  );
}

/**
 * 处理错误
 */
export function handleError(error: any): void {
  const errorInfo = parseError(error);
  const handler = getErrorHandler();
  handler(errorInfo);
}

/**
 * 异步错误包装器
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }) as T;
}

/**
 * 错误边界处理
 */
export function useErrorHandler() {
  return {
    handleError,
    setErrorHandler,
    parseError,
  };
}

export default {
  AppError,
  NetworkError,
  ServerError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  parseError,
  handleError,
  setErrorHandler,
  withErrorHandling,
  useErrorHandler,
};
