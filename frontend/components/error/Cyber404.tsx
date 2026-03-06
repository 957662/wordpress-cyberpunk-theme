'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Cyber404Props {
  title?: string;
  message?: string;
  showGoBack?: boolean;
  showHome?: boolean;
  showSearch?: boolean;
  className?: string;
}

/**
 * Cyber404 Component
 * 赛博朋克风格的404页面
 */
export function Cyber404({
  title = '404',
  message = '页面未找到',
  showGoBack = true,
  showHome = true,
  showSearch = true,
  className,
}: Cyber404Props) {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div
      className={cn(
        'min-h-screen bg-gray-50 dark:bg-gray-900',
        'flex items-center justify-center p-4',
        className
      )}
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 标题 - 故障效果 */}
        <div className="relative">
          <h1 className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 animate-pulse">
            {title}
          </h1>
          <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-bold text-cyan-500/20 blur-3xl">
            {title}
          </div>
        </div>

        {/* 错误信息 */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {message}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            抱歉,您访问的页面不存在。可能已被删除、移动,或者URL输入错误。
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {showGoBack && (
            <button
              onClick={goBack}
              className={cn(
                'flex items-center gap-2 px-6 py-3',
                'bg-gray-200 dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'rounded-lg font-medium',
                'hover:bg-gray-300 dark:hover:bg-gray-700',
                'transition-colors duration-200'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              返回上页
            </button>
          )}

          {showHome && (
            <Link
              href="/"
              className={cn(
                'flex items-center gap-2 px-6 py-3',
                'bg-gradient-to-r from-cyan-500 to-purple-500',
                'text-white',
                'rounded-lg font-medium',
                'hover:from-cyan-600 hover:to-purple-600',
                'shadow-lg shadow-cyan-500/30',
                'transition-all duration-200'
              )}
            >
              <Home className="w-4 h-4" />
              返回首页
            </Link>
          )}

          {showSearch && (
            <Link
              href="/search"
              className={cn(
                'flex items-center gap-2 px-6 py-3',
                'border-2 border-cyan-500',
                'text-cyan-500 dark:text-cyan-400',
                'rounded-lg font-medium',
                'hover:bg-cyan-50 dark:hover:bg-cyan-900/20',
                'transition-colors duration-200'
              )}
            >
              <Search className="w-4 h-4" />
              搜索内容
            </Link>
          )}
        </div>

        {/* 装饰元素 */}
        <div className="relative h-32 overflow-hidden">
          {/* 扫描线 */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,240,255,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan" />

          {/* 网格背景 */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #00f0ff 1px, transparent 1px),
                linear-gradient(to bottom, #00f0ff 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 500错误页面
 */
export function Cyber500({
  message = '服务器错误',
  ...props
}: Omit<Cyber404Props, 'title'>) {
  return (
    <Cyber404
      title="500"
      message={message}
      {...props}
    />
  );
}

/**
 * 自定义错误页面
 */
export function CyberError({
  code,
  title,
  message,
  ...props
}: Cyber404Props & { code?: string; title?: string }) {
  return (
    <Cyber404
      title={code || 'ERROR'}
      message={title || message}
      {...props}
    />
  );
}

export default Cyber404;
