'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MessageSquare,
  Heart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart
} from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';
import { CyberButton } from '@/components/ui/CyberButton';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  period: string;
  icon: React.ElementType;
  color: 'cyan' | 'purple' | 'pink' | 'green';
}

interface ChartData {
  labels: string[];
  values: number[];
}

interface RecentActivity {
  id: string;
  type: 'view' | 'like' | 'comment' | 'share';
  title: string;
  time: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [stats, setStats] = useState<StatCard[]>([]);
  const [chartData, setChartData] = useState<ChartData>({ labels: [], values: [] });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // 模拟数据加载
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockStats: StatCard[] = [
      {
        title: '总访问量',
        value: formatNumber(45230 + Math.random() * 10000),
        change: 12.5,
        period: '较上期',
        icon: Eye,
        color: 'cyan',
      },
      {
        title: '新增用户',
        value: formatNumber(1234 + Math.random() * 500),
        change: 8.3,
        period: '较上期',
        icon: Users,
        color: 'purple',
      },
      {
        title: '互动数',
        value: formatNumber(8765 + Math.random() * 2000),
        change: -2.4,
        period: '较上期',
        icon: Heart,
        color: 'pink',
      },
      {
        title: '评论数',
        value: formatNumber(432 + Math.random() * 200),
        change: 15.7,
        period: '较上期',
        icon: MessageSquare,
        color: 'green',
      },
    ];

    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const mockChartData: ChartData = {
      labels: Array.from({ length: days }, (_, i) => `Day ${i + 1}`),
      values: Array.from({ length: days }, () => Math.floor(Math.random() * 1000)),
    };

    const mockActivity: RecentActivity[] = [
      { id: '1', type: 'view', title: '文章「如何使用 TypeScript」被查看', time: '2 分钟前' },
      { id: '2', type: 'like', title: '小明点赞了你的评论', time: '15 分钟前' },
      { id: '3', type: 'comment', title: '小红在「React Hooks 教程」中留言', time: '1 小时前' },
      { id: '4', type: 'share', title: '文章「Next.js 14 新特性」被分享', time: '3 小时前' },
      { id: '5', type: 'view', title: '文章「赛博朋克设计指南」被查看', time: '5 小时前' },
    ];

    setStats(mockStats);
    setChartData(mockChartData);
    setRecentActivity(mockActivity);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      cyan: {
        bg: 'bg-cyber-cyan/10',
        text: 'text-cyber-cyan',
        border: 'border-cyber-cyan/30',
      },
      purple: {
        bg: 'bg-cyber-purple/10',
        text: 'text-cyber-purple',
        border: 'border-cyber-purple/30',
      },
      pink: {
        bg: 'bg-cyber-pink/10',
        text: 'text-cyber-pink',
        border: 'border-cyber-pink/30',
      },
      green: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30',
      },
    };
    return colors[color as keyof typeof colors];
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    const icons = {
      view: <Eye className="w-4 h-4" />,
      like: <Heart className="w-4 h-4" />,
      comment: <MessageSquare className="w-4 h-4" />,
      share: <TrendingUp className="w-4 h-4" />,
    };
    return icons[type];
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    const colors = {
      view: 'text-cyber-cyan bg-cyber-cyan/10',
      like: 'text-cyber-pink bg-cyber-pink/10',
      comment: 'text-cyber-purple bg-cyber-purple/10',
      share: 'text-green-400 bg-green-500/10',
    };
    return colors[type];
  };

  const renderMiniChart = (data: number[], color: string) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <svg
        viewBox="0 0 100 30"
        className="w-full h-8"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${30 - ((data[0] - min) / range) * 25} ${data
            .map((val, i) => `L ${i * (100 / (data.length - 1))} ${30 - ((val - min) / range) * 25}`)
            .join(' ')}`}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          className="drop-shadow-lg"
        />
        <path
          d={`M 0 30 L 0 ${30 - ((data[0] - min) / range) * 25} ${data
            .map((val, i) => `L ${i * (100 / (data.length - 1))} ${30 - ((val - min) / range) * 25}`)
            .join(' ')} L 100 30 Z`}
          fill={`url(#gradient-${color})`}
          opacity="0.5"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">数据统计</h2>
          <p className="text-gray-400 text-sm mt-1">查看您的网站数据分析</p>
        </div>

        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <CyberButton
              key={range}
              variant={timeRange === range ? 'neon' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
            </CyberButton>
          ))}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          const colorMap = {
            cyan: '#00f0ff',
            purple: '#9d00ff',
            pink: '#ff0080',
            green: '#00ff88',
          };
          const chartColor = colorMap[stat.color];

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CyberCard className={`${colors.border} hover:border-${stat.color}-500/50 transition-colors`}>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {stat.change >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-800">
                    <p className="text-gray-500 text-xs">{stat.period}</p>
                  </div>

                  {/* 迷你图表 */}
                  <div className="h-8">
                    {renderMiniChart(
                      Array.from({ length: 20 }, () => Math.random() * 100),
                      chartColor
                    )}
                  </div>
                </div>
              </CyberCard>
            </motion.div>
          );
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 访问趋势 */}
        <CyberCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyber-cyan" />
                访问趋势
              </h3>
            </div>

            <div className="h-64 flex items-end gap-1">
              {chartData.values.map((value, index) => {
                const height = (value / Math.max(...chartData.values)) * 100;
                return (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.02 }}
                    className="flex-1 bg-gradient-to-t from-cyber-cyan/20 to-cyber-cyan/60 rounded-t hover:from-cyber-cyan/30 hover:to-cyber-cyan/80 transition-all cursor-pointer group relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {value}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span>{chartData.labels[0]}</span>
              <span>{chartData.labels[Math.floor(chartData.labels.length / 2)]}</span>
              <span>{chartData.labels[chartData.labels.length - 1]}</span>
            </div>
          </div>
        </CyberCard>

        {/* 内容分布 */}
        <CyberCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyber-purple" />
                内容分布
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { label: '技术文章', value: 45, color: 'bg-cyber-cyan' },
                { label: '教程指南', value: 30, color: 'bg-cyber-purple' },
                { label: '随笔杂谈', value: 15, color: 'bg-cyber-pink' },
                { label: '其他', value: 10, color: 'bg-gray-600' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">{item.label}</span>
                    <span className="text-white font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CyberCard>
      </div>

      {/* 最近活动 */}
      <CyberCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">最近活动</h3>
            <CyberButton variant="outline" size="sm">
              查看全部
            </CyberButton>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm">{activity.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CyberCard>
    </div>
  );
};
