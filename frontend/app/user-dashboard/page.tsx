'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  BookOpen,
  Bookmark,
  Heart,
  Settings,
  Bell,
  TrendingUp,
  Clock,
  Award,
  Target,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserDashboardPage() {
  const [stats, setStats] = useState({
    postsRead: 0,
    readingTime: 0,
    bookmarks: 0,
    likes: 0,
    currentStreak: 0,
    totalAchievements: 0,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'read', title: 'TypeScript 高级指南', time: '2小时前' },
    { id: 2, type: 'bookmark', title: 'Next.js 14 完全教程', time: '5小时前' },
    { id: 3, type: 'like', title: 'React 性能优化实践', time: '1天前' },
  ]);

  const [readingGoals, setReadingGoals] = useState({
    weeklyTarget: 5,
    weeklyProgress: 3,
    monthlyTarget: 20,
    monthlyProgress: 12,
  });

  useEffect(() => {
    // 从 localStorage 或 API 加载用户数据
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
    color,
  }: {
    icon: any;
    title: string;
    value: number | string;
    description?: string;
    color: string;
  }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-gray-900/50 border border-gray-800',
        'hover:border-cyan-500/50',
        'transition-all duration-300',
        'group'
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity">
        <Icon className={cn('w-full h-full', color)} />
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-lg bg-gray-800/50', color)}>
            <Icon size={24} />
          </div>
        </div>

        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-400 mb-2">{title}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">用户仪表板</h1>
              <p className="text-gray-400">欢迎回来！查看您的阅读统计和活动</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
              <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="已阅读文章"
            value={stats.postsRead}
            description="累计阅读数量"
            color="text-cyan-400"
          />
          <StatCard
            icon={Clock}
            title="阅读时长"
            value={`${stats.readingTime}h`}
            description="总阅读时间"
            color="text-purple-400"
          />
          <StatCard
            icon={Bookmark}
            title="收藏夹"
            value={stats.bookmarks}
            description="已收藏文章"
            color="text-pink-400"
          />
          <StatCard
            icon={Heart}
            title="点赞数"
            value={stats.likes}
            description="点赞过的文章"
            color="text-red-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：阅读目标 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 阅读目标 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="text-cyan-400" size={24} />
                  阅读目标
                </h2>
                <span className="text-sm text-gray-400">2026年3月</span>
              </div>

              <div className="space-y-6">
                {/* 周目标 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">本周目标</span>
                    <span className="text-sm font-semibold text-cyan-400">
                      {readingGoals.weeklyProgress} / {readingGoals.weeklyTarget} 篇
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(readingGoals.weeklyProgress / readingGoals.weeklyTarget) * 100}%`,
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>

                {/* 月目标 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">本月目标</span>
                    <span className="text-sm font-semibold text-purple-400">
                      {readingGoals.monthlyProgress} / {readingGoals.monthlyTarget} 篇
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(readingGoals.monthlyProgress / readingGoals.monthlyTarget) * 100}%`,
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 最近活动 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-400" size={24} />
                最近活动
              </h2>

              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const icons = {
                    read: <BookOpen size={20} className="text-cyan-400" />,
                    bookmark: <Bookmark size={20} className="text-purple-400" />,
                    like: <Heart size={20} className="text-pink-400" />,
                  };

                  return (
                    <motion.div
                      key={activity.id}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                        {icons[activity.type as keyof typeof icons]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium mb-1 truncate">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* 右侧：成就和日历 */}
          <div className="space-y-6">
            {/* 成就 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="text-yellow-400" size={24} />
                成就
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: '📚', name: '书虫', unlocked: true },
                  { icon: '🔥', name: '连续7天', unlocked: true },
                  { icon: '⭐', name: '精选读者', unlocked: false },
                  { icon: '💎', name: '收藏家', unlocked: true },
                  { icon: '🚀', name: '快速阅读', unlocked: false },
                  { icon: '🏆', name: '月度冠军', unlocked: false },
                ].map((achievement) => (
                  <div
                    key={achievement.name}
                    className={cn(
                      'flex flex-col items-center p-3 rounded-lg',
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30'
                        : 'bg-gray-800/30 border border-gray-700 opacity-50'
                    )}
                  >
                    <span className="text-3xl mb-2">{achievement.icon}</span>
                    <span className="text-xs text-center text-gray-300">
                      {achievement.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 连续打卡 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">连续打卡</h3>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {stats.currentStreak} 天
                </span>
              </div>

              <div className="flex justify-between">
                {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => {
                  const isCompleted = index < 5; // 示例数据
                  return (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <span className="text-xs text-gray-400">{day}</span>
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center',
                          isCompleted
                            ? 'bg-gradient-to-br from-cyan-500 to-purple-500'
                            : 'bg-gray-800'
                        )}
                      >
                        {isCompleted && <Check size={16} className="text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* 快速操作 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">快速操作</h2>

              <div className="space-y-2">
                {[
                  { icon: BookOpen, label: '继续阅读', color: 'text-cyan-400' },
                  { icon: Bookmark, label: '查看收藏', color: 'text-purple-400' },
                  { icon: BarChart3, label: '阅读统计', color: 'text-pink-400' },
                  { icon: Settings, label: '账户设置', color: 'text-gray-400' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3',
                      'rounded-lg bg-gray-800/30',
                      'hover:bg-gray-800/50',
                      'transition-colors',
                      'text-left'
                    )}
                  >
                    <action.icon size={20} className={action.color} />
                    <span className="text-white">{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
