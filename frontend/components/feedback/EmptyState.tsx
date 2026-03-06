import React from 'react';
import { cn } from '@/lib/utils';
import { FileX, Search, Inbox, AlertCircle } from 'lucide-react';

export type EmptyStateType = 'no-data' | 'no-results' | 'no-messages' | 'error';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const icons = {
  'no-data': FileX,
  'no-results': Search,
  'no-messages': Inbox,
  'error': AlertCircle,
};

const defaultMessages = {
  'no-data': {
    title: '暂无数据',
    description: '还没有任何内容，开始创建吧！',
  },
  'no-results': {
    title: '未找到结果',
    description: '尝试使用不同的关键词搜索',
  },
  'no-messages': {
    title: '暂无消息',
    description: '您的收件箱是空的',
  },
  'error': {
    title: '出错了',
    description: '加载失败，请稍后重试',
  },
};

/**
 * EmptyState - 空状态组件
 * 用于显示列表、表格等无数据时的占位状态
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-data',
  title,
  description,
  actionLabel,
  onAction,
  className,
  icon: customIcon,
}) => {
  const Icon = customIcon ? null : icons[type];
  const messages = defaultMessages[type];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      <div className="mb-4 text-cyan-500">
        {customIcon || <Icon className="w-16 h-16 mx-auto" />}
      </div>

      <h3 className="text-lg font-semibold text-gray-100 mb-2">
        {title || messages.title}
      </h3>

      <p className="text-gray-400 mb-6 max-w-md">
        {description || messages.description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
