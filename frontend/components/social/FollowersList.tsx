'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { FollowButton } from './FollowButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Follower {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  isFollowing: boolean;
  followerCount: number;
  followedAt: string;
}

interface FollowersListProps {
  userId: string;
  type?: 'followers' | 'following';
  limit?: number;
  showBio?: boolean;
  onClose?: () => void;
  className?: string;
}

export const FollowersList: React.FC<FollowersListProps> = ({
  userId,
  type = 'followers',
  limit = 20,
  showBio = true,
  onClose,
  className,
}) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFollowers = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/users/${userId}/${type}?page=${pageNum}&limit=${limit}&query=${searchQuery}`
      );

      if (response.ok) {
        const data = await response.json();
        if (pageNum === 1) {
          setFollowers(data.followers);
        } else {
          setFollowers(prev => [...prev, ...data.followers]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers(1);
  }, [userId, type]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setPage(1);
      fetchFollowers(1);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleFollowToggle = async (targetUserId: string, isFollowing: boolean) => {
    try {
      const response = await fetch(`/api/users/${targetUserId}/follow`, {
        method: isFollowing ? 'POST' : 'DELETE',
      });

      if (response.ok) {
        setFollowers(prev =>
          prev.map(follower =>
            follower.id === targetUserId
              ? { ...follower, isFollowing }
              : follower
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const filteredFollowers = followers.filter(follower =>
    follower.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    follower.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn('bg-gray-900/95 backdrop-blur-sm rounded-lg border border-cyan-500/30', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <Users className="text-cyan-400" size={24} />
          <h2 className="text-xl font-bold text-white">
            {type === 'followers' ? 'Followers' : 'Following'}
          </h2>
          <span className="text-sm text-gray-400">
            ({followers.length})
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-cyan-500/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredFollowers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Users size={48} className="mb-4 opacity-50" />
            <p>No {type} found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredFollowers.map((follower, index) => (
              <motion.div
                key={follower.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors border-b border-cyan-500/10 last:border-b-0"
              >
                <Avatar
                  src={follower.avatar}
                  alt={follower.displayName}
                  size="md"
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate">
                      {follower.displayName}
                    </h3>
                    <span className="text-sm text-gray-400 truncate">
                      @{follower.username}
                    </span>
                  </div>
                  {showBio && follower.bio && (
                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                      {follower.bio}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{follower.followerCount} followers</span>
                    <span>•</span>
                    <span>Followed {new Date(follower.followedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <FollowButton
                  userId={follower.id}
                  isFollowing={follower.isFollowing}
                  onFollowToggle={handleFollowToggle}
                  variant="outline"
                  size="sm"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Load More */}
      {hasMore && !isLoading && filteredFollowers.length > 0 && (
        <div className="p-4 border-t border-cyan-500/20">
          <button
            onClick={() => {
              setPage(prev => prev + 1);
              fetchFollowers(page + 1);
            }}
            className="w-full py-2 px-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors font-medium"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowersList;
