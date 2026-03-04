/**
 * CyberPress Platform - PullToRefresh Component
 * 下拉刷新组件 - 赛博朋克风格
 */

'use client';

import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, ReactNode } from 'react';

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
  loadingComponent?: ReactNode;
  icon?: ReactNode;
  pullText?: string;
  releaseText?: string;
  refreshingText?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  loadingComponent,
  icon,
  pullText = '下拉刷新',
  releaseText = '释放刷新',
  refreshingText = '正在刷新...',
  disabled = false,
  className,
  contentClassName,
}: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [pullState, setPullState] = useState<'idle' | 'pulling' | 'ready' | 'refreshing'>('idle');

  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const startY = useRef(0);
  const currentY = useRef(0);

  const defaultIcon = (
    <svg
      className="w-6 h-6 text-cyber-cyan"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || refreshing) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    if (scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    setPulling(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling || disabled || refreshing) return;

    currentY.current = e.touches[0].clientY;
    const distance = Math.max(0, currentY.current - startY.current) * 0.5;

    // 限制最大拉动距离
    const clampedDistance = Math.min(distance, threshold * 1.5);
    setPullDistance(clampedDistance);

    if (clampedDistance >= threshold) {
      setPullState('ready');
    } else if (clampedDistance > 0) {
      setPullState('pulling');
    } else {
      setPullState('idle');
    }
  };

  const handleTouchEnd = async () => {
    if (!pulling || disabled || refreshing) return;

    setPulling(false);

    if (pullDistance >= threshold) {
      setPullState('refreshing');
      setRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } finally {
        setTimeout(() => {
          setRefreshing(false);
          setPullDistance(0);
          setPullState('idle');
        }, 500);
      }
    } else {
      setPullDistance(0);
      setPullState('idle');
    }
  };

  const getProgress = () => {
    return Math.min(pullDistance / threshold, 1);
  };

  const getStateText = () => {
    switch (pullState) {
      case 'pulling':
        return pullText;
      case 'ready':
        return releaseText;
      case 'refreshing':
        return refreshingText;
      default:
        return pullText;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 刷新指示器 */}
      <motion.div
        className="absolute left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-10"
        style={{
          height: threshold,
          top: -threshold + pullDistance,
        }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{
            scale: pullState === 'ready' ? 1.1 : 1,
            rotate: pullState === 'refreshing' ? 360 : 0,
          }}
          transition={{
            rotate: {
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            },
            scale: {
              duration: 0.2,
            },
          }}
        >
          {refreshing ? (
            loadingComponent || (
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 border-2 border-cyber-border rounded-full" />
                <div className="absolute inset-0 border-2 border-cyber-cyan rounded-full border-t-transparent animate-spin" />
              </div>
            )
          ) : (
            <motion.div
              animate={{
                rotate: getProgress() * 180,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
            >
              {icon || defaultIcon}
            </motion.div>
          )}

          <span
            className={cn(
              'text-sm font-medium transition-colors',
              pullState === 'ready' && 'text-cyber-cyan',
              pullState !== 'ready' && 'text-cyber-muted'
            )}
          >
            {getStateText()}
          </span>
        </motion.div>

        {/* 进度指示器 */}
        {!refreshing && (
          <div className="w-32 h-1 bg-cyber-border rounded-full overflow-hidden mt-2">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple shadow-neon-cyan"
              style={{
                width: `${getProgress() * 100}%`,
              }}
            />
          </div>
        )}
      </motion.div>

      {/* 内容区域 */}
      <motion.div
        className={cn('relative', contentClassName)}
        animate={{
          y: refreshing ? threshold : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
