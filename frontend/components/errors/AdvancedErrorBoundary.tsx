/**
 * Advanced Error Boundary Component
 * 高级错误边界组件 - 提供完整的错误处理和恢复功能
 *
 * @author AI Development Team
 * @version 2.0.0
 */

'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, X } from 'lucide-react';

// 类型定义
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReset?: boolean;
  enableReload?: boolean;
  enableHome?: boolean;
  enableReport?: boolean;
  reportEndpoint?: string;
  showDetails?: boolean;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
  showDetails: boolean;
}

export class AdvancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    this.setState({
      error,
      errorInfo,
    });

    // 调用自定义错误处理
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 发送错误报告
    this.reportError(error, errorInfo);

    // 控制台输出
    console.error('Error caught by boundary:', error, errorInfo);
  }

  /**
   * 报告错误
   */
  async reportError(error: Error, errorInfo: ErrorInfo) {
    const { reportEndpoint, enableReport = true } = this.props;

    if (!enableReport || !reportEndpoint) return;

    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount,
    };

    try {
      await fetch(reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  /**
   * 重试
   */
  handleRetry = async () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      console.warn('Max retries reached');
      return;
    }

    this.setState({ isRetrying: true });

    // 模拟重试延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      isRetrying: false,
    }));
  };

  /**
   * 重新加载页面
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * 返回首页
   */
  handleHome = () => {
    window.location.href = '/';
  };

  /**
   * 切换详细信息
   */
  toggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    const {
      children,
      fallback,
      enableReset = true,
      enableReload = true,
      enableHome = true,
      showDetails: showDetailsProp = false,
    } = this.props;

    const {
      hasError,
      error,
      errorInfo,
      isRetrying,
      showDetails,
      retryCount,
    } = this.state;

    if (!hasError) {
      return children;
    }

    // 使用自定义 fallback
    if (fallback) {
      return fallback;
    }

    // 默认错误 UI
    return (
      <div className="error-boundary min-h-screen flex items-center justify-center bg-cyber-dark p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl w-full"
        >
          <div className="overflow-hidden rounded-lg border border-cyber-pink/30 bg-cyber-dark/50 backdrop-blur-sm shadow-lg shadow-cyber-pink/20">
            {/* 错误图标 */}
            <div className="flex items-center justify-center border-b border-cyber-pink/20 bg-cyber-pink/5 p-8">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="relative"
              >
                <AlertTriangle className="h-24 w-24 text-cyber-pink" />
                <div className="absolute inset-0 animate-ping rounded-full border-2 border-cyber-pink opacity-20" />
              </motion.div>
            </div>

            {/* 错误信息 */}
            <div className="p-8">
              <h1 className="mb-4 text-3xl font-bold text-white">
                哎呀，出错了！
              </h1>
              <p className="mb-6 text-gray-400">
                很抱歉，应用程序遇到了意外错误。我们的团队已经收到通知，正在努力修复。
              </p>

              {/* 错误详情 */}
              {(showDetailsProp || showDetails) && error && (
                <div className="mb-6 overflow-hidden rounded-md border border-cyber-pink/20 bg-cyber-dark/70">
                  <div className="flex items-center justify-between border-b border-cyber-pink/20 bg-cyber-pink/5 px-4 py-2">
                    <span className="text-sm font-semibold text-cyber-pink">错误详情</span>
                    <button
                      onClick={this.toggleDetails}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <strong className="text-cyber-cyan">错误消息:</strong>
                      <p className="mt-1 text-sm text-gray-400">{error.message}</p>
                    </div>
                    {error.stack && (
                      <div className="mt-4">
                        <strong className="text-cyber-cyan">堆栈跟踪:</strong>
                        <pre className="mt-1 overflow-auto rounded bg-cyber-dark/50 p-2 text-xs text-gray-400">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    {errorInfo && errorInfo.componentStack && (
                      <div className="mt-4">
                        <strong className="text-cyber-cyan">组件堆栈:</strong>
                        <pre className="mt-1 overflow-auto rounded bg-cyber-dark/50 p-2 text-xs text-gray-400">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-4">
                {/* 重试 */}
                {enableReset && retryCount < 3 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={this.handleRetry}
                    disabled={isRetrying}
                    className="flex items-center gap-2 rounded-md border border-cyber-cyan/30 bg-cyber-cyan/10 px-6 py-3 text-cyber-cyan hover:bg-cyber-cyan/20 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-5 w-5 ${isRetrying ? 'animate-spin' : ''}`} />
                    {isRetrying ? '重试中...' : '重试'}
                  </motion.button>
                )}

                {/* 重新加载 */}
                {enableReload && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={this.handleReload}
                    className="flex items-center gap-2 rounded-md border border-cyber-purple/30 bg-cyber-purple/10 px-6 py-3 text-cyber-purple hover:bg-cyber-purple/20"
                  >
                    <RefreshCw className="h-5 w-5" />
                    重新加载
                  </motion.button>
                )}

                {/* 返回首页 */}
                {enableHome && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={this.handleHome}
                    className="flex items-center gap-2 rounded-md border border-cyber-green/30 bg-cyber-green/10 px-6 py-3 text-cyber-green hover:bg-cyber-green/20"
                  >
                    <Home className="h-5 w-5" />
                    返回首页
                  </motion.button>
                )}

                {/* 显示详情 */}
                {!showDetailsProp && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={this.toggleDetails}
                    className="flex items-center gap-2 rounded-md border border-cyber-yellow/30 bg-cyber-yellow/10 px-6 py-3 text-cyber-yellow hover:bg-cyber-yellow/20"
                  >
                    <Bug className="h-5 w-5" />
                    {showDetails ? '隐藏详情' : '显示详情'}
                  </motion.button>
                )}
              </div>

              {/* 重试计数 */}
              {retryCount > 0 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  已重试 {retryCount} 次
                </div>
              )}
            </div>
          </div>

          {/* 页脚 */}
          <div className="mt-6 text-center text-sm text-gray-500">
            如果问题持续存在，请联系技术支持
          </div>
        </motion.div>
      </div>
    );
  }
}

/**
 * Hook - 使用错误边界
 */
export function useErrorBoundary() {
  return {
    // 可以添加更多错误处理相关的功能
  };
}

/**
 * 高阶组件 - 包装组件以提供错误边界
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Partial<Props>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <AdvancedErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </AdvancedErrorBoundary>
    );
  };
}

export default AdvancedErrorBoundary;
