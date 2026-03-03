/**
 * 用户关注统计卡片
 * 显示关注数、粉丝数等统计信息
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { followService, FollowStats } from '@/services/followService';

interface FollowStatsCardProps {
  userId: string;
  showFollowers?: boolean;
  showFollowing?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
  onStatClick?: (type: 'followers' | 'following') => void;
}

export function FollowStatsCard({
  userId,
  showFollowers = true,
  showFollowing = true,
  variant = 'default',
  className,
  onStatClick,
}: FollowStatsCardProps) {
  const [stats, setStats] = useState<FollowStats>({
    followingCount: 0,
    followerCount: 0,
    isFollowing: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await followService.getFollowStats(userId);
      setStats(data);
    } catch (error) {
      console.error('Failed to load follow stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const StatItem = ({
    icon: Icon,
    label,
    value,
    onClick,
  }: {
    icon: typeof Users;
    label: string;
    value: number;
    onClick?: () => void;
  }) => {
    if (variant === 'minimal') {
      return (
        <span className="text-sm text-gray-400">
          {formatNumber(value)} {label}
        </span>
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
          'hover:bg-cyber-primary/10 dark:hover:bg-cyber-primary/20',
          onClick && 'cursor-pointer'
        )}
      >
        <Icon className="h-4 w-4 text-cyber-primary" />
        <div className="flex flex-col items-start">
          <span className="text-lg font-bold text-foreground">
            {isLoading ? '—' : formatNumber(value)}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </motion.button>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        {showFollowers && (
          <StatItem
            icon={Users}
            label="粉丝"
            value={stats.followerCount}
            onClick={() => onStatClick?.('followers')}
          />
        )}
        {showFollowing && (
          <StatItem
            icon={UserPlus}
            label="关注"
            value={stats.followingCount}
            onClick={() => onStatClick?.('following')}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-cyber-border/50 bg-card/50 p-4 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-center justify-around">
        {showFollowers && (
          <StatItem
            icon={Users}
            label="粉丝"
            value={stats.followerCount}
            onClick={() => onStatClick?.('followers')}
          />
        )}
        {showFollowing && (
          <StatItem
            icon={UserPlus}
            label="关注"
            value={stats.followingCount}
            onClick={() => onStatClick?.('following')}
          />
        )}
      </div>
    </div>
  );
}
