'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle, Bookmark, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BlogStatsProps {
  views?: number;
  likes?: number;
  comments?: number;
  bookmarks?: number;
  readingTime?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  layout?: 'horizontal' | 'vertical' | 'compact';
  showLabels?: boolean;
  showIcons?: boolean;
  variant?: 'default' | 'neon' | 'minimal';
  className?: string;
}

export function BlogStatsCard({
  views = 0,
  likes = 0,
  comments = 0,
  bookmarks = 0,
  readingTime,
  trend = 'neutral',
  trendValue,
  layout = 'horizontal',
  showLabels = true,
  showIcons = true,
  variant = 'default',
  className,
}: BlogStatsProps) {
  const stats = [
    { icon: Eye, label: '浏览', value: views, color: 'text-cyber-cyan', bgColor: 'bg-cyber-cyan/10' },
    { icon: Heart, label: '点赞', value: likes, color: 'text-cyber-pink', bgColor: 'bg-cyber-pink/10' },
    { icon: MessageCircle, label: '评论', value: comments, color: 'text-cyber-purple', bgColor: 'bg-cyber-purple/10' },
    { icon: Bookmark, label: '收藏', value: bookmarks, color: 'text-cyber-green', bgColor: 'bg-cyber-green/10' },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (layout === 'compact') {
    return (
      <div className={cn('flex items-center gap-4 text-sm', className)}>
        {stats.map((stat) => (
          <div key={stat.label} className={cn('flex items-center gap-1', stat.color)}>
            {showIcons && <stat.icon className="w-4 h-4" />}
            <span className="font-semibold">{formatNumber(stat.value)}</span>
          </div>
        ))}
        {readingTime && (
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{readingTime} 分钟</span>
          </div>
        )}
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div className={cn('cyber-card p-4 space-y-3', className)}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn('flex items-center gap-3 p-3 rounded-lg', variant === 'neon' && stat.bgColor)}
          >
            {showIcons && (
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
            )}
            <div className="flex-1">
              {showLabels && <p className="text-xs text-gray-400 mb-0.5">{stat.label}</p>}
              <p className="text-xl font-bold">{formatNumber(stat.value)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('cyber-card p-4', className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className={cn('text-center p-3 rounded-lg transition-all', variant === 'neon' && stat.bgColor)}
          >
            {showIcons && <div className="flex justify-center mb-2"><stat.icon className={cn('w-6 h-6', stat.color)} /></div>}
            {showLabels && <p className="text-xs text-gray-400 mb-1">{stat.label}</p>}
            <p className="text-2xl font-bold">{formatNumber(stat.value)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default BlogStatsCard;
