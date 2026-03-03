/**
 * 粉丝/关注列表组件
 * 显示用户的粉丝或关注列表
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, Users, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { followService, FollowListResponse, UserFollow } from '@/services/followService';
import { FollowButton } from './follow-button';
import toast from 'react-hot-toast';

interface FollowersListProps {
  userId: string;
  type: 'followers' | 'following';
  className?: string;
}

export function FollowersList({ userId, type, className }: FollowersListProps) {
  const [data, setData] = useState<FollowListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData(currentPage);
  }, [userId, type, currentPage]);

  const loadData = async (page: number) => {
    try {
      setIsLoading(true);
      const result =
        type === 'followers'
          ? await followService.getFollowersList(userId, page)
          : await followService.getFollowingList(userId, page);
      setData(result);
    } catch (error) {
      toast.error('加载失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const title = type === 'followers' ? '粉丝列表' : '关注列表';
  const emptyText = type === 'followers' ? '还没有粉丝' : '还没有关注任何人';

  if (isLoading && !data) {
    return (
      <div className={cn('flex min-h-[400px] items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyber-primary border-t-transparent" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {type === 'followers' ? (
            <Users className="h-6 w-6 text-cyber-primary" />
          ) : (
            <UserCheck className="h-6 w-6 text-cyber-primary" />
          )}
          <h2 className="text-2xl font-bold">{title}</h2>
          {data && (
            <span className="text-sm text-muted-foreground">
              共 {data.total} 人
            </span>
          )}
        </div>
      </div>

      {!data || data.items.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-cyber-border">
          <p className="text-muted-foreground">{emptyText}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between rounded-lg border border-cyber-border/50 bg-card/50 p-4 backdrop-blur-sm transition-colors hover:border-cyber-primary/50"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary">
                    {item.follower.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.follower.avatar}
                        alt={item.follower.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                        {item.follower.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {item.follower.displayName || item.follower.username}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      @{item.follower.username}
                    </p>
                  </div>
                </div>
                <FollowButton
                  userId={item.follower.id}
                  variant="outline"
                  size="sm"
                />
              </motion.div>
            ))}
          </div>

          {/* 分页 */}
          {data.total > data.pageSize && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-cyber-border px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyber-primary hover:text-cyber-primary"
              >
                上一页
              </button>
              <span className="text-sm text-muted-foreground">
                第 {currentPage} 页 / 共 {Math.ceil(data.total / data.pageSize)} 页
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(data.total / data.pageSize)}
                className="rounded-lg border border-cyber-border px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyber-primary hover:text-cyber-primary"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
