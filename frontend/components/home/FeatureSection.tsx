/**
 * FeatureSection Component
 * 特性展示组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Rocket, Code, Database, Globe } from '@/components/graphics';

const features = [
  {
    icon: Zap,
    title: '极速性能',
    description: '基于 Next.js 14 优化的静态生成和服务端渲染，提供极致的加载速度',
    color: 'from-cyber-yellow to-cyber-orange',
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '企业级安全防护，支持 JWT 认证、CSRF 保护等安全特性',
    color: 'from-cyber-green to-cyber-cyan',
  },
  {
    icon: Rocket,
    title: 'PWA 支持',
    description: '完整的离线功能和推送通知，打造原生应用般的体验',
    color: 'from-cyber-purple to-cyber-pink',
  },
  {
    icon: Code,
    title: '开发者友好',
    description: 'TypeScript 全栈类型安全，完善的开发工具和文档',
    color: 'from-cyber-cyan to-cyber-blue',
  },
  {
    icon: Database,
    title: 'WordPress 后端',
    description: '强大的 WordPress 内容管理，熟悉的编辑体验',
    color: 'from-cyber-pink to-cyber-red',
  },
  {
    icon: Globe,
    title: 'SEO 优化',
    description: '内置搜索引擎优化，自动生成 sitemap 和 RSS feed',
    color: 'from-cyber-green to-cyber-teal',
  },
];

export const FeatureSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative p-8 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan transition-all duration-300"
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300`} />

            {/* Icon */}
            <div className="relative mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}>
                <Icon size={32} className="text-white" />
              </div>
            </div>

            {/* Content */}
            <h3 className="relative text-2xl font-orbitron font-bold mb-4 text-white group-hover:text-cyber-cyan transition-colors">
              {feature.title}
            </h3>
            <p className="relative text-gray-400 leading-relaxed">
              {feature.description}
            </p>

            {/* Corner Decoration */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-lg" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeatureSection;
