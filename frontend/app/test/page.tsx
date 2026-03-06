/**
 * Test Page - 测试页面
 * 用于验证所有核心功能是否正常工作
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { ArticleCard } from '@/components/blog';
import { GlitchText } from '@/components/effects/GlitchText';
import { Logo } from '@/components/icons';

// 测试数据
const testPost = {
  id: '1',
  title: '测试文章标题',
  slug: 'test-post',
  excerpt: '这是一篇测试文章的摘要。用于验证 ArticleCard 组件是否正常工作。',
  publishedAt: new Date().toISOString(),
  readTime: 5,
  viewCount: 100,
  likeCount: 20,
  commentCount: 5,
  author: {
    name: '测试作者',
    avatar: undefined,
  },
  categories: [
    {
      name: '测试',
      slug: 'test',
      color: '#00f0ff',
    },
  ],
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <Logo size={64} className="text-cyber-cyan" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            <GlitchText text="CyberPress 测试页面" />
          </h1>
          <p className="text-gray-400">
            验证所有核心组件是否正常工作
          </p>
        </motion.div>

        {/* 按钮测试 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">按钮组件测试</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">主要按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="outline">轮廓按钮</Button>
            <Button variant="ghost">幽灵按钮</Button>
            <Button variant="danger">危险按钮</Button>
          </div>
        </motion.section>

        {/* 文章卡片测试 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">文章卡片测试</h2>
          <div className="max-w-2xl">
            <ArticleCard {...testPost} />
          </div>
        </motion.section>

        {/* 颜色测试 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">赛博朋克配色</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '霓虹青', color: 'bg-cyber-cyan' },
              { name: '赛博紫', color: 'bg-cyber-purple' },
              { name: '激光粉', color: 'bg-cyber-pink' },
              { name: '电压黄', color: 'bg-cyber-yellow' },
              { name: '矩阵绿', color: 'bg-cyber-green' },
              { name: '火焰橙', color: 'bg-cyber-orange' },
            ].map((color) => (
              <div
                key={color.name}
                className={`${color.color} p-6 rounded-lg text-center`}
              >
                <div className="font-bold text-cyber-dark">{color.name}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 动画测试 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">动画效果</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['glow', 'flicker', 'scan', 'float'].map((anim) => (
              <motion.div
                key={anim}
                className={`cyber-card p-6 text-center animate-${anim}`}
              >
                <div className="text-cyber-cyan font-bold">{anim}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 返回首页 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            返回首页
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
