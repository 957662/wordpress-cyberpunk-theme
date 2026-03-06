/**
 * 分析页面 - 展示网站统计数据
 */

import React from 'react';
import { Metadata } from 'next';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: '数据分析 - CyberPress',
  description: '网站数据统计和分析',
};

const stats = [
  {
    label: '总访问量',
    value: '125,678',
    change: '+12.5%',
    trend: 'up',
    icon: Eye,
    color: 'text-cyber-cyan',
  },
  {
    label: '独立访客',
    value: '45,234',
    change: '+8.3%',
    trend: 'up',
    icon: Users,
    color: 'text-cyber-purple',
  },
  {
    label: '文章浏览',
    value: '89,456',
    change: '+15.2%',
    trend: 'up',
    icon: BarChart3,
    color: 'text-cyber-pink',
  },
  {
    label: '互动次数',
    value: '23,456',
    change: '-2.1%',
    trend: 'down',
    icon: Heart,
    color: 'text-cyber-green',
  },
];

const popularPosts = [
  {
    id: '1',
    title: 'Next.js 14 完全指南',
    views: 12543,
    likes: 856,
    comments: 124,
    trend: 'up',
  },
  {
    id: '2',
    title: 'TypeScript 最佳实践',
    views: 10234,
    likes: 723,
    comments: 89,
    trend: 'up',
  },
  {
    id: '3',
    title: '赛博朋克设计系统',
    views: 8765,
    likes: 654,
    comments: 67,
    trend: 'down',
  },
  {
    id: '4',
    title: 'React Server Components',
    views: 7654,
    likes: 543,
    comments: 45,
    trend: 'up',
  },
  {
    id: '5',
    title: 'Tailwind CSS 高级技巧',
    views: 6543,
    likes: 432,
    comments: 34,
    trend: 'up',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-cyber-cyan mb-4 neon-glow">
            数据分析
          </h1>
          <p className="text-gray-400 text-lg">
            实时监控网站数据和用户行为
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="cyber-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <div
                  className={`flex items-center gap-1 text-xs font-bold ${
                    stat.trend === 'up' ? 'text-cyber-green' : 'text-cyber-pink'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* 热门文章 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-cyber-cyan mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            热门文章
          </h2>
          <div className="space-y-4">
            {popularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-cyber-dark/50 rounded-lg hover:bg-cyber-dark/70 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {post.comments}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.trend === 'up' ? (
                    <ArrowUp className="w-5 h-5 text-cyber-green" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-cyber-pink" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 快速链接 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="cyber-card p-6">
            <h3 className="text-lg font-bold text-cyber-cyan mb-4">本周概览</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">新增文章</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">新增评论</span>
                <span className="text-white font-bold">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">新用户</span>
                <span className="text-white font-bold">34</span>
              </div>
            </div>
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-lg font-bold text-cyber-cyan mb-4">快速操作</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded bg-cyber-dark/50 text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors">
                导出数据报告
              </button>
              <button className="w-full text-left px-4 py-2 rounded bg-cyber-dark/50 text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors">
                查看详细分析
              </button>
              <button className="w-full text-left px-4 py-2 rounded bg-cyber-dark/50 text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors">
                设置数据追踪
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
