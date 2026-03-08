/**
 * ErrorBoundary - React 错误边界组件
 * 捕获子组件树中的 JavaScript 错误
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

export class ErrorBoundaryNew extends Component<Props, State> {
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

    // 可以在这里将错误信息发送到错误追踪服务
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

  handleGoBack = () => {
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义的 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误界面
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full"
          >
            {/* 错误卡片 */}
            <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl">
              {/* 霓虹边框效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />

              {/* 背景装饰 */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
                  backgroundSize: '100% 4px'
                }} />
              </div>

              <div className="relative p-8 md:p-12">
                {/* 图标 */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl animate-pulse" />
                    <div className="relative p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
                      <AlertCircle className="w-16 h-16 text-red-500" />
                    </div>
                  </div>
                </motion.div>

                {/* 标题 */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
                >
                  出错了！
                </motion.h1>

                {/* 描述 */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-center mb-8"
                >
                  很抱歉，应用程序遇到了一个错误。请尝试刷新页面或返回上一页。
                </motion.p>

                {/* 错误详情（开发环境） */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8 p-4 rounded-lg bg-black/30 border border-gray-800 overflow-auto max-h-60"
                  >
                    <p className="text-red-400 font-mono text-sm mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-gray-500 font-mono text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </motion.div>
                )}

                {/* 操作按钮 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    onClick={this.handleReset}
                    variant="neon"
                    color="cyan"
                    icon={<RefreshCw className="w-4 h-4" />}
                  >
                    重试
                  </Button>

                  <Button
                    onClick={this.handleReload}
                    variant="outline"
                    color="gray"
                    icon={<RefreshCw className="w-4 h-4" />}
                  >
                    刷新页面
                  </Button>

                  <Button
                    onClick={this.handleGoBack}
                    variant="outline"
                    color="gray"
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    返回上一页
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    color="gray"
                    icon={<Home className="w-4 h-4" />}
                  >
                    返回首页
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* 底部信息 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-gray-600 text-sm mt-6"
            >
              如果问题持续存在，请联系技术支持
            </motion.p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 函数式错误边界 Hook（使用示例）
export function useErrorHandler() {
  return [
    (error: Error) => {
      throw error;
    },
  ];
}

export default ErrorBoundaryNew;
