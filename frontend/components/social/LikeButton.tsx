'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  initialLiked?: boolean;
  initialCount?: number;
  onLike?: () => Promise<void>;
  onUnlike?: () => Promise<void>;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  initialLiked = false,
  initialCount = 0,
  onLike,
  onUnlike,
  showCount = true,
  size = 'md',
  className = '',
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (liked) {
        await onUnlike?.();
        setLiked(false);
        setCount((prev) => Math.max(0, prev - 1));
      } else {
        await onLike?.();
        setLiked(true);
        setCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 ${sizeClasses[size]} rounded-lg transition-all ${
        liked
          ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/50'
          : 'bg-cyber-dark/50 text-cyber-muted border border-cyber-cyan/30 hover:border-cyber-pink/50 hover:text-cyber-pink'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={iconSizes[size]}
          fill={liked ? 'currentColor' : 'none'}
        />
      </motion.div>
      {showCount && (
        <span className="font-medium">{count}</span>
      )}
    </motion.button>
  );
};

export default LikeButton;
