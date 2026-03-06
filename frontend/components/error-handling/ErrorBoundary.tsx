'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 错误边界属性
 */
export interface ErrorBoundaryProps {
  /** 子组件 */
  children: ReactNode;
  /** 回退UI */
  fallback?: ReactNode;
  /** 错误回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 是否显示堆栈跟踪 */
  showStackTrace?: boolean;
}

/**
 * 错误边界状态
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

/**
 * 默认错误回退UI
 */
interface DefaultFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
  showDetails: boolean;
  onToggleDetails: () => void;
  showStackTrace?: boolean;
}

function DefaultFallback({
  error,
  errorInfo,
  resetError,
  showDetails,
  onToggleDetails,
  showStackTrace = true,
}: DefaultFallbackProps) {
  const [copied, setCopied] = React.useState(false);

  const copyError = () => {
    const errorText = `Error: ${error?.message}\n\nComponent Stack:\n${errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl w-full"
      >
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-500/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 rounded-2xl pointer-events-none" />

          {/* 错误图标 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* 标题 */}
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            出错了
          </h1>
          <p className="text-center text-gray-400 mb-6">
            抱歉，应用程序遇到了意外错误
          </p>

          {/* 错误消息 */}
          <div className="bg-gray-950/50 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Bug className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-400 mb-1">错误信息</p>
                <p className="text-sm text-gray-300 break-words">
                  {error?.message || '未知错误'}
                </p>
              </div>
            </div>
          </div>

          {/* 详细信息 */}
          {showDetails && errorInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6"
            >
              <div className="bg-gray-950/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-400">组件堆栈</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyError}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-gray-800 text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        复制
                      </>
                    )}
                  </motion.button>
                </div>
                <pre className="text-xs text-gray-500 overflow-x-auto whitespace-pre-wrap font-mono">
                  {showStackTrace ? errorInfo.componentStack : '组件堆栈跟踪已隐藏'}
                </pre>
              </div>
            </motion.div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetError}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-shadow"
            >
              <RefreshCw className="w-5 h-5" />
              重新加载
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 border-2 border-gray-700 text-gray-300 font-medium rounded-lg hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
            >
              <Home className="w-5 h-5" />
              返回首页
            </motion.a>
          </div>

          {/* 切换详细信息 */}
          {errorInfo && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onToggleDetails}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  隐藏详细信息
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  显示详细信息
                </>
              )}
            </motion.button>
          )}

          {/* 页脚信息 */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-center text-gray-500">
              错误ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * 错误边界组件
 *
 * 捕获子组件树中的 JavaScript 错误，记录错误日志，并显示回退 UI
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => {
 *     console.error('Error caught:', error, errorInfo);
 *     // 发送错误日志到服务器
 *   }}
 *   showDetails={true}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // 调用错误回调
    this.props.onError?.(error, errorInfo);

    // 记录错误到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  toggleDetails = (): void => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, showDetails } = this.state;
    const { children, fallback, className, showDetails: showDetailsProp } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className={cn('error-boundary', className)}>
          <DefaultFallback
            error={error}
            errorInfo={errorInfo}
            resetError={this.resetError}
            showDetails={showDetailsProp ?? showDetails}
            onToggleDetails={this.toggleDetails}
            showStackTrace={this.props.showStackTrace}
          />
        </div>
      );
    }

    return children;
  }
}

/**
 * 错误卡片组件 - 用于在页面内显示错误
 */
export interface ErrorCardProps {
  /** 错误对象 */
  error: Error | string;
  /** 错误标题 */
  title?: string;
  /** 是否可关闭 */
  dismissible?: boolean;
  /** 关闭回调 */
  onDismiss?: () => void;
  /** 自定义样式类名 */
  className?: string;
  /** 错误变体 */
  variant?: 'error' | 'warning' | 'info';
  /** 显示的操作按钮 */
  actions?: ReactNode;
}

/**
 * 错误卡片组件
 *
 * 在页面内显示错误信息，不会影响整个应用
 *
 * @example
 * ```tsx
 * <ErrorCard
 *   error={error}
 *   title="加载失败"
 *   onDismiss={() => setError(null)}
 *   actions={
 *     <button onClick={retry}>重试</button>
 *   }
 * />
 * ```
 */
export function ErrorCard({
  error,
  title,
  dismissible = false,
  onDismiss,
  className,
  variant = 'error',
  actions,
}: ErrorCardProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  const variantStyles = {
    error: 'border-red-500/50 bg-red-500/5',
    warning: 'border-yellow-500/50 bg-yellow-500/5',
    info: 'border-cyan-500/50 bg-cyan-500/5',
  };

  const iconStyles = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-cyan-400',
  };

  const Icon = variant === 'warning' ? AlertTriangle : AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'border-2 rounded-lg p-4',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[variant])} />
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-semibold text-white mb-1">{title}</h3>
          )}
          <p className="text-sm text-gray-300 break-words">{errorMessage}</p>
          {actions && <div className="mt-3">{actions}</div>}
        </div>
        {dismissible && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * 加载错误组件 - 用于显示加载失败的占位符
 */
export interface LoadingErrorProps {
  /** 错误对象 */
  error?: Error | string;
  /** 重试回调 */
  onRetry?: () => void;
  /** 自定义消息 */
  message?: string;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 加载错误组件
 *
 * 显示一个友好的加载失败界面，带有重试按钮
 *
 * @example
 * ```tsx
 * <LoadingError
 *   error={error}
 *   onRetry={() => retry()}
 *   message="加载失败，请重试"
 * />
 * ```
 */
export function LoadingError({
  error,
  onRetry,
  message = '加载失败',
  className,
}: LoadingErrorProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] mb-4"
      >
        <AlertTriangle className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-lg font-semibold text-white mb-2">{message}</h3>
      {errorMessage && (
        <p className="text-sm text-gray-400 mb-4 text-center">{errorMessage}</p>
      )}
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-shadow"
        >
          <RefreshCw className="w-4 h-4" />
          重试
        </motion.button>
      )}
    </div>
  );
}

/**
 * 空状态组件
 */
export interface EmptyStateProps {
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 图标 */
  icon?: ReactNode;
  /** 操作按钮 */
  action?: ReactNode;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 空状态组件
 *
 * 显示空状态的占位符
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="暂无数据"
 *   description="还没有任何内容"
 *   icon={<FolderOpen className="w-12 h-12" />}
 *   action={<button>创建</button>}
 * />
 * ```
 */
export function EmptyState({
  title = '暂无数据',
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="mb-4 text-gray-600"
        >
          {icon}
        </motion.div>
      )}
      <h3 className="text-lg font-semibold text-gray-400 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4 max-w-md">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/**
 * 错误触发器 Hook - 用于测试错误边界
 */
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    throw error;
  }, []);
}

export default ErrorBoundary;
