'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  UserCheck,
  Search,
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { socialApi } from '@/lib/api/social';
import { FollowButton } from '../follow/FollowButton';

interface UserRelationsListProps {
  userId: string;
  type: 'followers' | 'following';
  onClose?: () => void;
  className?: string;
}

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  followersCount: number;
  isFollowing: boolean;
}

export const UserRelationsList: React.FC<UserRelationsListProps> = ({
  userId,
  type,
  onClose,
  className,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [userId, type]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setPage(1);
      const response = type === 'followers'
        ? await socialApi.getFollowers(userId, 1, 20)
        : await socialApi.getFollowing(userId, 1, 20);

      if (response.success && response.data) {
        setUsers(response.data.users);
        setHasMore(response.data.users.length >= 20);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const response = type === 'followers'
        ? await socialApi.getFollowers(userId, nextPage, 20)
        : await socialApi.getFollowing(userId, nextPage, 20);

      if (response.success && response.data) {
        setUsers((prev) => [...prev, ...response.data.users]);
        setPage(nextPage);
        setHasMore(response.data.users.length >= 20);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFollowChange = (userId: string, newFollowingState: boolean) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFollowing: newFollowingState } : user
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn(
      'rounded-xl overflow-hidden',
      'bg-gradient-to-br from-cyber-dark/80 to-cyber-dark/60',
      'border border-cyber-purple/20',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-cyber-purple/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {type === 'followers' ? 'Followers' : 'Following'}
            </h2>
            <p className="text-sm text-cyber-muted">
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-cyber-purple/10 transition-colors"
          >
            <X size={20} className="text-cyber-muted" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-cyber-purple/20">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted"
          />
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-lg',
              'bg-cyber-dark/50 border border-cyber-purple/20',
              'text-white placeholder:text-cyber-muted/50',
              'focus:outline-none focus:ring-2 focus:ring-cyber-purple/50',
              'transition-all duration-300'
            )}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-cyber-purple" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-cyber-purple/10 flex items-center justify-center mb-4">
              <Users size={32} className="text-cyber-purple/50" />
            </div>
            <p className="text-cyber-muted text-sm">
              {searchQuery ? 'No users found' : `No ${type} yet`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-cyber-purple/10">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 hover:bg-cyber-purple/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink p-0.5">
                        <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-sm font-medium">
                              {user.displayName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      {user.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-cyber-dark flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-cyber-cyan flex items-center justify-center">
                            <svg
                              className="w-2 h-2 text-cyber-dark"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-white font-medium truncate">
                          {user.displayName}
                        </h3>
                        {user.verified && (
                          <div className="w-4 h-4 rounded-full bg-cyber-cyan flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-2.5 h-2.5 text-cyber-dark"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-cyber-muted">@{user.username}</p>
                      {user.bio && (
                        <p className="text-xs text-cyber-muted/70 mt-1 line-clamp-1">
                          {user.bio}
                        </p>
                      )}
                      <p className="text-xs text-cyber-muted/50 mt-1">
                        {user.followersCount} followers
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      <FollowButton
                        userId={user.id}
                        isFollowing={user.isFollowing}
                        onFollowChange={(isFollowing) => handleFollowChange(user.id, isFollowing)}
                        variant="secondary"
                        size="sm"
                        showIcon={false}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && filteredUsers.length > 0 && (
          <div className="p-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={cn(
                'w-full py-3 px-4 rounded-lg',
                'bg-cyber-purple/10 border border-cyber-purple/20',
                'text-cyber-purple hover:bg-cyber-purple/20',
                'transition-all duration-300',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Load More</span>
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRelationsList;
