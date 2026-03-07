'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * BlogErrorBoundary - 博客错误边界组件
 * 捕获子组件中的错误并显示友好的错误界面
 */
export class BlogErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BlogErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      errorInfo,
    });

    // 调用自定义错误处理
    this.props.onError?.(error, errorInfo);

    // 这里可以添加错误上报逻辑
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
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误界面
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8">
            <div className="text-center space-y-6">
              {/* 错误图标 */}
              <div className="text-6xl">⚠️</div>

              {/* 错误标题 */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                哎呀，出错了！
              </h1>

              {/* 错误描述 */}
              <p className="text-gray-600 dark:text-gray-400">
                页面加载时遇到了一些问题。请尝试刷新页面，或者稍后再试。
              </p>

              {/* 错误详情（开发环境） */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <summary className="cursor-pointer font-semibold mb-2">
                    错误详情（仅开发环境显示）
                  </summary>
                  <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="min-w-[120px]"
                >
                  重试
                </Button>
                <Button
                  onClick={this.handleReload}
                  className="min-w-[120px]"
                >
                  刷新页面
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  variant="ghost"
                  className="min-w-[120px]"
                >
                  返回上一页
                </Button>
              </div>

              {/* 帮助链接 */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                如果问题持续存在，请{' '}
                <a
                  href="/contact"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  联系我们
                </a>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * withErrorBoundary - HOC 包装器
 * 为任何组件添加错误边界
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <BlogErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </BlogErrorBoundary>
    );
  };
}

/**
 * useErrorHandler - Hook 用于在函数组件中手动触发错误边界
 */
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    throw error;
  }, []);
}

export default BlogErrorBoundary;
