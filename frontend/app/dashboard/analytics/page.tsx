/**
 * Analytics Dashboard - 数据分析仪表板
 * 完整的数据可视化仪表板，包含图表、统计、趋势分析
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// 类型定义
interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

// 模拟数据
const MOCK_METRICS: MetricCard[] = [
  {
    title: '总浏览量',
    value: '45.2K',
    change: 12.5,
    trend: 'up',
    icon: Eye,
    color: 'text-cyber-cyan'
  },
  {
    title: '独立访客',
    value: '12.8K',
    change: 8.3,
    trend: 'up',
    icon: Users,
    color: 'text-cyber-purple'
  },
  {
    title: '互动率',
    value: '3.2%',
    change: -2.1,
    trend: 'down',
    icon: Activity,
    color: 'text-cyber-pink'
  },
  {
    title: '平均停留时间',
    value: '4:32',
    change: 15.7,
    trend: 'up',
    icon: Calendar,
    color: 'text-green-400'
  }
];

const MOCK_TRAFFIC_DATA: ChartData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  datasets: [
    {
      label: '浏览量',
      data: [4200, 5800, 7100, 6900, 9200, 11500, 12800],
      color: '#00f0ff'
    },
    {
      label: '访客',
      data: [1200, 1800, 2100, 1900, 2800, 3500, 4200],
      color: '#9d00ff'
    }
  ]
};

const TOP_ARTICLES = [
  {
    id: '1',
    title: 'TypeScript 高级类型完全指南',
    views: 5678,
    likes: 234,
    comments: 45,
    trend: 'up'
  },
  {
    id: '2',
    title: 'React 19 新特性深度解析',
    views: 4321,
    likes: 189,
    comments: 38,
    trend: 'up'
  },
  {
    id: '3',
    title: '赛博朋克设计系统实战',
    views: 3890,
    likes: 156,
    comments: 29,
    trend: 'stable'
  },
  {
    id: '4',
    title: 'Next.js 14 性能优化技巧',
    views: 3456,
    likes: 142,
    comments: 31,
    trend: 'down'
  },
  {
    id: '5',
    title: 'AI 辅助开发最佳实践',
    views: 2890,
    likes: 128,
    comments: 24,
    trend: 'up'
  }
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('all');

  const handleRefresh = async () => {
    setIsLoading(true);
    // 模拟数据加载
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleExport = () => {
    // 模拟导出功能
    console.log('Exporting analytics data...');
  };

  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                数据分析
              </h1>
              <p className="text-gray-400">
                查看您的博客表现和用户互动数据
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg p-1">
                {[
                  { id: '7d', label: '7天' },
                  { id: '30d', label: '30天' },
                  { id: '90d', label: '90天' },
                  { id: '1y', label: '1年' }
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setTimeRange(range.id as any)}
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-medium transition-all',
                      timeRange === range.id
                        ? 'bg-cyber-cyan text-cyber-dark'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isLoading}
                className={cn(
                  'p-2 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20',
                  'text-cyber-cyan hover:bg-cyber-cyan/10',
                  'transition-all',
                  isLoading && 'animate-spin'
                )}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>导出报告</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {MOCK_METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'cyber-card p-6 rounded-xl',
                  'hover:border-cyber-cyan/50 transition-all duration-300'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('p-3 bg-cyber-dark/50 rounded-lg', metric.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  )}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </h3>
                  <p className="text-sm text-gray-400">{metric.title}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 cyber-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">流量趋势</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-cyber-dark/50 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-cyber-dark/50 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <PieChart className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Simple Chart Visualization */}
            <div className="h-64 flex items-end justify-between gap-2">
              {MOCK_TRAFFIC_DATA.labels.map((label, index) => {
                const maxValue = Math.max(...MOCK_TRAFFIC_DATA.datasets[0].data);
                const value = MOCK_TRAFFIC_DATA.datasets[0].data[index];
                const height = (value / maxValue) * 100;
                
                return (
                  <motion.div
                    key={label}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div className="relative w-full bg-gradient-to-t from-cyber-cyan/20 to-cyber-purple/20 rounded-t-lg hover:from-cyber-cyan/30 hover:to-cyber-purple/30 transition-all cursor-pointer">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium text-white">{value}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{label}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              {MOCK_TRAFFIC_DATA.datasets.map((dataset) => (
                <div key={dataset.label} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dataset.color }}
                  />
                  <span className="text-sm text-gray-400">{dataset.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="cyber-card p-6 rounded-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">流量来源</h2>
            
            <div className="space-y-4">
              {[
                { source: '直接访问', percentage: 45, color: 'bg-cyber-cyan' },
                { source: '搜索引擎', percentage: 30, color: 'bg-cyber-purple' },
                { source: '社交媒体', percentage: 15, color: 'bg-cyber-pink' },
                { source: '外部链接', percentage: 10, color: 'bg-green-400' }
              ].map((item) => (
                <div key={item.source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{item.source}</span>
                    <span className="text-sm font-medium text-white">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-cyber-dark/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className={cn('h-full rounded-full', item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">热门文章</h2>
            <button className="text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors">
              查看全部 →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">文章</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">浏览</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">点赞</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">评论</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">趋势</th>
                </tr>
              </thead>
              <tbody>
                {TOP_ARTICLES.map((article, index) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="border-b border-gray-700/30 hover:bg-cyber-cyan/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{article.title}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{article.views}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <Heart className="w-4 h-4" />
                        <span>{article.likes}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span>{article.comments}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className={cn(
                        'flex items-center justify-center gap-1 text-sm font-medium',
                        article.trend === 'up' && 'text-green-400',
                        article.trend === 'down' && 'text-red-400',
                        article.trend === 'stable' && 'text-gray-400'
                      )}>
                        {article.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                        {article.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                        {article.trend === 'stable' && <Activity className="w-4 h-4" />}
                        <span>
                          {article.trend === 'up' ? '上升' : article.trend === 'down' ? '下降' : '稳定'}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
