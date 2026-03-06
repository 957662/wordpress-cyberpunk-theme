'use client';

/**
 * 增强版点赞按钮组件
 * 集成新的点赞API和Hook
 */

import { useLike } from '@/lib/hooks/useLike';
import { LikeTargetType } from '@/types/like.types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';

export interface LikeButtonEnhancedProps {
  targetType?: LikeTargetType;
  targetId: string | number;
  initialLiked?: boolean;
  initialCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
  onLikeChange?: (liked: boolean) => void;
}

export function LikeButtonEnhanced({
  targetType = LikeTargetType.POST,
  targetId,
  initialLiked = false,
  initialCount = 0,
  showCount = true,
  size = 'md',
  variant = 'default',
  disabled = false,
  className = '',
  onLikeChange,
}: LikeButtonEnhancedProps) {
  const { isLiked, likeCount, isMutating, toggle } = useLike({
    targetType,
    targetId: String(targetId),
    initialLiked,
    initialCount,
    onSuccess: (liked) => {
      onLikeChange?.(liked);
    },
  });

  // 尺寸样式
  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // 变体样式
  const variantStyles = {
    default: isLiked
      ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink shadow-lg shadow-cyber-pink/20'
      : 'bg-cyber-dark border-cyber-border text-cyber-muted hover:text-cyber-pink hover:border-cyber-pink/50',
    outline: isLiked
      ? 'border-cyber-pink text-cyber-pink bg-transparent'
      : 'border-cyber-border text-cyber-muted hover:border-cyber-pink hover:text-cyber-pink bg-transparent',
    ghost: isLiked
      ? 'text-cyber-pink bg-transparent border-0'
      : 'text-cyber-muted hover:text-cyber-pink bg-transparent border-0',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={toggle}
      disabled={disabled || isMutating}
      className={cn(
        'relative flex items-center gap-2 rounded-lg border transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      aria-label={isLiked ? '取消点赞' : '点赞'}
    >
      {/* 图标 */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {isLiked ? (
            <motion.div
              key="liked"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ThumbsUp
                className="relative z-10"
                size={iconSizes[size]}
                fill="currentColor"
              />
              {/* 发光效果 */}
              <motion.div
                className="absolute inset-0 blur-lg bg-cyber-pink"
                initial={{ scale: 0.5, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="unliked"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ThumbsUp size={iconSizes[size]} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 计数 */}
      {showCount && (
        <motion.span
          key={likeCount}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-medium"
        >
          {likeCount > 0 ? likeCount.toLocaleString() : '点赞'}
        </motion.span>
      )}

      {/* 加载状态 */}
      {isMutating && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-full h-full bg-cyber-dark/50 backdrop-blur-sm flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-cyber-pink border-t-transparent rounded-full animate-spin" />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}

/**
 * 点赞卡片组件
 * 显示点赞列表和统计
 */
export interface LikeCardProps {
  targetType: LikeTargetType;
  targetId: string | number;
  className?: string;
}

export function LikeCard({ targetType, targetId, className = '' }: LikeCardProps) {
  const { likeCount, isLoading } = useLike({
    targetType,
    targetId: String(targetId),
  });

  return (
    <div className={cn('bg-cyber-dark border border-cyber-border rounded-lg p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-cyber-pink" />
          <span className="text-cyber-muted">{isLoading ? '...' : likeCount}</span>
        </div>
        <button className="text-sm text-cyber-cyan hover:underline">
          查看全部
        </button>
      </div>
    </div>
  );
}

export default LikeButtonEnhanced;
