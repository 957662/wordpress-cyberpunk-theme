'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowToggle: (userId: string, isFollowing: boolean) => Promise<void>;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing: initialIsFollowing,
  onFollowToggle,
  variant = 'default',
  size = 'md',
  className,
  disabled = false,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    const newState = !isFollowing;

    try {
      await onFollowToggle(userId, newState);
      startTransition(() => {
        setIsFollowing(newState);
      });
    } catch (error) {
      console.error('Follow toggle failed:', error);
      // Revert on error
      setIsFollowing(isFollowing);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200';

  const variantStyles = {
    default: cn(
      'bg-cyan-500 text-black hover:bg-cyan-400',
      'shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]',
      isFollowing && 'bg-fuchsia-500 hover:bg-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.3)]'
    ),
    outline: cn(
      'border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black',
      isFollowing && 'border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black'
    ),
    ghost: cn(
      'text-cyan-500 hover:bg-cyan-500/10',
      isFollowing && 'text-fuchsia-500 hover:bg-fuchsia-500/10'
    ),
  };

  return (
    <motion.button
      whileHover={{ scale: isLoading || disabled ? 1 : 1.02 }}
      whileTap={{ scale: isLoading || disabled ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={isLoading || isPending || disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        (isLoading || isPending || disabled) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isLoading || isPending ? (
        <Loader2 className={cn('animate-spin')} size={iconSize[size]} />
      ) : isFollowing ? (
        <>
          <UserCheck size={iconSize[size]} />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus size={iconSize[size]} />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
};

export default FollowButton;
