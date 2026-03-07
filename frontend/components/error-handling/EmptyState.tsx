/**
 * Empty State Component
 */

'use client';

import React from 'react';
import { FileX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = '暂无数据',
  message = '这里还没有任何内容',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="text-gray-400 mb-4">
        {icon || <FileX size={48} />}
      </div>
      <h3 className="text-lg font-medium text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-400 text-center mb-4">{message}</p>
      {action}
    </div>
  );
}

export default EmptyState;
