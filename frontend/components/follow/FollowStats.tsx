'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowStats {
  followers_count: number;
  following_count: number;
}

interface FollowStatsProps {
  userId: number;
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onStatsClick?: (type: 'followers' | 'following') => void;
}

export const FollowStats: React.FC<FollowStatsProps> = ({
  userId,
  showLabels = true,
  variant = 'default',
  orientation = 'horizontal',
  className,
  onStatsClick
}) => {
  const [stats, setStats] = useState<FollowStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/follows/stats/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch follow stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (isLoading) {
    return <FollowStatsSkeleton variant={variant} orientation={orientation} />;
  }

  if (!stats) {
    return null;
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const baseStyles = 'flex items-center gap-2 text-cyber-muted';
  const orientationStyles = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  const variantStyles = {
    default: 'gap-4',
    compact: 'gap-2 text-sm',
    minimal: 'gap-1 text-xs',
  };

  const StatItem: React.FC<{
    icon: React.ReactNode;
    count: number;
    label: string;
    type: 'followers' | 'following';
  }> = ({ icon, count, label, type }) => (
    <motion.button
      whileHover={{ scale: onStatsClick ? 1.05 : 1 }}
      whileTap={{ scale: onStatsClick ? 0.95 : 1 }}
      onClick={() => onStatsClick?.(type)}
      className={cn(
        'flex items-center gap-1.5 transition-colors',
        onStatsClick && 'hover:text-cyber-cyan cursor-pointer',
        !onStatsClick && 'cursor-default'
      )}
    >
      {variant !== 'minimal' && icon}
      <span className="font-semibold text-cyber-cyan">
        {formatNumber(count)}
      </span>
      {showLabels && <span className="text-xs">{label}</span>}
    </motion.button>
  );

  return (
    <div className={cn(baseStyles, orientationStyles, variantStyles[variant], className)}>
      <StatItem
        icon={<Users size={variant === 'minimal' ? 14 : 18} />}
        count={stats.followers_count}
        label="粉丝"
        type="followers"
      />
      <StatItem
        icon={<UserPlus size={variant === 'minimal' ? 14 : 18} />}
        count={stats.following_count}
        label="关注"
        type="following"
      />
    </div>
  );
};

interface FollowStatsSkeletonProps {
  variant: 'default' | 'compact' | 'minimal';
  orientation: 'horizontal' | 'vertical';
}

const FollowStatsSkeleton: React.FC<FollowStatsSkeletonProps> = ({
  variant,
  orientation
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-4',
        orientation === 'vertical' && 'flex-col'
      )}
    >
      {[1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'flex items-center gap-2 animate-pulse',
            variant === 'compact' && 'gap-1',
            variant === 'minimal' && 'gap-1'
          )}
        >
          <div
            className={cn(
              'rounded-full bg-cyber-muted/20',
              variant === 'default' && 'h-5 w-5',
              variant === 'compact' && 'h-4 w-4',
              variant === 'minimal' && 'h-3 w-3'
            )}
          />
          <div
            className={cn(
              'rounded bg-cyber-muted/20',
              variant === 'default' && 'h-4 w-16',
              variant === 'compact' && 'h-3 w-12',
              variant === 'minimal' && 'h-2.5 w-8'
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default FollowStats;
