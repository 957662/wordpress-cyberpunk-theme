/**
 * 增强错误边界组件
 * 捕获并处理 React 组件树中的错误
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorBoundaryEnhancedProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  enableReset?: boolean;
  enableReload?: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundaryEnhanced extends Component<
  ErrorBoundaryEnhancedProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryEnhancedProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // 调用错误回调
    this.props.onError?.(error, errorInfo);

    // 记录错误到控制台
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // 可以在这里将错误发送到错误追踪服务
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // 使用自定义 fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full">
            {/* 错误图标 */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                <div className="relative bg-red-500 rounded-full p-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* 错误标题 */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                哎呀，出错了！
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                页面遇到了一些问题，请稍后再试
              </p>
            </div>

            {/* 错误详情 */}
            {this.props.showErrorDetails && this.state.error && (
              <details className="mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Bug size={16} />
                  <span>错误详情</span>
                </summary>
                <div className="mt-3 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      错误信息：
                    </span>
                    <pre className="mt-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        组件堆栈：
                      </span>
                      <pre className="mt-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* 操作按钮 */}
            <div className="space-y-3">
              {this.props.enableReset && (
                <Button
                  onClick={this.handleReset}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重试
                </Button>
              )}

              {this.props.enableReload && (
                <Button
                  onClick={this.handleReload}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新页面
                </Button>
              )}

              <Button
                onClick={() => (window.location.href = '/')}
                className="w-full"
                variant="ghost"
              >
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </div>

            {/* 帮助信息 */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>问题持续存在？</p>
              <a
                href="mailto:support@example.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                联系支持团队
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 函数式错误边界 Hook
 */
export function useErrorHandler() {
  return [ErrorBoundaryEnhanced] as const;
}

/**
 * 简化版错误边界
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryEnhancedProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryEnhanced {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryEnhanced>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

export default ErrorBoundaryEnhanced;
