'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 错误边界组件
 * 捕获子组件中的 JavaScript 错误，显示友好的错误界面
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 调用自定义错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 在生产环境中，可以将错误发送到错误追踪服务
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // 例如：sendToErrorTrackingService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误界面
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-900/50 border border-cyber-pink/30 rounded-2xl p-8 shadow-neon-pink">
              {/* 错误图标 */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyber-pink/20 blur-xl rounded-full" />
                  <div className="relative bg-cyber-pink/10 rounded-full p-6">
                    <AlertTriangle className="w-16 h-16 text-cyber-pink" />
                  </div>
                </div>
              </div>

              {/* 错误标题 */}
              <h1 className="text-3xl font-bold text-white text-center mb-4">
                哎呀！出错了
              </h1>

              {/* 错误信息 */}
              <div className="bg-gray-950/50 rounded-lg p-4 mb-6">
                <p className="text-gray-400 text-center mb-2">
                  应用程序遇到了一个意外错误
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4">
                    <summary className="text-cyber-cyan cursor-pointer hover:text-cyber-cyan/80 transition-colors">
                      查看错误详情
                    </summary>
                    <pre className="mt-2 text-xs text-gray-500 overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="neon"
                  color="cyan"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  重试
                </Button>

                <Button
                  onClick={() => window.location.href = '/'}
                  variant="neon"
                  color="purple"
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  返回首页
                </Button>
              </div>

              {/* 返回上一页 */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => window.history.back()}
                  className="text-gray-500 hover:text-cyber-cyan transition-colors text-sm"
                >
                  ← 返回上一页
                </button>
              </div>
            </div>

            {/* 错误ID */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                错误 ID: {Date.now()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 简化的错误显示组件
 */
export function ErrorFallback({
  title = '出错了',
  message,
  onRetry,
  showHome = true,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHome?: boolean;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/50 border border-cyber-pink/30 rounded-2xl p-8 shadow-neon-pink text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-cyber-pink/10 rounded-full p-4">
              <AlertTriangle className="w-12 h-12 text-cyber-pink" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>

          {message && (
            <p className="text-gray-400 mb-6">{message}</p>
          )}

          <div className="flex flex-col gap-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="neon"
                color="cyan"
                className="flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                重试
              </Button>
            )}

            {showHome && (
              <Link href="/">
                <Button
                  variant="neon"
                  color="purple"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  返回首页
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 用于异步组件错误的 Hook
 */
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    // 将错误抛给最近的 ErrorBoundary
    throw error;
  }, []);
}

export default ErrorBoundary;
