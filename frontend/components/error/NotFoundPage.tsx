'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

export interface NotFoundPageProps {
  title?: string;
  message?: string;
  showGoBack?: boolean;
  showHome?: boolean;
  customActions?: React.ReactNode;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  title = '404',
  message = '页面走丢了',
  showGoBack = true,
  showHome = true,
  customActions
}) => {
  const [glitchText, setGlitchText] = useState('');
  const fullTitle = '404 NOT FOUND';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let glitchInterval: NodeJS.Timeout;

    // 正常显示
    let currentIndex = 0;
    interval = setInterval(() => {
      if (currentIndex < fullTitle.length) {
        setGlitchText(fullTitle.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    // 故障效果
    glitchInterval = setInterval(() => {
      const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      const randomPos = Math.floor(Math.random() * fullTitle.length);

      setGlitchText(prev => {
        const arr = prev.split('');
        arr[randomPos] = randomChar;
        return arr.join('');
      });

      setTimeout(() => {
        setGlitchText(fullTitle);
      }, 50);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
      {/* 背景动画 */}
      <div className="absolute inset-0">
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* 扫描线 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent"
          animate={{
            y: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* 粒子效果 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* 主要内容 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-2xl mx-auto"
      >
        {/* 404 故障文字 */}
        <motion.h1
          variants={itemVariants}
          className="text-8xl md:text-9xl font-bold mb-8 relative"
          style={{
            textShadow: `
              0 0 10px rgba(0, 240, 255, 0.8),
              0 0 20px rgba(0, 240, 255, 0.6),
              0 0 30px rgba(0, 240, 255, 0.4),
              0 0 40px rgba(0, 240, 255, 0.2)
            `
          }}
        >
          <span className="text-cyber-cyan">{glitchText}</span>

          {/* 故障叠加效果 */}
          <motion.span
            className="absolute inset-0 text-cyber-pink opacity-50"
            animate={{
              x: [-2, 2, -1, 1, 0],
              y: [0, 2, -2, 1, -1, 0]
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            {glitchText}
          </motion.span>

          <motion.span
            className="absolute inset-0 text-cyber-purple opacity-30"
            animate={{
              x: [2, -2, 1, -1, 0],
              y: [0, -2, 2, -1, 1, 0]
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            {glitchText}
          </motion.span>
        </motion.h1>

        {/* 鬼魂图标 */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="inline-block"
          >
            <Ghost className="w-24 h-24 text-cyber-cyan opacity-80" />
          </motion.div>
        </motion.div>

        {/* 消息文本 */}
        <motion.p
          variants={itemVariants}
          className="text-2xl text-gray-400 mb-4"
        >
          {message}
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-gray-500 mb-12"
        >
          您访问的页面不存在或已被移动到其他位置
        </motion.p>

        {/* 操作按钮 */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {showGoBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-dark-bg border-2 border-dark-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              返回上页
            </motion.button>
          )}

          {showHome && (
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-blue-500 text-white font-semibold hover:shadow-neon transition-all"
              >
                <Home className="w-5 h-5" />
                回到首页
              </motion.button>
            </Link>
          )}

          {customActions}
        </motion.div>

        {/* 建议链接 */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-dark-border"
        >
          <p className="text-sm text-gray-500 mb-4">您可能在寻找：</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-lg bg-dark-bg border border-dark-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all text-sm"
            >
              博客文章
            </Link>
            <Link
              href="/portfolio"
              className="px-4 py-2 rounded-lg bg-dark-bg border border-dark-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all text-sm"
            >
              作品集
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-lg bg-dark-bg border border-dark-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all text-sm"
            >
              关于我们
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg bg-dark-bg border border-dark-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all text-sm"
            >
              联系我们
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* 底部装饰 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      />
    </div>
  );
};

export default NotFoundPage;
