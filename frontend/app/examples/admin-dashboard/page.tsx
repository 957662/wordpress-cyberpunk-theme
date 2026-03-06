'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageSquare,
  BookOpen,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboardExample() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample statistics data
  const stats = [
    {
      title: '总浏览量',
      value: '125,432',
      change: 12.5,
      trend: 'up',
      icon: Eye,
      color: 'text-cyber-cyan',
    },
    {
      title: '新增用户',
      value: '1,234',
      change: 8.2,
      trend: 'up',
      icon: Users,
      color: 'text-cyber-purple',
    },
    {
      title: '文章数量',
      value: '456',
      change: 5.4,
      trend: 'up',
      icon: BookOpen,
      color: 'text-cyber-pink',
    },
    {
      title: '评论总数',
      value: '2,345',
      change: -2.1,
      trend: 'down',
      icon: MessageSquare,
      color: 'text-cyber-green',
    },
    {
      title: '点赞数',
      value: '8,901',
      change: 15.3,
      trend: 'up',
      icon: Heart,
      color: 'text-cyber-yellow',
    },
    {
      title: '活跃用户',
      value: '345',
      change: 3.7,
      trend: 'up',
      icon: Activity,
      color: 'text-cyber-red',
    },
  ];

  // Sample recent activity
  const recentActivities = [
    {
      id: '1',
      type: 'post',
      action: '发布了新文章',
      title: '如何使用 Next.js 14 构建高性能应用',
      user: '张三',
      time: '2分钟前',
    },
    {
      id: '2',
      type: 'comment',
      action: '评论了文章',
      title: 'React Server Components 完全指南',
      user: '李四',
      time: '5分钟前',
    },
    {
      id: '3',
      type: 'like',
      action: '点赞了文章',
      title: 'TypeScript 5.0 新特性详解',
      user: '王五',
      time: '10分钟前',
    },
    {
      id: '4',
      type: 'user',
      action: '注册了新用户',
      user: '赵六',
      time: '15分钟前',
    },
    {
      id: '5',
      type: 'bookmark',
      action: '收藏了文章',
      title: 'Web 性能优化最佳实践',
      user: '孙七',
      time: '20分钟前',
    },
  ];

  // Sample popular posts
  const popularPosts = [
    {
      id: '1',
      title: '如何构建高性能的 Next.js 14 应用',
      views: 12345,
      likes: 567,
      comments: 89,
      publishedAt: '2024-03-06',
    },
    {
      id: '2',
      title: 'React Server Components 完全指南',
      views: 9876,
      likes: 432,
      comments: 65,
      publishedAt: '2024-03-05',
    },
    {
      id: '3',
      title: 'TypeScript 5.0 新特性详解',
      views: 7654,
      likes: 321,
      comments: 43,
      publishedAt: '2024-03-04',
    },
    {
      id: '4',
      title: 'Web 性能优化最佳实践',
      views: 6543,
      likes: 289,
      comments: 32,
      publishedAt: '2024-03-03',
    },
    {
      id: '5',
      title: '深入理解 JavaScript 闭包',
      views: 5432,
      likes: 234,
      comments: 28,
      publishedAt: '2024-03-02',
    },
  ];

  // Sample traffic data (would be real data in production)
  const trafficData = [
    { date: '03-01', pageViews: 1200, uniqueVisitors: 800 },
    { date: '03-02', pageViews: 1450, uniqueVisitors: 950 },
    { date: '03-03', pageViews: 1100, uniqueVisitors: 750 },
    { date: '03-04', pageViews: 1600, uniqueVisitors: 1050 },
    { date: '03-05', pageViews: 1800, uniqueVisitors: 1200 },
    { date: '03-06', pageViews: 2000, uniqueVisitors: 1300 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">管理仪表板</h1>
            <p className="text-gray-400">欢迎回来！这是您的网站数据概览。</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-cyber-dark border border-cyber-cyan/30 rounded-lg p-2">
              <Button
                size="sm"
                variant={timeRange === '7d' ? 'neon' : 'ghost'}
                onClick={() => setTimeRange('7d')}
              >
                7天
              </Button>
              <Button
                size="sm"
                variant={timeRange === '30d' ? 'neon' : 'ghost'}
                onClick={() => setTimeRange('30d')}
              >
                30天
              </Button>
              <Button
                size="sm"
                variant={timeRange === '90d' ? 'neon' : 'ghost'}
                onClick={() => setTimeRange('90d')}
              >
                90天
              </Button>
            </div>
            <Calendar className="text-cyber-cyan" />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:border-cyber-cyan/50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon size={20} className={stat.color} />
                      <h3 className="text-sm text-gray-400">{stat.title}</h3>
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="flex items-center gap-2 text-sm">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight size={16} className="text-green-500" />
                      ) : (
                        <ArrowDownRight size={16} className="text-red-500" />
                      )}
                      <span
                        className={
                          stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {stat.change > 0 ? '+' : ''}
                        {stat.change}%
                      </span>
                      <span className="text-gray-500">vs 上期</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Chart */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">流量趋势</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {trafficData.map((data, index) => (
                  <motion.div
                    key={data.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="w-full flex gap-1 items-end justify-center h-48">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.pageViews / 2000) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-4 bg-gradient-to-t from-cyber-cyan to-cyber-purple rounded-t"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{
                          height: `${(data.uniqueVisitors / 1300) * 100}%`,
                        }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-4 bg-gradient-to-t from-cyber-pink to-cyber-yellow rounded-t"
                      />
                    </div>
                    <div className="text-xs text-gray-500">{data.date}</div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-cyber-cyan to-cyber-purple rounded" />
                  <span className="text-gray-400">页面浏览量</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-cyber-pink to-cyber-yellow rounded" />
                  <span className="text-gray-400">独立访客</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">最近活动</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 pb-3 border-b border-cyber-cyan/10 last:border-0 last:pb-0"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === 'post'
                          ? 'bg-cyber-purple/20 text-cyber-purple'
                          : activity.type === 'comment'
                          ? 'bg-cyber-cyan/20 text-cyber-cyan'
                          : activity.type === 'like'
                          ? 'bg-cyber-pink/20 text-cyber-pink'
                          : activity.type === 'user'
                          ? 'bg-cyber-green/20 text-cyber-green'
                          : 'bg-cyber-yellow/20 text-cyber-yellow'
                      }`}
                    >
                      {activity.type === 'post' && <BookOpen size={16} />}
                      {activity.type === 'comment' && <MessageSquare size={16} />}
                      {activity.type === 'like' && <Heart size={16} />}
                      {activity.type === 'user' && <Users size={16} />}
                      {activity.type === 'bookmark' && <Activity size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-bold">{activity.user}</span>{' '}
                        {activity.action}
                      </p>
                      {activity.title && (
                        <p className="text-xs text-gray-400 truncate">
                          {activity.title}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Popular Posts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">热门文章</h2>
            <Button variant="ghost" size="sm">
              查看全部
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-cyan/20">
                  <th className="text-left p-3 text-sm text-gray-400">标题</th>
                  <th className="text-left p-3 text-sm text-gray-400">浏览量</th>
                  <th className="text-left p-3 text-sm text-gray-400">点赞</th>
                  <th className="text-left p-3 text-sm text-gray-400">评论</th>
                  <th className="text-left p-3 text-sm text-gray-400">发布时间</th>
                  <th className="text-left p-3 text-sm text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {popularPosts.map((post, index) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-cyber-cyan/10 hover:bg-cyber-cyan/5"
                  >
                    <td className="p-3">
                      <div className="font-medium">{post.title}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-cyber-cyan">
                        <Eye size={14} />
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-cyber-pink">
                        <Heart size={14} />
                        {post.likes}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-cyber-purple">
                        <MessageSquare size={14} />
                        {post.comments}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-400">
                      {post.publishedAt}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          编辑
                        </Button>
                        <Button variant="ghost" size="sm">
                          删除
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">快捷操作</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="neon" className="flex flex-col gap-2 h-auto py-4">
              <BookOpen size={24} />
              <span>新建文章</span>
            </Button>
            <Button variant="ghost" className="flex flex-col gap-2 h-auto py-4">
              <Users size={24} />
              <span>用户管理</span>
            </Button>
            <Button variant="ghost" className="flex flex-col gap-2 h-auto py-4">
              <MessageSquare size={24} />
              <span>评论审核</span>
            </Button>
            <Button variant="ghost" className="flex flex-col gap-2 h-auto py-4">
              <Activity size={24} />
              <span>系统设置</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
