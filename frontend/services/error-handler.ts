/**
 * 全局错误处理器
 * 统一处理应用中的各种错误
 */

import React, { Component, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface AppError {
  name: string;
  message: string;
  code?: string | number;
  stack?: string;
  context?: Record<string, any>;
  timestamp: number;
}

export type ErrorLevel = 'info' | 'warning' | 'error' | 'fatal';

export interface ErrorLog {
  error: AppError;
  level: ErrorLevel;
  userAgent: string;
  url: string;
  userId?: string;
}

/**
 * 错误类型
 */
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTH = 'AUTH_ERROR',
  PERMISSION = 'PERMISSION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

/**
 * 创建应用错误对象
 */
export function createAppError(
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  context?: Record<string, any>
): AppError {
  return {
    name: type,
    message,
    code: type,
    context,
    timestamp: Date.now(),
  };
}

/**
 * 错误处理器类
 */
class ErrorHandler {
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 100;
  private onErrorCallback?: (error: AppError, level: ErrorLevel) => void;

  /**
   * 处理错误
   */
  handle(error: Error | AppError | string, level: ErrorLevel = 'error'): void {
    const appError = this.normalizeError(error);
    const errorLog: ErrorLog = {
      error: appError,
      level,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      userId: this.getUserId(),
    };

    this.logError(errorLog);
    this.notifyUser(appError, level);
    this.onErrorCallback?.(appError, level);

    // 在开发环境打印错误
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorHandler]', appError);
    }
  }

  /**
   * 处理网络错误
   */
  handleNetworkError(error: any): void {
    const message = error?.response?.data?.message || error?.message || '网络请求失败';
    const appError = createAppError(message, ErrorType.NETWORK, {
      status: error?.response?.status,
      url: error?.config?.url,
    });
    this.handle(appError, 'error');
  }

  /**
   * 处理验证错误
   */
  handleValidationError(errors: Record<string, string[]>): void {
    const message = Object.values(errors).flat().join('; ');
    const appError = createAppError(message || '表单验证失败', ErrorType.VALIDATION, { errors });
    this.handle(appError, 'warning');
  }

  /**
   * 处理认证错误
   */
  handleAuthError(message: string = '认证失败，请重新登录'): void {
    const appError = createAppError(message, ErrorType.AUTH);
    this.handle(appError, 'error');

    // 清除认证信息并跳转登录
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1500);
    }
  }

  /**
   * 处理权限错误
   */
  handlePermissionError(message: string = '您没有权限执行此操作'): void {
    const appError = createAppError(message, ErrorType.PERMISSION);
    this.handle(appError, 'warning');
  }

  /**
   * 处理404错误
   */
  handleNotFoundError(resource: string = '请求的资源'): void {
    const appError = createAppError(`${resource}不存在`, ErrorType.NOT_FOUND, { resource });
    this.handle(appError, 'warning');
  }

  /**
   * 处理服务器错误
   */
  handleServerError(message: string = '服务器错误，请稍后重试'): void {
    const appError = createAppError(message, ErrorType.SERVER);
    this.handle(appError, 'error');
  }

  /**
   * 标准化错误对象
   */
  private normalizeError(error: Error | AppError | string): AppError {
    if (typeof error === 'string') {
      return createAppError(error);
    }

    if ('name' in error && 'message' in error && 'timestamp' in error) {
      return error as AppError;
    }

    return createAppError(error.message, ErrorType.UNKNOWN, {
      stack: error.stack,
      ...error,
    });
  }

  /**
   * 记录错误日志
   */
  private logError(errorLog: ErrorLog): void {
    this.errorLogs.push(errorLog);

    // 保持日志数量不超过最大值
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs.shift();
    }

    // 发送到服务器
    this.sendToServer(errorLog);
  }

  /**
   * 通知用户
   */
  private notifyUser(error: AppError, level: ErrorLevel): void {
    const messages: Record<ErrorLevel, string> = {
      info: 'info',
      warning: '⚠️',
      error: '❌',
      fatal: '💀',
    };

    const prefix = messages[level] || '';
    toast.error(`${prefix} ${error.message}`);
  }

  /**
   * 发送错误到服务器
   */
  private async sendToServer(errorLog: ErrorLog): Promise<void> {
    try {
      if (typeof window === 'undefined') return;

      await fetch('/api/v1/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorLog),
      });
    } catch (e) {
      // 忽略发送日志失败的错误
      console.warn('Failed to send error log to server:', e);
    }
  }

  /**
   * 获取用户ID
   */
  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem('user_id') || undefined;
  }

  /**
   * 设置错误回调
   */
  onError(callback: (error: AppError, level: ErrorLevel) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * 获取错误日志
   */
  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  /**
   * 清除错误日志
   */
  clearErrorLogs(): void {
    this.errorLogs = [];
  }
}

// 创建全局错误处理器实例
export const errorHandler = new ErrorHandler();

/**
 * 错误边界组件
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    const appError = createAppError(error.message, ErrorType.UNKNOWN, {
      componentStack: errorInfo.componentStack,
      stack: error.stack,
    });

    errorHandler.handle(appError, 'fatal');
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">💀</div>
              <h1 className="text-2xl font-bold text-cyber-cyan mb-2">出错了</h1>
              <p className="text-cyber-muted mb-4">应用遇到了一个错误</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-cyber-cyan text-cyber-dark rounded-lg hover:opacity-80 transition-opacity"
              >
                重新加载
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * 高阶组件：为组件添加错误处理
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.ComponentType<P> {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Hook：使用错误处理
 */
export function useErrorHandler() {
  const handleAsync = React.useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        errorHandler.handleNetworkError(error);
        return null;
      }
    },
    []
  );

  return {
    errorHandler,
    handleAsync,
  };
}

export default errorHandler;
