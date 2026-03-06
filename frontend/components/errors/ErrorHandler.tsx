'use client';

import React, { ComponentType } from 'react';
import { AlertCircle, Wifi, Database, AlertTriangle } from 'lucide-react';
import { ErrorFallback } from './ErrorBoundary';

// =====================================================
// 错误类型定义
// =====================================================

export enum ErrorType {
  NETWORK = 'network',
  API = 'api',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: any;
}

// =====================================================
// 错误识别函数
// =====================================================

export function identifyError(error: any): AppError {
  // 网络错误
  if (!navigator.onLine) {
    return {
      type: ErrorType.NETWORK,
      message: '网络连接已断开，请检查您的网络设置',
    };
  }

  // Fetch 错误
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: ErrorType.NETWORK,
      message: '网络请求失败，请稍后重试',
    };
  }

  // HTTP 状态码错误
  if (error.response || error.status) {
    const status = error.response?.status || error.status;

    switch (status) {
      case 400:
        return {
          type: ErrorType.VALIDATION,
          message: '请求数据格式错误',
          code: status,
        };
      case 401:
      case 403:
        return {
          type: ErrorType.UNAUTHORIZED,
          message: '您没有权限执行此操作',
          code: status,
        };
      case 404:
        return {
          type: ErrorType.NOT_FOUND,
          message: '请求的资源不存在',
          code: status,
        };
      case 422:
        return {
          type: ErrorType.VALIDATION,
          message: '提交的数据验证失败',
          code: status,
        };
      case 500:
      case 502:
      case 503:
        return {
          type: ErrorType.SERVER,
          message: '服务器暂时无法响应，请稍后重试',
          code: status,
        };
      default:
        return {
          type: ErrorType.API,
          message: error.response?.data?.message || error.message || '请求失败',
          code: status,
        };
    }
  }

  // GraphQL 错误
  if (error.graphQLErrors) {
    return {
      type: ErrorType.API,
      message: error.graphQLErrors[0]?.message || 'GraphQL 查询失败',
      details: error.graphQLErrors,
    };
  }

  // 默认错误
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || '发生了未知错误',
    details: error,
  };
}

// =====================================================
// 错误显示组件
// =====================================================

interface ErrorHandlerProps {
  error: AppError | Error | any;
  onRetry?: () => void;
  showHome?: boolean;
  className?: string;
}

export function ErrorHandler({
  error,
  onRetry,
  showHome = true,
  className = '',
}: ErrorHandlerProps) {
  const appError = error instanceof Error ? identifyError(error) : error;

  const getErrorIcon = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return <Wifi className="w-12 h-12 text-cyber-pink" />;
      case ErrorType.API:
      case ErrorType.SERVER:
        return <Database className="w-12 h-12 text-cyber-cyan" />;
      case ErrorType.VALIDATION:
        return <AlertCircle className="w-12 h-12 text-cyber-yellow" />;
      case ErrorType.NOT_FOUND:
        return <AlertTriangle className="w-12 h-12 text-cyber-purple" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-cyber-pink" />;
    }
  };

  const getErrorColor = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return 'cyber-pink';
      case ErrorType.API:
      case ErrorType.SERVER:
        return 'cyber-cyan';
      case ErrorType.VALIDATION:
        return 'cyber-yellow';
      case ErrorType.NOT_FOUND:
        return 'cyber-purple';
      default:
        return 'cyber-pink';
    }
  };

  const errorColor = getErrorColor();

  return (
    <div className={`min-h-[400px] flex items-center justify-center ${className}`}>
      <div className="max-w-md w-full px-4">
        <div className={`bg-gray-900/50 border border-${errorColor}/30 rounded-2xl p-8 shadow-neon-${errorColor} text-center`}>
          {/* 错误图标 */}
          <div className="flex justify-center mb-6">
            <div className={`bg-${errorColor}/10 rounded-full p-4`}>
              {getErrorIcon()}
            </div>
          </div>

          {/* 错误标题 */}
          <h2 className="text-2xl font-bold text-white mb-2">
            {getErrorTitle(appError.type)}
          </h2>

          {/* 错误信息 */}
          <p className="text-gray-400 mb-6">{appError.message}</p>

          {/* 错误详情（开发模式） */}
          {process.env.NODE_ENV === 'development' && appError.details && (
            <details className="mb-6 text-left">
              <summary className="text-cyber-cyan cursor-pointer hover:text-cyber-cyan/80 transition-colors text-sm">
                查看详细信息
              </summary>
              <pre className="mt-2 text-xs text-gray-500 overflow-auto max-h-40 bg-gray-950/50 rounded p-2">
                {JSON.stringify(appError.details, null, 2)}
              </pre>
            </details>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-col gap-3">
            {onRetry && appError.type !== ErrorType.NOT_FOUND && (
              <button
                onClick={onRetry}
                className={`bg-gradient-to-r from-${errorColor} to-${errorColor}/80 hover:from-${errorColor}/80 hover:to-${errorColor} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-neon-${errorColor} hover:shadow-neon-${errorColor}-hover`}
              >
                重试
              </button>
            )}

            {showHome && (
              <a
                href="/"
                className="text-gray-500 hover:text-cyber-cyan transition-colors text-sm"
              >
                返回首页
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case ErrorType.NETWORK:
      return '网络错误';
    case ErrorType.API:
      return '请求失败';
    case ErrorType.VALIDATION:
      return '数据验证失败';
    case ErrorType.NOT_FOUND:
      return '页面不存在';
    case ErrorType.UNAUTHORIZED:
      return '权限不足';
    case ErrorType.SERVER:
      return '服务器错误';
    default:
      return '出错了';
  }
}

// =====================================================
// Higher-Order Components
// =====================================================

interface WithErrorHandlingProps {
  fallback?: ComponentType<{ error: AppError; onRetry?: () => void }>;
  onError?: (error: AppError) => void;
}

export function withErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorHandlingProps = {}
) {
  const { fallback, onError } = options;

  return function WithErrorHandlingWrapper(props: P & { error?: any; onRetry?: () => void }) {
    const { error, onRetry, ...rest } = props;

    if (error) {
      const appError = identifyError(error);

      // 调用错误回调
      if (onError) {
        onError(appError);
      }

      // 使用自定义 fallback 或默认 ErrorHandler
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent error={appError} onRetry={onRetry} />;
      }

      return <ErrorHandler error={appError} onRetry={onRetry} />;
    }

    return <WrappedComponent {...(rest as P)} />;
  };
}

// =====================================================
// 错误 Hook
// =====================================================

export function useErrorHandler() {
  const handleError = React.useCallback(
    (error: any, callback?: (error: AppError) => void) => {
      const appError = identifyError(error);

      if (callback) {
        callback(appError);
      }

      // 在开发环境打印错误
      if (process.env.NODE_ENV === 'development') {
        console.error('Error handled:', appError);
      }

      // 在生产环境发送到错误追踪服务
      if (process.env.NODE_ENV === 'production') {
        // sendToErrorTracking(appError);
      }

      return appError;
    },
    []
  );

  const handleAsyncError = React.useCallback(
    async <T,>(promise: Promise<T>): Promise<T> => {
      try {
        return await promise;
      } catch (error) {
        throw handleError(error);
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
    identifyError,
  };
}

// =====================================================
// 错误 Toast 通知
// =====================================================

export function showErrorToast(error: AppError | Error) {
  const appError = error instanceof Error ? identifyError(error) : error;

  // 这里可以集成你的 Toast 通知系统
  // 例如：toast.error(appError.message);

  console.error('Toast error:', appError.message);
}

// =====================================================
// 默认导出
// =====================================================

export default ErrorHandler;
