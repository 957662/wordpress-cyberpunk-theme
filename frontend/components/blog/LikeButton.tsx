'use client';

/**
 * 点赞按钮组件
 * 支持点赞计数、动画效果、实时更新
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsUp as ThumbsUpFilled } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  initialLiked?: boolean;
  onLike?: (postId: string, liked: boolean) => Promise<void>;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export function LikeButton({
  postId,
  initialLikes = 0,
  initialLiked = false,
  onLike,
  showCount = true,
  size = 'md',
  variant = 'default',
  disabled = false,
  className = '',
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // 同步初始状态
  useEffect(() => {
    setLikes(initialLikes);
    setLiked(initialLiked);
  }, [initialLikes, initialLiked]);

  // 处理点赞
  const handleLike = useCallback(async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    // 乐观更新
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));

    // 显示动画
    if (newLikedState) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 1000);
    }

    try {
      if (onLike) {
        await onLike(postId, newLikedState);
      }

      if (newLikedState) {
        toast.success('点赞成功!');
      } else {
        toast.success('已取消点赞');
      }
    } catch (error) {
      // 回滚
      setLiked(!newLikedState);
      setLikes((prev) => (newLikedState ? prev - 1 : prev + 1));
      toast.error('操作失败,请重试');
      console.error('点赞失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [disabled, isLoading, liked, onLike, postId]);

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
    default: liked
      ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink'
      : 'bg-cyber-dark border-cyber-border text-cyber-muted hover:text-cyber-pink',
    outline: liked
      ? 'border-cyber-pink text-cyber-pink bg-transparent'
      : 'border-cyber-border text-cyber-muted hover:border-cyber-pink hover:text-cyber-pink bg-transparent',
    ghost: liked
      ? 'text-cyber-pink bg-transparent border-0'
      : 'text-cyber-muted hover:text-cyber-pink bg-transparent border-0',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLike}
      disabled={disabled || isLoading}
      className={cn(
        'relative flex items-center gap-2 rounded-lg border transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      aria-label={liked ? '取消点赞' : '点赞'}
    >
      {/* 图标 */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {liked ? (
            <motion.div
              key="liked"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ThumbsUpFilled
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

        {/* 点击动画 */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full border-2 border-cyber-pink"
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 计数 */}
      {showCount && (
        <motion.span
          key={likes}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-medium"
        >
          {likes > 0 ? likes.toLocaleString() : '点赞'}
        </motion.span>
      )}

      {/* 加载状态 */}
      {isLoading && (
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
 * 点赞列表组件
 */
export interface LikeListProps {
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  className?: string;
}

export function LikeList({ users, className = '' }: LikeListProps) {
  if (users.length === 0) {
    return (
      <p className={cn('text-sm text-cyber-muted', className)}>
        暂无点赞,快来抢沙发吧~
      </p>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex -space-x-2">
        {users.slice(0, 5).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-8 h-8 rounded-full border-2 border-cyber-dark bg-cyber-muted flex items-center justify-center overflow-hidden"
          >
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-cyber-cyan">
                {user.name.charAt(0)}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {users.length > 5 && (
        <span className="text-sm text-cyber-muted">
          +{users.length - 5} 人点赞
        </span>
      )}
    </div>
  );
}

export default LikeButton;
