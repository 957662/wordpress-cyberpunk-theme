'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  userId: number;
  isFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing: initialIsFollowing = false,
  onFollowChange,
  variant = 'primary',
  size = 'md',
  showIcon = true,
  disabled = false,
  className
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/follows/${userId}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('操作失败');
      }

      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      onFollowChange?.(newFollowingState);
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const variantStyles = {
    primary: isFollowing
      ? 'bg-cyber-dark border border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-white'
      : 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white hover:shadow-[0_0_20px_rgba(157,0,255,0.5)]',
    secondary: isFollowing
      ? 'bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark'
      : 'bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark',
    ghost: isFollowing
      ? 'bg-transparent text-cyber-muted hover:text-cyber-purple'
      : 'bg-transparent text-cyber-cyan hover:text-cyber-purple',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-cyber-purple focus:ring-offset-2 focus:ring-offset-cyber-dark',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      onClick={handleFollowToggle}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={iconSizes[size]} />
      ) : (
        showIcon && (
          <>
            {isFollowing ? (
              <UserCheck size={iconSizes[size]} />
            ) : (
              <UserPlus size={iconSizes[size]} />
            )}
          </>
        )
      )}

      <span>
        {isLoading ? '处理中...' : isFollowing ? '已关注' : '关注'}
      </span>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-red-500 px-2 py-1 text-xs text-white"
        >
          {error}
        </motion.div>
      )}
    </motion.button>
  );
};

export default FollowButton;
