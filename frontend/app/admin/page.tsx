'use client';

/**
 * Admin Dashboard Page
 * 管理后台首页
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import Link from 'next/link';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataCharts } from '@/components/admin/DataCharts';
import { QuickActions } from '@/components/admin/QuickActions';

interface DashboardStats {
  posts: {
    total: number;
    published: number;
    drafts: number;
    change: number;
  };
  users: {
    total: number;
    active: number;
    change: number;
  };
  comments: {
    total: number;
    pending: number;
    change: number;
  };
  views: {
    total: number;
    change: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    posts: { total: 156, published: 142, drafts: 14, change: 12 },
    users: { total: 2840, active: 1920, change: 8 },
    comments: { total: 3420, pending: 28, change: -5 },
    views: { total: 125000, change: 23 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-border bg-cyber-dark/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-cyber-cyan" />
              <h1 className="text-2xl font-bold text-white">管理后台</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/posts">
                <button className="px-4 py-2 bg-cyber-cyan/10 text-cyber-cyan rounded-lg hover:bg-cyber-cyan/20 transition-colors">
                  文章管理
                </button>
              </Link>
              <Link href="/admin/comments">
                <button className="px-4 py-2 bg-cyber-purple/10 text-cyber-purple rounded-lg hover:bg-cyber-purple/20 transition-colors">
                  评论审核
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">欢迎回来！</h2>
          <p className="text-gray-400">这是您的仪表盘概览</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Posts Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatsCard
              title="文章"
              value={stats.posts.total}
              icon={FileText}
              color="cyan"
              change={stats.posts.change}
              details={[
                { label: '已发布', value: stats.posts.published },
                { label: '草稿', value: stats.posts.drafts },
              ]}
            />
          </motion.div>

          {/* Users Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatsCard
              title="用户"
              value={stats.users.total}
              icon={Users}
              color="purple"
              change={stats.users.change}
              details={[
                { label: '活跃用户', value: stats.users.active },
              ]}
            />
          </motion.div>

          {/* Comments Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatsCard
              title="评论"
              value={stats.comments.total}
              icon={MessageSquare}
              color="pink"
              change={stats.comments.change}
              details={[
                { label: '待审核', value: stats.comments.pending },
              ]}
            />
          </motion.div>

          {/* Views Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatsCard
              title="浏览量"
              value={stats.views.total.toLocaleString()}
              icon={TrendingUp}
              color="green"
              change={stats.views.change}
            />
          </motion.div>
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <DataCharts />
        </motion.div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <QuickActions />
          </motion.div>

          {/* Pending Comments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="cyber-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyber-yellow" />
              待审核评论
            </h3>
            <div className="space-y-3">
              {[
                { id: 1, author: '张三', post: 'Next.js 14 完全指南', time: '2小时前', content: '非常有用的文章！' },
                { id: 2, author: '李四', post: '赛博朋克设计美学', time: '5小时前', content: '设计风格很独特' },
                { id: 3, author: '王五', post: 'TypeScript 高级技巧', time: '1天前', content: '学到了很多' },
              ].map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-cyber-dark/50 rounded-lg border border-cyber-border hover:border-cyber-cyan/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {comment.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{comment.author}</p>
                        <p className="text-xs text-gray-500">{comment.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-green-400 hover:bg-green-400/10 rounded transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{comment.post}</p>
                  <p className="text-sm text-gray-300 line-clamp-2">{comment.content}</p>
                </div>
              ))}
            </div>
            <Link href="/admin/comments">
              <button className="w-full mt-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-colors">
                查看全部评论 →
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
