'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface User {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  joinDate: Date;
  stats?: {
    posts?: number;
    followers?: number;
    following?: number;
    likes?: number;
  };
  verified?: boolean;
  badge?: string;
}

interface UserCardProps {
  user: User;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showStats?: boolean;
  showFollowButton?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onClick?: () => void;
}

export function UserCard({
  user,
  className,
  variant = 'default',
  showStats = true,
  showFollowButton = true,
  isFollowing = false,
  onFollow,
  onClick,
}: UserCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        'relative bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/30 rounded-xl p-6 hover:border-cyber-cyan/50 transition-all group',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="relative flex items-start gap-4">
        <div className="relative flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName}
              className={cn(
                'rounded-full object-cover border-2',
                variant === 'compact' ? 'w-12 h-12' : 'w-16 h-16',
                'border-cyber-cyan/30 group-hover:border-cyber-cyan/50 transition-colors'
              )}
            />
          ) : (
            <div
              className={cn(
                'rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold',
                variant === 'compact' ? 'w-12 h-12 text-lg' : 'w-16 h-16 text-xl'
              )}
            >
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <h3 className="font-bold text-white truncate group-hover:text-cyber-cyan transition-colors">
                {user.displayName}
              </h3>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>

            {showFollowButton && variant !== 'compact' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onFollow?.();
                }}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium border transition-all flex-shrink-0',
                  isFollowing
                    ? 'bg-pink-500/20 border-pink-500/50 text-pink-400 hover:bg-pink-500/30'
                    : 'bg-cyber-cyan/20 border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/30'
                )}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </motion.button>
            )}
          </div>

          {user.bio && variant !== 'compact' && (
            <p className="text-sm text-gray-300 line-clamp-2 mb-3">{user.bio}</p>
          )}

          {variant !== 'compact' && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyber-cyan transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{user.website}</span>
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Joined {formatDate(user.joinDate)}</span>
              </div>
            </div>
          )}

          {showStats && user.stats && variant !== 'compact' && (
            <div className="flex items-center gap-4 text-sm">
              {user.stats.posts !== undefined && (
                <div>
                  <span className="font-bold text-white">{user.stats.posts}</span>
                  <span className="text-gray-400 ml-1">Posts</span>
                </div>
              )}
              {user.stats.followers !== undefined && (
                <div>
                  <span className="font-bold text-white">{user.stats.followers}</span>
                  <span className="text-gray-400 ml-1">Followers</span>
                </div>
              )}
              {user.stats.following !== undefined && (
                <div>
                  <span className="font-bold text-white">{user.stats.following}</span>
                  <span className="text-gray-400 ml-1">Following</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default UserCard;
