'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowerCountProps {
  userId: string;
  initialCount?: number;
  showTrend?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
  onUpdate?: (count: number) => void;
}

interface FollowerStats {
  count: number;
  trend: 'up' | 'down' | 'neutral';
  change: number;
}

export const FollowerCount: React.FC<FollowerCountProps> = ({
  userId,
  initialCount = 0,
  showTrend = true,
  variant = 'default',
  className,
  onUpdate,
}) => {
  const [stats, setStats] = useState<FollowerStats>({
    count: initialCount,
    trend: 'neutral',
    change: 0,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/users/${userId}/followers/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          onUpdate?.(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch follower stats:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [userId, onUpdate]);

  useEffect(() => {
    if (stats.count !== initialCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [stats.count, initialCount]);

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const TrendIcon = stats.trend === 'up' ? TrendingUp : stats.trend === 'down' ? TrendingDown : null;

  const variants = {
    default: (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Users className="text-cyan-400" size={20} />
          <span className="text-2xl font-bold text-white">{formatCount(stats.count)}</span>
        </div>
        {showTrend && TrendIcon && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              stats.trend === 'up' ? 'text-green-400' : 'text-red-400'
            )}
          >
            <TrendIcon size={14} />
            <span>{Math.abs(stats.change)}%</span>
          </motion.div>
        )}
      </div>
    ),
    compact: (
      <div className="flex items-center gap-2">
        <Users className="text-cyan-400" size={16} />
        <span className="text-lg font-semibold text-white">{formatCount(stats.count)}</span>
        {showTrend && TrendIcon && (
          <TrendIcon
            size={14}
            className={stats.trend === 'up' ? 'text-green-400' : 'text-red-400'}
          />
        )}
      </div>
    ),
    minimal: (
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-gray-300">{formatCount(stats.count)}</span>
        {showTrend && stats.change !== 0 && (
          <span
            className={cn(
              'text-xs font-medium',
              stats.trend === 'up' ? 'text-green-400' : 'text-red-400'
            )}
          >
            ({stats.trend === 'up' ? '+' : ''}{stats.change}%)
          </span>
        )}
      </div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('inline-flex', isAnimating && 'scale-110 transition-transform', className)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={stats.count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {variants[variant]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default FollowerCount;
