'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserMinus, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  userId: string;
  isInitiallyFollowing?: boolean;
  followerCount?: number;
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export function FollowButton({
  userId,
  isInitiallyFollowing = false,
  followerCount,
  onFollow,
  onUnfollow,
  showCount = false,
  size = 'md',
  variant = 'default',
  className,
  disabled = false,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [count, setCount] = useState(followerCount || 0);
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async () => {
    if (disabled || isPending) return;

    const newIsFollowing = !isFollowing;

    // Optimistic update
    setIsFollowing(newIsFollowing);
    setCount(prev => (newIsFollowing ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (newIsFollowing) {
        if (onFollow) {
          await onFollow(userId);
        }
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        if (onUnfollow) {
          await onUnfollow(userId);
        }
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(!newIsFollowing);
      setCount(prev => (newIsFollowing ? Math.max(0, prev - 1) : prev + 1));
      console.error('Failed to toggle follow:', error);
    }
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-5 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={handleClick}
        disabled={disabled || isPending}
        variant={isFollowing ? 'outline' : variant}
        className={cn(
          'gap-2 transition-all duration-200 font-semibold',
          isFollowing
            ? 'border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10'
            : 'bg-cyber-cyan hover:bg-cyber-cyan/80 text-black',
          sizeClasses[size],
          (disabled || isPending) && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {isPending ? (
          <Loader2 className={`w-${iconSizes[size]} h-${iconSizes[size]} animate-spin`} />
        ) : (
          <>
            <AnimatePresence mode="wait">
              {isFollowing ? (
                showSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check style={{ width: iconSizes[size], height: iconSizes[size] }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="following"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UserMinus style={{ width: iconSizes[size], height: iconSizes[size] }} />
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="follow"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserPlus style={{ width: iconSizes[size], height: iconSizes[size] }} />
                </motion.div>
              )}
            </AnimatePresence>
            <span>{isFollowing ? (showSuccess ? '已关注' : '已关注') : '关注'}</span>
          </>
        )}
      </Button>
      {showCount && (
        <span className="ml-2 text-sm text-gray-400">
          {count} {count === 1 ? 'follower' : 'followers'}
        </span>
      )}
    </motion.div>
  );
}

// Compact follow button for user cards
export function CompactFollowButton({
  isFollowing,
  onToggle,
  disabled = false,
  className,
}: {
  isFollowing: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'px-3 py-1.5 rounded-lg text-sm font-semibold transition-all',
        isFollowing
          ? 'border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10'
          : 'bg-cyber-cyan text-black hover:bg-cyber-cyan/80',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isFollowing ? '已关注' : '关注'}
    </motion.button>
  );
}

// Follow stats display
export function FollowStats({
  followers,
  following,
  onFollowersClick,
  onFollowingClick,
  className,
}: {
  followers: number;
  following: number;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <button
        onClick={onFollowersClick}
        className="group flex items-baseline gap-1 transition-colors"
      >
        <span className="text-lg font-bold text-white group-hover:text-cyber-cyan transition-colors">
          {followers.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400">粉丝</span>
      </button>
      <span className="text-gray-600">·</span>
      <button
        onClick={onFollowingClick}
        className="group flex items-baseline gap-1 transition-colors"
      >
        <span className="text-lg font-bold text-white group-hover:text-cyber-cyan transition-colors">
          {following.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400">关注</span>
      </button>
    </div>
  );
}

// Follow suggestion card
export function FollowSuggestion({
  user,
  onFollow,
  onDismiss,
}: {
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
  onFollow: (userId: string) => void;
  onDismiss: (userId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/40 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold text-lg">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{user.name}</h4>
          <p className="text-sm text-cyber-cyan">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{user.bio}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <FollowButton
            userId={user.id}
            onFollow={onFollow}
            onUnfollow={() => {}}
            size="sm"
          />
          <button
            onClick={() => onDismiss(user.id)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default FollowButton;
