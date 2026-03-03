'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  itemId: string;
  itemType: 'article' | 'comment';
  initialLikes?: number;
  initialLiked?: boolean;
  onLikeChange?: (liked: boolean, likesCount: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export function LikeButton({
  itemId,
  itemType,
  initialLikes = 0,
  initialLiked = false,
  onLikeChange,
  size = 'md',
  showCount = true,
  variant = 'ghost',
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${itemType}s/${itemId}/like`, {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      const data = await response.json();
      const newLikedStatus = !liked;
      const newCount = data.likesCount ?? (liked ? likesCount - 1 : likesCount + 1);

      setLiked(newLikedStatus);
      setLikesCount(newCount);
      onLikeChange?.(newLikedStatus, newCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeStyles = {
    sm: { button: 'p-1.5', icon: 16, text: 'text-xs' },
    md: { button: 'p-2', icon: 18, text: 'text-sm' },
    lg: { button: 'p-3', icon: 20, text: 'text-base' },
  };

  const currentSize = sizeStyles[size];

  const variantStyles = {
    default: cn(
      'rounded-lg',
      liked
        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25'
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
    ),
    outline: cn(
      'rounded-lg border-2',
      liked
        ? 'border-pink-500 text-pink-500'
        : 'border-gray-600 text-gray-400 hover:border-pink-500 hover:text-pink-500'
    ),
    ghost: cn(
      'rounded-lg',
      liked ? 'text-pink-500 hover:bg-pink-500/10' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    ),
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading || isPending}
      className={cn(
        'inline-flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        currentSize.button,
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {isLoading || isPending ? (
        <Loader2 className={cn('animate-spin', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
      ) : (
        <motion.div
          animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={currentSize.icon}
            className={cn(liked && 'fill-current')}
          />
        </motion.div>
      )}

      {showCount && (
        <span className={cn('font-medium', currentSize.text, liked && 'text-white')}>
          {likesCount > 0 ? (likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount) : '赞'}
        </span>
      )}

      {/* 赛博朋克发光效果 */}
      {liked && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/20 to-rose-500/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}

// 导出配置
LikeButton.sizes = ['sm', 'md', 'lg'] as const;
LikeButton.variants = ['default', 'outline', 'ghost'] as const;
LikeButton.itemTypes = ['article', 'comment'] as const;
