'use client';

/**
 * CyberHero - 赛博朋克风格首页英雄区块
 *
 * 功能特性：
 * - 动态渐变背景
 * - 霓虹发光效果
 * - 打字机动画
 * - 响应式设计
 * - CTA 按钮
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { CyberButton } from '@/components/ui';

interface CyberHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  showScrollIndicator?: boolean;
}

const typingTexts = [
  '探索科技与美学',
  '赛博朋克风格',
  '现代博客平台',
  '无限创意空间',
];

export function CyberHero({
  title = '欢迎来到',
  subtitle = 'CyberPress',
  description = '一个融合赛博朋克美学与现代技术的博客平台。探索前沿技术、设计趋势与创意灵感的汇聚之地。',
  primaryCTA = { text: '开始阅读', href: '/blog' },
  secondaryCTA = { text: '了解更多', href: '/about' },
  showScrollIndicator = true,
}: CyberHeroProps) {
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // 打字机效果
  useEffect(() => {
    const currentText = typingTexts[typingIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setTypingIndex((prev) => (prev + 1) % typingTexts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex]);

  // 滚动处理
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 -z-10">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-dark" />

        {/* 动画光晕 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-pink/10 rounded-full blur-3xl animate-pulse delay-500" />

        {/* 扫描线效果 */}
        <div className="absolute inset-0 bg-[url('/images/scanlines.png')] opacity-5 pointer-events-none" />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* 标签 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-cyber-cyan" />
          <span className="text-sm text-cyber-cyan">{displayText}</span>
          <span className="animate-pulse">|</span>
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
        >
          <span className="text-white block mb-2">{title}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-300% animate-gradient">
            {subtitle}
          </span>
        </motion.h1>

        {/* 描述 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>

        {/* CTA 按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          <Link href={primaryCTA.href}>
            <CyberButton
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {primaryCTA.text}
            </CyberButton>
          </Link>
          <Link href={secondaryCTA.href}>
            <CyberButton variant="outline" size="lg">
              {secondaryCTA.text}
            </CyberButton>
          </Link>
        </motion.div>

        {/* 特性标签 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center items-center"
        >
          {[
            { icon: Zap, text: 'Next.js 14', color: 'text-cyber-cyan' },
            { icon: Sparkles, text: '赛博朋克', color: 'text-cyber-purple' },
            { icon: ArrowRight, text: 'TypeScript', color: 'text-cyber-pink' },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 border border-cyber-border rounded-lg hover:border-cyber-cyan/50 transition-all"
            >
              <feature.icon className={`w-4 h-4 ${feature.color}`} />
              <span className="text-sm text-gray-300">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 滚动指示器 */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={scrollToContent}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs">向下滚动</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

export default CyberHero;
