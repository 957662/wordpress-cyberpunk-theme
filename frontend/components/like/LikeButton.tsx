'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface LikeButtonProps {
  itemId: string;
  itemType: 'post' | 'comment';
  initialLikes: number;
  initialLiked: boolean;
  onLikeChange?: (liked: boolean, count: number) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function LikeButton({
  itemId,
  itemType,
  initialLikes,
  initialLiked,
  onLikeChange,
  className,
  variant = 'default',
  size = 'md',
  showCount = true,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  const sizeClasses = {
    sm: 'px-2 py-1 gap-1.5 text-sm',
    md: 'px-3 py-1.5 gap-2 text-base',
    lg: 'px-4 py-2 gap-2.5 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const variantClasses = {
    default: liked
      ? 'bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30'
      : 'bg-slate-800/50 text-cyber-text-secondary border-slate-700 hover:text-cyber-text-primary hover:border-slate-600',
    outline: liked
      ? 'border-red-500 text-red-500 hover:bg-red-500/10'
      : 'border-slate-700 text-cyber-text-secondary hover:border-cyber-primary hover:text-cyber-primary',
    ghost: liked
      ? 'text-red-500 hover:bg-red-500/10'
      : 'text-cyber-text-secondary hover:bg-slate-800/50 hover:text-cyber-text-primary',
  };

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const previousState = liked;
    const previousCount = likes;
    const newState = !liked;
    const newCount = newState ? likes + 1 : likes - 1;

    // 乐观更新
    setLiked(newState);
    setLikes(newCount);

    if (newState) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }

    try {
      const response = await fetch('/api/social/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId,
          item_type: itemType,
          action: newState ? 'like' : 'unlike',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      const data = await response.json();

      startTransition(() => {
        setLiked(newState);
        setLikes(data.likes_count || newCount);
        onLikeChange?.(newState, data.likes_count || newCount);
      });
    } catch (error) {
      // 回滚
      setLiked(previousState);
      setLikes(previousCount);
      toast.error('操作失败，请稍后重试', {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading || isPending}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Heart Icon */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {isLoading || isPending ? (
            <Loader2
              className="animate-spin"
              size={iconSizes[size]}
              key="loader"
            />
          ) : (
            <motion.div
              key="heart"
              initial={false}
              animate={{
                scale: liked ? [1, 1.3, 1] : 1,
                rotate: liked ? [0, -10, 10, -10, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={iconSizes[size]}
                className={cn(
                  'transition-colors duration-200',
                  liked ? 'fill-red-500 text-red-500' : ''
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Heart Animation */}
        <AnimatePresence>
          {showHeartAnimation && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1.5, 1],
                    y: -20 - i * 10,
                    x: (i - 1) * 10,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                  className="absolute top-0 left-0 pointer-events-none"
                >
                  <Heart
                    size={iconSizes[size]}
                    className="fill-red-500 text-red-500"
                  />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Like Count */}
      {showCount && (
        <motion.span
          key={likes}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'min-w-[2ch] text-center font-medium',
            liked ? 'text-red-500' : ''
          )}
        >
          {likes > 0 ? likes.toLocaleString() : '点赞'}
        </motion.span>
      )}
    </motion.button>
  );
}
