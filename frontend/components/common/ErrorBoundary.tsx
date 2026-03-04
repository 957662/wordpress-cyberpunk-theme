'use client';

import { Component, ReactNode } from 'react';
import { logReactError } from '@/lib/utils/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
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

  componentDidCatch(error: Error, errorInfo: any) {
    // 记录错误
    logReactError(error, errorInfo);

    // 调用自定义错误处理
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // 使用自定义 fallback 或默认错误 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-cyber-dark">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-cyber-cyan mb-4">出错了</h1>
            <p className="text-gray-400 mb-6">页面遇到了一些问题</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyber-cyan text-black font-medium rounded-lg hover:bg-cyber-cyan/90 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 默认错误回退组件
export function DefaultErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cyber-dark">
      <div className="max-w-md w-full p-8 bg-cyber-card border border-cyber-cyan/30 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-cyber-cyan mb-2">出错了</h1>
          <p className="text-gray-400 mb-6">
            {error?.message || '页面遇到了一些问题'}
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300">
                错误详情
              </summary>
              <pre className="mt-2 p-4 bg-cyber-darker rounded text-xs text-red-400 overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-cyber-cyan text-black font-medium rounded-lg hover:bg-cyber-cyan/90 transition-colors"
            >
              刷新页面
            </button>
            {resetError && (
              <button
                onClick={resetError}
                className="flex-1 px-4 py-2 border border-cyber-border text-gray-300 rounded-lg hover:border-cyber-cyan/50 transition-colors"
              >
                重试
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 自定义错误回退组件
interface CustomErrorFallbackProps {
  title?: string;
  message?: string;
  showDetails?: boolean;
  error?: Error;
  onReset?: () => void;
}

export function CustomErrorFallback({
  title = '出错了',
  message = '页面遇到了一些问题',
  showDetails = false,
  error,
  onReset,
}: CustomErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cyber-dark">
      <div className="max-w-md w-full p-8 bg-cyber-card border border-cyber-pink/30 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-cyber-pink/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-cyber-pink"
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

          <h1 className="text-2xl font-bold text-cyber-pink mb-2">{title}</h1>
          <p className="text-gray-400 mb-6">{message}</p>

          {showDetails && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300">
                错误详情
              </summary>
              <pre className="mt-2 p-4 bg-cyber-darker rounded text-xs text-red-400 overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-cyber-pink text-white font-medium rounded-lg hover:bg-cyber-pink/90 transition-colors"
            >
              刷新页面
            </button>
            {onReset && (
              <button
                onClick={onReset}
                className="flex-1 px-4 py-2 border border-cyber-border text-gray-300 rounded-lg hover:border-cyber-cyan/50 transition-colors"
              >
                重试
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
