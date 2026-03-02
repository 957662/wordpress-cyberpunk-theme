'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  userId: number;
  isFollowing?: boolean;
  followerCount?: number;
  onFollowChange?: (isFollowing: boolean) => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FollowButton({
  userId,
  isFollowing: initialFollowing = false,
  followerCount = 0,
  onFollowChange,
  variant = 'primary',
  size = 'md',
  className
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(followerCount);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newState = !isFollowing;
      setIsFollowing(newState);
      setCount(prev => newState ? prev + 1 : prev - 1);

      if (onFollowChange) {
        onFollowChange(newState);
      }

      // 这里应该调用实际的 API
      // const response = await fetch(`/api/users/${userId}/follow`, {
      //   method: newState ? 'POST' : 'DELETE'
      // });
    } catch (error) {
      console.error('关注操作失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const variants = {
    primary: isFollowing
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90',
    outline: isFollowing
      ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
      : 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10',
    ghost: isFollowing
      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
      : 'text-cyber-cyan hover:bg-cyber-cyan/10'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-lg gap-2'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5'
  };

  return (
    <motion.button
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      onClick={handleFollow}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        variant !== 'ghost' && 'border',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
      ) : isFollowing ? (
        <UserCheck className={iconSizes[size]} />
      ) : (
        <UserPlus className={iconSizes[size]} />
      )}

      <span>{isFollowing ? '已关注' : '关注'}</span>

      {count > 0 && variant !== 'ghost' && (
        <span className="opacity-70">({count.toLocaleString()})</span>
      )}
    </motion.button>
  );
}

// 紧凑版关注按钮
export function FollowButtonCompact({
  userId,
  isFollowing: initialFollowing = false,
  onFollowChange,
  className
}: Omit<FollowButtonProps, 'followerCount' | 'variant' | 'size'>) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newState = !isFollowing;
      setIsFollowing(newState);

      if (onFollowChange) {
        onFollowChange(newState);
      }
    } catch (error) {
      console.error('关注操作失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
      onClick={handleFollow}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        isFollowing
          ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
          : 'bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="w-3.5 h-3.5" />
      ) : (
        <UserPlus className="w-3.5 h-3.5" />
      )}

      <span>{isFollowing ? '已关注' : '关注'}</span>
    </motion.button>
  );
}

// 带下拉菜单的关注按钮
export function FollowButtonWithMenu({
  userId,
  isFollowing: initialFollowing = false,
  followerCount = 0,
  onFollowChange,
  className
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [showMenu, setShowMenu] = useState(false);

  const handleFollow = async () => {
    if (isFollowing) {
      setShowMenu(!showMenu);
    } else {
      // 直接关注
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsFollowing(true);
        if (onFollowChange) onFollowChange(true);
      } catch (error) {
        console.error('关注失败:', error);
      }
    }
  };

  const handleUnfollow = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsFollowing(false);
      setShowMenu(false);
      if (onFollowChange) onFollowChange(false);
    } catch (error) {
      console.error('取消关注失败:', error);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleFollow}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          isFollowing
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90'
        )}
      >
        {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
        <span>{isFollowing ? '已关注' : '关注'}</span>
        {followerCount > 0 && (
          <span className="opacity-70">({followerCount.toLocaleString()})</span>
        )}
      </motion.button>

      {/* 下拉菜单 */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 cyber-card overflow-hidden z-20"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={handleUnfollow}
                className="w-full px-3 py-2 text-left text-sm text-cyber-pink hover:bg-cyber-pink/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>取消关注</span>
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-cyber-darker rounded-lg transition-colors"
              >
                查看个人主页
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
