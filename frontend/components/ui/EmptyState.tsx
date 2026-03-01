/**
 * EmptyState Component
 * 空状态组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileX, Search, Inbox, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

/**
 * 空状态类型
 */
export type EmptyStateType = 'no-data' | 'no-results' | 'error' | 'custom';

/**
 * EmptyState 组件属性
 */
export interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * 默认图标和文本
 */
const defaultConfig = {
  'no-data': {
    icon: <Inbox className="w-16 h-16" />,
    title: '暂无数据',
    description: '还没有任何内容，快来创建第一条吧！'
  },
  'no-results': {
    icon: <Search className="w-16 h-16" />,
    title: '未找到结果',
    description: '没有找到匹配的内容，请尝试其他关键词'
  },
  'error': {
    icon: <AlertCircle className="w-16 h-16" />,
    title: '出错了',
    description: '加载内容时出现问题，请稍后重试'
  }
};

/**
 * EmptyState 组件
 */
export function EmptyState({
  type = 'no-data',
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  const config = defaultConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {/* 图标 */}
      <div className="mb-6 text-cyber-cyan/60">
        {icon || config.icon}
      </div>

      {/* 标题 */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title || config.title}
      </h3>

      {/* 描述 */}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}

      {/* 操作按钮 */}
      {action && (
        <Button
          variant="primary"
          color="cyan"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

/**
 * 404 空状态组件
 */
export interface NotFoundStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function NotFoundState({
  title = '页面未找到',
  description = '您访问的页面不存在或已被删除',
  action,
  className
}: NotFoundStateProps) {
  return (
    <EmptyState
      type="custom"
      icon={<FileX className="w-16 h-16" />}
      title={title}
      description={description}
      action={action && {
        label: action.label,
        onClick: () => (window.location.href = action.href)
      }}
      className={className}
    />
  );
}

/**
 * 无权限空状态组件
 */
export interface NoPermissionStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function NoPermissionState({
  title = '无权限访问',
  description = '您没有权限访问此内容，请登录或联系管理员',
  action,
  className
}: NoPermissionStateProps) {
  return (
    <EmptyState
      type="custom"
      icon={<AlertCircle className="w-16 h-16" />}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}

/**
 * 加载失败空状态组件
 */
export interface LoadErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function LoadErrorState({
  title = '加载失败',
  description = '加载内容时出现问题，请检查网络连接后重试',
  onRetry,
  className
}: LoadErrorStateProps) {
  return (
    <EmptyState
      type="error"
      title={title}
      description={description}
      action={onRetry && {
        label: '重试',
        onClick: onRetry
      }}
      className={className}
    />
  );
}
