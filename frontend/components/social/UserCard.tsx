/**
 * 用户卡片组件
 * User Card Component
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFollow } from '@/hooks/useSocialFeatures';

interface UserCardProps {
  user: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    website?: string;
    followers_count?: number;
    following_count?: number;
  };
  variant?: 'default' | 'compact' | 'minimal';
  showFollowButton?: boolean;
  showStats?: boolean;
  onClick?: () => void;
  className?: string;
}

export function UserCard({
  user,
  variant = 'default',
  showFollowButton = true,
  showStats = true,
  onClick,
  className = '',
}: UserCardProps) {
  const { isFollowing, toggleFollow, isLoading: isFollowLoading } = useFollow(user.id);

  const cardContent = (
    <>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {user.avatar_url ? (
          <div className="relative">
            <Image
              src={user.avatar_url}
              alt={user.username}
              width={variant === 'minimal' ? 40 : 80}
              height={variant === 'minimal' ? 40 : 80}
              className={`rounded-full border-2 border-cyber-cyan/30 ${
                variant === 'minimal' ? 'w-10 h-10' : 'w-20 h-20'
              }`}
            />
          </div>
        ) : (
          <div
            className={`rounded-full bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20 flex items-center justify-center text-white font-bold border-2 border-cyber-cyan/30 ${
              variant === 'minimal' ? 'w-10 h-10 text-sm' : 'w-20 h-20 text-2xl'
            }`}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className={`flex-1 min-w-0 ${variant === 'minimal' ? '' : 'mt-3'}`}>
        <h3
          className={`font-semibold text-white truncate ${
            variant === 'minimal' ? 'text-sm' : 'text-lg'
          }`}
        >
          {user.display_name || user.username}
        </h3>
        {user.display_name && variant !== 'minimal' && (
          <p className="text-sm text-cyber-muted">@{user.username}</p>
        )}

        {variant !== 'minimal' && user.bio && (
          <p className="text-sm text-cyber-secondary mt-2 line-clamp-2">{user.bio}</p>
        )}

        {variant !== 'minimal' && (
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-cyber-muted">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-cyber-cyan transition-colors"
              >
                <LinkIcon className="w-3 h-3" />
                网站
              </a>
            )}
          </div>
        )}

        {showStats && variant !== 'minimal' && (
          <div className="flex gap-4 mt-3 text-sm">
            <span className="text-white">
              <strong>{user.followers_count || 0}</strong>{' '}
              <span className="text-cyber-muted">粉丝</span>
            </span>
            <span className="text-white">
              <strong>{user.following_count || 0}</strong>{' '}
              <span className="text-cyber-muted">关注</span>
            </span>
          </div>
        )}
      </div>

      {/* Follow Button */}
      {showFollowButton && variant !== 'minimal' && (
        <FollowActionButton
          isFollowing={isFollowing ?? false}
          isLoading={isFollowLoading}
          onToggle={toggleFollow}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }
        }
        onClick={onClick}
        className={`cyber-card p-4 cursor-pointer hover:border-cyber-cyan/50 transition-colors ${className}`}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <Link
      href={`/user/${user.username}`}
      className={`block cyber-card p-4 hover:border-cyber-cyan/50 transition-colors ${className}`}
    >
      {cardContent}
    </Link>
  );
}

function FollowActionButton({
  isFollowing,
  isLoading,
  onToggle,
}: {
  isFollowing: boolean;
  isLoading: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      disabled={isLoading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
        isFollowing
          ? 'bg-cyber-secondary border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10'
          : 'bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white hover:shadow-lg hover:shadow-cyber-purple/20'
      }`}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
      ) : isFollowing ? (
        '已关注'
      ) : (
        '关注'
      )}
    </motion.button>
  );
}

/**
 * 用户头像组件 (最小化版本)
 */
export function UserAvatar({
  user,
  size = 'md',
  className = '',
}: {
  user: { username: string; avatar_url?: string };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div className={`rounded-full bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20 flex items-center justify-center text-white font-bold border-2 border-cyber-cyan/30 ${sizeClasses[size]} ${className}`}>
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.username}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{user.username.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
