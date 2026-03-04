'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * 错误边界组件
 * 捕获子组件中的JavaScript错误，显示备用UI
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);

    // 发送错误到监控服务
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: { react: { componentStack: errorInfo.componentStack } },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary-fallback flex flex-col items-center justify-center min-h-[400px] p-8 bg-cyber-dark/50 border border-cyber-pink/30 rounded-lg">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-cyber-pink mb-4">
              出错了
            </h2>
            <p className="text-cyber-muted mb-6 text-center">
              抱歉，页面遇到了一些问题。请刷新页面重试。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyber-cyan text-cyber-dark font-semibold rounded-lg hover:bg-cyber-cyan/80 transition-colors"
            >
              刷新页面
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-cyber-darker rounded-lg border border-cyber-border">
                <summary className="cursor-pointer text-cyber-yellow font-semibold mb-2">
                  错误详情 (开发模式)
                </summary>
                <pre className="text-sm text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * 异步组件错误边界
 * 用于处理异步操作中的错误
 */
export function AsyncErrorBoundary({
  children,
  error,
  reset,
}: {
  children: ReactNode;
  error?: Error | null;
  reset?: () => void;
}) {
  if (error) {
    return (
      <div className="async-error-boundary flex flex-col items-center justify-center p-8 bg-cyber-dark/50 border border-cyber-pink/30 rounded-lg">
        <div className="text-4xl mb-4">❌</div>
        <h3 className="text-xl font-bold text-cyber-pink mb-2">
          操作失败
        </h3>
        <p className="text-cyber-muted mb-4">{error.message}</p>
        {reset && (
          <button
            onClick={reset}
            className="px-4 py-2 bg-cyber-cyan text-cyber-dark font-semibold rounded-lg hover:bg-cyber-cyan/80 transition-colors"
          >
            重试
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * 全局错误处理器
 */
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorListeners: Array<(error: Error) => void> = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      // 捕获未处理的Promise拒绝
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        this.notifyListeners(
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason))
        );
      });

      // 捕获全局错误
      window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        this.notifyListeners(event.error);
      });
    }
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  /**
   * 注册错误监听器
   */
  onError(callback: (error: Error) => void): () => void {
    this.errorListeners.push(callback);
    return () => {
      this.errorListeners = this.errorListeners.filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(error: Error): void {
    this.errorListeners.forEach((callback) => {
      try {
        callback(error);
      } catch (err) {
        console.error('Error in error listener:', err);
      }
    });
  }

  /**
   * 手动报告错误
   */
  reportError(error: Error): void {
    this.notifyListeners(error);
  }
}

/**
 * 错误日志收集器
 */
export class ErrorCollector {
  private errors: Array<{
    error: Error;
    timestamp: Date;
    context?: Record<string, any>;
  }> = [];
  private maxErrors = 50;

  /**
   * 记录错误
   */
  record(error: Error, context?: Record<string, any>): void {
    this.errors.push({
      error,
      timestamp: new Date(),
      context,
    });

    // 保持错误数量在限制内
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
  }

  /**
   * 获取所有错误
   */
  getAll(): Array<{
    error: Error;
    timestamp: Date;
    context?: Record<string, any>;
  }> {
    return [...this.errors];
  }

  /**
   * 清空错误
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * 获取最近的错误
   */
  getRecent(count = 10): Array<{
    error: Error;
    timestamp: Date;
    context?: Record<string, any>;
  }> {
    return this.errors.slice(-count);
  }

  /**
   * 导出错误日志
   */
  export(): string {
    return JSON.stringify(
      this.errors.map(({ error, timestamp, context }) => ({
        message: error.message,
        stack: error.stack,
        timestamp: timestamp.toISOString(),
        context,
      })),
      null,
      2
    );
  }
}

/**
 * React Hook for error handling
 */
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error) => {
    GlobalErrorHandler.getInstance().reportError(error);
  }, []);

  const handleErrorWithCallback = React.useCallback(
    (asyncFn: () => Promise<void>) => {
      return async (...args: any[]) => {
        try {
          await asyncFn(...args);
        } catch (error) {
          handleError(
            error instanceof Error ? error : new Error(String(error))
          );
        }
      };
    },
    [handleError]
  );

  return {
    handleError,
    handleErrorWithCallback,
  };
}

/**
 * 高阶组件：为组件添加错误处理
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * 错误恢复组件
 */
export function ErrorRecovery({
  error,
  reset,
  children,
}: {
  error: Error | null;
  reset: () => void;
  children: ReactNode;
}) {
  React.useEffect(() => {
    if (error) {
      console.error('Error in ErrorRecovery:', error);
    }
  }, [error]);

  if (error) {
    return (
      <div className="error-recovery flex flex-col items-center justify-center p-8">
        <div className="text-4xl mb-4">🔄</div>
        <h3 className="text-xl font-bold text-cyber-pink mb-4">
          需要恢复
        </h3>
        <p className="text-cyber-muted mb-6 text-center">
          遇到错误，点击下方按钮重试
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-cyber-cyan text-cyber-dark font-semibold rounded-lg hover:bg-cyber-cyan/80 transition-colors"
        >
          恢复
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default ErrorBoundary;
