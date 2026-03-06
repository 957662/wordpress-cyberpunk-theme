'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  Check,
  X,
  Edit2,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingGoal {
  /** 目标ID */
  id: string;
  /** 目标类型 */
  type: 'daily' | 'weekly' | 'monthly';
  /** 目标文章数 */
  articleCount: number;
  /** 目标阅读时长（分钟） */
  readingTime: number;
  /** 当前完成数 */
  currentCount: number;
  /** 当前阅读时长（分钟） */
  currentReadingTime: number;
  /** 开始日期 */
  startDate: string;
  /** 结束日期 */
  endDate: string;
  /** 是否已达成 */
  isAchieved: boolean;
}

interface ReadingGoalSettingProps {
  /** 目标数据 */
  goal: ReadingGoal;
  /** 更新目标回调 */
  onUpdate?: (goal: ReadingGoal) => void;
  /** 删除目标回调 */
  onDelete?: (id: string) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 是否显示编辑按钮 */
  showEdit?: boolean;
  /** 是否显示删除按钮 */
  showDelete?: boolean;
}

/**
 * 阅读目标设置组件
 *
 * 允许用户设置和追踪阅读目标（每日/每周/每月）
 *
 * @example
 * ```tsx
 * <ReadingGoalSetting
 *   goal={{
 *     id: '1',
 *     type: 'daily',
 *     articleCount: 5,
 *     readingTime: 60,
 *     currentCount: 3,
 *     currentReadingTime: 45,
 *     startDate: '2024-03-06',
 *     endDate: '2024-03-06',
 *     isAchieved: false
 *   }}
 * />
 * ```
 */
export const ReadingGoalSetting: React.FC<ReadingGoalSettingProps> = ({
  goal,
  onUpdate,
  onDelete,
  className,
  showEdit = true,
  showDelete = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState(goal);

  // 计算完成百分比
  const calculateProgress = () => {
    const countProgress = (goal.currentCount / goal.articleCount) * 100;
    const timeProgress = (goal.currentReadingTime / goal.readingTime) * 100;
    return Math.min(100, Math.max(countProgress, timeProgress));
  };

  const progress = calculateProgress();
  const progressColor = progress >= 100 ? 'text-green-500' : 'text-blue-500';

  // 保存编辑
  const handleSave = () => {
    onUpdate?.(editedGoal);
    setIsEditing(false);
  };

  // 取消编辑
  const handleCancel = () => {
    setEditedGoal(goal);
    setIsEditing(false);
  };

  // 格式化日期范围
  const formatDateRange = () => {
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);

    if (goal.type === 'daily') {
      return startDate.toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
      });
    }

    return `${startDate.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    })} - ${endDate.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    })}`;
  };

  // 获取目标类型文本
  const getGoalTypeText = () => {
    switch (goal.type) {
      case 'daily':
        return '每日目标';
      case 'weekly':
        return '每周目标';
      case 'monthly':
        return '每月目标';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      {/* 头部 */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Target className={cn('h-5 w-5', progressColor)} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {getGoalTypeText()}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDateRange()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {goal.isAchieved && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Check className="h-3 w-3" />
              已达成
            </span>
          )}

          {showEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              aria-label="编辑目标"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}

          {showDelete && (
            <button
              onClick={() => onDelete?.(goal.id)}
              className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
              aria-label="删除目标"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 编辑模式 */}
      <AnimatePresence>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                目标文章数
              </label>
              <input
                type="number"
                min="1"
                value={editedGoal.articleCount}
                onChange={(e) =>
                  setEditedGoal({ ...editedGoal, articleCount: parseInt(e.target.value) || 1 })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                目标阅读时长（分钟）
              </label>
              <input
                type="number"
                min="1"
                value={editedGoal.readingTime}
                onChange={(e) =>
                  setEditedGoal({ ...editedGoal, readingTime: parseInt(e.target.value) || 1 })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                <Save className="mr-1 inline h-4 w-4" />
                保存
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 进度条 */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  完成进度
                </span>
                <span className={cn('font-medium', progressColor)}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <motion.div
                  className={cn('h-full', progress >= 100 ? 'bg-green-500' : 'bg-blue-500')}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    文章数
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {goal.currentCount} / {goal.articleCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    阅读时长
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {goal.currentReadingTime} / {goal.readingTime} 分钟
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * 阅读目标列表组件
 */
interface ReadingGoalListProps {
  /** 目标列表 */
  goals: ReadingGoal[];
  /** 更新目标回调 */
  onUpdate?: (goal: ReadingGoal) => void;
  /** 删除目标回调 */
  onDelete?: (id: string) => void;
  /** 添加目标回调 */
  onAdd?: () => void;
  /** 自定义样式类名 */
  className?: string;
}

export const ReadingGoalList: React.FC<ReadingGoalListProps> = ({
  goals,
  onUpdate,
  onDelete,
  onAdd,
  className,
}) => {
  if (goals.length === 0) {
    return (
      <div className={cn(
        'rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900',
        className
      )}>
        <Target className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          还没有设置阅读目标
        </p>
        {onAdd && (
          <button
            onClick={onAdd}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            设置目标
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {goals.map((goal) => (
        <ReadingGoalSetting
          key={goal.id}
          goal={goal}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ReadingGoalSetting;
