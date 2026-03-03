'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserMinus, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  isFollowing?: boolean;
}

interface FollowerListProps {
  userId: string;
  type: 'followers' | 'following';
  limit?: number;
  showBio?: boolean;
  showStats?: boolean;
  interactive?: boolean;
  className?: string;
}

export function FollowerList({
  userId,
  type,
  limit = 20,
  showBio = true,
  showStats = true,
  interactive = true,
  className,
}: FollowerListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [userId, type, page]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/users/${userId}/${type}?page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      if (page === 1) {
        setUsers(data.users);
      } else {
        setUsers(prev => [...prev, ...data.users]);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
    if (!interactive) return;

    try {
      const response = await fetch(`/api/users/${targetUserId}/follow`, {
        method: isCurrentlyFollowing ? 'DELETE' : 'POST',
      });

      if (!response.ok) throw new Error('Failed to update follow status');

      setUsers(users.map(user =>
        user.id === targetUserId
          ? { ...user, isFollowing: !isCurrentlyFollowing }
          : user
      ));
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* 标题和搜索 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="text-cyan-500" size={20} />
          <h3 className="text-lg font-semibold text-white">
            {type === 'followers' ? '粉丝列表' : '正在关注'}
          </h3>
          <span className="text-sm text-gray-400">
            ({filteredUsers.length})
          </span>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="搜索用户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 w-48"
          />
        </div>
      </div>

      {/* 用户列表 */}
      <div className="space-y-3">
        {isLoading && page === 1 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-cyan-500" size={32} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>{searchQuery ? '未找到匹配的用户' : type === 'followers' ? '还没有粉丝' : '还没有关注任何人'}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
              >
                {/* 赛博朋克发光边框 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-4 flex items-center gap-4">
                  {/* 头像 */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-cyan-500/30 group-hover:ring-cyan-500/60 transition-all">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.displayName}
                          width={56}
                          height={56}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* 在线状态指示器 */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                  </div>

                  {/* 用户信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                        {user.displayName}
                      </h4>
                      <span className="text-xs text-gray-500">@{user.username}</span>
                    </div>
                    {showBio && user.bio && (
                      <p className="text-sm text-gray-400 truncate mt-1">{user.bio}</p>
                    )}
                    {showStats && (
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{user.followersCount} 粉丝</span>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  {interactive && (
                    <motion.button
                      onClick={() => handleFollowToggle(user.id, user.isFollowing || false)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        user.isFollowing
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                          : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {user.isFollowing ? (
                        <>
                          <UserMinus size={14} className="inline mr-1" />
                          取消关注
                        </>
                      ) : (
                        <>
                          <Users size={14} className="inline mr-1" />
                          关注
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 加载更多 */}
      {hasMore && !isLoading && (
        <div className="flex justify-center pt-4">
          <motion.button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-cyan-500/50 rounded-lg text-cyan-400 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            加载更多
          </motion.button>
        </div>
      )}

      {isLoading && page > 1 && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-cyan-500" size={24} />
        </div>
      )}
    </div>
  );
}
