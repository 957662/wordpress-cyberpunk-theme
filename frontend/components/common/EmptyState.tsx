'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FileX,
  Search,
  Inbox,
  AlertCircle,
  RefreshCw,
  Plus,
  FolderOpen,
} from 'lucide-react';

interface EmptyStateProps {
  type?: 'empty' | 'error' | 'not-found' | 'loading' | 'no-data' | 'no-permission';
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  className?: string;
}

const emptyStateConfig = {
  empty: {
    icon: Inbox,
    defaultTitle: '暂无内容',
    defaultDescription: '这里还没有任何内容',
  },
  error: {
    icon: AlertCircle,
    defaultTitle: '出错了',
    defaultDescription: '加载内容时发生错误',
  },
  'not-found': {
    icon: Search,
    defaultTitle: '未找到内容',
    defaultDescription: '您查找的内容不存在',
  },
  loading: {
    icon: RefreshCw,
    defaultTitle: '加载中',
    defaultDescription: '正在获取内容...',
  },
  'no-data': {
    icon: FileX,
    defaultTitle: '暂无数据',
    defaultDescription: '当前没有可显示的数据',
  },
  'no-permission': {
    icon: FolderOpen,
    defaultTitle: '无权限访问',
    defaultDescription: '您没有权限访问此内容',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'empty',
  title,
  description,
  icon: CustomIcon,
  action,
  className,
}) => {
  const config = emptyStateConfig[type];
  const Icon = CustomIcon || config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center',
        className
      )}
    >
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-cyber-cyan/20 blur-xl rounded-full" />
          <div className="relative p-6 rounded-2xl bg-cyber-darker border border-cyber-border">
            <Icon className="w-12 h-12 text-cyber-cyan" />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-display font-bold text-white mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-gray-400 mb-6 max-w-md">
        {description || config.defaultDescription}
      </p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="cyber-button flex items-center gap-2"
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          <span>{action.label}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

interface EmptyStateIllustrationProps {
  children?: React.ReactNode;
  className?: string;
}

export const EmptyStateIllustration: React.FC<EmptyStateIllustrationProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      {/* Grid background */}
      <div className="absolute inset-0 bg-cyber-grid opacity-10" />

      {/* Animated circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-cyber-cyan/20 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1 + i * 0.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Pre-configured empty states
export const EmptyPosts = ({ onCreate }: { onCreate?: () => void }) => (
  <EmptyState
    type="empty"
    title="还没有文章"
    description="创建您的第一篇文章开始博客之旅"
    action={onCreate ? {
      label: '创建文章',
      onClick: onCreate,
      icon: Plus,
    } : undefined}
  />
);

export const EmptyComments = () => (
  <EmptyState
    type="no-data"
    title="暂无评论"
    description="成为第一个评论的人吧"
  />
);

export const EmptySearch = ({ query, onClear }: { query: string; onClear: () => void }) => (
  <EmptyState
    type="not-found"
    title={`未找到 "${query}"`}
    description="尝试使用其他关键词搜索"
    action={{
      label: '清除搜索',
      onClick: onClear,
      icon: RefreshCw,
    }}
  />
);

export const EmptyError = ({ onRetry }: { onRetry: () => void }) => (
  <EmptyState
    type="error"
    title="加载失败"
    description="请检查网络连接后重试"
    action={{
      label: '重试',
      onClick: onRetry,
      icon: RefreshCw,
    }}
  />
);

export const EmptyNotifications = () => (
  <EmptyState
    type="no-data"
    title="暂无通知"
    description="您当前没有任何新通知"
  />
);

export const EmptyFavorites = () => (
  <EmptyState
    type="no-data"
    title="暂无收藏"
    description="收藏您喜欢的内容以便稍后查看"
  />
);
