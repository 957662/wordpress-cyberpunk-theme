/**
 * 全局错误处理工具
 * 提供统一的错误处理、日志记录和用户反馈
 */

import toast from 'react-hot-toast';

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * 创建自定义错误
 */
export function createError(
  message: string,
  code?: string,
  details?: unknown
): AppError {
  const error = new Error(message) as AppError;
  error.code = code;
  error.details = details;
  return error;
}

/**
 * 错误类型
 */
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTH_ERROR',
  AUTHORIZATION = 'PERMISSION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

/**
 * 获取错误类型
 */
export function getErrorType(error: unknown): ErrorType {
  if (!(error instanceof Error)) {
    return ErrorType.UNKNOWN;
  }

  const appError = error as AppError;

  if (appError.code === 'NETWORK_ERROR' || appError.message.includes('fetch')) {
    return ErrorType.NETWORK;
  }

  if (appError.statusCode === 401 || appError.code === 'AUTH_FAILED') {
    return ErrorType.AUTHENTICATION;
  }

  if (appError.statusCode === 403 || appError.code === 'PERMISSION_DENIED') {
    return ErrorType.AUTHORIZATION;
  }

  if (appError.statusCode === 404 || appError.code === 'NOT_FOUND') {
    return ErrorType.NOT_FOUND;
  }

  if (appError.statusCode === 400 || appError.code === 'VALIDATION_ERROR') {
    return ErrorType.VALIDATION;
  }

  if (appError.statusCode && appError.statusCode >= 500) {
    return ErrorType.SERVER;
  }

  return ErrorType.UNKNOWN;
}

/**
 * 获取用户友好的错误消息
 */
export function getErrorMessage(error: unknown): string {
  const errorType = getErrorType(error);

  const messages: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: '网络连接失败，请检查您的网络设置',
    [ErrorType.VALIDATION]: '输入数据格式不正确，请检查后重试',
    [ErrorType.AUTHENTICATION]: '登录已过期，请重新登录',
    [ErrorType.AUTHORIZATION]: '您没有权限执行此操作',
    [ErrorType.NOT_FOUND]: '请求的资源不存在',
    [ErrorType.SERVER]: '服务器错误，请稍后重试',
    [ErrorType.UNKNOWN]: '发生未知错误，请稍后重试',
  };

  return messages[errorType];
}

/**
 * 显示错误提示
 */
export function showError(error: unknown): void {
  const message = getErrorMessage(error);

  if (error instanceof Error && process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    toast.error(`${message}\n${error.message}`);
  } else {
    toast.error(message);
  }
}

/**
 * 错误边界处理器
 */
export function logError(error: unknown, context?: string): void {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // 在开发环境打印详细错误
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }

  // 在生产环境发送到错误追踪服务
  if (process.env.NODE_ENV === 'production') {
    // TODO: 发送到错误追踪服务 (如 Sentry)
    sendErrorToTracking(errorInfo);
  }
}

/**
 * 发送错误到追踪服务
 */
async function sendErrorToTracking(errorInfo: Record<string, unknown>): Promise<void> {
  try {
    // 实现错误追踪逻辑
    await fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorInfo),
    });
  } catch {
    // 忽略错误追踪自身的错误
  }
}

/**
 * 处理 API 错误
 */
export async function handleApiError<T>(
  promise: Promise<T>
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await promise;
    return { data };
  } catch (err) {
    const error = err instanceof Error ? (err as AppError) : new Error(String(err));
    return { error };
  }
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: boolean;
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts) {
        const waitTime = backoff ? delay * attempt : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

/**
 * 超时包装器
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = '操作超时，请稍后重试'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
}

/**
 * 安全执行函数（不抛出错误）
 */
export function safeExecute<T>(
  fn: () => T,
  defaultValue: T,
  onError?: (error: Error) => void
): T {
  try {
    return fn();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) {
      onError(err);
    }
    return defaultValue;
  }
}

/**
 * 安全异步执行
 */
export async function safeAsyncExecute<T>(
  fn: () => Promise<T>,
  defaultValue: T,
  onError?: (error: Error) => void
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) {
      onError(err);
    }
    return defaultValue;
  }
}
