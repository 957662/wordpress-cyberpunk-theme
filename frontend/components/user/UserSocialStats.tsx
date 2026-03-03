/**
 * User Social Stats Component
 * Display user social statistics (followers, following, etc.)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { followService } from '@/services/followService';
import type { FollowStats } from '@/services/followService';
import CyberCard from '@/components/ui/CyberCard';
import CyberButton from '@/components/ui/CyberButton';

interface UserSocialStatsProps {
  userId: string;
  username?: string;
  className?: string;
  showFollowButton?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function UserSocialStats({
  userId,
  username,
  className = '',
  showFollowButton = false,
  onFollowChange,
}: UserSocialStatsProps) {
  const [stats, setStats] = useState<FollowStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await followService.getFollowStats(userId);
      setStats(data);
      setFollowing(data.isFollowing);
    } catch (error) {
      console.error('Failed to load follow stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!stats) return;

    try {
      setFollowLoading(true);
      const newFollowingState = await followService.toggleFollow(userId, following);
      setFollowing(newFollowingState);

      // Update stats
      setStats(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isFollowing: newFollowingState,
          followerCount: newFollowingState
            ? prev.followerCount + 1
            : prev.followerCount - 1,
        };
      });

      onFollowChange?.(newFollowingState);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-24 bg-cyber-muted/30 rounded-lg" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={className}>
      <CyberCard className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Followers */}
          <Link
            href={`/users/${username || userId}/followers`}
            className="text-center group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="transition-transform"
            >
              <div className="text-2xl font-bold text-cyber-cyan mb-1">
                {stats.followerCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 group-hover:text-cyber-cyan transition-colors">
                Followers
              </div>
            </motion.div>
          </Link>

          {/* Following */}
          <Link
            href={`/users/${username || userId}/following`}
            className="text-center group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="transition-transform"
            >
              <div className="text-2xl font-bold text-cyber-purple mb-1">
                {stats.followingCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 group-hover:text-cyber-purple transition-colors">
                Following
              </div>
            </motion.div>
          </Link>

          {/* Actions */}
          <div className="flex items-center justify-center">
            {showFollowButton && (
              <CyberButton
                variant={following ? 'outline' : 'primary'}
                size="sm"
                disabled={followLoading}
                onClick={handleToggleFollow}
                className="w-full"
              >
                {followLoading ? (
                  '...'
                ) : following ? (
                  'Unfollow'
                ) : (
                  'Follow'
                )}
              </CyberButton>
            )}
          </div>
        </div>

        {/* Follow Status Indicator */}
        {following && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 pt-4 border-t border-cyber-cyan/20 text-center"
          >
            <span className="text-sm text-cyber-cyan">
              ✓ You are following this user
            </span>
          </motion.div>
        )}
      </CyberCard>
    </div>
  );
}
