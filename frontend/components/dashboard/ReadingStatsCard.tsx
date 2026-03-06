'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface ReadingStats {
  totalArticles: number;
  completedArticles: number;
  inProgressArticles: number;
  totalReadingTime: number;
  averageProgress: number;
}

interface ReadingStatsCardProps {
  stats: ReadingStats;
  className?: string;
}

/**
 * 阅读统计卡片组件
 * 显示用户的阅读统计信息
 */
export const ReadingStatsCard: React.FC<ReadingStatsCardProps> = ({
  stats,
  className = '',
}) => {
  const formatReadingTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const completionRate = stats.totalArticles > 0
    ? Math.round((stats.completedArticles / stats.totalArticles) * 100)
    : 0;

  const statItems = [
    {
      icon: BookOpen,
      label: '总文章',
      value: stats.totalArticles,
      color: 'cyber-cyan',
    },
    {
      icon: CheckCircle,
      label: '已完成',
      value: stats.completedArticles,
      color: 'cyber-green',
      subtext: `${completionRate}% 完成率`,
    },
    {
      icon: Clock,
      label: '阅读时间',
      value: formatReadingTime(stats.totalReadingTime),
      color: 'cyber-purple',
    },
    {
      icon: TrendingUp,
      label: '平均进度',
      value: `${stats.averageProgress}%`,
      color: 'cyber-pink',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="cyber-card bg-cyber-dark border border-cyber-cyan/20 rounded-lg p-5 hover:border-cyber-cyan/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-cyber-cyan/10 rounded-lg">
                <Icon className="w-6 h-6 text-cyber-cyan" />
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-1">
                  {item.value}
                </div>
                <div className="text-sm text-gray-400">
                  {item.label}
                </div>
                {'subtext' in item && item.subtext && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.subtext}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ReadingStatsCard;
