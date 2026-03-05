/**
 * Enhanced Error Handler Utility
 * 增强的统一错误处理工具
 * CyberPress Platform
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

export interface ErrorLog {
  message: string;
  stack?: string;
  code?: string;
  context: ErrorContext;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
}

/**
 * 应用错误类
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * 网络错误类
 */
export class NetworkError extends AppError {
  constructor(message: string, statusCode?: number, context?: ErrorContext) {
    super(message, 'NETWORK_ERROR', statusCode ?? 503, context);
    this.name = 'NetworkError';
  }
}

/**
 * 验证错误类
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

/**
 * 认证错误类
 */
export class AuthError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'AUTH_ERROR', 401, context);
    this.name = 'AuthError';
  }
}

/**
 * 权限错误类
 */
export class PermissionError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'PERMISSION_ERROR', 403, context);
    this.name = 'PermissionError';
  }
}

/**
 * 未找到错误类
 */
export class NotFoundError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'NOT_FOUND', 404, context);
    this.name = 'NotFoundError';
  }
}

/**
 * 错误处理器
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 100;
  private onErrorCallback?: (error: ErrorLog) => void;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * 处理错误
   */
  handleError(error: Error | AppError, context: ErrorContext = {}): ErrorLog {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      code: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
      context,
      timestamp: Date.now(),
      level: this.getErrorLevel(error),
    };

    this.addLog(errorLog);

    if (this.onErrorCallback) {
      this.onErrorCallback(errorLog);
    }

    // 在开发环境中打印错误
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorHandler]', errorLog);
    }

    return errorLog;
  }

  /**
   * 处理异步错误
   */
  handleAsyncError(
    promise: Promise<any>,
    context: ErrorContext = {}
  ): Promise<any> {
    return promise.catch((error) => {
      throw this.handleError(error, context);
    });
  }

  /**
   * 包装异步函数以自动处理错误
   */
  wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context: ErrorContext = {}
  ): T {
    return (async (...args: any[]) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError(error as Error, context);
        throw error;
      }
    }) as T;
  }

  /**
   * 获取错误级别
   */
  private getErrorLevel(error: Error): 'error' | 'warning' | 'info' {
    if (error instanceof ValidationError) {
      return 'warning';
    }
    return 'error';
  }

  /**
   * 添加错误日志
   */
  private addLog(log: ErrorLog): void {
    this.errorLogs.push(log);

    // 保持日志数量在限制内
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs);
    }
  }

  /**
   * 获取所有错误日志
   */
  getLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  /**
   * 清空错误日志
   */
  clearLogs(): void {
    this.errorLogs = [];
  }

  /**
   * 设置错误回调
   */
  onError(callback: (error: ErrorLog) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * 获取错误统计
   */
  getStats(): {
    total: number;
    byLevel: Record<string, number>;
    byCode: Record<string, number>;
  } {
    const stats = {
      total: this.errorLogs.length,
      byLevel: {} as Record<string, number>,
      byCode: {} as Record<string, number>,
    };

    for (const log of this.errorLogs) {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.byCode[log.code] = (stats.byCode[log.code] || 0) + 1;
    }

    return stats;
  }

  /**
   * 导出错误日志
   */
  exportLogs(): string {
    return JSON.stringify(this.errorLogs, null, 2);
  }

  /**
   * 导入错误日志
   */
  importLogs(json: string): void {
    try {
      const logs = JSON.parse(json) as ErrorLog[];
      this.errorLogs = logs;
    } catch (error) {
      this.handleError(new Error('Failed to import error logs'));
    }
  }
}

/**
 * 全局错误处理器实例
 */
export const errorHandler = ErrorHandler.getInstance();

/**
 * 安全执行函数
 */
export function safeExecute<T>(
  fn: () => T,
  defaultValue: T,
  context?: ErrorContext
): T {
  try {
    return fn();
  } catch (error) {
    errorHandler.handleError(error as Error, context);
    return defaultValue;
  }
}

/**
 * 安全执行异步函数
 */
export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  defaultValue: T,
  context?: ErrorContext
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    errorHandler.handleError(error as Error, context);
    return defaultValue;
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
    context?: ErrorContext;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    context = {},
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        errorHandler.handleError(lastError, {
          ...context,
          attempt,
          maxAttempts,
        });
        throw lastError;
      }

      const currentDelay = backoff ? delay * attempt : delay;
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }

  throw lastError;
}

/**
 * 断言
 */
export function assert(
  condition: boolean,
  message: string,
  code?: string
): asserts condition {
  if (!condition) {
    throw new AppError(message, code || 'ASSERTION_FAILED');
  }
}

/**
 * 不可达代码检查
 */
export function assertUnreachable(x: never): never {
  throw new AppError(`Unexpected value: ${x}`, 'UNREACHABLE_CODE');
}
