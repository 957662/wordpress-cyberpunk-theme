/**
 * Admin Dashboard Page
 * 管理后台仪表板页面
 */

'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout, { StatCard, PageHeader } from '@/components/admin/AdminLayout';
import {
  FileText,
  Eye,
  MessageSquare,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalUsers: number;
  postsChange: string;
  viewsChange: string;
  commentsChange: string;
  usersChange: string;
}

interface RecentPost {
  id: number;
  title: string;
  status: 'published' | 'draft' | 'pending';
  views: number;
  comments: number;
  createdAt: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: 'cyan' | 'purple' | 'green' | 'orange';
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: '新建文章',
    description: '创建并发布新文章',
    icon: <FileText className="w-6 h-6" />,
    href: '/admin/posts/new',
    color: 'cyan',
  },
  {
    title: '管理评论',
    description: '审核和管理用户评论',
    icon: <MessageSquare className="w-6 h-6" />,
    href: '/admin/comments',
    color: 'purple',
  },
  {
    title: '上传媒体',
    description: '上传图片和视频',
    icon: <FileText className="w-6 h-6" />,
    href: '/admin/media/upload',
    color: 'green',
  },
  {
    title: '用户管理',
    description: '管理网站用户',
    icon: <Users className="w-6 h-6" />,
    href: '/admin/users',
    color: 'orange',
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 156,
    totalViews: 45678,
    totalComments: 1234,
    totalUsers: 890,
    postsChange: '+12%',
    viewsChange: '+23%',
    commentsChange: '+8%',
    usersChange: '+15%',
  });

  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([
    {
      id: 1,
      title: '如何使用 FastAPI 构建高性能 API',
      status: 'published',
      views: 1234,
      comments: 45,
      createdAt: '2024-03-01',
    },
    {
      id: 2,
      title: 'Next.js 14 新特性详解',
      status: 'published',
      views: 987,
      comments: 32,
      createdAt: '2024-02-28',
    },
    {
      id: 3,
      title: '赛博朋克设计指南',
      status: 'draft',
      views: 0,
      comments: 0,
      createdAt: '2024-02-27',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-600/20 text-green-400';
      case 'draft':
        return 'bg-gray-600/20 text-gray-400';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'pending':
        return '待审核';
      default:
        return '未知';
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="仪表板"
        description="欢迎回来！这是您的网站概览"
        actions={
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Calendar className="w-4 h-4 mr-2" />
            查看报告
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="文章总数"
          value={stats.totalPosts}
          change={stats.postsChange}
          icon={<FileText className="w-6 h-6" />}
          color="cyan"
        />
        <StatCard
          title="总浏览量"
          value={stats.totalViews.toLocaleString()}
          change={stats.viewsChange}
          icon={<Eye className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="评论总数"
          value={stats.totalComments}
          change={stats.commentsChange}
          icon={<MessageSquare className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="用户总数"
          value={stats.totalUsers}
          change={stats.usersChange}
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近文章 */}
        <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>最近文章</span>
              <Button variant="link" className="text-cyan-500 hover:text-cyan-400">
                查看全部
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium mb-1 truncate">{post.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(post.status)}`}>
                        {getStatusText(post.status)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.createdAt}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    编辑
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 快速操作 */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {QUICK_ACTIONS.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{action.title}</h4>
                    <p className="text-gray-400 text-xs">{action.description}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-500 transition-colors" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 系统状态 */}
      <Card className="mt-6 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            系统状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
              <div>
                <p className="text-gray-400 text-sm">服务器状态</p>
                <p className="text-white font-medium mt-1">运行中</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
              <div>
                <p className="text-gray-400 text-sm">数据库</p>
                <p className="text-white font-medium mt-1">正常</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
              <div>
                <p className="text-gray-400 text-sm">缓存</p>
                <p className="text-white font-medium mt-1">已启用</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
