'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  variant?: 'no-posts' | 'no-results' | 'error' | 'loading';
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  variant = 'no-posts',
  title,
  message,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const defaultConfig = {
    'no-posts': {
      icon: <FileText className="w-16 h-16" />,
      title: title || '暂无文章',
      message: message || '还没有发布任何文章，敬请期待！',
    },
    'no-results': {
      icon: <Search className="w-16 h-16" />,
      title: title || '未找到相关内容',
      message: message || '尝试使用其他关键词搜索',
    },
    'error': {
      icon: <AlertCircle className="w-16 h-16" />,
      title: title || '加载失败',
      message: message || '请刷新页面重试',
    },
    'loading': {
      icon: null,
      title: title || '加载中...',
      message: message || '正在获取内容',
    },
  };

  const config = defaultConfig[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {/* Icon */}
      {icon || config.icon ? (
        <div className="mb-6 text-cyber-cyan/50">
          {icon || config.icon}
        </div>
      ) : null}

      {/* Loading Spinner */}
      {variant === 'loading' && (
        <div className="relative w-16 h-16 mb-6">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-cyber-cyan/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-cyber-purple/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
        {config.title}
      </h3>

      {/* Message */}
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {config.message}
      </p>

      {/* Action Button */}
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

export default EmptyState;
