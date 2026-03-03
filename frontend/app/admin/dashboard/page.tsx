'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/AuthProvider';
import { CyberCard } from '@/components/cyber/CyberCard';
import { CyberStatCard } from '@/components/ui/CyberStatCard';

interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  totalComments: number;
  publishedPosts: number;
  draftPosts: number;
  recentActivity: ActivityItem[];
  viewsOverTime: ViewsData[];
}

interface ActivityItem {
  id: string;
  type: 'post' | 'comment' | 'user';
  title: string;
  date: string;
  author: string;
}

interface ViewsData {
  date: string;
  views: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchDashboardStats();
  }, [dateRange]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`/api/admin/dashboard?range=${dateRange}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="cyber-loader" />
      </div>
    );
  }

  const statCards = [
    {
      title: '文章总数',
      value: stats?.totalPosts || 0,
      change: '+12%',
      icon: FileText,
      color: 'cyber-cyan',
    },
    {
      title: '用户总数',
      value: stats?.totalUsers || 0,
      change: '+8%',
      icon: Users,
      color: 'cyber-purple',
    },
    {
      title: '总浏览量',
      value: stats?.totalViews || 0,
      change: '+23%',
      icon: Eye,
      color: 'cyber-pink',
    },
    {
      title: '评论总数',
      value: stats?.totalComments || 0,
      change: '+15%',
      icon: MessageSquare,
      color: 'cyber-green',
    },
  ];

  return (
    <ProtectedRoute requireCapability="manage_options">
      <div className="min-h-screen bg-gray-900 p-6">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyber-cyan mb-2">仪表盘</h1>
          <p className="text-gray-400">欢迎回到 CyberPress 管理后台</p>
        </div>

        {/* 日期选择器 */}
        <div className="mb-6 flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg transition-all ${
                dateRange === range
                  ? 'bg-cyber-cyan text-gray-900'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range === '7d' ? '最近7天' : range === '30d' ? '最近30天' : '最近90天'}
            </button>
          ))}
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CyberStatCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                color={stat.color}
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 浏览量趋势 */}
          <div className="lg:col-span-2">
            <CyberCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-cyber-cyan">浏览量趋势</h2>
                <TrendingUp className="w-5 h-5 text-cyber-green" />
              </div>
              <div className="h-64 flex items-center justify-center">
                {stats?.viewsOverTime && stats.viewsOverTime.length > 0 ? (
                  <div className="w-full h-full">
                    {/* 这里可以集成图表库，如 recharts 或 chart.js */}
                    <div className="flex items-end justify-between h-full pb-4 px-2">
                      {stats.viewsOverTime.slice(-7).map((item, index) => (
                        <motion.div
                          key={item.date}
                          initial={{ height: 0 }}
                          animate={{ height: `${(item.views / Math.max(...stats.viewsOverTime.map(v => v.views))) * 100}%` }}
                          transition={{ delay: index * 0.1 }}
                          className="flex-1 mx-1 bg-gradient-to-t from-cyber-purple to-cyber-cyan rounded-t-lg relative group"
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.views}
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                            {new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">暂无数据</p>
                )}
              </div>
            </CyberCard>
          </div>

          {/* 文章状态 */}
          <div>
            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-cyber-cyan mb-6">文章状态</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-cyber-green"></div>
                    <span className="text-gray-300">已发布</span>
                  </div>
                  <span className="text-xl font-bold text-cyber-green">
                    {stats?.publishedPosts || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-cyber-yellow"></div>
                    <span className="text-gray-300">草稿</span>
                  </div>
                  <span className="text-xl font-bold text-cyber-yellow">
                    {stats?.draftPosts || 0}
                  </span>
                </div>
              </div>
            </CyberCard>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="mt-6">
          <CyberCard className="p-6">
            <h2 className="text-xl font-bold text-cyber-cyan mb-6">最近活动</h2>
            <div className="space-y-4">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'post' ? 'bg-cyber-cyan/20' :
                      activity.type === 'comment' ? 'bg-cyber-purple/20' :
                      'bg-cyber-pink/20'
                    }`}>
                      {activity.type === 'post' && <FileText className="w-5 h-5 text-cyber-cyan" />}
                      {activity.type === 'comment' && <MessageSquare className="w-5 h-5 text-cyber-purple" />}
                      {activity.type === 'user' && <Users className="w-5 h-5 text-cyber-pink" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        {activity.author} • {activity.date}
                      </p>
                    </div>
                    <Clock className="w-5 h-5 text-gray-500" />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">暂无活动记录</p>
              )}
            </div>
          </CyberCard>
        </div>

        {/* 快捷操作 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <CyberCard className="p-6 hover:scale-105 transition-transform cursor-pointer">
            <FileText className="w-8 h-8 text-cyber-cyan mb-4" />
            <h3 className="text-lg font-bold text-gray-300 mb-2">新建文章</h3>
            <p className="text-sm text-gray-400">创建并发布新的博客文章</p>
          </CyberCard>

          <CyberCard className="p-6 hover:scale-105 transition-transform cursor-pointer">
            <Users className="w-8 h-8 text-cyber-purple mb-4" />
            <h3 className="text-lg font-bold text-gray-300 mb-2">用户管理</h3>
            <p className="text-sm text-gray-400">管理网站用户和权限</p>
          </CyberCard>

          <CyberCard className="p-6 hover:scale-105 transition-transform cursor-pointer">
            <BarChart3 className="w-8 h-8 text-cyber-pink mb-4" />
            <h3 className="text-lg font-bold text-gray-300 mb-2">统计分析</h3>
            <p className="text-sm text-gray-400">查看详细的网站统计数据</p>
          </CyberCard>
        </div>
      </div>
    </ProtectedRoute>
  );
}
