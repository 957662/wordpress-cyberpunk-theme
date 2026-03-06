'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BlogStatsProps {
  views?: number;
  likes?: number;
  comments?: number;
  bookmarks?: number;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

/**
 * 博客统计组件
 * 显示文章的浏览、点赞、评论、收藏数
 */
export function BlogStats({
  views = 0,
  likes = 0,
  comments = 0,
  bookmarks = 0,
  variant = 'default',
  className,
}: BlogStatsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return \`\${(num / 1000000).toFixed(1)}M\`;
    }
    if (num >= 1000) {
      return \`\${(num / 1000).toFixed(1)}K\`;
    }
    return num.toString();
  };

  const stats = [
    { icon: Eye, label: '浏览', value: views, color: 'text-cyan-400' },
    { icon: Heart, label: '点赞', value: likes, color: 'text-pink-400' },
    { icon: MessageCircle, label: '评论', value: comments, color: 'text-purple-400' },
    { icon: Bookmark, label: '收藏', value: bookmarks, color: 'text-yellow-400' },
  ];

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-4 text-sm', className)}>
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <stat.icon className="w-4 h-4" />
            <span>{formatNumber(stat.value)}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-3 text-xs', className)}>
        {stats.filter(stat => stat.value > 0).map((stat, index) => (
          <div key={index} className={cn('flex items-center gap-1', stat.color)}>
            <stat.icon className="w-3.5 h-3.5" />
            <span className="font-medium">{formatNumber(stat.value)}</span>
          </div>
        ))}
      </div>
    );
  }

  // 默认变体
  return (
    <div className={cn('flex items-center gap-6', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-2"
        >
          <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-800', stat.color)}>
            <stat.icon className="w-5 h-5" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stat.value)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * 单个统计项组件
 */
export interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color?: string;
  className?: string;
}

export function StatItem({ icon: Icon, label, value, color, className }: StatItemProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return \`\${(num / 1000000).toFixed(1)}M\`;
    }
    if (num >= 1000) {
      return \`\${(num / 1000).toFixed(1)}K\`;
    }
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex items-center gap-3', className)}
    >
      <div className={cn('p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800', color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          {formatNumber(value)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

export default BlogStats;
