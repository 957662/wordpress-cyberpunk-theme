'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Cpu, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  showParticles?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = '探索赛博朋克世界',
  subtitle = '未来已来，触手可及',
  description = '融合前沿技术与创意设计，打造独一无二的数字体验。从 WordPress 到 Next.js，从传统到未来。',
  primaryCta = {
    text: '开始探索',
    href: '/blog',
  },
  secondaryCta = {
    text: '查看作品',
    href: '/portfolio',
  },
  showParticles = true,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  // 生成粒子
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 动态背景 */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 240, 255, 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* 粒子效果 */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-cyan-400/20"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* 扫描线效果 */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-10" />

      {/* 内容 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-center"
      >
        {/* 装饰图标 */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center gap-4">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="rounded-full bg-cyan-500/10 p-4"
          >
            <Cpu className="h-8 w-8 text-cyan-400" />
          </motion.div>
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
            }}
            className="rounded-full bg-purple-500/10 p-4"
          >
            <Sparkles className="h-8 w-8 text-purple-400" />
          </motion.div>
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 18, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            }}
            className="rounded-full bg-pink-500/10 p-4"
          >
            <Zap className="h-8 w-8 text-pink-400" />
          </motion.div>
        </motion.div>

        {/* 副标题 */}
        <motion.p
          variants={itemVariants}
          className="mb-4 text-sm font-medium tracking-widest text-cyan-400 uppercase"
        >
          {subtitle}
        </motion.p>

        {/* 标题 */}
        <motion.h1
          variants={itemVariants}
          className="mb-6 text-4xl font-bold text-white md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>

        {/* 描述 */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 md:text-xl"
        >
          {description}
        </motion.p>

        {/* CTA 按钮 */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105"
          >
            <span>{primaryCta.text}</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 px-8 py-4 font-semibold text-white transition-all hover:border-cyan-400 hover:bg-cyan-500/10"
          >
            <span>{secondaryCta.text}</span>
          </Link>
        </motion.div>

        {/* 特性标签 */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WordPress'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-cyan-500/30 bg-gray-800/50 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />

      {/* 滚动提示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest">向下滚动</span>
          <div className="h-12 w-6 rounded-full border-2 border-gray-600 p-2">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-cyan-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
