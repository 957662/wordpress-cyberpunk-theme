/**
 * BlogStatsCard - 博客统计卡片组件
 * 显示博客的各类统计数据和指标
 */

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Bookmark,
  Calendar,
  Clock,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Post } from '@/types';
import { getPostsStats } from '@/lib/utils/blog-helpers';

export interface BlogStatsCardProps {
  posts: Post[];
  period?: 'all' | 'week' | 'month' | 'year';
  className?: string;
}

export const BlogStatsCard: React.FC<BlogStatsCardProps> = ({
  posts,
  period = 'all',
  className,
}) => {
  // 过滤指定时间段的文章
  const filteredPosts = useMemo(() => {
    if (period === 'all') return posts;

    const now = new Date();
    const cutoffDate = new Date();

    switch (period) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return posts.filter(post => {
      const postDate = new Date(post.publishedAt || post.createdAt);
      return postDate >= cutoffDate;
    });
  }, [posts, period]);

  // 计算统计数据
  const stats = useMemo(() => getPostsStats(filteredPosts), [filteredPosts]);

  // 计算增长率（与上一期对比）
  const growthRate = useMemo(() => {
    if (period === 'all') return null;

    const previousPeriodPosts = useMemo(() => {
      const now = new Date();
      const cutoffDate = new Date();
      const previousCutoffDate = new Date();

      switch (period) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          previousCutoffDate.setDate(now.getDate() - 14);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          previousCutoffDate.setMonth(now.getMonth() - 2);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          previousCutoffDate.setFullYear(now.getFullYear() - 2);
          break;
        default:
          return [];
      }

      return posts.filter(post => {
        const postDate = new Date(post.publishedAt || post.createdAt);
        return postDate >= previousCutoffDate && postDate < cutoffDate;
      });
    }, [posts, period]);

    const currentStats = getPostsStats(filteredPosts);
    const previousStats = getPostsStats(previousPeriodPosts);

    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      posts: calculateGrowth(currentStats.total, previousStats.total),
      views: calculateGrowth(currentStats.totalViews, previousStats.totalViews),
      likes: calculateGrowth(currentStats.totalLikes, previousStats.totalLikes),
      comments: calculateGrowth(currentStats.totalComments, previousStats.totalComments),
    };
  }, [filteredPosts, posts, period]);

  // 统计卡片数据
  const statItems = useMemo(() => {
    return [
      {
        label: '总文章数',
        value: stats.total,
        icon: Calendar,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        growth: growthRate?.posts,
      },
      {
        label: '总浏览量',
        value: stats.totalViews,
        icon: Eye,
        color: 'text-cyber-cyan',
        bgColor: 'bg-cyber-cyan/10',
        borderColor: 'border-cyber-cyan/30',
        growth: growthRate?.views,
      },
      {
        label: '总点赞数',
        value: stats.totalLikes,
        icon: Heart,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        growth: growthRate?.likes,
      },
      {
        label: '总评论数',
        value: stats.totalComments,
        icon: MessageSquare,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        growth: growthRate?.comments,
      },
    ];
  }, [stats, growthRate]);

  // 额外指标
  const metrics = useMemo(() => {
    if (stats.total === 0) return [];

    const avgViews = Math.round(stats.totalViews / stats.total);
    const avgLikes = Math.round(stats.totalLikes / stats.total);
    const avgComments = Math.round(stats.totalComments / stats.total);

    return [
      {
        label: '平均浏览',
        value: avgViews,
        icon: TrendingUp,
      },
      {
        label: '平均点赞',
        value: avgLikes,
        icon: Award,
      },
      {
        label: '平均评论',
        value: avgComments,
        icon: MessageSquare,
      },
    ];
  }, [stats]);

  // 时间段标签
  const periodLabel = useMemo(() => {
    const labels = {
      all: '全部时间',
      week: '最近一周',
      month: '最近一个月',
      year: '最近一年',
    };
    return labels[period];
  }, [period]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">博客统计</h2>
        <span className="text-sm text-gray-400">{periodLabel}</span>
      </div>

      {/* 主要统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative p-6 bg-gray-900/50 backdrop-blur-sm border rounded-xl',
                item.borderColor,
                'hover:border-opacity-50 transition-all duration-300',
                'group hover:shadow-lg hover:shadow-cyber-cyan/5'
              )}
            >
              {/* 图标背景 */}
              <div className={cn('absolute top-4 right-4 w-12 h-12 rounded-lg', item.bgColor, 'opacity-50')} />

              {/* 内容 */}
              <div className="relative">
                <div className={cn('flex items-center gap-2 mb-2', item.color)}>
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-white">
                    {item.value.toLocaleString()}
                  </div>

                  {/* 增长率指示器 */}
                  {item.growth !== null && (
                    <div
                      className={cn(
                        'flex items-center gap-1 text-sm font-medium',
                        item.growth > 0 ? 'text-green-400' : item.growth < 0 ? 'text-red-400' : 'text-gray-400'
                      )}
                    >
                      <TrendingUp className={cn('w-4 h-4', item.growth < 0 && 'rotate-180')} />
                      <span>{Math.abs(item.growth).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 额外指标 */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg hover:border-cyber-cyan/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{metric.label}</span>
                  </div>
                  <span className="text-lg font-bold text-white">{metric.value}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 草稿数量 */}
      {stats.draft > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-yellow-400">
                你有 {stats.draft} 篇草稿
              </p>
              <p className="text-xs text-yellow-400/70">
                完成编辑后即可发布
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BlogStatsCard;
