'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  type?: 'empty' | 'search' | 'error';
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * 空状态组件
 * 用于博客列表为空、搜索无结果、错误提示等场景
 */
export function EmptyState({
  type = 'empty',
  title,
  message,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'search':
        return {
          icon: <Search className="w-16 h-16" />,
          defaultTitle: '未找到相关内容',
          defaultMessage: '请尝试使用其他关键词搜索',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-16 h-16 text-red-500" />,
          defaultTitle: '出现错误',
          defaultMessage: '加载内容时出现问题，请稍后重试',
        };
      default:
        return {
          icon: <FileText className="w-16 h-16" />,
          defaultTitle: '暂无内容',
          defaultMessage: '还没有发布任何文章',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {/* 图标 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="text-gray-400 dark:text-gray-600 mb-6"
      >
        {config.icon}
      </motion.div>

      {/* 标题 */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title || config.defaultTitle}
      </h3>

      {/* 描述 */}
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        {message || config.defaultMessage}
      </p>

      {/* 操作按钮 */}
      {actionLabel && onAction && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onAction}
          className={cn(
            'px-6 py-3 rounded-lg font-medium',
            'bg-gradient-to-r from-cyan-500 to-purple-500',
            'text-white',
            'hover:from-cyan-600 hover:to-purple-600',
            'shadow-[0_0_15px_rgba(0,240,255,0.3)]',
            'hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]',
            'transition-all duration-300',
            'hover:scale-105'
          )}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}

/**
 * 博客专用空状态组件
 */
export interface BlogEmptyStateProps {
  variant?: 'no-posts' | 'no-results' | 'category-empty' | 'tag-empty';
  onClearFilter?: () => void;
  onBackHome?: () => void;
  className?: string;
}

export function BlogEmptyState({
  variant = 'no-posts',
  onClearFilter,
  onBackHome,
  className,
}: BlogEmptyStateProps) {
  const configs = {
    'no-posts': {
      type: 'empty' as const,
      title: '暂无文章',
      message: '还没有发布任何文章，请稍后再来查看',
      actionLabel: '返回首页',
      onAction: onBackHome,
    },
    'no-results': {
      type: 'search' as const,
      title: '未找到相关文章',
      message: '请尝试使用其他关键词或筛选条件',
      actionLabel: '清除筛选',
      onAction: onClearFilter,
    },
    'category-empty': {
      type: 'empty' as const,
      title: '该分类暂无文章',
      message: '这个分类下还没有发布任何文章',
      actionLabel: '浏览其他分类',
      onAction: onBackHome,
    },
    'tag-empty': {
      type: 'empty' as const,
      title: '该标签暂无文章',
      message: '这个标签下还没有发布任何文章',
      actionLabel: '浏览其他标签',
      onAction: onBackHome,
    },
  };

  const config = configs[variant];

  return (
    <EmptyState
      type={config.type}
      title={config.title}
      message={config.message}
      actionLabel={config.actionLabel}
      onAction={config.onAction}
      className={className}
    />
  );
}

export default EmptyState;
