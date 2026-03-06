/**
 * ErrorBoundary Component
 * 错误边界组件
 *
 * 捕获和处理React组件树中的JavaScript错误
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui';

// ==================== 错误边界Props ====================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

// ==================== 错误边界State ====================

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// ==================== 默认错误UI ====================

function DefaultErrorFallback({
  error,
  resetErrorBoundary
}: {
  error?: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
      <div className="cyber-card max-w-2xl w-full p-8 space-y-6">
        {/* 错误图标 */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-cyber-pink/10 rounded-full animate-ping"></div>
            <div className="relative w-24 h-24 flex items-center justify-center text-cyber-pink">
              <svg
                className="w-12 h-12"
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
            </div>
          </div>
        </div>

        {/* 错误标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-cyber-cyan">
            系统错误
          </h1>
          <p className="text-cyber-muted">
            抱歉，应用程序遇到了意外错误
          </p>
        </div>

        {/* 错误详情 */}
        {error && (
          <div className="bg-cyber-dark/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-cyber-pink">
              {error.name}
            </p>
            <p className="text-sm text-cyber-muted break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="neon"
            onClick={resetErrorBoundary}
            className="w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            重新加载
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            返回首页
          </Button>
        </div>

        {/* 技术支持 */}
        <div className="text-center text-sm text-cyber-muted">
          <p>如果问题持续存在，请联系技术支持</p>
          <p className="mt-1">
            <a
              href="mailto:support@cyberpress.com"
              className="text-cyber-cyan hover:underline"
            >
              support@cyberpress.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== 错误边界组件 ====================

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 更新状态
    this.setState({
      error,
      errorInfo,
    });

    // 调用错误回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 在生产环境中，可以发送错误到监控服务
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // 发送错误到监控服务（如 Sentry）
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // TODO: 发送到实际的错误监控服务
    console.log('Error logged to service:', errorData);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 否则使用默认错误UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// ==================== 函数式错误边界Hook ====================

export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}

// ==================== 错误Fallback组件 ====================

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary
}: ErrorFallbackProps) {
  return (
    <DefaultErrorFallback
      error={error}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
}

// ==================== 高阶组件 ====================

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

// ==================== 使用示例 ====================

/*
// 基础使用
function App() {
  return (
    <ErrorBoundary>
      <YourComponentTree />
    </ErrorBoundary>
  );
}

// 使用自定义fallback
function App() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong!</div>}
      onError={(error, errorInfo) => {
        console.log('Error:', error);
      }}
    >
      <YourComponentTree />
    </ErrorBoundary>
  );
}

// 使用高阶组件
const SafeComponent = withErrorBoundary(RiskyComponent, {
  fallback: <CustomErrorScreen />,
});

// 使用Hook
function MyComponent() {
  const handleError = useErrorHandler();

  const handleClick = () => {
    try {
      // 一些可能出错的操作
    } catch (error) {
      handleError(error as Error);
    }
  };

  return <button onClick={handleClick}>Click me</button>;
}
*/
