'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CyberLoader } from '@/components/ui';

/**
 * 加载页面
 * 赛博朋克风格的过渡加载动画
 */
export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    // 3秒后自动跳转回首页
    const timeout = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cyber-dark">
      {/* 动态背景 */}
      <div className="absolute inset-0">
        {/* 径向渐变 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(157,0,255,0.15),transparent_70%)] animate-pulse" />

        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>

        {/* 扫描线 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full" style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)'
          }} />
        </div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center">
        {/* Logo/标题 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent mb-4">
            CYBERPRESS
          </h1>
          <p className="text-cyber-primary text-sm tracking-[0.3em] uppercase">
            Initializing System
          </p>
        </motion.div>

        {/* 加载动画 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <CyberLoader size="lg" />
        </motion.div>

        {/* 加载文本 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <p className="text-gray-400 text-sm">Loading modules...</p>

          {/* 进度条 */}
          <div className="w-64 mx-auto">
            <motion.div
              className="h-1 bg-cyber-dark rounded-full overflow-hidden border border-cyber-primary/30"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{
                  filter: 'blur(4px)'
                }}
              />
            </motion.div>
          </div>

          {/* 状态文本 */}
          <motion.p
            className="text-cyber-primary text-xs font-mono mt-4"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {'> '}
            {[
              'Establishing neural link...',
              'Loading holographic interface...',
              'Syncing quantum database...',
              'Calibrating photon emitters...',
              'Ready to deploy'
            ][Math.floor(Date.now() / 600) % 5]}
          </motion.p>
        </motion.div>

        {/* 装饰元素 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex justify-center gap-8"
        >
          {[
            { label: 'CPU', value: '87%' },
            { label: 'MEM', value: '64%' },
            { label: 'NET', value: '92%' }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <p className="text-cyber-primary text-sm font-bold">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 角落装饰 */}
      <div className="absolute top-8 left-8">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-cyber-secondary animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <div className="absolute bottom-8 right-8 text-right">
        <p className="text-gray-600 text-xs font-mono">
          v2.0.26 [STABLE]
        </p>
        <p className="text-gray-700 text-xs font-mono">
          Build: {Date.now().toString(36).toUpperCase()}
        </p>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(30px, 30px);
          }
        }
      `}</style>
    </div>
  );
}
