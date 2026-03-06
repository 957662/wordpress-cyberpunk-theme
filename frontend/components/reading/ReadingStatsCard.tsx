'use client';

/**
 * ReadingStatsCard - 阅读统计卡片
 * 展示用户的阅读数据和成就
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Flame,
  Target,
  Eye,
  Calendar,
  Bookmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReadingStats {
  totalArticles: number;
  totalWords: number;
  totalReadingTime: number; // 分钟
  currentStreak: number; // 连续阅读天数
  longestStreak: number;
  averageReadingSpeed: number; // 字/分钟
  completionRate: number; // 百分比
  thisWeekReading: number; // 本周阅读字数
  thisMonthReading: number; // 本月阅读字数
  favoriteCategories: string[];
  recentAchievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ReadingStatsCardProps {
  stats: ReadingStats;
  variant?: 'compact' | 'detailed' | 'minimal';
  className?: string;
  showAchievements?: boolean;
  showTrends?: boolean;
}

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-orange-500',
};

export function ReadingStatsCard({
  stats,
  variant = 'detailed',
  className,
  showAchievements = true,
  showTrends = true,
}: ReadingStatsCardProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} 分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} 小时 ${mins} 分钟`;
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // 紧凑模式
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'cyber-card p-4 bg-gradient-to-br from-cyber-dark to-cyber-muted border border-cyber-border',
          className
        )}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem
            icon={<BookOpen className="w-5 h-5" />}
            label="文章"
            value={stats.totalArticles}
            color="cyber-cyan"
          />
          <StatItem
            icon={<Clock className="w-5 h-5" />}
            label="阅读时长"
            value={formatTime(stats.totalReadingTime)}
            color="cyber-purple"
          />
          <StatItem
            icon={<TrendingUp className="w-5 h-5" />}
            label="总字数"
            value={formatNumber(stats.totalWords)}
            color="cyber-pink"
          />
          <StatItem
            icon={<Flame className="w-5 h-5" />}
            label="连续天数"
            value={`${stats.currentStreak}天`}
            color="cyber-green"
          />
        </div>
      </motion.div>
    );
  }

  // 极简模式
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'cyber-card p-3 bg-cyber-dark/50 border border-cyber-border',
          className
        )}
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-400">
              <BookOpen className="w-4 h-4" />
              <span>{stats.totalArticles} 篇</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatTime(stats.totalReadingTime)}</span>
            </div>
          </div>
          {stats.currentStreak > 0 && (
            <div className="flex items-center gap-1.5 text-cyber-green">
              <Flame className="w-4 h-4" />
              <span>{stats.currentStreak} 天</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // 详细模式
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'cyber-card p-6 bg-gradient-to-br from-cyber-dark to-cyber-muted border border-cyber-border',
        className
      )}
    >
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyber-cyan" />
          阅读统计
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>本月数据</span>
        </div>
      </div>

      {/* 主要统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatItem
          icon={<BookOpen className="w-5 h-5" />}
          label="阅读文章"
          value={stats.totalArticles}
          color="cyber-cyan"
          trend={`本周 +${Math.round(stats.thisWeekReading / 1000)}k`}
        />
        <StatItem
          icon={<Eye className="w-5 h-5" />}
          label="阅读字数"
          value={formatNumber(stats.totalWords)}
          color="cyber-purple"
          trend={`本月 +${formatNumber(stats.thisMonthReading)}`}
        />
        <StatItem
          icon={<Clock className="w-5 h-5" />}
          label="阅读时长"
          value={formatTime(stats.totalReadingTime)}
          color="cyber-pink"
        />
        <StatItem
          icon={<Flame className="w-5 h-5" />}
          label="连续阅读"
          value={`${stats.currentStreak}天`}
          color="cyber-green"
          trend={`最长 ${stats.longestStreak}天`}
        />
      </div>

      {/* 阅读速度和完成率 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">平均阅读速度</span>
            <Target className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.averageReadingSpeed}
            <span className="text-sm text-gray-400 ml-1">字/分钟</span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (stats.averageReadingSpeed / 500) * 100)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
            />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">文章完成率</span>
            <Award className="w-4 h-4 text-cyber-pink" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.completionRate}%
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-cyber-pink to-cyber-yellow"
            />
          </div>
        </div>
      </div>

      {/* 喜欢的分类 */}
      {stats.favoriteCategories.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            常读分类
          </h4>
          <div className="flex flex-wrap gap-2">
            {stats.favoriteCategories.map((category, index) => (
              <motion.span
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1.5 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/30 rounded-full text-sm text-cyber-cyan"
              >
                {category}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* 成就展示 */}
      {showAchievements && stats.recentAchievements.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            最近成就
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'relative p-3 rounded-lg border overflow-hidden',
                  'bg-gradient-to-br ' + rarityColors[achievement.rarity] + '/10',
                  'border-' + rarityColors[achievement.rarity].split(' ')[0] + '/30'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-white text-sm truncate">
                      {achievement.title}
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// 统计项子组件
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  trend?: string;
}

function StatItem({ icon, label, value, color, trend }: StatItemProps) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg bg-${color}/20 text-${color}`}>
          {icon}
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className={`text-2xl font-bold text-white`}>{value}</div>
      {trend && (
        <div className="text-xs text-cyber-green mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
  );
}

export default ReadingStatsCard;
