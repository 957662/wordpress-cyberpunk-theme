'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, Shield, Rocket, Palette, Database } from 'lucide-react';
import FeatureCard from './FeatureCard';

export interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features?: Array<{
    icon: any;
    title: string;
    description: string;
    color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  }>;
}

const defaultFeatures = [
  {
    icon: Code2,
    title: '现代化技术栈',
    description: '基于 Next.js 14、TypeScript 和 Tailwind CSS 构建，提供卓越的开发体验和性能表现。',
    color: 'cyan' as const,
  },
  {
    icon: Zap,
    title: '极致性能',
    description: '优化加载速度、代码分割和缓存策略，确保网站在任何设备上都能快速响应。',
    color: 'yellow' as const,
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '内置安全防护机制，包括 CSRF 保护、XSS 防护和安全的认证系统。',
    color: 'purple' as const,
  },
  {
    icon: Rocket,
    title: '易于部署',
    description: '支持多种部署方式，包括 Vercel、Docker 和传统服务器，灵活满足各种需求。',
    color: 'pink' as const,
  },
  {
    icon: Palette,
    title: '赛博朋克设计',
    description: '独特的视觉风格，融合霓虹色彩、发光效果和流畅动画，打造沉浸式体验。',
    color: 'cyan' as const,
  },
  {
    icon: Database,
    title: 'WordPress 集成',
    description: '无缝集成 WordPress REST API，享受强大内容管理系统的同时保持前端灵活性。',
    color: 'purple' as const,
  },
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title = '核心特性',
  subtitle = '打造现代化的数字体验',
  features = defaultFeatures,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* 内容 */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm font-semibold tracking-widest text-cyan-400 uppercase">
            {subtitle}
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {title}
          </h2>
        </motion.div>

        {/* 特性网格 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400">
            持续进化，不断优化，为您提供最佳体验
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
