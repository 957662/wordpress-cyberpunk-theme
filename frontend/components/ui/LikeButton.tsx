'use client';

import React, { useState, useCallback } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  postId: number | string;
  initialLiked?: boolean;
  initialCount?: number;
  onToggle?: (liked: boolean) => Promise<void>;
  className?: string;
  showCount?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLiked = false,
  initialCount = 0,
  onToggle,
  className,
  showCount = true,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const newLikedState = !liked;
      
      if (onToggle) {
        await onToggle(newLikedState);
      }
      
      setLiked(newLikedState);
      setCount((prev) => (newLikedState ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  }, [liked, isLoading, onToggle]);

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2 px-4 py-2',
        'rounded-lg',
        'border',
        'bg-cyber-dark/80 backdrop-blur-sm',
        'font-medium transition-all duration-200',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
        liked
          ? 'border-cyber-pink text-cyber-pink hover:bg-cyber-pink/10'
          : 'border-cyber-cyan/20 text-gray-400 hover:border-cyber-cyan/30 hover:text-cyber-cyan',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Heart
          className={cn(
            'w-5 h-5 transition-all duration-200',
            liked && 'fill-current'
          )}
        />
      )}
      
      {showCount && (
        <span className="text-sm">{count.toLocaleString()}</span>
      )}
    </button>
  );
};

export default LikeButton;
