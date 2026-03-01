/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，记录错误并显示备用 UI
 */

'use client';

import React from 'react';
import Button from './Button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean; // 是否隔离错误，阻止错误冒泡
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string; // 用于追踪错误ID
}

interface FallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  errorId: string;
  resetError: () => void;
}

// 默认错误UI组件
const DefaultFallback: React.FC<FallbackProps> = ({
  error,
  errorId,
  resetError
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  // 复制错误信息到剪贴板
  const copyErrorInfo = () => {
    const errorText = `
Error ID: ${errorId}
Message: ${error.message}
Stack: ${error.stack}
Timestamp: ${new Date().toISOString()}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      // 可以添加一个 toast 提示
      console.log('Error info copied to clipboard');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-2xl w-full bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl shadow-red-500/20">
        {/* 错误图标 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            {/* 光晕效果 */}
            <div className="absolute inset-0 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-ping" />
          </div>
        </div>

        {/* 错误标题 */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          出现了错误
        </h1>
        <p className="text-gray-400 text-center mb-6">
          抱歉，应用程序遇到了意外错误
        </p>

        {/* 错误ID */}
        <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">错误ID:</span>
            <code className="text-sm text-red-400 font-mono">{errorId}</code>
          </div>
        </div>

        {/* 错误信息 */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm font-mono break-all">
            {error.message}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            onClick={resetError}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
          >
            <svg
              className="w-4 h-4 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            刷新页面
          </Button>

          <Button
            onClick={copyErrorInfo}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            复制错误信息
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* 详细信息切换 */}
        <details className="group">
          <summary
            onClick={(e) => {
              e.preventDefault();
              setIsDetailsOpen(!isDetailsOpen);
            }}
            className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isDetailsOpen ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            查看详细错误信息
          </summary>

          {isDetailsOpen && (
            <div className="mt-4 bg-gray-800/50 rounded-lg p-4 overflow-auto max-h-64">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all">
                {error.stack}
              </pre>
            </div>
          )}
        </details>
      </div>
    </div>
  );
};

/**
 * 错误边界组件
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 更新状态
    this.setState({
      error,
      errorInfo,
    });

    // 调用错误回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 记录到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 可以在这里上报错误到错误追踪服务
    this.logErrorToService(error, errorInfo);
  }

  // 生成唯一的错误ID
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 上报错误到服务
  private logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // 这里可以集成 Sentry, LogRocket 等错误追踪服务
    const errorPayload = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // 示例：发送到错误追踪API
    fetch('/api/error-tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorPayload),
    }).catch((err) => {
      console.error('Failed to report error:', err);
    });
  }

  // 重置错误状态
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo!}
          errorId={this.state.errorId}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Hook: 在函数组件中使用错误边界
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
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundary;
}

export default ErrorBoundary;
