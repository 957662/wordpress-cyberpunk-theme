/**
 * 关注按钮组件
 * 支持关注/取消关注用户
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { followService } from '@/services/followService';
import toast from 'react-hot-toast';

interface FollowButtonProps {
  userId: string;
  isFollowing?: boolean;
  username?: string;
  onFollowChange?: (isFollowing: boolean) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FollowButton({
  userId,
  isFollowing: initialIsFollowing = false,
  username,
  onFollowChange,
  variant = 'default',
  size = 'md',
  showIcon = true,
  disabled = false,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      const newState = await followService.toggleFollow(userId, isFollowing);
      setIsFollowing(newState);
      onFollowChange?.(newState);

      toast.success(
        newState
          ? `已关注 ${username || '用户'}`
          : `已取消关注 ${username || '用户'}`
      );
    } catch (error: any) {
      toast.error(error.message || '操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const variantClasses = {
    default: isFollowing
      ? 'bg-cyber-pink/10 text-cyber-pink border-cyber-pink/30 hover:bg-cyber-pink/20'
      : 'bg-cyber-primary text-white border-cyber-primary/50 hover:bg-cyber-primary/90',
    outline: isFollowing
      ? 'border-cyber-pink text-cyber-pink hover:bg-cyber-pink/10'
      : 'border-cyber-primary text-cyber-primary hover:bg-cyber-primary/10',
    ghost: isFollowing
      ? 'text-cyber-pink hover:bg-cyber-pink/10'
      : 'text-cyber-primary hover:bg-cyber-primary/10',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-cyber-primary/50 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
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
      <span>{isFollowing ? '已关注' : '关注'}</span>
    </motion.button>
  );
}
