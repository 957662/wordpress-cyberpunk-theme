'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Star,
  Flame,
  Target,
  BookOpen,
  Clock,
  Zap,
  Medal,
  Crown,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Achievement {
  /** 成就ID */
  id: string;
  /** 成就标题 */
  title: string;
  /** 成就描述 */
  description: string;
  /** 成就图标 */
  icon: 'trophy' | 'star' | 'flame' | 'target' | 'book' | 'clock' | 'zap' | 'medal' | 'crown';
  /** 成就稀有度 */
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  /** 是否已解锁 */
  isUnlocked: boolean;
  /** 解锁时间 */
  unlockedAt?: string;
  /** 进度（0-100）*/
  progress: number;
  /** 成就类型 */
  type: 'reading' | 'streak' | 'time' | 'special';
}

interface ReadingAchievementProps {
  /** 成就列表 */
  achievements: Achievement[];
  /** 点击成就回调 */
  onAchievementClick?: (achievement: Achievement) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 显示模式 */
  viewMode?: 'grid' | 'list';
}

/**
 * 阅读成就组件
 *
 * 展示用户的阅读成就系统
 *
 * @example
 * ```tsx
 * const achievements = [
 *   {
 *     id: '1',
 *     title: '初出茅庐',
 *     description: '完成第一篇文章阅读',
 *     icon: 'book',
 *     rarity: 'common',
 *     isUnlocked: true,
 *     progress: 100,
 *     type: 'reading'
 *   },
 *   // ... 更多成就
 * ];
 *
 * <ReadingAchievement achievements={achievements} />
 * ```
 */
export const ReadingAchievement: React.FC<ReadingAchievementProps> = ({
  achievements,
  onAchievementClick,
  className,
  viewMode = 'grid',
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // 获取图标组件
  const getIcon = (iconType: Achievement['icon']) => {
    const icons = {
      trophy: Trophy,
      star: Star,
      flame: Flame,
      target: Target,
      book: BookOpen,
      clock: Clock,
      zap: Zap,
      medal: Medal,
      crown: Crown,
    };
    return icons[iconType] || Star;
  };

  // 获取稀有度颜色
  const getRarityColor = (rarity: Achievement['rarity']) => {
    const colors = {
      common: 'from-gray-500 to-gray-600',
      rare: 'from-blue-500 to-blue-600',
      epic: 'from-purple-500 to-purple-600',
      legendary: 'from-yellow-500 to-orange-500',
    };
    return colors[rarity];
  };

  // 获取稀有度边框颜色
  const getRarityBorderColor = (rarity: Achievement['rarity']) => {
    const colors = {
      common: 'border-gray-300 dark:border-gray-700',
      rare: 'border-blue-400 dark:border-blue-600',
      epic: 'border-purple-400 dark:border-purple-600',
      legendary: 'border-yellow-400 dark:border-yellow-600',
    };
    return colors[rarity];
  };

  // 过滤成就：优先显示已解锁的
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (!a.isUnlocked && b.isUnlocked) return 1;
    return b.progress - a.progress;
  });

  if (viewMode === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {sortedAchievements.map((achievement) => {
          const Icon = getIcon(achievement.icon);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedAchievement(achievement);
                onAchievementClick?.(achievement);
              }}
              className={cn(
                'flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm transition-all dark:bg-gray-900',
                getRarityBorderColor(achievement.rarity),
                !achievement.isUnlocked && 'opacity-60 grayscale',
                'cursor-pointer'
              )}
            >
              {/* 图标 */}
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br',
                  getRarityColor(achievement.rarity),
                  achievement.isUnlocked || 'bg-gray-400'
                )}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>

              {/* 内容 */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {achievement.title}
                  </h4>
                  {!achievement.isUnlocked && (
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      未解锁
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
              </div>

              {/* 进度 */}
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {achievement.progress}%
                </div>
                {achievement.unlockedAt && (
                  <div className="text-xs text-gray-500">
                    {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Grid view
  return (
    <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4', className)}>
      {sortedAchievements.map((achievement, index) => {
        const Icon = getIcon(achievement.icon);
        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => {
              setSelectedAchievement(achievement);
              onAchievementClick?.(achievement);
            }}
            className={cn(
              'relative cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all dark:bg-gray-900',
              getRarityBorderColor(achievement.rarity),
              !achievement.isUnlocked && 'opacity-60 grayscale'
            )}
          >
            {/* 背景光效 */}
            {achievement.isUnlocked && (
              <div
                className={cn(
                  'absolute inset-0 rounded-lg bg-gradient-to-br opacity-10 blur-xl',
                  getRarityColor(achievement.rarity)
                )}
              />
            )}

            {/* 图标 */}
            <div className="relative mb-3 flex justify-center">
              <motion.div
                animate={
                  achievement.isUnlocked
                    ? {
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-lg',
                  getRarityColor(achievement.rarity),
                  !achievement.isUnlocked && 'bg-gray-400'
                )}
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>

              {/* 闪光效果 */}
              {achievement.isUnlocked && (
                <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-yellow-400" />
              )}
            </div>

            {/* 标题 */}
            <h4 className="mb-1 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
              {achievement.title}
            </h4>

            {/* 描述 */}
            <p className="mb-3 text-center text-xs text-gray-600 dark:text-gray-400">
              {achievement.description}
            </p>

            {/* 进度条 */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <motion.div
                className={cn(
                  'h-full',
                  achievement.progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${achievement.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* 进度文字 */}
            <div className="mt-2 text-center">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {achievement.progress}%
              </span>
              {achievement.unlockedAt && (
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* 成就详情弹窗 */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900"
            >
              <div className="mb-4 flex justify-center">
                <div
                  className={cn(
                    'flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br',
                    getRarityColor(selectedAchievement.rarity)
                  )}
                >
                  {React.createElement(getIcon(selectedAchievement.icon), {
                    className: 'h-10 w-10 text-white',
                  })}
                </div>
              </div>

              <h3 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-gray-100">
                {selectedAchievement.title}
              </h3>

              <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
                {selectedAchievement.description}
              </p>

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    完成进度
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedAchievement.progress}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className={cn(
                      'h-full',
                      selectedAchievement.progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                    )}
                    style={{ width: `${selectedAchievement.progress}%` }}
                  />
                </div>
              </div>

              {selectedAchievement.unlockedAt && (
                <div className="mb-4 text-center text-sm text-gray-500">
                  解锁时间：{new Date(selectedAchievement.unlockedAt).toLocaleString('zh-CN')}
                </div>
              )}

              <button
                onClick={() => setSelectedAchievement(null)}
                className="w-full rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 成就统计卡片
 */
interface AchievementStatsProps {
  /** 总成就数 */
  totalAchievements: number;
  /** 已解锁成就数 */
  unlockedAchievements: number;
  /** 当前等级 */
  currentLevel: number;
  /** 下一等级所需经验 */
  nextLevelXP: number;
  /** 当前经验值 */
  currentXP: number;
  /** 自定义样式类名 */
  className?: string;
}

export const AchievementStats: React.FC<AchievementStatsProps> = ({
  totalAchievements,
  unlockedAchievements,
  currentLevel,
  nextLevelXP,
  currentXP,
  className,
}) => {
  const unlockRate = totalAchievements > 0
    ? Math.round((unlockedAchievements / totalAchievements) * 100)
    : 0;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  return (
    <div className={cn('rounded-lg border bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          成就统计
        </h3>
        <div className="flex items-center gap-1">
          <Crown className="h-5 w-5 text-yellow-500" />
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Lv.{currentLevel}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* 解锁率 */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              成就解锁
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {unlockedAchievements} / {totalAchievements} ({unlockRate}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${unlockRate}%` }}
            />
          </div>
        </div>

        {/* 经验值 */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              经验值
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {currentXP} / {nextLevelXP} XP
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingAchievement;
