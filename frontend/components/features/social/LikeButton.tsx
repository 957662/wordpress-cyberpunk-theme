'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  itemId: string;
  itemType: 'post' | 'comment' | 'reply';
  initialLikes?: number;
  isInitiallyLiked?: boolean;
  onLike?: (itemId: string, itemType: string) => Promise<void>;
  onUnlike?: (itemId: string, itemType: string) => Promise<void>;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  disabled?: boolean;
}

export function LikeButton({
  itemId,
  itemType,
  initialLikes = 0,
  isInitiallyLiked = false,
  onLike,
  onUnlike,
  showCount = true,
  size = 'md',
  variant = 'ghost',
  className,
  disabled = false,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  const handleClick = async () => {
    if (disabled || isPending) return;

    const newIsLiked = !isLiked;

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? prev + 1 : prev - 1);

    try {
      if (newIsLiked) {
        if (onLike) {
          await onLike(itemId, itemType);
        }
      } else {
        if (onUnlike) {
          await onUnlike(itemId, itemType);
        }
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikes(prev => newIsLiked ? prev - 1 : prev + 1);
      console.error('Failed to toggle like:', error);
    }
  };

  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3',
    lg: 'h-12 px-4 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={handleClick}
        disabled={disabled || isPending}
        variant={variant}
        className={cn(
          'gap-2 transition-all duration-200',
          isLiked && 'text-cyber-pink hover:text-cyber-pink/80 hover:bg-cyber-pink/10',
          !isLiked && 'text-gray-400 hover:text-cyber-pink hover:bg-cyber-pink/5',
          sizeClasses[size],
          className
        )}
      >
        <motion.div
          animate={{
            scale: isLiked ? [1, 1.3, 1] : 1,
            rotate: isLiked ? [0, -10, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {isLiked ? (
            <Heart className="fill-current" style={{ width: iconSizes[size], height: iconSizes[size] }} />
          ) : (
            <HeartOff style={{ width: iconSizes[size], height: iconSizes[size] }} />
          )}
        </motion.div>
        {showCount && (
          <motion.span
            key={likes}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-semibold"
          >
            {likes}
          </motion.span>
        )}
      </Button>
    </motion.div>
  );
}

// Quick like button (minimal version)
interface QuickLikeButtonProps {
  isLiked: boolean;
  count: number;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export function QuickLikeButton({
  isLiked,
  count,
  onToggle,
  disabled = false,
  className,
}: QuickLikeButtonProps) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all',
        isLiked
          ? 'text-cyber-pink bg-cyber-pink/10'
          : 'text-gray-400 hover:text-cyber-pink hover:bg-cyber-pink/5',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          scale: isLiked ? [1, 1.3, 1] : 1,
          rotate: isLiked ? [0, -10, 10, -10, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </motion.svg>
      <span className="text-sm font-medium">{count}</span>
    </motion.button>
  );
}

// Like animation wrapper
export function LikeAnimation({ children, isLiked }: { children: React.ReactNode; isLiked: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{
        scale: isLiked ? [1, 1.5, 1] : 1,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

export default LikeButton;
