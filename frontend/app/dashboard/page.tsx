'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Users, 
  TrendingUp, 
  Clock,
  FileText,
  Activity
} from 'lucide-react';
import { BarChart } from '@/components/charts';
import { cn } from '@/lib/utils';

// 示例数据
const visitorData = [
  { label: '周一', value: 1200 },
  { label: '周二', value: 1900 },
  { label: '周三', value: 1500 },
  { label: '周四', value: 2200 },
  { label: '周五', value: 1800 },
  { label: '周六', value: 2400 },
  { label: '周日', value: 2100 },
];

const postViewsData = [
  { label: '文章 A', value: 3500 },
  { label: '文章 B', value: 2800 },
  { label: '文章 C', value: 2200 },
  { label: '文章 D', value: 1900 },
  { label: '文章 E', value: 1500 },
];

const categoryData = [
  { label: '技术', value: 45 },
  { label: '生活', value: 25 },
  { label: '随笔', value: 20 },
  { label: '其他', value: 10 },
];

export default function DashboardPage() {
  const stats = [
    {
      title: '总访问量',
      value: '12,345',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'cyan',
    },
    {
      title: '文章总数',
      value: '89',
      change: '+3',
      trend: 'up',
      icon: FileText,
      color: 'purple',
    },
    {
      title: '平均阅读时长',
      value: '4:32',
      change: '+8.2%',
      trend: 'up',
      icon: Clock,
      color: 'pink',
    },
    {
      title: '活跃度',
      value: '78%',
      change: '-2.1%',
      trend: 'down',
      icon: Activity,
      color: 'green',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white">数据仪表盘</h1>
          <p className="text-sm text-gray-400 mt-1">
            查看您的网站数据和统计信息
          </p>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              cyan: 'from-cyan-500 to-blue-500',
              purple: 'from-purple-500 to-pink-500',
              pink: 'from-pink-500 to-rose-500',
              green: 'from-green-500 to-emerald-500',
            };

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm hover:border-gray-600 transition-all"
              >
                <div className={cn(
                  'absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity',
                  colorClasses[stat.color as keyof typeof colorClasses]
                )} />

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={cn(
                      'rounded-lg bg-gradient-to-br p-3',
                      colorClasses[stat.color as keyof typeof colorClasses],
                      'opacity-20'
                    )}>
                      <Icon className={cn(
                        'h-6 w-6',
                        stat.color === 'cyan' && 'text-cyan-400',
                        stat.color === 'purple' && 'text-purple-400',
                        stat.color === 'pink' && 'text-pink-400',
                        stat.color === 'green' && 'text-green-400'
                      )} />
                    </div>
                    <span className={cn(
                      'text-sm font-medium',
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    )}>
                      {stat.change}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Visitor Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">访问量趋势</h3>
                <p className="text-sm text-gray-400 mt-1">最近7天</p>
              </div>
              <BarChart3 className="h-5 w-5 text-cyan-400" />
            </div>
            <BarChart data={visitorData} height={200} showGrid />
          </motion.div>

          {/* Post Views Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">热门文章</h3>
                <p className="text-sm text-gray-400 mt-1">浏览量排行</p>
              </div>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <BarChart 
              data={postViewsData} 
              height={200} 
              orientation="horizontal"
              showGrid 
            />
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm lg:col-span-2"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">分类分布</h3>
                <p className="text-sm text-gray-400 mt-1">文章分类统计</p>
              </div>
              <PieChart className="h-5 w-5 text-pink-400" />
            </div>
            <BarChart 
              data={categoryData.map(d => ({ ...d, value: d.value * 100 }))}
              height={150}
              colorScheme="pink"
            />
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold text-white mb-4">最近活动</h3>
          <div className="space-y-4">
            {[
              { action: '发布了新文章', target: '如何使用 Next.js 14', time: '2小时前' },
              { action: '更新了', target: 'React Hooks 最佳实践', time: '5小时前' },
              { action: '收到评论', target: '关于 TypeScript 的讨论', time: '1天前' },
              { action: '发布了新文章', target: '赛博朋克设计指南', time: '2天前' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between rounded-lg bg-gray-900/50 px-4 py-3 hover:bg-gray-900/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-sm text-gray-300">
                    {activity.action} <span className="text-white font-medium">{activity.target}</span>
                  </span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
