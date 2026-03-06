'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // 调用自定义错误处理
    this.props.onError?.(error, errorInfo);

    // 上报错误到监控服务
    if (typeof window !== 'undefined') {
      // 这里可以集成错误监控服务
      // 例如: Sentry, LogRocket 等
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoBack = () => {
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // 使用自定义 fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full"
          >
            <div className="bg-deep-black/80 backdrop-blur-sm border border-cyber-border rounded-lg p-8">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-cyber-pink/20 rounded-full blur-xl" />
                  <AlertCircle className="relative w-20 h-20 text-cyber-pink" />
                </motion.div>
              </div>

              {/* Error Message */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">出错了</h1>
                <p className="text-gray-400">
                  抱歉，应用程序遇到了意外错误。请尝试刷新页面或返回首页。
                </p>
              </div>

              {/* Error Details (仅在开发环境显示) */}
              {this.props.showDetails && process.env.NODE_ENV === 'development' && (
                <details className="mb-6 bg-cyber-muted/10 rounded-lg p-4 border border-cyber-border">
                  <summary className="cursor-pointer text-sm font-mono text-cyber-cyan mb-2">
                    错误详情
                  </summary>
                  <div className="mt-2 text-xs font-mono text-gray-300 space-y-2">
                    {this.state.error && (
                      <div>
                        <strong className="text-cyber-pink">Error:</strong>
                        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo && (
                      <div>
                        <strong className="text-cyber-pink">Component Stack:</strong>
                        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-gray-400">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className={cn(
                    'inline-flex items-center justify-center gap-2',
                    'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                    'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30',
                    'hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50'
                  )}
                >
                  <RefreshCw className="w-4 h-4" />
                  重试
                </button>

                <button
                  onClick={this.handleGoBack}
                  className={cn(
                    'inline-flex items-center justify-center gap-2',
                    'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                    'bg-cyber-muted/10 text-gray-300 border border-cyber-border',
                    'hover:bg-cyber-muted/20 hover:border-gray-600'
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回
                </button>

                <button
                  onClick={this.handleGoHome}
                  className={cn(
                    'inline-flex items-center justify-center gap-2',
                    'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                    'bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30',
                    'hover:bg-cyber-purple/20 hover:border-cyber-purple/50'
                  )}
                >
                  <Home className="w-4 h-4" />
                  首页
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 函数式 ErrorBoundary Hook
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error handled by useErrorHandler:', error, errorInfo);

    // 这里可以集成错误监控服务
    // 例如: Sentry.captureException(error)
  };
};

// 简化的错误边界组件（用于函数式组件）
export const SimpleErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback }) => {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
};

export default ErrorBoundary;
