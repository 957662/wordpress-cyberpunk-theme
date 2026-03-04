'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Zap, Shield, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    title: 'UI 组件',
    description: '80+ 精美 UI 组件，涵盖所有常见场景',
    icon: <Palette className="w-8 h-8" />,
    count: 80,
    color: 'from-cyan-500 to-blue-500',
    href: '/examples/ui-components',
  },
  {
    title: '赛博特效',
    description: '13 种炫酷的赛博朋克风格特效',
    icon: <Sparkles className="w-8 h-8" />,
    count: 13,
    color: 'from-purple-500 to-pink-500',
    href: '/effects-demo',
  },
  {
    title: '布局组件',
    description: '灵活的栅格系统和容器组件',
    icon: <Layers className="w-8 h-8" />,
    count: 3,
    color: 'from-green-500 to-emerald-500',
    href: '/examples/layout',
  },
  {
    title: '业务组件',
    description: '博客、作品集、认证等业务组件',
    icon: <Code className="w-8 h-8" />,
    count: 20,
    color: 'from-yellow-500 to-orange-500',
    href: '/examples/business',
  },
  {
    title: '工具函数',
    description: '字符串、数组、日期等工具函数',
    icon: <Zap className="w-8 h-8" />,
    count: 50,
    color: 'from-red-500 to-rose-500',
    href: '/examples/utils',
  },
  {
    title: '自定义 Hooks',
    description: '常用的 React 自定义 Hooks',
    icon: <Shield className="w-8 h-8" />,
    count: 30,
    color: 'from-indigo-500 to-violet-500',
    href: '/examples/hooks',
  },
];

export default function ComponentsShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6">
              组件展示中心
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              探索 CyberPress Platform 的 130+ 精美组件，每个组件都经过精心设计和优化
            </p>
          </motion.div>
        </div>
      </div>

      {/* 统计数据 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: '总组件数', value: '130+', color: 'text-cyan-400' },
            { label: 'UI 组件', value: '80+', color: 'text-purple-400' },
            { label: '特效组件', value: '13', color: 'text-pink-400' },
            { label: '自定义 Hooks', value: '30+', color: 'text-green-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center"
            >
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 分类卡片 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <div className="group relative h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden">
                  {/* 背景渐变 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  {/* 内容 */}
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${category.color} mb-4`}>
                      <div className="text-white">{category.icon}</div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {category.title}
                    </h3>

                    <p className="text-gray-400 mb-4">{category.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.count} 个组件
                      </span>
                      <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 特性列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">核心特性</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '✅ 完整的 TypeScript 类型支持',
              '✅ Tailwind CSS 赛博朋克主题',
              '✅ Framer Motion 动画效果',
              '✅ 响应式设计',
              '✅ 可访问性支持',
              '✅ 无外部依赖',
              '✅ 高性能优化',
              '✅ 易于自定义',
              '✅ 详细的文档',
            ].map((feature) => (
              <div key={feature} className="text-gray-300">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20"
      >
        <div className="text-center bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            开始使用这些组件
          </h3>
          <p className="text-gray-400 mb-6">
            立即开始在您的项目中使用这些精美的组件
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/docs"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
            >
              查看文档
            </Link>
            <Link
              href="/examples"
              className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              查看示例
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
