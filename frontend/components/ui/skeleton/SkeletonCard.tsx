/**
 * Skeleton Card Component
 * 骨架屏卡片组件 - 用于加载状态展示
 * CyberPress Platform
 */

import { cn } from '@/lib/utils';

export interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showFooter?: boolean;
  lines?: number;
  variant?: 'default' | 'card' | 'list' | 'minimal';
}

/**
 * 骨架屏卡片组件
 */
export function SkeletonCard({
  className,
  showAvatar = true,
  showTitle = true,
  showDescription = true,
  showFooter = true,
  lines = 3,
  variant = 'default',
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'cyber-card p-6 border border-cyber-border/50',
        'animate-pulse',
        className
      )}
    >
      {/* Avatar */}
      {showAvatar && variant !== 'minimal' && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-3/4" />
            <div className="h-3 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-1/2" />
          </div>
        </div>
      )}

      {/* Title */}
      {showTitle && variant !== 'minimal' && (
        <div className="space-y-3 mb-4">
          <div className="h-6 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-3/4" />
          <div className="h-6 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-1/2" />
        </div>
      )}

      {/* Description */}
      {showDescription && (
        <div className="space-y-2 mb-4">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded',
                i === lines - 1 ? 'w-2/3' : 'w-full'
              )}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      {showFooter && variant === 'default' && (
        <div className="flex items-center justify-between pt-4 border-t border-cyber-border/50">
          <div className="h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-1/4" />
          <div className="h-8 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-20" />
        </div>
      )}
    </div>
  );
}

/**
 * 骨架屏列表组件
 */
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="cyber-card p-4 border border-cyber-border/50 animate-pulse"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-3/4" />
              <div className="h-3 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-full" />
              <div className="h-3 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 骨架屏文章组件
 */
export function SkeletonArticle() {
  return (
    <article className="cyber-card p-8 border border-cyber-border/50 animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20" />
          <div className="flex-1">
            <div className="h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-1/4" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-3 mb-6">
        <div className="h-8 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-full" />
        <div className="h-8 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-4/5" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-full"
          />
        ))}
        <div className="h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-2/3" />
      </div>
    </article>
  );
}

/**
 * 骨架屏表格组件
 */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="cyber-card border border-cyber-border/50 overflow-hidden">
      {/* Header */}
      <div className="border-b border-cyber-border/50 bg-cyber-dark/50">
        <div className="grid grid-cols-4 gap-4 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-6 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-cyber-border/50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div
                key={j}
                className="h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 骨架屏图表组件
 */
export function SkeletonChart() {
  return (
    <div className="cyber-card p-6 border border-cyber-border/50 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-6 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-1/3" />
          <div className="h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-1/4" />
        </div>
        <div className="h-10 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-24" />
      </div>

      {/* Chart Area */}
      <div className="h-64 flex items-end justify-between space-x-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-cyber-cyan/20 to-cyber-purple/20 rounded-t"
            style={{
              height: `${Math.random() * 80 + 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 骨架屏统计卡片组件
 */
export function SkeletonStatCard() {
  return (
    <div className="cyber-card p-6 border border-cyber-border/50 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20" />
        <div className="h-8 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-16" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-8 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-1/2" />
        <div className="h-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-1/3" />
      </div>

      <div className="h-2 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded w-full" />
    </div>
  );
}
