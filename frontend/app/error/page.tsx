/**
 * 全局错误页面
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorPage } from '@/components/ui/error-page';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // 记录错误到错误监控服务
    console.error('Global error:', error);

    // 这里可以集成错误监控服务
    // Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <ErrorPage
          code={500}
          title="应用程序错误"
          message="抱歉，应用程序遇到了一个意外错误。"
          customActions={
            <>
              <button
                onClick={reset}
                className="px-6 py-2 rounded-lg font-medium bg-cyber-purple text-white hover:bg-cyber-purple/80 transition-all"
              >
                重试
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 rounded-lg font-medium bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80 transition-all"
              >
                返回首页
              </button>
            </>
          }
        />
      </body>
    </html>
  );
}
