'use client';

/**
 * 增强型错误边界
 * 提供详细的错误信息和恢复选项
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { CyberButton } from '@/components/ui/CyberButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReset?: boolean;
  enableReload?: boolean;
  enableReport?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundaryAdvanced extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // 调用自定义错误处理
    this.props.onError?.(error, errorInfo);

    // 记录到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 可以在这里发送到错误追踪服务
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    const errorData = {
      id: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    // 这里可以发送到错误追踪服务
    if (process.env.NODE_ENV === 'production') {
      // 发送到错误追踪服务
      // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
    } else {
      console.table(errorData);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReport = () => {
    const { error, errorInfo, errorId } = this.state;
    const report = {
      id: errorId,
      error: {
        message: error?.message,
        stack: error?.stack,
      },
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    };

    // 复制到剪贴板
    const reportText = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(reportText).then(() => {
      alert('错误报告已复制到剪贴板！');
    });
  };

  render() {
    if (this.state.hasError) {
      // 使用自定义 fallback 或默认错误 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="cyber-card p-8 border-cyber-pink/50">
              {/* 错误图标 */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyber-pink/20 text-cyber-pink mb-4">
                  <svg
                    className="w-10 h-10"
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
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                  出错了
                </h1>
                <p className="text-gray-400">
                  抱歉，应用程序遇到了意外错误
                </p>
              </div>

              {/* 错误详情 */}
              {this.state.error && (
                <div className="mb-6 p-4 bg-cyber-darker rounded border border-cyber-border">
                  <h3 className="text-sm font-mono text-cyber-pink mb-2">
                    {this.state.error.message}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    错误 ID: {this.state.errorId}
                  </p>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-3 justify-center">
                {this.props.enableReset && (
                  <CyberButton
                    variant="primary"
                    onClick={this.handleReset}
                  >
                    重试
                  </CyberButton>
                )}
                {this.props.enableReload !== false && (
                  <CyberButton
                    variant="outline"
                    onClick={this.handleReload}
                  >
                    刷新页面
                  </CyberButton>
                )}
                {this.props.enableReport && (
                  <CyberButton
                    variant="ghost"
                    onClick={this.handleReport}
                  >
                    复制错误报告
                  </CyberButton>
                )}
              </div>

              {/* 开发环境显示详细错误 */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm text-cyber-cyan hover:text-cyber-cyan/80">
                    查看详细错误信息
                  </summary>
                  <div className="mt-4 p-4 bg-cyber-darker rounded overflow-x-auto">
                    <pre className="text-xs text-gray-400 font-mono">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-gray-500 font-mono mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>

            {/* 返回首页 */}
            <div className="text-center mt-6">
              <a
                href="/"
                className="text-cyber-cyan hover:text-cyber-cyan/80 underline"
              >
                返回首页
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
 * Hook 版本的错误边界
 */
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}
