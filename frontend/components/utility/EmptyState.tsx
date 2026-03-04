/**
 * 空状态组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon,
  title = '暂无数据',
  description = '这里还没有任何内容',
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizes = {
    sm: { icon: 'w-12 h-12', text: 'text-sm', spacing: 'gap-3' },
    md: { icon: 'w-16 h-16', text: 'text-base', spacing: 'gap-4' },
    lg: { icon: 'w-20 h-20', text: 'text-lg', spacing: 'gap-6' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8',
        sizes[size].spacing,
        className
      )}
    >
      {/* 图标 */}
      {icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'flex items-center justify-center text-cyber-cyan/50 mb-4',
            sizes[size].icon
          )}
        >
          {icon}
        </motion.div>
      )}

      {/* 标题 */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          'font-display font-semibold text-gray-400 mb-2',
          sizes[size].text
        )}
      >
        {title}
      </motion.h3>

      {/* 描述 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          'text-gray-500 max-w-md mb-6',
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
        )}
      >
        {description}
      </motion.p>

      {/* 操作按钮 */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={action.onClick}
            className={cn(
              'px-6 py-2 rounded-lg font-medium transition-all duration-200',
              'hover:scale-105 active:scale-95',
              action.variant === 'primary' &&
                'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90',
              action.variant === 'secondary' &&
                'bg-cyber-purple text-white hover:bg-cyber-purple/90',
              (!action.variant || action.variant === 'outline') &&
                'border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10'
            )}
          >
            {action.label}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// 预定义的空状态
export const EmptyStates = {
  NO_POSTS: (
    <EmptyState
      title="暂无文章"
      description="还没有发布任何文章，快来发布第一篇吧！"
      action={{ label: '写文章', onClick: () => {}, variant: 'primary' }}
    />
  ),

  NO_COMMENTS: (
    <EmptyState
      title="暂无评论"
      description="还没有人评论，快来抢沙发吧！"
      action={{ label: '发表评论', onClick: () => {}, variant: 'primary' }}
    />
  ),

  NO_SEARCH_RESULTS: (
    <EmptyState
      title="未找到相关内容"
      description="换个关键词试试看吧"
      action={{ label: '清除搜索', onClick: () => {}, variant: 'outline' }}
    />
  ),

  NO_NOTIFICATIONS: (
    <EmptyState
      title="暂无通知"
      description="还没有任何新通知"
    />
  ),

  NO_FOLLOWERS: (
    <EmptyState
      title="暂无关注者"
      description="成为第一个关注者吧！"
      action={{ label: '关注', onClick: () => {}, variant: 'primary' }}
    />
  ),

  ERROR: (message?: string) => (
    <EmptyState
      title="出错了"
      description={message || '加载失败，请稍后重试'}
      action={{ label: '重试', onClick: () => window.location.reload(), variant: 'primary' }}
    />
  ),
};
