'use client';

/**
 * 404 页面
 * 赛博朋克风格的错误页面
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4 overflow-hidden relative">
      {/* 动画背景 */}
      <div className="absolute inset-0 bg-cyber-grid opacity-10" />

      {/* 扫描线效果 */}
      <div className="absolute inset-0 animate-scan pointer-events-none">
        <div className="h-1 bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent" />
      </div>

      {/* 内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 max-w-2xl"
      >
        {/* 404 大标题 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-display font-bold leading-none">
            <span className="text-glow-cyan text-cyber-cyan inline-block">4</span>
            <span className="text-glow-purple text-cyber-purple inline-block">0</span>
            <span className="text-glow-pink text-cyber-pink inline-block">4</span>
          </h1>
        </motion.div>

        {/* 错误信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            页面未找到
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            您访问的页面可能已被移动、删除或从未存在
          </p>
        </motion.div>

        {/* 故障效果装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10">
            <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
            <span className="text-cyber-cyan text-sm font-mono">SYSTEM ERROR</span>
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link href="/">
            <CyberButton variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              返回首页
            </CyberButton>
          </Link>
          <Link href="/blog">
            <CyberButton variant="outline" leftIcon={<Search className="w-4 h-4" />}>
              浏览文章
            </CyberButton>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 border border-cyber-purple text-cyber-purple rounded hover:bg-cyber-purple/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            返回上页
          </button>
        </motion.div>

        {/* 装饰性代码 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
          className="mt-12 p-4 bg-cyber-darker rounded border border-cyber-border"
        >
          <pre className="text-xs text-gray-500 font-mono text-left overflow-x-auto">
            {`ERROR: Page not found
CODE: 404
TIME: ${new Date().toISOString()}
PATH: ${typeof window !== 'undefined' ? window.location.pathname : '/unknown'}
STATUS: Lost in cyberspace...`}
          </pre>
        </motion.div>
      </motion.div>

      {/* 粒子动画 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0,
            }}
            animate={{
              y: [null, '-100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
