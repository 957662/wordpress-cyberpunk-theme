'use client';

/**
 * FollowButton - 关注按钮组件
 * 支持关注/取消关注作者
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  userId: string;
  userName?: string;
  isFollowing?: boolean;
  followersCount?: number;
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  className?: string;
}

export function FollowButton({
  userId,
  userName,
  isFollowing: initialIsFollowing = false,
  followersCount = 0,
  onFollow,
  onUnfollow,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(followersCount);

  const handleToggleFollow = async () => {
    setIsLoading(true);

    try {
      if (isFollowing) {
        await onUnfollow?.(userId);
        setIsFollowing(false);
        setCount(prev => Math.max(0, prev - 1));
      } else {
        await onFollow?.(userId);
        setIsFollowing(true);
        setCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      // Handle error - maybe show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleToggleFollow}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          'border-2 disabled:opacity-50 disabled:cursor-not-allowed',
          isFollowing
            ? 'bg-cyber-purple/10 border-cyber-purple text-cyber-purple hover:bg-cyber-purple/20'
            : 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/20 hover:shadow-lg hover:shadow-cyber-cyan/20'
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          <UserCheck className="w-4 h-4" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        <span>{isFollowing ? '已关注' : '关注'}</span>
      </motion.button>

      {/* Followers Count */}
      <div className="text-sm text-gray-500">
        <span className="font-medium text-white">{count}</span> 关注者
      </div>
    </div>
  );
}

export default FollowButton;
