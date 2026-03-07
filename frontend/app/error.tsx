/**
 * 全局错误页面
 */

'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorIcon } from '@/components/icons/StatusIcons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 错误日志上报
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cyber-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card variant="neon" glowColor="pink" className="p-12 text-center">
          {/* Error Icon */}
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <ErrorIcon className="w-24 h-24 text-cyber-pink mx-auto" />
          </motion.div>

          {/* Error Title */}
          <h1 className="font-display font-bold text-4xl mb-4">
            系统错误
          </h1>

          {/* Error Message */}
          <p className="text-gray-400 text-lg mb-6">
            抱歉，应用程序遇到了一些问题。我们已记录此错误并将尽快修复。
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-cyber-cyan hover:text-cyber-pink transition-colors mb-2">
                错误详情
              </summary>
              <pre className="bg-cyber-muted p-4 rounded text-sm overflow-auto max-h-64">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="primary"
              onClick={reset}
            >
              重试
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              返回首页
            </Button>
          </div>

          {/* Error Code */}
          {error.digest && (
            <p className="text-gray-500 text-sm mt-6">
              错误代码: {error.digest}
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
