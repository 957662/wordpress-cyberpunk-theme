/**
 * 错误页面组件
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlitchText } from '../effects/GlitchText';
import { Button } from './Button';

export interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  customActions?: React.ReactNode;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code = 500,
  title = '出错了',
  message = '抱歉，服务器遇到了一些问题。',
  showHomeButton = true,
  showBackButton = true,
  customActions,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 错误代码 */}
          <div className="mb-8">
            <GlitchText
              text={code.toString()}
              className="text-[150px] font-bold text-cyber-cyan leading-none"
            />
          </div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>

          {/* 消息 */}
          <p className="text-xl text-cyber-muted mb-8">
            {message}
          </p>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4 justify-center">
            {showBackButton && (
              <Button
                variant="neon"
                onClick={() => window.history.back()}
              >
                返回上一页
              </Button>
            )}

            {showHomeButton && (
              <Link href="/">
                <Button variant="holographic">
                  回到首页
                </Button>
              </Link>
            )}

            {customActions}
          </div>
        </motion.div>

        {/* 装饰元素 */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </div>
    </div>
  );
};

// 预定义的错误页面
export const NotFoundPage: React.FC = () => (
  <ErrorPage
    code={404}
    title="页面未找到"
    message="您访问的页面不存在或已被删除。"
  />
);

export const UnauthorizedPage: React.FC = () => (
  <ErrorPage
    code={401}
    title="未授权"
    message="您需要登录才能访问此页面。"
    customActions={
      <Link href="/login">
        <Button variant="neon">前往登录</Button>
      </Link>
    }
  />
);

export const ForbiddenPage: React.FC = () => (
  <ErrorPage
    code={403}
    title="禁止访问"
    message="您没有权限访问此页面。"
  />
);

export const ServerErrorPage: React.FC = () => (
  <ErrorPage
    code={500}
    title="服务器错误"
    message="服务器遇到了一些问题，请稍后再试。"
  />
);

export const MaintenancePage: React.FC = () => (
  <ErrorPage
    code={503}
    title="系统维护中"
    message="系统正在维护中，请稍后再来。"
    showBackButton={false}
  />
);

export default ErrorPage;
