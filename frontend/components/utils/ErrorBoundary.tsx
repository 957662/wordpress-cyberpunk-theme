'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  resetOnPropsChange?: boolean;
  enableRetry?: boolean;
  enableReport?: boolean;
  reportEndpoint?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Send to error reporting service
    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error boundary when props change if enabled
    if (
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children &&
      this.state.hasError
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
    });
  };

  handleRetry = () => {
    this.setState(
      (prevState) => ({
        retryCount: prevState.retryCount + 1,
      }),
      () => {
        this.resetErrorBoundary();
      }
    );
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  reportError = async (error: Error, errorInfo: ErrorInfo) => {
    const { enableReport, reportEndpoint } = this.props;

    if (!enableReport || !reportEndpoint) return;

    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      await fetch(reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  };

  render() {
    const { hasError, error, errorInfo, errorId } = this.state;
    const {
      children,
      fallback,
      showErrorDetails = process.env.NODE_ENV === 'development',
      enableRetry = true,
      enableReport = true,
    } = this.props;

    if (!hasError) {
      return children;
    }

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Default error UI
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
      >
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                哎呀，出错了！
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                应用程序遇到了意外错误。我们已记录此问题，请稍后重试。
              </p>
              {errorId && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  错误 ID: <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{errorId}</code>
                </p>
              )}
            </div>

            {/* Error Details (Development Only) */}
            {showErrorDetails && error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-auto max-h-60">
                <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
                {errorInfo && errorInfo.componentStack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Component Stack
                    </summary>
                    <pre className="text-xs text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {enableRetry && this.state.retryCount < 3 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleRetry}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-cyber-cyan hover:bg-cyber-cyan/90 text-black font-semibold rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  重试
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                返回首页
              </motion.button>

              {enableReport && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Error ID: ${errorId}\nMessage: ${error?.message}\nStack: ${error?.stack}`
                    );
                    alert('错误信息已复制到剪贴板');
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
                >
                  <Bug className="w-4 h-4" />
                  复制错误
                </motion.button>
              )}
            </div>

            {/* Retry Count Warning */}
            {this.state.retryCount >= 3 && (
              <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                  ⚠️ 多次重试失败，请尝试返回首页或刷新页面
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
}

export default ErrorBoundary;

// Functional wrapper for easier usage
export interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
