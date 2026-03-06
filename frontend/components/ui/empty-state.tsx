/**
 * 空状态组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-12',
        className
      )}
    >
      {/* 图标 */}
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="mb-6 text-6xl"
        >
          {icon}
        </motion.div>
      )}

      {/* 标题 */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-white mb-2"
      >
        {title}
      </motion.h3>

      {/* 描述 */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-cyber-muted mb-6 max-w-md"
        >
          {description}
        </motion.p>
      )}

      {/* 操作按钮 */}
      {action && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={action.onClick}
          className={cn(
            'px-6 py-2 rounded-lg font-medium transition-all',
            'hover:scale-105 active:scale-95',
            {
              'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80':
                action.variant === 'primary',
              'bg-cyber-purple text-white hover:bg-cyber-purple/80':
                action.variant === 'secondary',
              'border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10':
                action.variant === 'outline' || !action.variant,
            }
          )}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

// 预定义的空状态
export const NoData: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <EmptyState
    icon="📭"
    title="暂无数据"
    description="这里还没有任何内容"
    action={
      onRefresh && {
        label: '刷新',
        onClick: onRefresh,
        variant: 'outline',
      }
    }
  />
);

export const NoResults: React.FC<{ onClear?: () => void }> = ({ onClear }) => (
  <EmptyState
    icon="🔍"
    title="未找到结果"
    description="尝试调整搜索条件"
    action={
      onClear && {
        label: '清除筛选',
        onClick: onClear,
        variant: 'outline',
      }
    }
  />
);

export const NoNotifications: React.FC = () => (
  <EmptyState
    icon="🔔"
    title="暂无通知"
    description="您目前没有任何新通知"
  />
);

export const NoMessages: React.FC<{ onStartChat?: () => void }> = ({ onStartChat }) => (
  <EmptyState
    icon="💬"
    title="暂无消息"
    description="开始与朋友聊天吧"
    action={
      onStartChat && {
        label: '发起聊天',
        onClick: onStartChat,
        variant: 'primary',
      }
    }
  />
);

export const NoBookmarks: React.FC<{ onBrowse?: () => void }> = ({ onBrowse }) => (
  <EmptyState
    icon="🔖"
    title="暂无收藏"
    description="收藏您喜欢的文章，方便随时查看"
    action={
      onBrowse && {
        label: '浏览文章',
        onClick: onBrowse,
        variant: 'primary',
      }
    }
  />
);

export const NoFollowers: React.FC<{ onExplore?: () => void }> = ({ onExplore }) => (
  <EmptyState
    icon="👥"
    title="还没有关注者"
    description="发布优质内容，吸引更多关注"
    action={
      onExplore && {
        label: '探索',
        onClick: onExplore,
        variant: 'primary',
      }
    }
  />
);

export const NoComments: React.FC<{ onComment?: () => void }> = ({ onComment }) => (
  <EmptyState
    icon="💭"
    title="暂无评论"
    description="成为第一个评论的人吧"
    action={
      onComment && {
        label: '发表评论',
        onClick: onComment,
        variant: 'primary',
      }
    }
  />
);

export const NoPosts: React.FC<{ onCreate?: () => void }> = ({ onCreate }) => (
  <EmptyState
    icon="📝"
    title="暂无文章"
    description="开始创作您的第一篇文章"
    action={
      onCreate && {
        label: '创建文章',
        onClick: onCreate,
        variant: 'primary',
      }
    }
  />
);

export const NoCategories: React.FC = () => (
  <EmptyState
    icon="📁"
    title="暂无分类"
    description="还没有创建任何分类"
  />
);

export const NoTags: React.FC = () => (
  <EmptyState
    icon="🏷️"
    title="暂无标签"
    description="还没有创建任何标签"
  />
);

export const ErrorState: React.FC<{ onRetry?: () => void; message?: string }> = ({
  onRetry,
  message = '加载失败'
}) => (
  <EmptyState
    icon="❌"
    title={message}
    description="出现了一些问题，请稍后再试"
    action={
      onRetry && {
        label: '重试',
        onClick: onRetry,
        variant: 'primary',
      }
    }
  />
);

export const LoadingState: React.FC<{ message?: string }> = ({ message = '加载中...' }) => (
  <div className="flex flex-col items-center justify-center p-12">
    <div className="relative w-16 h-16 mb-4">
      <div className="absolute inset-0 border-4 border-cyber-muted rounded-full" />
      <div className="absolute inset-0 border-4 border-t-cyber-cyan rounded-full animate-spin" />
    </div>
    <p className="text-cyber-muted">{message}</p>
  </div>
);

export default EmptyState;
