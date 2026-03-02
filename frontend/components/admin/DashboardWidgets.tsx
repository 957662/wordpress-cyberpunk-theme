/**
 * 仪表板小部件
 * 显示关键指标和快捷操作
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  Eye,
  ThumbsUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  trend?: 'up' | 'down' | 'neutral';
}

function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = 'cyan',
  trend,
}: MetricCardProps) {
  const colorClasses = {
    cyan: 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10',
    purple: 'text-cyber-purple border-cyber-purple/30 bg-cyber-purple/10',
    pink: 'text-cyber-pink border-cyber-pink/30 bg-cyber-pink/10',
    green: 'text-cyber-green border-cyber-green/30 bg-cyber-green/10',
    yellow: 'text-cyber-yellow border-cyber-yellow/30 bg-cyber-yellow/10',
  };

  const trendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : null;
  const trendColor = trend === 'up' ? 'text-cyber-green' : trend === 'down' ? 'text-cyber-pink' : 'text-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && trendIcon && (
            <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
              {change !== undefined && <span>{change}%</span>}
              <trendIcon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-display font-bold">{value}</p>
          {changeLabel && (
            <p className="text-xs text-gray-500 mt-1">{changeLabel}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export interface AnalyticsChartProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  type?: 'line' | 'bar';
  color?: string;
}

function AnalyticsChart({ title, data, type = 'line', color = '#00f0ff' }: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const height = 200;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-display font-bold mb-4">{title}</h3>
      <div className="relative" style={{ height }}>
        {type === 'bar' ? (
          <div className="flex items-end justify-between gap-2 h-full">
            {data.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / maxValue) * 100}%` }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 bg-gradient-to-t from-cyber-cyan/20 to-cyber-cyan/80 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-cyber-dark px-2 py-1 rounded text-xs whitespace-nowrap">
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <svg className="w-full h-full" viewBox={`0 0 ${data.length * 40} ${height}`}>
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={data.map((item, index) => `${index * 40},${height - (item.value / maxValue) * height}`).join(' ')}
            />
            {data.map((item, index) => (
              <circle
                key={item.label}
                cx={index * 40}
                cy={height - (item.value / maxValue) * height}
                r="4"
                fill={color}
                className="hover:r-6 transition-all cursor-pointer"
              />
            ))}
          </svg>
        )}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export interface RecentActivityProps {
  activities: Array<{
    id: string;
    type: 'post' | 'comment' | 'user' | 'like';
    title: string;
    time: string;
    status?: 'published' | 'draft' | 'pending' | 'approved';
  }>;
}

function RecentActivity({ activities }: RecentActivityProps) {
  const icons = {
    post: FileText,
    comment: MessageSquare,
    user: Users,
    like: ThumbsUp,
  };

  const statusColors = {
    published: 'bg-cyber-green/20 text-cyber-green',
    draft: 'bg-yellow-500/20 text-yellow-500',
    pending: 'bg-cyber-yellow/20 text-cyber-yellow',
    approved: 'bg-cyber-cyan/20 text-cyber-cyan',
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-display font-bold mb-4">最近活动</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = icons[activity.type];
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-cyber-muted/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-cyber-cyan/10">
                <Icon className="w-4 h-4 text-cyber-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              {activity.status && (
                <Badge variant="outline" className={statusColors[activity.status]}>
                  {activity.status}
                </Badge>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

export interface QuickActionsProps {
  actions: Array<{
    label: string;
    icon: React.ElementType;
    href: string;
    color?: 'cyan' | 'purple' | 'pink' | 'green';
  }>;
}

function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-display font-bold mb-4">快捷操作</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.a
              key={action.label}
              href={action.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border ${
                action.color === 'cyan'
                  ? 'border-cyber-cyan/30 hover:bg-cyber-cyan/10'
                  : action.color === 'purple'
                  ? 'border-cyber-purple/30 hover:bg-cyber-purple/10'
                  : action.color === 'pink'
                  ? 'border-cyber-pink/30 hover:bg-cyber-pink/10'
                  : 'border-cyber-green/30 hover:bg-cyber-green/10'
              } transition-all text-center group`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2 text-cyber-cyan group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{action.label}</span>
            </motion.a>
          );
        })}
      </div>
    </Card>
  );
}

// 主组件
export function DashboardWidgets() {
  const [metrics, setMetrics] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalUsers: 0,
  });

  const [chartData, setChartData] = useState([
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 200 },
    { label: 'Wed', value: 150 },
    { label: 'Thu', value: 280 },
    { label: 'Fri', value: 220 },
    { label: 'Sat', value: 180 },
    { label: 'Sun', value: 240 },
  ]);

  const [recentActivities] = useState([
    { id: '1', type: 'post' as const, title: '新文章发布：Next.js 14 最佳实践', time: '2小时前', status: 'published' as const },
    { id: '2', type: 'comment' as const, title: '张三 评论了 "TypeScript 进阶教程"', time: '4小时前', status: 'pending' as const },
    { id: '3', type: 'user' as const, title: '新用户注册：李四', time: '5小时前', status: 'approved' as const },
    { id: '4', type: 'like' as const, title: '王五 赞了 "React Hooks 详解"', time: '6小时前', status: 'approved' as const },
    { id: '5', type: 'post' as const, title: '文章更新：Tailwind CSS 完全指南', time: '1天前', status: 'draft' as const },
  ]);

  const [quickActions] = useState([
    { label: '新建文章', icon: FileText, href: '/admin/posts/new', color: 'cyan' as const },
    { label: '管理评论', icon: MessageSquare, href: '/admin/comments', color: 'purple' as const },
    { label: '用户管理', icon: Users, href: '/admin/users', color: 'pink' as const },
    { label: '数据统计', icon: TrendingUp, href: '/admin/analytics', color: 'green' as const },
  ]);

  useEffect(() => {
    // 模拟获取数据
    setMetrics({
      totalPosts: 128,
      totalViews: 45680,
      totalComments: 1234,
      totalUsers: 567,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* 指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="总文章数"
          value={metrics.totalPosts}
          change={12}
          changeLabel="较上月"
          icon={FileText}
          color="cyan"
          trend="up"
        />
        <MetricCard
          title="总浏览量"
          value={metrics.totalViews.toLocaleString()}
          change={8}
          changeLabel="较上月"
          icon={Eye}
          color="purple"
          trend="up"
        />
        <MetricCard
          title="评论数"
          value={metrics.totalComments}
          change={-3}
          changeLabel="较上月"
          icon={MessageSquare}
          color="pink"
          trend="down"
        />
        <MetricCard
          title="用户数"
          value={metrics.totalUsers}
          change={15}
          changeLabel="较上月"
          icon={Users}
          color="green"
          trend="up"
        />
      </div>

      {/* 图表和活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart title="本周访问量" data={chartData} type="bar" />
        </div>
        <div>
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

      {/* 快捷操作 */}
      <QuickActions actions={quickActions} />
    </div>
  );
}

export default DashboardWidgets;
