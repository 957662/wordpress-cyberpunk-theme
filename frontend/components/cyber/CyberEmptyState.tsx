'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CyberButton } from './CyberButton';

export interface CyberEmptyStateProps {
  /**
   * 图标组件
   */
  icon?: LucideIcon;
  /**
   * SVG 图标 URL
   */
  iconUrl?: string;
  /**
   * 自定义图标元素
   */
  iconElement?: React.ReactNode;
  /**
   * 标题
   */
  title: string;
  /**
   * 描述文本
   */
  description?: string;
  /**
   * 主要操作按钮文本
   */
  actionLabel?: string;
  /**
   * 主要操作点击事件
   */
  onAction?: () => void;
  /**
   * 次要操作按钮文本
   */
  secondaryActionLabel?: string;
  /**
   * 次要操作点击事件
   */
  onSecondaryAction?: () => void;
  /**
   * 主题颜色
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  /**
   * 大小
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * 是否显示插画
   */
  illustration?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
}

const sizeClasses = {
  sm: {
    container: 'py-8 px-4',
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-sm'
  },
  md: {
    container: 'py-12 px-6',
    icon: 'w-16 h-16',
    title: 'text-xl',
    description: 'text-base'
  },
  lg: {
    container: 'py-16 px-8',
    icon: 'w-20 h-20',
    title: 'text-2xl',
    description: 'text-lg'
  }
};

const colorClasses = {
  cyan: 'text-cyan-400 bg-cyan-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  pink: 'text-pink-400 bg-pink-500/10',
  green: 'text-green-400 bg-green-500/10',
  yellow: 'text-yellow-400 bg-yellow-500/10'
};

export const CyberEmptyState: React.FC<CyberEmptyStateProps> = ({
  icon: Icon,
  iconUrl,
  iconElement,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  color = 'cyan',
  size = 'md',
  illustration = true,
  className
}) => {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  // 渲染图标
  const renderIcon = () => {
    if (iconElement) {
      return iconElement;
    }

    if (iconUrl) {
      return (
        <img
          src={iconUrl}
          alt=""
          className={cn(
            'mx-auto mb-4 rounded-lg',
            sizeClass.icon,
            illustration && 'opacity-50'
          )}
        />
      );
    }

    if (Icon) {
      return (
        <div className={cn(
          'mx-auto mb-6 flex items-center justify-center rounded-xl',
          sizeClass.icon,
          colorClass
        )}>
          <Icon className={cn('w-1/2 h-1/2', colorClass.split(' ')[0])} />
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClass.container,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 图标 */}
      {renderIcon()}

      {/* 标题 */}
      <motion.h3
        className={cn(
          'mb-2 font-semibold text-white',
          sizeClass.title
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {title}
      </motion.h3>

      {/* 描述 */}
      {description && (
        <motion.p
          className={cn(
            'mb-6 max-w-md text-gray-400',
            sizeClass.description
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.p>
      )}

      {/* 操作按钮 */}
      {(actionLabel || secondaryActionLabel) && (
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {actionLabel && (
            <CyberButton
              onClick={onAction}
              color={color}
              size="sm"
            >
              {actionLabel}
            </CyberButton>
          )}

          {secondaryActionLabel && (
            <CyberButton
              onClick={onSecondaryAction}
              variant="outline"
              color={color}
              size="sm"
            >
              {secondaryActionLabel}
            </CyberButton>
          )}
        </motion.div>
      )}

      {/* 装饰性光效 */}
      {illustration && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full blur-3xl opacity-20 -z-10',
            colorClass.split(' ')[1].replace('text-', 'bg-')
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  );
};

/**
 * 预设空状态组件
 */

/** 无数据空状态 */
export const NoData: React.FC<Pick<CyberEmptyStateProps, 'onAction' | 'className'>> = ({
  onAction,
  className
}) => (
  <CyberEmptyState
    title="暂无数据"
    description="当前页面还没有任何数据，请稍后再试或创建新数据"
    actionLabel="创建数据"
    onAction={onAction}
    color="cyan"
    className={className}
  />
);

/** 搜索无结果空状态 */
export const NoSearchResults: React.FC<Pick<CyberEmptyStateProps, 'onAction' | 'className'>> = ({
  onAction,
  className
}) => (
  <CyberEmptyState
    title="未找到相关内容"
    description="尝试使用其他关键词或清除筛选条件"
    secondaryActionLabel="清除筛选"
    onSecondaryAction={onAction}
    color="purple"
    className={className}
  />
);

/** 错误空状态 */
export const ErrorState: React.FC<{
  onRetry?: () => void;
  className?: string;
}> = ({
  onRetry,
  className
}) => (
  <CyberEmptyState
    title="出现错误"
    description="加载内容时出现问题，请检查网络连接后重试"
    actionLabel="重试"
    onAction={onRetry}
    color="pink"
    className={className}
  />
);

/** 网络断开空状态 */
export const Offline: React.FC<Pick<CyberEmptyStateProps, 'onAction' | 'className'>> = ({
  onAction,
  className
}) => (
  <CyberEmptyState
    title="网络连接已断开"
    description="请检查您的网络连接，确保设备已连接到互联网"
    actionLabel="重新连接"
    onAction={onAction}
    color="yellow"
    className={className}
  />
);

/** 权限不足空状态 */
export const AccessDenied: React.FC<Pick<CyberEmptyStateProps, 'onAction' | 'className'>> = ({
  onAction,
  className
}) => (
  <CyberEmptyState
    title="权限不足"
    description="您没有访问此内容的权限，请联系管理员获取相应权限"
    actionLabel="返回首页"
    onAction={onAction}
    color="pink"
    className={className}
  />
);

/** 404 空状态 */
export const NotFound: React.FC<Pick<CyberEmptyStateProps, 'onAction' | 'className'>> = ({
  onAction,
  className
}) => (
  <CyberEmptyState
    title="页面未找到"
    description="您访问的页面不存在或已被删除"
    actionLabel="返回首页"
    onAction={onAction}
    color="cyan"
    className={className}
  />
);

export default CyberEmptyState;
