'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  StatCard,
  StatusBadge,
  NotificationCard,
  TagCloud,
  Timeline,
  CyberCard,
  GlassCard,
  Pagination,
  EmptyState,
  LoadingSpinner
} from '@/components/utility';
import { Search, Bell, TrendingUp, Users, Activity } from 'lucide-react';
import type { NotificationType, TimelineEvent } from '@/types/utility.types';

export default function UtilityShowcasePage() {
  const [currentPage, setCurrentPage] = useState(1);

  // 示例数据
  const stats = [
    { title: '总访问量', value: '12,345', icon: TrendingUp, trend: 12.5, color: 'cyan' as const },
    { title: '用户数', value: '1,234', icon: Users, trend: 8.3, color: 'purple' as const },
    { title: '活跃度', value: '89%', icon: Activity, trend: -2.1, color: 'green' as const },
    { title: '通知', value: '23', icon: Bell, color: 'pink' as const }
  ];

  const notifications = [
    {
      id: '1',
      type: 'comment' as NotificationType,
      title: '新评论',
      message: '张三 评论了你的文章《Vue 3 最佳实践》',
      time: '2分钟前',
      read: false
    },
    {
      id: '2',
      type: 'like' as NotificationType,
      title: '收到点赞',
      message: '李四 赞了你的文章《React Hooks 详解》',
      time: '15分钟前',
      read: false
    },
    {
      id: '3',
      type: 'follow' as NotificationType,
      title: '新关注者',
      message: '王五 关注了你',
      time: '1小时前',
      read: true
    }
  ];

  const tags = [
    { id: '1', name: 'React', count: 45 },
    { id: '2', name: 'Vue', count: 38 },
    { id: '3', name: 'TypeScript', count: 32 },
    { id: '4', name: 'Next.js', count: 28 },
    { id: '5', name: 'Tailwind CSS', count: 25 },
    { id: '6', name: 'Framer Motion', count: 20 }
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      title: '项目启动',
      description: '项目正式立项，开始需求分析',
      timestamp: '2024-01-01',
      status: 'completed'
    },
    {
      id: '2',
      title: '设计阶段',
      description: '完成 UI/UX 设计稿',
      timestamp: '2024-01-15',
      status: 'completed'
    },
    {
      id: '3',
      title: '开发阶段',
      description: '前后端开发进行中',
      timestamp: '2024-02-01',
      status: 'pending'
    },
    {
      id: '4',
      title: '测试上线',
      description: '预计 3 月完成测试并上线',
      timestamp: '2024-03-01',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 页面头部 */}
      <div className="border-b border-cyber-cyan/20 bg-cyber-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            实用工具组件展示
          </h1>
          <p className="text-gray-400">
            CyberPress 平台的实用组件库演示
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* 统计卡片 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyber-cyan" />
            统计卡片
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                  color={stat.color}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 状态徽章 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">状态徽章</h2>
          <div className="flex flex-wrap gap-4">
            <StatusBadge status="success" text="成功" />
            <StatusBadge status="error" text="失败" />
            <StatusBadge status="warning" text="警告" />
            <StatusBadge status="pending" text="处理中" />
            <StatusBadge status="banned" text="已封禁" />
          </div>
        </section>

        {/* 卡片样式 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">卡片样式</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CyberCard variant="default">
              <h3 className="text-xl font-semibold text-white mb-2">默认卡片</h3>
              <p className="text-gray-400">标准的赛博朋克风格卡片</p>
            </CyberCard>

            <CyberCard variant="glow">
              <h3 className="text-xl font-semibold text-white mb-2">发光卡片</h3>
              <p className="text-gray-400">带有发光效果的卡片</p>
            </CyberCard>

            <GlassCard>
              <h3 className="text-xl font-semibold text-white mb-2">玻璃态卡片</h3>
              <p className="text-gray-400">毛玻璃效果背景</p>
            </GlassCard>
          </div>
        </section>

        {/* 通知卡片 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyber-cyan" />
            通知中心
          </h2>
          <div className="space-y-3">
            {notifications.map(notification => (
              <NotificationCard
                key={notification.id}
                {...notification}
              />
            ))}
          </div>
        </section>

        {/* 标签云 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">标签云</h2>
          <TagCloud
            tags={tags}
            variant="default"
            size="md"
          />
        </section>

        {/* 时间轴 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">项目时间轴</h2>
          <Timeline
            events={timelineEvents}
            variant="vertical"
          />
        </section>

        {/* 分页 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">分页组件</h2>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </section>

        {/* 空状态 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">空状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState
              title="暂无数据"
              description="还没有任何内容"
            />
            <EmptyState
              title="加载中..."
              description="请稍候"
            />
          </div>
        </section>

        {/* 加载动画 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">加载动画</h2>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="加载中..." />
          </div>
        </section>
      </div>
    </div>
  );
}
