import React from 'react';
import { cn } from '@/lib/utils';

interface AspectRatioProps {
  children: React.ReactNode;
  ratio?: number | 'square' | 'video' | 'portrait' | 'landscape';
  className?: string;
}

const ratioValues: Record<string, number> = {
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
  landscape: 4 / 3,
};

/**
 * AspectRatio - 宽高比容器组件
 * 保持特定宽高比的容器
 */
export const AspectRatio: React.FC<AspectRatioProps> = ({
  children,
  ratio = 'video',
  className,
}) => {
  const aspectRatio = typeof ratio === 'string' ? ratioValues[ratio] : ratio;

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ paddingBottom: `${100 / aspectRatio}%` }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default AspectRatio;
