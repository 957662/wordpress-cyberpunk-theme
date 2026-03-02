'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlitchText } from '@/components/effects';

/**
 * 404 Not Found 页面
 * 赛博朋克风格的404页面
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4">
        {/* 404 标题 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <GlitchText
            text="404"
            className="text-[180px] font-bold leading-none bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          />
        </motion.div>

        {/* 错误信息 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The page you're looking for has been lost in the digital void.
            It may have been moved, deleted, or never existed at all.
          </p>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-semibold overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </span>
          </Link>

          <Link
            href="/blog"
            className="px-8 py-4 border-2 border-cyan-500/30 rounded-xl text-cyan-300 font-semibold hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
          >
            Browse Blog
          </Link>
        </motion.div>

        {/* 装饰元素 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-xs text-gray-500">Search</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-xs text-gray-500">Blog</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💼</div>
            <div className="text-xs text-gray-500">Portfolio</div>
          </div>
        </motion.div>
      </div>

      {/* 底部信息 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-gray-600 text-sm">
          Error Code: 0x404 • System Status: Offline
        </p>
      </motion.div>
    </div>
  );
}

/**
 * 全局 404 处理
 */
export function NotFound() {
  return (
    <html lang="en">
      <body>
        <NotFoundPage />
      </body>
    </html>
  );
}
