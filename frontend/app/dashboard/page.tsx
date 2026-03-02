/**
 * Dashboard Page
 * 仪表板主页
 */

'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { CyberCard } from '@/components/ui/CyberCard';
import { Button } from '@/components/ui/Button';

// 模拟数据
const stats = [
  {
    title: '总文章数',
    value: '156',
    change: '+12%',
    trend: 'up',
    icon: FileText,
    color: 'cyan',
  },
  {
    title: '总用户数',
    value: '2,847',
    change: '+8%',
    trend: 'up',
    icon: Users,
    color: 'purple',
  },
  {
    title: '今日浏览',
    value: '1,234',
    change: '-3%',
    trend: 'down',
    icon: Eye,
    color: 'pink',
  },
  {
    title: '新评论',
    value: '89',
    change: '+24%',
    trend: 'up',
    icon: MessageSquare,
    color: 'cyan',
  },
];

const recentPosts = [
  {
    id: 1,
    title: '深入理解 Next.js 14 服务端组件',
    status: 'published',
    views: 1234,
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'React Server Actions 完全指南',
    status: 'published',
    views: 856,
    date: '2024-01-14',
  },
  {
    id: 3,
    title: 'TypeScript 高级技巧',
    status: 'draft',
    views: 0,
    date: '2024-01-13',
  },
  {
    id: 4,
    title: 'Tailwind CSS 性能优化',
    status: 'published',
    views: 2341,
    date: '2024-01-12',
  },
];

const recentComments = [
  {
    id: 1,
    author: 'John Doe',
    post: '深入理解 Next.js 14 服务端组件',
    content: '非常实用的文章，解决了我的问题！',
    date: '2 小时前',
  },
  {
    id: 2,
    author: 'Jane Smith',
    post: 'React Server Actions 完全指南',
    content: '写得很好，期待更多内容。',
    date: '5 小时前',
  },
  {
    id: 3,
    author: 'Bob Johnson',
    post: 'TypeScript 高级技巧',
    content: '有没有关于泛型的更多例子？',
    date: '1 天前',
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            仪表板
          </h1>
          <p className="text-gray-400">
            欢迎回来！这是您的网站概览。
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color as 'cyan' | 'purple' | 'pink'}
                trend={{
                  value: stat.change,
                  direction: stat.trend as 'up' | 'down',
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <CyberCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-white">
                  最新文章
                </h2>
                <Button variant="ghost" size="sm">
                  查看全部
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                        标题
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                        状态
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                        浏览
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                        日期
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPosts.map((post, index) => (
                      <motion.tr
                        key={post.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-cyber-border hover:bg-cyber-cyan/5 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="text-white font-medium">{post.title}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            post.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {post.status === 'published' ? '已发布' : '草稿'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {post.views.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {post.date}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CyberCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Comments */}
            <CyberCard>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                最新评论
              </h2>

              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-lg bg-cyber-dark border border-cyber-border"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-sm font-bold text-white">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {comment.author}
                        </p>
                        <p className="text-xs text-gray-500">{comment.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                      {comment.content}
                    </p>
                    <p className="text-xs text-cyber-cyan truncate">
                      {comment.post}
                    </p>
                  </div>
                ))}
              </div>
            </CyberCard>

            {/* Quick Actions */}
            <CyberCard>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                快速操作
              </h2>

              <div className="space-y-2">
                <Button fullWidth className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  新建文章
                </Button>
                <Button variant="outline" fullWidth className="justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  管理用户
                </Button>
                <Button variant="outline" fullWidth className="justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  审核评论
                </Button>
              </div>
            </CyberCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
