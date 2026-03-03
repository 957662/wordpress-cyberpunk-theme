'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Heart,
  Bookmark,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { socialApi } from '@/lib/api/social';

interface SocialStatsCardProps {
  userId: string;
  username?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showTrends?: boolean;
  className?: string;
  onViewFollowers?: () => void;
  onViewFollowing?: () => void;
}

interface UserStats {
  followersCount: number;
  followingCount: number;
  postsCount?: number;
  totalLikes?: number;
  totalViews?: number;
  followerGrowth?: number;
  followingGrowth?: number;
}

export const SocialStatsCard: React.FC<SocialStatsCardProps> = ({
  userId,
  username,
  variant = 'default',
  showTrends = false,
  className,
  onViewFollowers,
  onViewFollowing,
}) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [followStatsRes] = await Promise.all([
        socialApi.getFollowStats(userId),
      ]);

      if (followStatsRes.success && followStatsRes.data) {
        setStats({
          followersCount: followStatsRes.data.followersCount,
          followingCount: followStatsRes.data.followingCount,
          postsCount: 0, // Would come from posts API
          totalLikes: 0, // Would come from likes API
          totalViews: 0, // Would come from analytics API
          followerGrowth: Math.floor(Math.random() * 20), // Mock data
          followingGrowth: Math.floor(Math.random() * 10),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cn(
        'rounded-xl bg-cyber-dark/50 border border-cyber-purple/20 p-6',
        'animate-pulse',
        className
      )}>
        <div className="h-20 bg-cyber-purple/10 rounded" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={cn(
        'rounded-xl bg-cyber-dark/50 border border-red-500/20 p-6',
        className
      )}>
        <p className="text-red-400 text-sm">Failed to load statistics</p>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    trend?: number;
    onClick?: () => void;
    color?: string;
  }> = ({ icon, label, value, trend, onClick, color = 'cyber-purple' }) => (
    <motion.button
      whileHover={{ scale: onClick ? 1.05 : 1, y: -2 }}
      whileTap={{ scale: onClick ? 0.95 : 1 }}
      onClick={onClick}
      className={cn(
        'relative group flex-1 min-w-[120px] p-4 rounded-lg',
        'bg-gradient-to-br from-cyber-dark/80 to-cyber-dark/60',
        'border border-cyber-purple/20 hover:border-cyber-purple/40',
        'transition-all duration-300',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={cn(
          'p-2 rounded-lg bg-cyber-purple/10',
          'text-cyber-purple group-hover:text-cyber-cyan',
          'transition-colors duration-300'
        )}>
          {icon}
        </div>
        <span className="text-sm text-cyber-muted">{label}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">
          {formatNumber(value)}
        </span>
      </div>

      {showTrends && trend !== undefined && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-xs',
          trend >= 0 ? 'text-green-400' : 'text-red-400'
        )}>
          <TrendingUp size={12} />
          <span>{trend >= 0 ? '+' : ''}{trend}%</span>
          <span className="text-cyber-muted">vs last month</span>
        </div>
      )}

      {onClick && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-cyber-purple/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.button>
  );

  if (variant === 'compact') {
    return (
      <div className={cn(
        'flex items-center gap-6 p-4 rounded-xl',
        'bg-gradient-to-r from-cyber-dark/80 to-cyber-dark/60',
        'border border-cyber-purple/20',
        className
      )}>
        <StatItem
          icon={<Users size={18} />}
          label="Followers"
          value={stats.followersCount}
          trend={showTrends ? stats.followerGrowth : undefined}
          onClick={onViewFollowers}
        />

        <div className="w-px h-8 bg-cyber-purple/20" />

        <StatItem
          icon={<UserPlus size={18} />}
          label="Following"
          value={stats.followingCount}
          trend={showTrends ? stats.followingGrowth : undefined}
          onClick={onViewFollowing}
        />
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-xl p-6',
      'bg-gradient-to-br from-cyber-dark/80 to-cyber-dark/60',
      'border border-cyber-purple/20',
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Social Statistics
        </h3>
        {username && (
          <span className="text-sm text-cyber-muted">@{username}</span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem
          icon={<Users size={20} />}
          label="Followers"
          value={stats.followersCount}
          trend={showTrends ? stats.followerGrowth : undefined}
          onClick={onViewFollowers}
        />

        <StatItem
          icon={<UserPlus size={20} />}
          label="Following"
          value={stats.followingCount}
          trend={showTrends ? stats.followingGrowth : undefined}
          onClick={onViewFollowing}
        />

        {variant === 'detailed' && (
          <>
            {stats.postsCount !== undefined && (
              <StatItem
                icon={<Bookmark size={20} />}
                label="Posts"
                value={stats.postsCount}
                color="cyber-cyan"
              />
            )}

            {stats.totalLikes !== undefined && (
              <StatItem
                icon={<Heart size={20} />}
                label="Total Likes"
                value={stats.totalLikes}
                color="cyber-pink"
              />
            )}

            {stats.totalViews !== undefined && (
              <StatItem
                icon={<Eye size={20} />}
                label="Total Views"
                value={stats.totalViews}
                color="cyber-yellow"
              />
            )}
          </>
        )}
      </div>

      {variant === 'detailed' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-cyber-purple/20"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-cyber-muted">
              Engagement Rate
            </span>
            <span className="text-cyber-cyan font-semibold">
              {stats.followersCount > 0
                ? ((stats.totalLikes || 0) / stats.followersCount * 100).toFixed(1)
                : '0'}%
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SocialStatsCard;
