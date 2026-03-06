/**
 * Empty State Component
 * 空状态组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileX, Inbox, Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EmptyStateType = 'no-data' | 'no-results' | 'error' | 'custom';

export interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const emptyStateConfig = {
  'no-data': {
    icon: Inbox,
    defaultTitle: '暂无数据',
    defaultDescription: '还没有任何内容，快去创建吧！',
  },
  'no-results': {
    icon: Search,
    defaultTitle: '未找到结果',
    defaultDescription: '没有找到匹配的内容，请尝试其他关键词。',
  },
  'error': {
    icon: AlertCircle,
    defaultTitle: '出错了',
    defaultDescription: '加载内容时出现错误，请稍后重试。',
  },
  'custom': {
    icon: FileX,
    defaultTitle: '暂无内容',
    defaultDescription: '这里还没有任何内容。',
  },
};

export function EmptyState({
  type = 'no-data',
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const IconComponent = config.icon;
  const CustomIcon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4 text-gray-400 dark:text-gray-600">
        {CustomIcon ? (
          <div className="w-16 h-16">{CustomIcon}</div>
        ) : (
          <IconComponent className="w-16 h-16" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title || config.defaultTitle}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {description || config.defaultDescription}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-cyber-cyan text-white font-medium hover:bg-cyber-purple transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

export default EmptyState;
