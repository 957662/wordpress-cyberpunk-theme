/**
 * 关注列表组件
 * 显示指定用户关注的所有用户
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { FollowUser } from '@/types/social.types';
import socialApi from '@/services/socialApi';

interface FollowingListProps {
  username: string;
  initialPage?: number;
}

/**
 * 关注列表组件
 */
export default function FollowingList({
  username,
  initialPage = 1,
}: FollowingListProps) {
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  /**
   * 加载关注列表
   */
  const loadFollowing = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      // 获取用户ID（这里需要先通过用户名获取用户ID）
      // 暂时使用模拟的用户ID
      const userId = '1';

      const response = await socialApi.getFollowing(userId, page, 20);

      if (response.success) {
        setFollowing(response.users);
        setTotalPages(Math.ceil(response.total / response.limit));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
      console.error('加载关注列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 取消关注用户
   */
  const handleUnfollow = async (userId: string) => {
    try {
      await socialApi.unfollowUser(userId);

      // 从列表中移除该用户
      setFollowing(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('取消关注失败:', err);
    }
  };

  // 加载数据
  useEffect(() => {
    loadFollowing(currentPage);
  }, [currentPage, username]);

  /**
   * 渲染用户卡片
   */
  const renderUserCard = (user: FollowUser, index: number) => (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-4 bg-cyber-dark/50 border-cyber-cyan/20 hover:border-cyber-cyan/40 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Link href={`/user/${user.username}`}>
              <Avatar
                src={user.avatar_url}
                alt={user.display_name}
                className="w-12 h-12 border-2 border-cyber-purple/50"
              />
            </Link>

            <div className="flex-1">
              <Link href={`/user/${user.username}`}>
                <h3 className="text-cyber-purple font-semibold hover:text-cyber-cyan transition-colors">
                  {user.display_name}
                </h3>
              </Link>
              <p className="text-sm text-gray-400">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-gray-300 mt-1 line-clamp-1">{user.bio}</p>
              )}
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span>{user.followers_count} 粉丝</span>
                <span>{user.following_count} 关注</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleUnfollow(user.id)}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            取消关注
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cyber-purple font-orbitron">
          关注列表
        </h2>
        <p className="text-gray-400">共关注 {following.length} 位用户</p>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-purple"></div>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      {/* 空状态 */}
      {!loading && !error && following.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">还没有关注任何人</p>
        </div>
      )}

      {/* 关注列表 */}
      {!loading && !error && following.length > 0 && (
        <div className="space-y-3">
          {following.map((user, index) => renderUserCard(user, index))}
        </div>
      )}

      {/* 分页 */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
            className="border-cyber-purple/30"
          >
            上一页
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? 'default' : 'outline'}
                className={
                  currentPage === page
                    ? 'bg-cyber-purple text-white'
                    : 'border-cyber-purple/30'
                }
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            className="border-cyber-purple/30"
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
