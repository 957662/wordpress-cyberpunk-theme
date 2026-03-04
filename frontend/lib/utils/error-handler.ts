/**
 * 错误处理工具函数
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

/**
 * 网络错误
 */
export class NetworkError extends AppError {
  constructor(message: string = '网络请求失败', details?: any) {
    super(message, 'NETWORK_ERROR', 0, details);
    this.name = 'NetworkError';
  }
}

/**
 * 验证错误
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * 认证错误
 */
export class AuthenticationError extends AppError {
  constructor(message: string = '未授权访问', details?: any) {
    super(message, 'AUTH_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * 权限错误
 */
export class AuthorizationError extends AppError {
  constructor(message: string = '权限不足', details?: any) {
    super(message, 'PERMISSION_ERROR', 403, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * 资源不存在错误
 */
export class NotFoundError extends AppError {
  constructor(message: string = '资源不存在', details?: any) {
    super(message, 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
  }
}

/**
 * 错误类型
 */
export type ErrorType =
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'notFound'
  | 'server'
  | 'unknown';

/**
 * 错误信息
 */
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

/**
 * 获取错误类型
 */
export function getErrorType(error: any): ErrorType {
  if (error instanceof NetworkError) return 'network';
  if (error instanceof ValidationError) return 'validation';
  if (error instanceof AuthenticationError) return 'authentication';
  if (error instanceof AuthorizationError) return 'authorization';
  if (error instanceof NotFoundError) return 'notFound';
  if (error instanceof AppError) return 'server';
  if (error?.response?.status) {
    const status = error.response.status;
    if (status >= 400 && status < 500) {
      if (status === 401) return 'authentication';
      if (status === 403) return 'authorization';
      if (status === 404) return 'notFound';
      return 'validation';
    }
    return 'server';
  }
  return 'unknown';
}

/**
 * 获取用户友好的错误消息
 */
export function getErrorMessage(error: any): string {
  const errorType = getErrorType(error);

  const messages: Record<ErrorType, string> = {
    network: '网络连接失败，请检查您的网络设置',
    validation: '输入信息有误，请检查后重试',
    authentication: '登录已过期，请重新登录',
    authorization: '您没有权限执行此操作',
    notFound: '请求的资源不存在',
    server: '服务器错误，请稍后重试',
    unknown: '发生未知错误，请稍后重试',
  };

  return error?.message || messages[errorType] || messages.unknown;
}

/**
 * 错误日志记录器
 */
export class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorInfo[] = [];

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * 记录错误
   */
  log(error: any, context?: string): void {
    const errorInfo: ErrorInfo = {
      type: getErrorType(error),
      message: getErrorMessage(error),
      code: error?.code,
      statusCode: error?.statusCode,
      details: error?.details,
    };

    this.errors.push({
      ...errorInfo,
      context,
    } as any);

    // 控制台输出
    console.error(`[Error${context ? ` (${context})` : ''}]:`, {
      ...errorInfo,
      originalError: error,
    });

    // 在生产环境中，可以发送到错误追踪服务
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorInfo, context);
    }
  }

  /**
   * 获取所有错误
   */
  getAllErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  /**
   * 清除错误日志
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * 发送到错误追踪服务
   */
  private sendToErrorService(errorInfo: ErrorInfo, context?: string): void {
    // 这里可以集成 Sentry, Bugsnag 等错误追踪服务
    // 例如: Sentry.captureException(error);
  }
}

/**
 * 全局错误处理器
 */
export function handleError(error: any, context?: string): ErrorInfo {
  const logger = ErrorLogger.getInstance();
  logger.log(error, context);

  return {
    type: getErrorType(error),
    message: getErrorMessage(error),
    code: error?.code,
    statusCode: error?.statusCode,
    details: error?.details,
  };
}

/**
 * React 错误边界使用
 */
export function logReactError(error: Error, errorInfo: any): void {
  const logger = ErrorLogger.getInstance();
  logger.log(
    new AppError(
      error.message,
      'REACT_ERROR',
      500,
      { componentStack: errorInfo.componentStack }
    ),
    'ReactErrorBoundary'
  );
}

/**
 * 异步错误包装器
 */
export function asyncErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, fn.name);
      throw error;
    }
  }) as T;
}

/**
 * Promise 错误处理
 */
export function handlePromiseError(
  promise: Promise<any>,
  context?: string
): Promise<any> {
  return promise.catch((error) => {
    handleError(error, context);
    throw error;
  });
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

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        handleError(error, `retry (attempt ${attempt})`);
        throw error;
      }

      const currentDelay = backoff ? delay * attempt : delay;
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
    }
  }

  throw new Error('Max retry attempts reached');
}

/**
 * 防抖错误处理
 */
export function debounceErrorHandling(fn: (...args: any[]) => void, delay: number = 1000) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      try {
        fn(...args);
      } catch (error) {
        handleError(error);
      }
    }, delay);
  };
}
