'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Flame,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingStats {
  /** 已读文章数 */
  totalArticles: number;
  /** 总阅读时长（分钟） */
  totalReadingTime: number;
  /** 本周阅读文章数 */
  weeklyArticles: number;
  /** 连续阅读天数 */
  readingStreak: number;
  /** 阅读进度百分比 */
  completionRate: number;
  /** 阅读成就数 */
  achievements: number;
}

interface ReadingStatsCardProps {
  /** 统计数据 */
  stats: ReadingStats;
  /** 卡片风格 */
  variant?: 'default' | 'compact' | 'detailed';
  /** 自定义样式类名 */
  className?: string;
  /** 点击回调 */
  onClick?: () => void;
}

/**
 * 阅读统计卡片组件
 *
 * 展示用户的阅读统计数据，包括文章数、阅读时长、连续天数等
 *
 * @example
 * ```tsx
 * <ReadingStatsCard
 *   stats={{
 *     totalArticles: 156,
 *     totalReadingTime: 2450,
 *     weeklyArticles: 12,
 *     readingStreak: 7,
 *     completionRate: 85,
 *     achievements: 23
 *   }}
 * />
 * ```
 */
export const ReadingStatsCard: React.FC<ReadingStatsCardProps> = ({
  stats,
  variant = 'default',
  className,
  onClick,
}) => {
  const formatReadingTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const statItems = [
    {
      icon: BookOpen,
      label: '已读文章',
      value: stats.totalArticles,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Clock,
      label: '阅读时长',
      value: formatReadingTime(stats.totalReadingTime),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: TrendingUp,
      label: '本周阅读',
      value: `${stats.weeklyArticles}篇`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Flame,
      label: '连续天数',
      value: `${stats.readingStreak}天`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Target,
      label: '完成率',
      value: `${stats.completionRate}%`,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: Award,
      label: '获得成就',
      value: stats.achievements,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'rounded-lg border bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {stats.totalArticles} 篇文章
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatReadingTime(stats.totalReadingTime)} 阅读时间
              </p>
            </div>
          </div>
          {stats.readingStreak > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-medium">{stats.readingStreak}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            阅读统计
          </h3>
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="h-5 w-5" />
            <span className="text-sm font-medium">连续 {stats.readingStreak} 天</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'rounded-lg p-3',
                  item.bgColor
                )}
              >
                <Icon className={cn('mb-2 h-5 w-5', item.color)} />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.label}
                </p>
                <p className={cn(
                  'text-xl font-bold',
                  item.color
                )}>
                  {item.value}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'rounded-lg border bg-white p-5 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          阅读统计
        </h3>
        {stats.readingStreak > 0 && (
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-medium">{stats.readingStreak}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn('rounded-md p-2', item.bgColor)}>
                <Icon className={cn('h-4 w-4', item.color)} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ReadingStatsCard;
