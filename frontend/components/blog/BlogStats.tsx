'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Calendar,
  Clock,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * BlogStats 组件 - 博客统计信息
 *
 * @description 显示博客的统计数据和趋势
 *
 * @example
 * ```tsx
 * <BlogStats
 *   totalPosts={125}
 *   totalViews={50000}
 *   totalLikes={3500}
 *   period="week"
 *   variant="card"
 * />
 * ```
 */

export interface BlogStatsProps {
  /** 总文章数 */
  totalPosts?: number;
  /** 总浏览数 */
  totalViews?: number;
  /** 总点赞数 */
  totalLikes?: number;
  /** 总评论数 */
  totalComments?: number;
  /** 总收藏数 */
  totalBookmarks?: number;
  /** 平均阅读时间 */
  avgReadingTime?: number;
  /** 统计周期 */
  period?: 'day' | 'week' | 'month' | 'year' | 'all';
  /** 增长率 */
  growthRate?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
  /** 显示变体 */
  variant?: 'card' | 'inline' | 'minimal' | 'cyber';
  /** 显示指标 */
  metrics?: Array<
    'posts' | 'views' | 'likes' | 'comments' | 'bookmarks' | 'readingTime'
  >;
  /** 自定义类名 */
  className?: string;
}

interface StatItem {
  id: string;
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  prefix?: string;
  suffix?: string;
  growth?: number;
}

export const BlogStats: React.FC<BlogStatsProps> = ({
  totalPosts = 0,
  totalViews = 0,
  totalLikes = 0,
  totalComments = 0,
  totalBookmarks = 0,
  avgReadingTime = 0,
  period = 'all',
  growthRate,
  variant = 'card',
  metrics = ['posts', 'views', 'likes', 'comments'],
  className,
}) => {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({
    posts: 0,
    views: 0,
    likes: 0,
    comments: 0,
    bookmarks: 0,
    readingTime: 0,
  });

  // 数字动画
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setAnimatedValues(prev => {
        const next = { ...prev };
        let complete = true;

        (Object.keys(prev) as Array<keyof typeof prev>).forEach(key => {
          const target = {
            posts: totalPosts,
            views: totalViews,
            likes: totalLikes,
            comments: totalComments,
            bookmarks: totalBookmarks,
            readingTime: avgReadingTime,
          }[key];

          if (prev[key] < target) {
            next[key] = Math.min(prev[key] + target / steps, target);
            complete = false;
          }
        });

        return complete ? prev : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [totalPosts, totalViews, totalLikes, totalComments, totalBookmarks, avgReadingTime]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const getPeriodLabel = () => {
    const labels = {
      day: '今日',
      week: '本周',
      month: '本月',
      year: '今年',
      all: '全部',
    };
    return labels[period];
  };

  const statItems: StatItem[] = [
    {
      id: 'posts',
      label: '文章总数',
      value: animatedValues.posts,
      icon: Calendar,
      color: 'text-blue-500',
      growth: growthRate?.views,
    },
    {
      id: 'views',
      label: '浏览次数',
      value: animatedValues.views,
      icon: Eye,
      color: 'text-green-500',
      growth: growthRate?.views,
    },
    {
      id: 'likes',
      label: '获得点赞',
      value: animatedValues.likes,
      icon: Heart,
      color: 'text-red-500',
      growth: growthRate?.likes,
    },
    {
      id: 'comments',
      label: '评论数量',
      value: animatedValues.comments,
      icon: MessageCircle,
      color: 'text-purple-500',
      growth: growthRate?.comments,
    },
    {
      id: 'bookmarks',
      label: '收藏次数',
      value: animatedValues.bookmarks,
      icon: Bookmark,
      color: 'text-yellow-500',
    },
    {
      id: 'readingTime',
      label: '平均阅读时间',
      value: animatedValues.readingTime,
      icon: Clock,
      color: 'text-cyan-500',
      suffix: ' 分钟',
    },
  ];

  const filteredStats = statItems.filter(stat =>
    metrics.includes(stat.id as any)
  );

  const variants = {
    card: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4',
    inline: 'flex flex-wrap gap-6',
    minimal: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2',
    cyber: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 标题 */}
      {variant !== 'minimal' && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {getPeriodLabel()}数据统计
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            实时更新的博客数据概览
          </p>
        </div>
      )}

      {/* 统计卡片 */}
      <div className={variants[variant]}>
        {filteredStats.map((stat, index) => {
          const Icon = stat.icon;
          const growth = stat.growth;

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative overflow-hidden rounded-lg p-4',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'hover:shadow-lg transition-shadow',
                variant === 'cyber' && 'bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/50'
              )}
            >
              {/* 背景装饰 */}
              {variant === 'cyber' && (
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <Icon className="w-full h-full" />
                </div>
              )}

              {/* 内容 */}
              <div className="relative">
                {/* 图标 */}
                <div
                  className={cn(
                    'inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3',
                    variant === 'cyber'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-gray-100 dark:bg-gray-700'
                  )}
                >
                  <Icon className={cn('w-5 h-5', stat.color)} />
                </div>

                {/* 数值 */}
                <div className="mb-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.prefix}
                    {formatNumber(stat.value)}
                    {stat.suffix}
                  </span>
                </div>

                {/* 标签 */}
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {stat.label}
                </div>

                {/* 增长率 */}
                {growth !== undefined && (
                  <div
                    className={cn(
                      'flex items-center gap-1 text-sm font-medium',
                      growth >= 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    <TrendingUp size={14} />
                    <span>{growth >= 0 ? '+' : ''}{growth.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 底部说明 */}
      {variant === 'card' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Zap size={16} />
          <span>数据每小时更新一次</span>
        </div>
      )}
    </div>
  );
};

export default BlogStats;
