'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FileText,
  Image,
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { CyberChart } from '@/components/ui/CyberChart';

interface DashboardStats {
  posts: {
    total: number;
    published: number;
    drafts: number;
    growth: number;
  };
  views: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
    spam: number;
  };
  media: {
    total: number;
    size: string;
    recent: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'post' | 'comment' | 'user' | 'media';
  action: string;
  description: string;
  timestamp: string;
  user?: string;
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard', 'stats', selectedPeriod],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard/stats');
      return response.data;
    },
    refetchInterval: 30000, // 每30秒刷新
  });

  const { data: activity, isLoading: activityLoading } = useQuery<RecentActivity[]>({
    queryKey: ['admin', 'dashboard', 'activity'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard/activity');
      return response.data;
    },
    refetchInterval: 15000, // 每15秒刷新
  });

  const chartData = stats ? {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '页面浏览量',
        data: [1200, 1900, 1500, 2100, 1800, 2400, 2200],
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
      },
      {
        label: '独立访客',
        data: [800, 1200, 1000, 1400, 1200, 1600, 1500],
        borderColor: '#9d00ff',
        backgroundColor: 'rgba(157, 0, 255, 0.1)',
      },
    ],
  } : null;

  const statCards = [
    {
      title: '文章',
      value: stats?.posts.total || 0,
      icon: FileText,
      color: 'cyan',
      change: stats?.posts.growth || 0,
      details: [
        { label: '已发布', value: stats?.posts.published || 0 },
        { label: '草稿', value: stats?.posts.drafts || 0 },
      ],
    },
    {
      title: '浏览量',
      value: stats?.views.today || 0,
      icon: TrendingUp,
      color: 'purple',
      change: 12.5,
      details: [
        { label: '本周', value: stats?.views.thisWeek || 0 },
        { label: '本月', value: stats?.views.thisMonth || 0 },
      ],
    },
    {
      title: '评论',
      value: stats?.comments.pending || 0,
      icon: MessageSquare,
      color: 'pink',
      change: -5.2,
      details: [
        { label: '已批准', value: stats?.comments.approved || 0 },
        { label: '垃圾评论', value: stats?.comments.spam || 0 },
      ],
    },
    {
      title: '媒体',
      value: stats?.media.total || 0,
      icon: Image,
      color: 'green',
      change: 8.3,
      details: [
        { label: '总大小', value: stats?.media.size || '0 MB' },
        { label: '本周新增', value: stats?.media.recent || 0 },
      ],
    },
    {
      title: '用户',
      value: stats?.users.total || 0,
      icon: Users,
      color: 'yellow',
      change: 15.7,
      details: [
        { label: '活跃用户', value: stats?.users.active || 0 },
        { label: '新用户', value: stats?.users.new || 0 },
      ],
    },
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'post':
        return FileText;
      case 'comment':
        return MessageSquare;
      case 'user':
        return Users;
      case 'media':
        return Image;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'post':
        return 'text-cyber-cyan';
      case 'comment':
        return 'text-cyber-pink';
      case 'user':
        return 'text-cyber-purple';
      case 'media':
        return 'text-cyber-green';
      default:
        return 'text-cyber-yellow';
    }
  };

  if (statsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cyber-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyber-cyan"></div>
          <p className="mt-4 text-cyber-cyan">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-glow-cyan text-cyber-cyan mb-2">
          管理仪表板
        </h1>
        <p className="text-gray-400">欢迎回来！这是您的网站概览。</p>
      </motion.div>

      {/* 时间段选择器 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex gap-2"
      >
        {(['7d', '30d', '90d'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedPeriod === period
                ? 'bg-cyber-cyan text-cyber-dark shadow-[0_0_20px_rgba(0,240,255,0.5)]'
                : 'bg-cyber-muted text-gray-400 hover:bg-cyber-muted/80'
            }`}
          >
            {period === '7d' ? '最近7天' : period === '30d' ? '最近30天' : '最近90天'}
          </button>
        ))}
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="cyber-card p-6 rounded-lg relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl group-hover:bg-${stat.color}-500/20 transition-all`}></div>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                    <Icon className={`w-6 h-6 text-cyber-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {stat.details.map((detail, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-500">{detail.label}</span>
                    <span className="text-gray-300">{detail.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className={`mt-4 flex items-center gap-2 text-sm ${
                stat.change >= 0 ? 'text-cyber-green' : 'text-cyber-pink'
              }`}>
                <Activity className="w-4 h-4" />
                <span>{stat.change >= 0 ? '+' : ''}{stat.change}%</span>
                <span className="text-gray-500">较上期</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 图表和活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 流量趋势图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card p-6 rounded-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-cyber-cyan" />
              <h2 className="text-xl font-bold text-white">流量趋势</h2>
            </div>
            <Clock className="w-5 h-5 text-gray-500" />
          </div>

          {chartData && (
            <div className="h-80">
              <CyberChart
                type="line"
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#9ca3af',
                        font: { size: 12 },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: '#9ca3af',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: '#9ca3af',
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </motion.div>

        {/* 最近活动 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card p-6 rounded-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyber-purple" />
              <h2 className="text-xl font-bold text-white">最近活动</h2>
            </div>
            <span className="text-sm text-gray-500">实时更新</span>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {activity?.map((item, index) => {
              const Icon = getActivityIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 p-4 rounded-lg bg-cyber-muted/30 hover:bg-cyber-muted/50 transition-all"
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(item.type)} bg-opacity-20`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white">{item.action}</p>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-400">{item.description}</p>
                    {item.user && (
                      <p className="text-xs text-cyber-cyan mt-1">by {item.user}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {!activity || activity.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">暂无最近活动</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 快速操作 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="cyber-card p-6 rounded-lg"
      >
        <h2 className="text-xl font-bold text-white mb-6">快速操作</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '新建文章', icon: FileText, href: '/admin/posts/new', color: 'cyan' },
            { label: '上传媒体', icon: Image, href: '/admin/media', color: 'purple' },
            { label: '管理评论', icon: MessageSquare, href: '/admin/comments', color: 'pink' },
            { label: '用户管理', icon: Users, href: '/admin/users', color: 'green' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-3 p-6 rounded-lg bg-cyber-muted/30 hover:bg-cyber-muted/50 transition-all group"
              >
                <div className={`p-3 rounded-lg bg-cyber-${action.color}-500/20 group-hover:bg-cyber-${action.color}-500/30 transition-all`}>
                  <Icon className={`w-8 h-8 text-cyber-${action.color}`} />
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-all">
                  {action.label}
                </span>
              </a>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
