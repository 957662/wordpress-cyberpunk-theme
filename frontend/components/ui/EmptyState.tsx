/**
 * EmptyState - 空状态组件
 * 用于显示无数据、无搜索结果等空状态
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  /**
   * 图标组件
   */
  icon?: LucideIcon;
  /**
   * 标题
   */
  title: string;
  /**
   * 描述文本
   */
  description?: string;
  /**
   * 操作按钮文本
   */
  actionText?: string;
  /**
   * 操作按钮点击事件
   */
  onAction?: () => void;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 大小变体
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * 自定义图标元素
   */
  customIcon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className,
  size = 'md',
  customIcon,
}) => {
  const sizeStyles = {
    sm: {
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      icon: 'w-24 h-24',
      title: 'text-2xl',
      description: 'text-lg',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8',
        className
      )}
    >
      {/* Icon */}
      <div className="mb-6">
        {customIcon ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="relative"
          >
            {customIcon}
          </motion.div>
        ) : Icon ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.1,
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            className={cn(
              'mx-auto rounded-full bg-cyber-cyan/10 border-2 border-cyber-cyan/30 flex items-center justify-center',
              currentSize.icon,
              size === 'sm' && 'p-3',
              size === 'md' && 'p-4',
              size === 'lg' && 'p-6'
            )}
          >
            <Icon className="text-cyber-cyan" />
          </motion.div>
        ) : null}
      </div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          'font-semibold text-white mb-2',
          currentSize.title
        )}
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            'text-gray-400 max-w-md mb-6',
            currentSize.description
          )}
        >
          {description}
        </motion.p>
      )}

      {/* Action Button */}
      {actionText && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * 预设的空状态变体
 */
export const EmptyStates = {
  noData: (props: Omit<EmptyStateProps, 'title' | 'icon'>) => (
    <EmptyState
      title="暂无数据"
      description="这里还没有任何内容"
      {...props}
    />
  ),

  noSearchResults: (props: Omit<EmptyStateProps, 'title' | 'icon'>) => (
    <EmptyState
      title="未找到相关结果"
      description="尝试使用不同的关键词搜索"
      {...props}
    />
  ),

  noNotifications: (props: Omit<EmptyStateProps, 'title' | 'icon'>) => (
    <EmptyState
      title="暂无通知"
      description="当有新通知时,它们会显示在这里"
      {...props}
    />
  ),

  noMessages: (props: Omit<EmptyStateProps, 'title' | 'icon'>) => (
    <EmptyState
      title="暂无消息"
      description="开始与朋友聊天吧"
      {...props}
    />
  ),

  error: (props: Omit<EmptyStateProps, 'title' | 'icon' | 'description'>) => (
    <EmptyState
      title="出错了"
      description="抱歉,加载失败。请稍后重试"
      actionText="重试"
      {...props}
    />
  ),

  networkError: (props: Omit<EmptyStateProps, 'title' | 'icon' | 'description'>) => (
    <EmptyState
      title="网络连接失败"
      description="请检查您的网络连接后重试"
      actionText="刷新"
      {...props}
    />
  ),
};

export default EmptyState;
