'use client';

import React, { Component, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorInfo {
  componentStack: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReset?: boolean;
  enableDetails?: boolean;
  showDevInfo?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * 增强的错误边界组件
 * 提供友好的错误显示和恢复机制
 */
export class ErrorBoundaryEnhanced extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误到状态
    this.setState({
      errorInfo,
    });

    // 调用自定义错误处理
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 在开发环境打印错误
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

    // 可选：发送错误到日志服务
    this.logErrorToService(error, errorInfo);
  }

  /**
   * 发送错误到日志服务
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // 这里可以集成第三方日志服务，如 Sentry, LogRocket 等
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    // 示例：发送到自己的 API
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData),
    // }).catch(console.error);

    // 在开发环境保存到 sessionStorage 方便调试
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const errors = JSON.parse(sessionStorage.getItem('errors') || '[]');
      errors.push(errorData);
      sessionStorage.setItem('errors', JSON.stringify(errors.slice(-10))); // 只保留最近10个
    }
  }

  /**
   * 重置错误状态
   */
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * 刷新页面
   */
  private handleReload = () => {
    window.location.reload();
  };

  /**
   * 返回首页
   */
  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo, errorId } = this.state;
    const {
      children,
      fallback,
      enableReset = true,
      enableDetails = process.env.NODE_ENV === 'development',
      showDevInfo = process.env.NODE_ENV === 'development',
    } = this.props;

    if (hasError && error) {
      // 如果提供了自定义 fallback，使用它
      if (fallback) {
        return <>{fallback}</>;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            <div className="bg-gray-900/50 border border-red-500/30 rounded-2xl p-8 shadow-2xl shadow-red-500/20">
              {/* 错误图标 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center"
              >
                <svg
                  className="w-10 h-10 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </motion.div>

              {/* 错误标题 */}
              <h1 className="text-3xl font-bold text-white text-center mb-4">
                Oops! Something went wrong
              </h1>

              {/* 错误消息 */}
              <p className="text-gray-400 text-center mb-6">
                {error.message || 'An unexpected error occurred'}
              </p>

              {/* 错误 ID */}
              {errorId && (
                <p className="text-gray-600 text-sm text-center mb-6">
                  Error ID: <code className="text-cyan-400">{errorId}</code>
                </p>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                {enableReset && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={this.handleReset}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold"
                  >
                    Try Again
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleReload}
                  className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-semibold hover:border-gray-600"
                >
                  Reload Page
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleGoHome}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Go Home
                </motion.button>
              </div>

              {/* 开发者信息 */}
              {(showDevInfo || enableDetails) && errorInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-gray-800"
                >
                  <details className="text-left">
                    <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 mb-4">
                      Error Details (for developers)
                    </summary>
                    <div className="space-y-4">
                      {/* 错误堆栈 */}
                      {error.stack && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">
                            Error Stack:
                          </h4>
                          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto text-xs text-red-400">
                            {error.stack}
                          </pre>
                        </div>
                      )}

                      {/* 组件堆栈 */}
                      {errorInfo.componentStack && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">
                            Component Stack:
                          </h4>
                          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto text-xs text-yellow-400">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}

                      {/* 复制错误信息 */}
                      <button
                        onClick={() => {
                          const errorText = `Error ID: ${errorId}\nMessage: ${error.message}\n\nStack:\n${error.stack}\n\nComponent Stack:\n${errorInfo.componentStack}`;
                          navigator.clipboard.writeText(errorText);
                        }}
                        className="px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        Copy Error Info
                      </button>
                    </div>
                  </details>
                </motion.div>
              )}

              {/* 帮助信息 */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>If this problem persists, please contact support.</p>
                <p className="mt-1">Include the Error ID in your message.</p>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return <>{children}</>;
  }
}

/**
 * Hook: 用于在函数组件中处理错误
 */
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    throw error;
  }, []);
}

/**
 * 高阶组件: 为组件添加错误边界
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryEnhanced {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryEnhanced>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

/**
 * 简单的 Fallback 组件
 */
export function ErrorFallback({
  error = 'Something went wrong',
  onReset,
}: {
  error?: string | Error;
  onReset?: () => void;
}) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Oops! Something went wrong
        </h2>
        {errorMessage && (
          <p className="text-gray-400 mb-6">{errorMessage}</p>
        )}
        {onReset && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold"
          >
            Try Again
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default ErrorBoundaryEnhanced;
