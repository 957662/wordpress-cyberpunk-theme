'use client';

/**
 * 全局错误边界组件
 * 捕获并处理 React 错误
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo);
    
    // 调用错误回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 上报错误到分析平台
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ trackError }) => {
        trackError(error, {
          componentStack: errorInfo.componentStack,
          digest: errorInfo.digest,
        });
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义错误 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
          <div className="max-w-md w-full">
            <div className="bg-cyber-muted border border-cyber-cyan/30 rounded-lg p-8 relative overflow-hidden">
              {/* 装饰性扫描线 */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="w-full h-1 bg-cyber-cyan absolute top-1/4 left-0"></div>
                <div className="w-full h-1 bg-cyber-cyan absolute top-2/4 left-0"></div>
                <div className="w-full h-1 bg-cyber-cyan absolute top-3/4 left-0"></div>
              </div>

              {/* 故障效果图标 */}
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto bg-cyber-cyan/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-cyber-cyan"
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

              {/* 标题 */}
              <h1 className="text-2xl font-bold text-center text-cyber-cyan mb-4 font-['Orbitron']">
                系统错误
              </h1>

              {/* 描述 */}
              <p className="text-gray-400 text-center mb-6">
                哎呀！页面遇到了一些问题。我们的团队已经收到通知，正在修复中。
              </p>

              {/* 错误详情（仅开发环境） */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400 mb-2">
                    查看错误详情
                  </summary>
                  <pre className="bg-black/50 p-4 rounded text-xs text-red-400 overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-4">
                <Button
                  variant="neon"
                  className="flex-1"
                  onClick={() => window.location.reload()}
                >
                  刷新页面
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.history.back()}
                >
                  返回
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 使用错误边界的 Hook
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('捕获到错误:', error, errorInfo);
    
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ trackError }) => {
        trackError(error, errorInfo);
      });
    }
  };
}
