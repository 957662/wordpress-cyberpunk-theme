import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  showTitle?: boolean;
  lines?: number;
}

/**
 * SkeletonCard - 骨架屏卡片组件
 * 用于加载时显示占位符
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className,
  showAvatar = true,
  showTitle = true,
  lines = 3,
}) => {
  return (
    <div className={cn('p-4 border border-gray-800 rounded-lg', className)}>
      {showAvatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-800 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
          </div>
        </div>
      )}

      {showTitle && (
        <div className="h-6 bg-gray-800 rounded animate-pulse mb-4" />
      )}

      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-gray-800 rounded animate-pulse',
              i === lines - 1 && 'w-2/3'
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;
