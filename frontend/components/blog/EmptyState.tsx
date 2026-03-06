/**
 * 空状态组件
 */

'use client';

import React from 'react';
import { FileQuestion, SearchX, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface EmptyStateProps {
  type?: 'no-posts' | 'no-results' | 'no-data' | 'error';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// ============================================================================
// Components
// ============================================================================

/**
 * 空状态展示组件
 */
export function EmptyState({
  type = 'no-data',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const renderIcon = () => {
    const iconClass = "h-16 w-16 text-gray-600 mx-auto mb-4";

    switch (type) {
      case 'no-posts':
        return <Inbox className={iconClass} />;
      case 'no-results':
        return <SearchX className={iconClass} />;
      case 'error':
        return <FileQuestion className={iconClass} />;
      default:
        return <FileQuestion className={iconClass} />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'no-posts':
        return {
          title: title || '暂无文章',
          description: description || '还没有发布任何文章,敬请期待!',
        };
      case 'no-results':
        return {
          title: title || '未找到结果',
          description: description || '没有找到匹配的文章,请尝试其他搜索词。',
        };
      case 'error':
        return {
          title: title || '加载失败',
          description: description || '加载数据时出现错误,请稍后重试。',
        };
      default:
        return {
          title: title || '暂无数据',
          description: description || '这里什么都没有。',
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {renderIcon()}
      <h3 className="text-xl font-semibold text-gray-300">{content.title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md">{content.description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 rounded-lg bg-cyber-cyan px-6 py-2 text-sm font-medium text-black hover:bg-cyber-purple hover:text-white transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * 文章列表空状态
 */
export function PostsEmptyState({
  onReset,
  className,
}: {
  onReset?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      type="no-posts"
      title="暂无文章"
      description="还没有发布任何文章,敬请期待!"
      action={onReset ? {
        label: '刷新',
        onClick: onReset,
      } : undefined}
      className={className}
    />
  );
}

/**
 * 搜索结果空状态
 */
export function SearchEmptyState({
  query,
  onClear,
  className,
}: {
  query?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      type="no-results"
      title="未找到结果"
      description={query ? `没有找到与 "${query}" 相关的文章` : '没有找到匹配的文章'}
      action={onClear ? {
        label: '清除搜索',
        onClick: onClear,
      } : undefined}
      className={className}
    />
  );
}

/**
 * 错误状态
 */
export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      type="error"
      title="加载失败"
      description={message || '加载数据时出现错误,请稍后重试。'}
      action={onRetry ? {
        label: '重试',
        onClick: onRetry,
      } : undefined}
      className={className}
    />
  );
}

export default EmptyState;
