/**
 * Analytics Admin Page
 * 管理后台分析页面
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

// 统计卡片组件
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

function StatsCard({ title, value, change, icon, color = 'text-cyber-cyan' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={`h-4 w-4 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500">vs 上周</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} bg-cyber-muted/20`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// 模拟数据
const statsData = {
  totalViews: 125430,
  uniqueVisitors: 45678,
  avgSessionDuration: '4:32',
  bounceRate: 32.5,
  viewsChange: 12.5,
  visitorsChange: 8.3,
  durationChange: -2.1,
  bounceChange: -5.2
};

const trafficSourcesData = [
  { name: '直接访问', value: 35, color: '#00f0ff' },
  { name: '搜索引擎', value: 30, color: '#9d00ff' },
  { name: '社交媒体', value: 20, color: '#ff0080' },
  { name: '外部链接', value: 10, color: '#00ff88' },
  { name: '其他', value: 5, color: '#f0ff00' }
];

const pageViewsData = [
  { date: '01', views: 3200, visitors: 1200 },
  { date: '02', views: 3800, visitors: 1500 },
  { date: '03', views: 3500, visitors: 1300 },
  { date: '04', views: 4200, visitors: 1800 },
  { date: '05', views: 4800, visitors: 2000 },
  { date: '06', views: 4500, visitors: 1900 },
  { date: '07', views: 5200, visitors: 2200 }
];

const topPagesData = [
  { path: '/blog/getting-started-with-nextjs', views: 8520, title: 'Next.js 入门指南' },
  { path: '/blog/react-hooks-tutorial', views: 6230, title: 'React Hooks 教程' },
  { path: '/blog/typescript-best-practices', views: 5180, title: 'TypeScript 最佳实践' },
  { path: '/blog/building-pwa-apps', views: 4350, title: '构建 PWA 应用' },
  { path: '/blog/css-animations-guide', views: 3890, title: 'CSS 动画指南' }
];

const deviceStatsData = [
  { name: '桌面端', value: 55, color: '#00f0ff' },
  { name: '移动端', value: 35, color: '#9d00ff' },
  { name: '平板', value: 10, color: '#ff0080' }
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    // 导出数据逻辑
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyber-cyan">数据分析</h1>
          <p className="text-gray-400 mt-1">查看网站流量和用户行为分析</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="cyber-input-wrapper">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="cyber-input"
            >
              <option value="24h">最近 24 小时</option>
              <option value="7d">最近 7 天</option>
              <option value="30d">最近 30 天</option>
              <option value="90d">最近 90 天</option>
            </select>
          </div>

          <button onClick={handleExport} className="cyber-button">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="总浏览量"
          value={statsData.totalViews.toLocaleString()}
          change={statsData.viewsChange}
          icon={<Eye className="h-6 w-6" />}
        />
        <StatsCard
          title="独立访客"
          value={statsData.uniqueVisitors.toLocaleString()}
          change={statsData.visitorsChange}
          icon={<Users className="h-6 w-6" />}
        />
        <StatsCard
          title="平均会话时长"
          value={statsData.avgSessionDuration}
          change={statsData.durationChange}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatsCard
          title="跳出率"
          value={`${statsData.bounceRate}%`}
          change={statsData.bounceChange}
          icon={<TrendingUp className="h-6 w-6" />}
          color="text-cyber-pink"
        />
      </div>

      {/* 流量趋势 */}
      <div className="cyber-card p-6">
        <h2 className="text-xl font-bold text-cyber-cyan mb-4">流量趋势</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={pageViewsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a0f',
                border: '1px solid #1a1a2e',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#00f0ff"
              strokeWidth={2}
              name="浏览量"
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#9d00ff"
              strokeWidth={2}
              name="访客数"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 流量来源 */}
        <div className="cyber-card p-6">
          <h2 className="text-xl font-bold text-cyber-cyan mb-4">流量来源</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficSourcesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficSourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0f',
                  border: '1px solid #1a1a2e',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 设备统计 */}
        <div className="cyber-card p-6">
          <h2 className="text-xl font-bold text-cyber-cyan mb-4">设备统计</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceStatsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0f',
                  border: '1px solid #1a1a2e',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#00f0ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 热门页面 */}
      <div className="cyber-card p-6">
        <h2 className="text-xl font-bold text-cyber-cyan mb-4">热门页面</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-muted/30">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">页面标题</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">路径</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">浏览量</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">占比</th>
              </tr>
            </thead>
            <tbody>
              {topPagesData.map((page, index) => (
                <tr key={index} className="border-b border-cyber-muted/20 hover:bg-cyber-muted/10">
                  <td className="py-3 px-4 text-white">{page.title}</td>
                  <td className="py-3 px-4 text-cyber-cyan text-sm">{page.path}</td>
                  <td className="py-3 px-4 text-right text-white">{page.views.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block px-2 py-1 rounded text-xs bg-cyber-cyan/20 text-cyber-cyan">
                      {((page.views / statsData.totalViews) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
