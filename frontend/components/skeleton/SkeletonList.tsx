import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonListProps {
  className?: string;
  items?: number;
  showAvatar?: boolean;
}

/**
 * SkeletonList - 骨架屏列表组件
 * 用于列表加载时显示占位符
 */
export const SkeletonList: React.FC<SkeletonListProps> = ({
  className,
  items = 5,
  showAvatar = true,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          {showAvatar && (
            <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;
