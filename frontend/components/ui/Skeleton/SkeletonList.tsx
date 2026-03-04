/**
 * CyberPress Platform - SkeletonList Component
 * 列表骨架屏组件 - 赛博朋克风格
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonListProps {
  count?: number;
  showAvatar?: boolean;
  showAction?: boolean;
  className?: string;
  itemClassName?: string;
}

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
};

export function SkeletonList({
  count = 5,
  showAvatar = false,
  showAction = false,
  className,
  itemClassName,
}: SkeletonListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'relative overflow-hidden rounded-lg bg-cyber-card border border-cyber-border p-4',
            itemClassName
          )}
        >
          {/* 扫描线效果 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/10 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: index * 0.1,
            }}
          />

          <div className="relative flex items-center space-x-4">
            {/* 头像 */}
            {showAvatar && (
              <div className="w-10 h-10 rounded-full bg-cyber-border animate-pulse flex-shrink-0" />
            )}

            {/* 内容 */}
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-cyber-border rounded animate-pulse w-3/4" />
              <div className="h-3 bg-cyber-border/50 rounded animate-pulse w-1/2" />
            </div>

            {/* 操作按钮 */}
            {showAction && (
              <div className="w-8 h-8 bg-cyber-border rounded animate-pulse flex-shrink-0" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// 表格骨架屏
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* 表头 */}
      <div className="flex space-x-4 p-4 bg-cyber-card border border-cyber-border rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-6 bg-cyber-border rounded animate-pulse flex-1" />
        ))}
      </div>

      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex space-x-4 p-4 bg-cyber-card border border-cyber-border rounded-lg"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                'h-4 bg-cyber-border/50 rounded animate-pulse flex-1',
                colIndex === 0 && 'w-1/3'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
