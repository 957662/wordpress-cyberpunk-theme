'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { StatsWidget } from '@/components/widgets/StatsWidget';
import { ClockWidget } from '@/components/widgets/ClockWidget';
import { CyberButton } from '@/components/ui/CyberButton';
import { NeonCard, NeonCardHeader, NeonCardBody } from '@/components/ui/NeonCard';
import { GlitchTitle } from '@/components/ui/GlitchText';
import { HologramPanel } from '@/components/ui/HologramPanel';

export default function DashboardExamplePage() {
  // 模拟数据
  const stats = [
    {
      label: '总访问量',
      value: 125643,
      prefix: '',
      suffix: '',
      decimals: 0,
      trend: { value: 12.5, period: '较上周' },
      icon: <Eye size={24} />,
      color: 'cyan' as const,
      description: '页面浏览总数',
    },
    {
      label: '活跃用户',
      value: 8432,
      trend: { value: 8.2, period: '较上周' },
      icon: <Users size={24} />,
      color: 'purple' as const,
      description: '本周活跃用户',
    },
    {
      label: '收入',
      value: 45678.9,
      prefix: '¥',
      decimals: 2,
      trend: { value: -3.2, period: '较上月' },
      icon: <DollarSign size={24} />,
      color: 'green' as const,
      description: '本月总收入',
    },
    {
      label: '互动率',
      value: 67.8,
      suffix: '%',
      decimals: 1,
      trend: { value: 15.7, period: '较上周' },
      icon: <Activity size={24} />,
      color: 'pink' as const,
      description: '用户互动指标',
    },
  ];

  const recentActivity = [
    { type: 'view', message: '用户查看了文章', time: '2分钟前', count: 24 },
    { type: 'like', message: '文章被点赞', time: '5分钟前', count: 18 },
    { type: 'comment', message: '收到新评论', time: '10分钟前', count: 5 },
    { type: 'share', message: '内容被分享', time: '15分钟前', count: 12 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 p-8">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <GlitchTitle text="仪表板" intensity="medium" />
        <p className="text-gray-400 mt-2">欢迎回来，这是您的数据概览</p>
      </motion.div>

      {/* 顶部统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <StatsWidget stats={stats} variant="neon" glow direction="row" />
      </motion.div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧主内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 时钟卡片 */}
          <NeonCard color="cyan" intensity="medium">
            <NeonCardHeader title="实时数据" />
            <NeonCardBody>
              <div className="flex justify-between items-center">
                <ClockWidget
                  variant="neon"
                  color="cyan"
                  showDate
                  showSeconds
                  glow
                />
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-2">服务器状态</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 font-mono">正常运行</span>
                  </div>
                </div>
              </div>
            </NeonCardBody>
          </NeonCard>

          {/* 活动图表 */}
          <HologramPanel color="purple" intensity="medium">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#9d00ff' }}>
                访问趋势
              </h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {[35, 62, 48, 75, 58, 82, 65, 90, 78, 85, 92, 88].map((value, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 rounded-t"
                    style={{
                      background: `linear-gradient(to top, rgba(157, 0, 255, 0.6), rgba(157, 0, 255, 0.2))`,
                      height: `${value}%`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>1月</span>
                <span>2月</span>
                <span>3月</span>
                <span>4月</span>
                <span>5月</span>
                <span>6月</span>
                <span>7月</span>
                <span>8月</span>
                <span>9月</span>
                <span>10月</span>
                <span>11月</span>
                <span>12月</span>
              </div>
            </div>
          </HologramPanel>

          {/* 最近活动 */}
          <NeonCard color="green" intensity="low">
            <NeonCardHeader title="最近活动" />
            <NeonCardBody>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const icons = {
                    view: <Eye size={18} />,
                    like: <Heart size={18} />,
                    comment: <MessageSquare size={18} />,
                    share: <Share2 size={18} />,
                  };

                  return (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded bg-black/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-green-400">{icons[activity.type as keyof typeof icons]}</div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <span className="text-lg font-bold text-green-400">{activity.count}</span>
                    </motion.div>
                  );
                })}
              </div>
            </NeonCardBody>
          </NeonCard>
        </div>

        {/* 右侧边栏 */}
        <div className="space-y-6">
          {/* 快速操作 */}
          <NeonCard color="pink" intensity="medium">
            <NeonCardHeader title="快速操作" />
            <NeonCardBody>
              <div className="space-y-3">
                <CyberButton variant="primary" size="md" className="w-full">
                  创建新文章
                </CyberButton>
                <CyberButton variant="secondary" size="md" className="w-full">
                  上传媒体
                </CyberButton>
                <CyberButton variant="outline" size="md" className="w-full">
                  查看分析
                </CyberButton>
              </div>
            </NeonCardBody>
          </NeonCard>

          {/* 系统状态 */}
          <HologramPanel color="cyan" intensity="low">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#00f0ff' }}>
                系统状态
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'CPU 使用率', value: 45, color: 'cyan' },
                  { label: '内存使用', value: 62, color: 'purple' },
                  { label: '磁盘空间', value: 78, color: 'pink' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="font-mono" style={{ color: colorMap[item.color as keyof typeof colorMap].primary }}>
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{
                          backgroundColor: colorMap[item.color as keyof typeof colorMap].primary,
                          boxShadow: `0 0 10px ${colorMap[item.color as keyof typeof colorMap].glow}`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </HologramPanel>

          {/* 快速统计 */}
          <NeonCard color="yellow" intensity="low">
            <NeonCardHeader title="今日概览" />
            <NeonCardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded bg-black/20">
                  <p className="text-2xl font-bold text-yellow-400">1,234</p>
                  <p className="text-xs text-gray-500 mt-1">新增用户</p>
                </div>
                <div className="text-center p-3 rounded bg-black/20">
                  <p className="text-2xl font-bold text-yellow-400">567</p>
                  <p className="text-xs text-gray-500 mt-1">新订单</p>
                </div>
                <div className="text-center p-3 rounded bg-black/20">
                  <p className="text-2xl font-bold text-yellow-400">89</p>
                  <p className="text-xs text-gray-500 mt-1">新增文章</p>
                </div>
                <div className="text-center p-3 rounded bg-black/20">
                  <p className="text-2xl font-bold text-yellow-400">23</p>
                  <p className="text-xs text-gray-500 mt-1">待审核</p>
                </div>
              </div>
            </NeonCardBody>
          </NeonCard>
        </div>
      </div>
    </div>
  );
}

const colorMap = {
  cyan: { primary: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)' },
  purple: { primary: '#9d00ff', glow: 'rgba(157, 0, 255, 0.5)' },
  pink: { primary: '#ff0080', glow: 'rgba(255, 0, 128, 0.5)' },
};
