'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { GlitchText } from '@/components/effects';

/**
 * 404 错误页面
 * 赛博朋克风格的"页面未找到"页面
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cyber-dark">
      {/* 背景特效 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* 404 数字 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="mb-8"
        >
          <GlitchText
            text="404"
            className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent leading-none"
          />
        </motion.div>

        {/* 错误信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-cyber-cyan mb-4">
            PAGE NOT FOUND
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-6">
            The digital entity you seek has been lost in the cyber void.
            The data may have been corrupted or relocated.
          </p>

          {/* 装饰性代码片段 */}
          <div className="bg-cyber-dark/80 border border-cyber-primary/30 rounded-lg p-4 max-w-md mx-auto mb-8">
            <pre className="text-xs text-cyber-primary font-mono">
              <code>{`Error: 404_NOT_FOUND
Status: ENTITY_MISSING
Timestamp: ${new Date().toISOString()}
Action: Redirect to home`}</code>
            </pre>
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="group relative px-8 py-3 bg-cyber-primary/10 border border-cyber-primary rounded-lg overflow-hidden transition-all duration-300 hover:bg-cyber-primary/20 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative flex items-center gap-2 text-cyber-primary font-semibold">
              <Home size={20} />
              <span>Return Home</span>
            </div>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group relative px-8 py-3 bg-cyber-dark/50 border border-cyber-secondary/50 rounded-lg overflow-hidden transition-all duration-300 hover:bg-cyber-secondary/10 hover:border-cyber-secondary hover:shadow-[0_0_30px_rgba(157,0,255,0.3)]"
          >
            <div className="relative flex items-center gap-2 text-cyber-secondary font-semibold">
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </div>
          </button>
        </motion.div>

        {/* 装饰元素 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 2 }}
          className="mt-16 flex justify-center gap-2"
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-cyber-primary"
              style={{
                animationDelay: `${i * 0.1}s`,
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* 角落装饰 */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyber-primary opacity-30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyber-secondary opacity-30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyber-secondary opacity-30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyber-primary opacity-30" />
    </div>
  );
}
