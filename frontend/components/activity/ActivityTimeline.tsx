'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Follow, 
  Eye,
  Calendar,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Activity {
  id: string;
  type: 'like' | 'comment' | 'bookmark' | 'share' | 'follow' | 'view';
  actor: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  target?: {
    id: string;
    type: 'post' | 'comment' | 'user';
    title: string;
    slug: string;
    thumbnail?: string;
  };
  metadata?: {
    content?: string;
    timestamp?: number;
  };
  createdAt: string;
}

interface ActivityTimelineProps {
  userId?: string;
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

/**
 * 用户活动时间线组件
 * 
 * 显示用户的活动动态，包括:
 * - 点赞的文章
 * - 发表的评论
 * - 收藏的内容
 * - 分享的行为
 * - 关注的用户
 * - 浏览历史
 */
export default function ActivityTimeline({
  userId,
  limit = 20,
  showFilters = true,
  className = '',
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Activity['type'] | 'all'>('all');

  useEffect(() => {
    fetchActivities();
  }, [userId, limit]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // 这里应该调用实际的 API
      // 暂时使用模拟数据
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'like',
          actor: {
            id: 'user1',
            name: '张三',
            username: 'zhangsan',
            avatar: '/images/avatars/user1.jpg',
          },
          target: {
            id: 'post1',
            type: 'post',
            title: 'Next.js 14 App Router 完全指南',
            slug: 'nextjs-14-app-router',
            thumbnail: '/images/blog/nextjs.jpg',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          id: '2',
          type: 'comment',
          actor: {
            id: 'user1',
            name: '张三',
            username: 'zhangsan',
            avatar: '/images/avatars/user1.jpg',
          },
          target: {
            id: 'post2',
            type: 'post',
            title: 'TypeScript 高级类型系统实战',
            slug: 'typescript-advanced-types',
          },
          metadata: {
            content: '这篇文章写得非常好，对我帮助很大！',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: '3',
          type: 'bookmark',
          actor: {
            id: 'user1',
            name: '张三',
            username: 'zhangsan',
          },
          target: {
            id: 'post3',
            type: 'post',
            title: 'React Server Components 最佳实践',
            slug: 'react-server-components',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: '4',
          type: 'follow',
          actor: {
            id: 'user1',
            name: '张三',
            username: 'zhangsan',
          },
          target: {
            id: 'user2',
            type: 'user',
            title: '李四',
            slug: 'lisi',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: '5',
          type: 'share',
          actor: {
            id: 'user1',
            name: '张三',
            username: 'zhangsan',
          },
          target: {
            id: 'post4',
            type: 'post',
            title: 'Tailwind CSS 实用技巧大全',
            slug: 'tailwind-css-tips',
            thumbnail: '/images/blog/tailwind.jpg',
          },
          metadata: {
            timestamp: Date.now(),
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
      ];

      setActivities(mockActivities.slice(0, limit));
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: Activity['type']) => {
    switch (type) {
      case 'like':
        return Heart;
      case 'comment':
        return MessageSquare;
      case 'bookmark':
        return Bookmark;
      case 'share':
        return Share2;
      case 'follow':
        return Follow;
      case 'view':
        return Eye;
      default:
        return Calendar;
    }
  };

  const getColorForType = (type: Activity['type']) => {
    switch (type) {
      case 'like':
        return 'text-pink-400 bg-pink-500/10';
      case 'comment':
        return 'text-cyan-400 bg-cyan-500/10';
      case 'bookmark':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'share':
        return 'text-green-400 bg-green-500/10';
      case 'follow':
        return 'text-purple-400 bg-purple-500/10';
      case 'view':
        return 'text-gray-400 bg-gray-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getTextForType = (type: Activity['type']) => {
    switch (type) {
      case 'like':
        return '点赞了';
      case 'comment':
        return '评论了';
      case 'bookmark':
        return '收藏了';
      case 'share':
        return '分享了';
      case 'follow':
        return '关注了';
      case 'view':
        return '浏览了';
      default:
        return '互动了';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;
    
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter);

  const filterOptions: { value: Activity['type'] | 'all'; label: string; icon: any }[] = [
    { value: 'all', label: '全部', icon: Calendar },
    { value: 'like', label: '点赞', icon: Heart },
    { value: 'comment', label: '评论', icon: MessageSquare },
    { value: 'bookmark', label: '收藏', icon: Bookmark },
    { value: 'share', label: '分享', icon: Share2 },
    { value: 'follow', label: '关注', icon: Follow },
  ];

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-800" />
            <div className="flex-1">
              <div className="h-4 bg-gray-800 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">活动时间线</h2>
        
        {showFilters && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-cyan-500"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Activities */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>暂无活动记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const Icon = getIconForType(activity.type);
            const colorClass = getColorForType(activity.type);
            const actionText = getTextForType(activity.type);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 transition-colors"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Actor */}
                  <Link
                    href={`/user/${activity.actor.username}`}
                    className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {activity.actor.name}
                  </Link>

                  {/* Action */}
                  <span className="text-gray-400 mx-1">{actionText}</span>

                  {/* Target */}
                  {activity.target && (
                    <Link
                      href={
                        activity.target.type === 'post'
                          ? `/blog/${activity.target.slug}`
                          : `/user/${activity.target.slug}`
                      }
                      className="font-medium text-white hover:text-cyan-400 transition-colors"
                    >
                      {activity.target.title}
                    </Link>
                  )}

                  {/* Metadata */}
                  {activity.metadata?.content && (
                    <p className="mt-2 text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                      {activity.metadata.content}
                    </p>
                  )}

                  {/* Thumbnail */}
                  {activity.target?.thumbnail && (
                    <div className="mt-3 relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={activity.target.thumbnail}
                        alt={activity.target.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatTime(activity.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {activities.length >= limit && (
        <div className="mt-6 text-center">
          <motion.button
            className="px-6 py-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // 加载更多
            }}
          >
            加载更多
          </motion.button>
        </div>
      )}
    </div>
  );
}
