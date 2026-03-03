'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CyberHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export const CyberHero: React.FC<CyberHeroProps> = ({
  title = '欢迎来到 CyberPress',
  subtitle = '赛博朋克风格的下一代博客平台',
  ctaText = '探索更多',
  ctaLink = '/blog',
  className,
}) => {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < title.length) {
      const timeout = setTimeout(() => {
        setTypedText(title.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, title]);

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'bg-gradient-to-br from-deep-black via-cyber-purple/10 to-deep-black',
        className
      )}
    >
      {/* 动态背景 */}
      <div className="absolute inset-0">
        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* 发光圆圈 */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* 打字机效果标题 */}
        <motion.h1
          className="font-orbitron text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {typedText}
          <motion.span
            className="inline-block w-0.5 h-12 ml-2 bg-cyber-cyan"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        {/* CTA 按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href={ctaLink}>
            <motion.button
              className="group relative px-8 py-4 bg-transparent border-2 border-cyber-cyan text-cyber-cyan font-orbitron font-bold text-lg uppercase tracking-wider overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 group-hover:text-deep-black transition-colors duration-300">
                {ctaText}
              </span>
              <motion.div
                className="absolute inset-0 bg-cyber-cyan"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* 特性标签 */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { label: '⚡ Next.js 14', color: 'border-cyber-cyan' },
            { label: '🎨 赛博朋克', color: 'border-cyber-purple' },
            { label: '📱 响应式', color: 'border-cyber-pink' },
            { label: '🔥 高性能', color: 'border-cyber-yellow' },
          ].map((tag, index) => (
            <motion.div
              key={tag.label}
              className={cn(
                'px-4 py-2 border-2 rounded-lg text-sm font-mono',
                'bg-deep-black/50 backdrop-blur-sm',
                tag.color
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {tag.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 滚动提示 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-cyber-cyan rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 bg-cyber-cyan rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent animate-scanline" />
      </div>
    </section>
  );
};

export default CyberHero;
