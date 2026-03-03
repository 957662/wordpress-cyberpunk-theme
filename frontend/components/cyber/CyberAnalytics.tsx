/**
 * CyberAnalytics - 赛博朋克风格的数据分析组件
 * 展示网站访问统计、用户行为、内容表现等数据
 *
 * @version 1.0.0
 * @author CyberPress Team
 */

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
  Share2,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// =====================================================
// 类型定义
// =====================================================

export interface MetricData {
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ElementType;
  trend?: number[];
}

export interface AnalyticsData {
  overview: {
    totalViews: MetricData;
    uniqueVisitors: MetricData;
    avgTimeOnPage: MetricData;
    bounceRate: MetricData;
  };
  content: {
    topPosts: Array<{
      id: string;
      title: string;
      views: number;
      likes: number;
      comments: number;
      shares: number;
    }>;
    topCategories: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  audience: {
    devices: Array<{
      type: 'desktop' | 'mobile' | 'tablet';
      count: number;
      percentage: number;
    }>;
    locations: Array<{
      country: string;
      city: string;
      count: number;
      percentage: number;
    }>;
  };
  timeline: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
}

export interface CyberAnalyticsProps {
  data?: AnalyticsData;
  isLoading?: boolean;
  error?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void;
  className?: string;
}

// =====================================================
// 默认数据
// =====================================================

const defaultData: AnalyticsData = {
  overview: {
    totalViews: {
      label: '总浏览量',
      value: '12,345',
      change: 12.5,
      changeType: 'increase',
      icon: Eye,
    },
    uniqueVisitors: {
      label: '独立访客',
      value: '8,901',
      change: 8.2,
      changeType: 'increase',
      icon: Users,
    },
    avgTimeOnPage: {
      label: '平均停留时间',
      value: '3:45',
      change: -5.3,
      changeType: 'decrease',
      icon: Activity,
    },
    bounceRate: {
      label: '跳出率',
      value: '42.3%',
      change: -2.1,
      changeType: 'increase',
      icon: TrendingDown,
    },
  },
  content: {
    topPosts: [
      { id: '1', title: 'Next.js 14 完全指南', views: 1234, likes: 89, comments: 45, shares: 23 },
      { id: '2', title: 'TypeScript 高级技巧', views: 987, likes: 76, comments: 34, shares: 18 },
      { id: '3', title: 'React 性能优化实践', views: 765, likes: 65, comments: 28, shares: 15 },
      { id: '4', title: '赛博朋克设计系统', views: 654, likes: 54, comments: 21, shares: 12 },
      { id: '5', title: 'Tailwind CSS 实战', views: 543, likes: 43, comments: 19, shares: 10 },
    ],
    topCategories: [
      { name: '前端开发', count: 234, percentage: 35 },
      { name: '后端开发', count: 189, percentage: 28 },
      { name: '设计', count: 145, percentage: 22 },
      { name: 'DevOps', count: 98, percentage: 15 },
    ],
  },
  audience: {
    devices: [
      { type: 'desktop', count: 5678, percentage: 55 },
      { type: 'mobile', count: 3456, percentage: 34 },
      { type: 'tablet', count: 1234, percentage: 11 },
    ],
    locations: [
      { country: '中国', city: '北京', count: 2345, percentage: 28 },
      { country: '中国', city: '上海', count: 1876, percentage: 22 },
      { country: '中国', city: '深圳', count: 1543, percentage: 18 },
      { country: '美国', city: '纽约', count: 987, percentage: 12 },
      { country: '日本', city: '东京', count: 765, percentage: 9 },
    ],
  },
  timeline: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    views: Math.floor(Math.random() * 1000) + 500,
    visitors: Math.floor(Math.random() * 500) + 200,
  })),
};

// =====================================================
// 辅助组件
// =====================================================

const MetricCard: React.FC<{
  data: MetricData;
  delay?: number;
}> = ({ data, delay = 0 }) => {
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg p-4',
        'hover:border-cyber-cyan/50 transition-all duration-300'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-cyber-cyan" />}
          <span className="text-sm text-gray-400">{data.label}</span>
        </div>
        {data.change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              data.changeType === 'increase' ? 'text-cyber-green' : 'text-cyber-pink'
            )}
          >
            {data.changeType === 'increase' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(data.change)}%
          </div>
        )}
      </div>

      <div className="text-2xl font-bold text-white mb-2">{data.value}</div>

      {data.trend && data.trend.length > 0 && (
        <div className="flex items-end gap-0.5 h-8">
          {data.trend.map((value, index) => {
            const max = Math.max(...data.trend!);
            const height = (value / max) * 100;

            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: delay + index * 0.05 }}
                className={cn(
                  'flex-1 rounded-t-sm',
                  index === data.trend!.length - 1
                    ? 'bg-cyber-cyan'
                    : 'bg-cyber-cyan/30'
                )}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

// =====================================================
// 主组件
// =====================================================

export const CyberAnalytics: React.FC<CyberAnalyticsProps> = ({
  data = defaultData,
  isLoading = false,
  error,
  timeRange = '30d',
  onTimeRangeChange,
  className,
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'content' | 'audience'>('overview');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-2">加载失败</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('cyber-analytics space-y-6', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyber-cyan" />
            数据分析
          </h2>
          <p className="text-gray-400 mt-1">查看网站流量和用户行为数据</p>
        </div>

        {/* 时间范围选择 */}
        <div className="flex items-center gap-2 bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg p-1">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange?.(range)}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-all',
                timeRange === range
                  ? 'bg-cyber-cyan text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {range === '7d' && '7天'}
              {range === '30d' && '30天'}
              {range === '90d' && '90天'}
              {range === '1y' && '1年'}
            </button>
          ))}
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex items-center gap-4 border-b border-cyber-cyan/30">
        <button
          onClick={() => setSelectedTab('overview')}
          className={cn(
            'pb-3 text-sm font-medium transition-colors relative',
            selectedTab === 'overview'
              ? 'text-cyber-cyan'
              : 'text-gray-400 hover:text-white'
          )}
        >
          总览
          {selectedTab === 'overview' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan"
            />
          )}
        </button>

        <button
          onClick={() => setSelectedTab('content')}
          className={cn(
            'pb-3 text-sm font-medium transition-colors relative',
            selectedTab === 'content'
              ? 'text-cyber-cyan'
              : 'text-gray-400 hover:text-white'
          )}
        >
          内容
          {selectedTab === 'content' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan"
            />
          )}
        </button>

        <button
          onClick={() => setSelectedTab('audience')}
          className={cn(
            'pb-3 text-sm font-medium transition-colors relative',
            selectedTab === 'audience'
              ? 'text-cyber-cyan'
              : 'text-gray-400 hover:text-white'
          )}
        >
          受众
          {selectedTab === 'audience' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan"
            />
          )}
        </button>
      </div>

      {/* 总览标签页 */}
      {selectedTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* 指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard data={data.overview.totalViews} delay={0} />
            <MetricCard data={data.overview.uniqueVisitors} delay={0.1} />
            <MetricCard data={data.overview.avgTimeOnPage} delay={0.2} />
            <MetricCard data={data.overview.bounceRate} delay={0.3} />
          </div>

          {/* 时间线图表 */}
          <div className="bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">访问趋势</h3>

            <div className="flex items-end gap-1 h-48">
              {data.timeline.map((item, index) => {
                const maxViews = Math.max(...data.timeline.map(d => d.views));
                const height = (item.views / maxViews) * 100;

                return (
                  <motion.div
                    key={item.date}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.02 }}
                    className="flex-1 group relative"
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyber-cyan to-cyber-purple rounded-t-sm opacity-70 group-hover:opacity-100 transition-opacity" />

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-bg border border-cyber-cyan/50 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="text-white font-medium">{item.date}</div>
                      <div className="text-cyber-cyan">{item.views} 浏览</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* 内容标签页 */}
      {selectedTab === 'content' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* 热门文章 */}
          <div className="bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyber-cyan" />
              热门文章
            </h3>

            <div className="space-y-3">
              {data.content.topPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-bg/30 hover:bg-dark-bg/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyber-cyan/20 rounded-full text-cyber-cyan font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{post.title}</div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {post.shares}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 热门分类 */}
          <div className="bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyber-cyan" />
              内容分类
            </h3>

            <div className="space-y-4">
              {data.content.topCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{category.name}</span>
                    <span className="text-cyber-cyan text-sm">{category.percentage}%</span>
                  </div>

                  <div className="h-2 bg-dark-bg/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
                    />
                  </div>

                  <div className="text-xs text-gray-500 mt-1">{category.count} 篇文章</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 受众标签页 */}
      {selectedTab === 'audience' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* 设备分布 */}
          <div className="bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">设备分布</h3>

            <div className="space-y-4">
              {data.audience.devices.map((device, index) => (
                <motion.div
                  key={device.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      'bg-gradient-to-br',
                      device.type === 'desktop' && 'from-cyber-cyan to-blue-500',
                      device.type === 'mobile' && 'from-cyber-purple to-pink-500',
                      device.type === 'tablet' && 'from-cyber-green to-teal-500'
                    )}
                  >
                    <div className="text-2xl">
                      {device.type === 'desktop' && '💻'}
                      {device.type === 'mobile' && '📱'}
                      {device.type === 'tablet' && '📟'}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-white font-medium capitalize">{device.type}</div>
                    <div className="text-sm text-gray-500">{device.count} 访问</div>
                  </div>

                  <div className="text-2xl font-bold text-cyber-cyan">
                    {device.percentage}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 地理分布 */}
          <div className="bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">地理分布</h3>

            <div className="space-y-3">
              {data.audience.locations.map((location, index) => (
                <motion.div
                  key={`${location.country}-${location.city}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-bg/30"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-cyber-cyan/20 rounded-full text-cyber-cyan font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {location.city}, {location.country}
                    </div>
                    <div className="text-sm text-gray-500">{location.count} 访问</div>
                  </div>

                  <div className="text-cyber-cyan font-semibold">{location.percentage}%</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CyberAnalytics;
