/**
 * 阅读统计卡片组件
 * 显示用户的阅读统计信息
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import { readingListService } from '@/services/reading-list-service';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
} from '@/components/icons';

interface ReadingStats {
  totalRead: number;
  totalTime: number;
  thisWeek: number;
  thisMonth: number;
}

export function ReadingStatsCard() {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [readingListCount, setReadingListCount] = useState(0);

  useEffect(() => {
    // 获取统计信息
    const readingStats = readingListService.getReadingStats();
    setStats(readingStats);

    // 获取阅读列表数量
    const listCount = readingListService.getReadingList().length;
    setReadingListCount(listCount);
  }, []);

  if (!stats) {
    return (
      <Card variant="glass" className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-cyber-muted rounded w-1/3" />
          <div className="h-8 bg-cyber-muted rounded" />
        </div>
      </Card>
    );
  }

  const statItems = [
    {
      label: '已阅读',
      value: stats.totalRead,
      icon: BookOpen,
      color: 'text-cyber-cyan',
      bgColor: 'bg-cyber-cyan/10',
    },
    {
      label: '阅读时长',
      value: `${Math.round(stats.totalTime)}分钟`,
      icon: Clock,
      color: 'text-cyber-purple',
      bgColor: 'bg-cyber-purple/10',
    },
    {
      label: '本周阅读',
      value: stats.thisWeek,
      icon: TrendingUp,
      color: 'text-cyber-green',
      bgColor: 'bg-cyber-green/10',
    },
    {
      label: '待阅读',
      value: readingListCount,
      icon: Award,
      color: 'text-cyber-pink',
      bgColor: 'bg-cyber-pink/10',
    },
  ];

  return (
    <Card variant="glass" className="p-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Award className="w-5 h-5 text-cyber-purple" />
        阅读统计
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`relative p-4 rounded-lg ${item.bgColor} border border-white/10`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`${item.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                </div>

                <div className={`text-2xl font-bold ${item.color} mb-1`}>
                  {item.value}
                </div>

                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 继续阅读 */}
      <ContinueReadingSection />
    </Card>
  );
}

function ContinueReadingSection() {
  const [continueReading, setContinueReading] = useState([]);

  useEffect(() => {
    const items = readingListService.getContinueReading(3);
    setContinueReading(items);
  }, []);

  if (continueReading.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-white/10">
      <h4 className="text-sm font-semibold text-gray-400 mb-3">
        继续阅读
      </h4>

      <div className="space-y-2">
        {continueReading.map((item: any) => (
          <a
            key={item.postId}
            href={`/blog/${item.slug}`}
            className="block p-3 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-medium text-white group-hover:text-cyber-cyan transition-colors line-clamp-1">
                  {item.title}
                </h5>

                {/* 阅读进度条 */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>进度</span>
                    <span>{Math.round(item.progress)}%</span>
                  </div>

                  <div className="h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
