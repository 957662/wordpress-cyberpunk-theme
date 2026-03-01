'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Eye, Heart, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: '总文章数',
      value: '128',
      change: 12,
      icon: FileText,
      trend: 'up' as const,
    },
    {
      title: '总访问量',
      value: '45.2K',
      change: 8,
      icon: Eye,
      trend: 'up' as const,
    },
    {
      title: '用户数',
      value: '1,234',
      change: 24,
      icon: Users,
      trend: 'up' as const,
    },
    {
      title: '点赞数',
      value: '8,456',
      change: -5,
      icon: Heart,
      trend: 'down' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">仪表盘</h1>
        <p className="text-gray-400">欢迎回来，管理员</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cyber-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">最近活动</h2>
            <button className="text-cyber-cyan text-sm hover:underline">查看全部</button>
          </div>
          <div className="space-y-4">
            {[
              { action: '发布了新文章', target: 'Next.js 14 新特性详解', time: '2 分钟前' },
              { action: '更新了', target: '赛博朋克设计系统', time: '1 小时前' },
              { action: '删除了', target: '旧版本备份', time: '3 小时前' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-3 bg-cyber-muted/50 rounded-lg">
                <div className="w-2 h-2 mt-2 rounded-full bg-cyber-cyan" />
                <div className="flex-1">
                  <p className="text-sm text-gray-300">
                    {activity.action} <span className="text-cyber-cyan">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trending Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyber-cyan" />
              热门文章
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Next.js 14 新特性详解', views: 1234, change: 12 },
              { title: '赛博朋克设计系统指南', views: 987, change: 8 },
              { title: 'TypeScript 最佳实践', views: 756, change: -3 },
            ].map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-cyber-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-300">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{post.views} 次浏览</p>
                </div>
                <div className={cn(
                  'text-sm font-medium',
                  post.change > 0 ? 'text-cyber-green' : 'text-cyber-pink'
                )}>
                  {post.change > 0 ? '+' : ''}{post.change}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
