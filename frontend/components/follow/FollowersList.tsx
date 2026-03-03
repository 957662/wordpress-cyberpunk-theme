'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from './FollowButton';

interface Follower {
  id: number;
  user_id: number;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  followed_at: string;
}

interface FollowersListProps {
  userId: number;
  type?: 'followers' | 'following';
  className?: string;
}

export const FollowersList: React.FC<FollowersListProps> = ({
  userId,
  type = 'followers',
  className
}) => {
  const [users, setUsers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const endpoint = type === 'followers' ? 'followers' : 'following';
        const response = await fetch(
          `/api/follows/${endpoint}/${userId}?page=${page}&page_size=${pageSize}`
        );

        if (!response.ok) {
          throw new Error('加载失败');
        }

        const data = await response.json();
        setUsers(data[type] || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [userId, type, page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-purple/30 pb-4">
        <h2 className="text-2xl font-bold text-cyber-cyan flex items-center gap-2">
          <Users size={24} />
          {type === 'followers' ? '粉丝列表' : '关注列表'}
          <span className="text-sm text-cyber-muted">({total})</span>
        </h2>
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-500/10 border border-red-500/50 p-4 text-center text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-purple" />
        </div>
      )}

      {/* Users List */}
      {!isLoading && users.length > 0 && (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <AnimatePresence>
            {users.map((user) => (
              <UserCard key={user.id} user={user} type={type} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && users.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-cyber-muted/5 border border-cyber-purple/20 p-12 text-center"
        >
          <Users className="mx-auto mb-4 h-12 w-12 text-cyber-muted/50" />
          <p className="text-cyber-muted">
            {type === 'followers' ? '还没有粉丝' : '还没有关注任何人'}
          </p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-cyber-purple/50 px-4 py-2 text-cyber-purple transition-colors hover:bg-cyber-purple/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={cn(
                  'min-w-[2.5rem] rounded-lg border px-3 py-2 transition-colors',
                  page === pageNum
                    ? 'border-cyber-cyan bg-cyber-cyan text-cyber-dark'
                    : 'border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/10'
                )}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-cyber-purple/50 px-4 py-2 text-cyber-purple transition-colors hover:bg-cyber-purple/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

interface UserCardProps {
  user: Follower;
  type: 'followers' | 'following';
}

const UserCard: React.FC<UserCardProps> = ({ user, type }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 },
      }}
      exit={{ opacity: 0, x: 20 }}
      className="group flex items-center justify-between rounded-lg border border-cyber-purple/20 bg-cyber-muted/5 p-4 transition-all hover:border-cyber-purple/50 hover:bg-cyber-muted/10"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Link
          href={`/author/${user.username}`}
          className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-cyber-purple/50 transition-all group-hover:ring-cyber-cyan"
        >
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.username}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyber-purple to-cyber-pink text-lg font-bold text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        {/* User Info */}
        <div className="flex-1">
          <Link
            href={`/author/${user.username}`}
            className="font-semibold text-cyber-cyan transition-colors hover:text-cyber-purple"
          >
            {user.full_name || user.username}
          </Link>
          {user.full_name && (
            <p className="text-sm text-cyber-muted">@{user.username}</p>
          )}
          {user.bio && (
            <p className="mt-1 line-clamp-2 text-sm text-cyber-muted/70">
              {user.bio}
            </p>
          )}
          <p className="mt-1 text-xs text-cyber-muted/50">
            {type === 'followers' ? '关注于' : '关注了'} •{' '}
            {new Date(user.followed_at).toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>

      {/* Follow Button */}
      <FollowButton userId={user.user_id} variant="secondary" size="sm" />
    </motion.div>
  );
};

export default FollowersList;
