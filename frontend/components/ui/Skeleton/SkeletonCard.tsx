/**
 * CyberPress Platform - SkeletonCard Component
 * 卡片骨架屏组件 - 赛博朋克风格
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonCardProps {
  variant?: 'default' | 'media' | 'avatar' | 'stat';
  showAvatar?: boolean;
  showMedia?: boolean;
  lineCount?: number;
  className?: string;
}

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
};

export function SkeletonCard({
  variant = 'default',
  showAvatar = false,
  showMedia = false,
  lineCount = 3,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-cyber-card border border-cyber-border p-6',
        className
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
        }}
      />

      <div className="relative space-y-4">
        {/* 头像 */}
        {showAvatar && (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-cyber-border animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-cyber-border rounded animate-pulse w-1/3" />
              <div className="h-3 bg-cyber-border/50 rounded animate-pulse w-1/4" />
            </div>
          </div>
        )}

        {/* 媒体 */}
        {showMedia && (
          <div className="w-full h-48 bg-cyber-border rounded-lg animate-pulse" />
        )}

        {/* 标题 */}
        <div className="space-y-2">
          <div className="h-6 bg-cyber-border rounded animate-pulse w-3/4" />
        </div>

        {/* 文本行 */}
        <div className="space-y-2">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-4 bg-cyber-border/50 rounded animate-pulse',
                i === lineCount - 1 && 'w-2/3'
              )}
            />
          ))}
        </div>

        {/* 统计卡片变体 */}
        {variant === 'stat' && (
          <div className="grid grid-cols-3 gap-4 pt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-8 bg-cyber-border rounded mx-auto w-16 animate-pulse" />
                <div className="h-3 bg-cyber-border/50 rounded mx-auto w-20 animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 博客卡片骨架屏
export function BlogCardSkeleton({ className }: { className?: string }) {
  return <SkeletonCard variant="media" showMedia lineCount={4} className={className} />;
}

// 用户卡片骨架屏
export function UserCardSkeleton({ className }: { className?: string }) {
  return <SkeletonCard variant="avatar" showAvatar lineCount={3} className={className} />;
}

// 统计卡片骨架屏
export function StatCardSkeleton({ className }: { className?: string }) {
  return <SkeletonCard variant="stat" className={className} />;
}
