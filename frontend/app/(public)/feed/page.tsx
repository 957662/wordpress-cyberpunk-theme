'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Rss,
  Clock,
  TrendingUp,
  User,
  MessageCircle,
  Heart,
  Bookmark,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingState } from '@/components/loading/LoadingState';
import Link from 'next/link';
import Image from 'next/image';

export interface FeedItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'follow' | 'bookmark';
  actor: {
    id: string;
    name: string;
    avatar?: string;
  };
  target?: {
    id: string;
    title: string;
    excerpt?: string;
    slug?: string;
  };
  createdAt: string;
  content?: string;
}

export interface FeedPageProps {}

export default function FeedPage({}: FeedPageProps) {
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'posts' | 'comments' | 'likes' | 'follows'>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    const loadFeed = () => {
      setLoading(true);
      setTimeout(() => {
        setFeedItems([
          {
            id: '1',
            type: 'post',
            actor: {
              id: 'user-1',
              name: '张三',
              avatar: '/avatars/user-1.jpg',
            },
            target: {
              id: 'post-1',
              title: '深入理解 TypeScript 高级类型',
              excerpt: 'TypeScript 的类型系统非常强大...',
              slug: 'understanding-typescript-advanced-types',
            },
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            type: 'comment',
            actor: {
              id: 'user-2',
              name: '李四',
            },
            target: {
              id: 'post-2',
              title: 'Next.js 14 App Router 完全指南',
              slug: 'nextjs-14-app-router-guide',
            },
            content: '这篇文章写得太好了！完全解决了我对 App Router 的困惑。',
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            type: 'like',
            actor: {
              id: 'user-3',
              name: '王五',
            },
            target: {
              id: 'post-3',
              title: '赛博朋克设计系统实践',
              slug: 'cyberpunk-design-system',
            },
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          },
          {
            id: '4',
            type: 'follow',
            actor: {
              id: 'user-4',
              name: '赵六',
            },
            createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          },
          {
            id: '5',
            type: 'bookmark',
            actor: {
              id: 'user-5',
              name: '孙七',
            },
            target: {
              id: 'post-4',
              title: 'React Server Components 最佳实践',
              slug: 'react-server-components-best-practices',
            },
            createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          },
        ]);
        setLoading(false);
      }, 1000);
    };

    loadFeed();

    // 自动刷新
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadFeed, 30000); // 每30秒刷新一次
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // 过滤动态
  const filteredItems = feedItems.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'posts') return item.type === 'post';
    if (filterType === 'comments') return item.type === 'comment';
    if (filterType === 'likes') return item.type === 'like';
    if (filterType === 'follows') return item.type === 'follow';
    return true;
  });

  // 获取动态图标和颜色
  const getFeedIcon = (type: FeedItem['type']) => {
    switch (type) {
      case 'post':
        return { icon: Rss, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
      case 'comment':
        return { icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' };
      case 'like':
        return { icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' };
      case 'follow':
        return { icon: User, color: 'text-green-400', bg: 'bg-green-500/10' };
      case 'bookmark':
        return { icon: Bookmark, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      default:
        return { icon: Rss, color: 'text-gray-400', bg: 'bg-gray-500/10' };
    }
  };

  // 获取动态文本
  const getFeedText = (item: FeedItem) => {
    switch (item.type) {
      case 'post':
        return '发布了新文章';
      case 'comment':
        return '评论了文章';
      case 'like':
        return '点赞了文章';
      case 'follow':
        return '关注了用户';
      case 'bookmark':
        return '收藏了文章';
      default:
        return '';
    }
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    return `${days} 天前`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-cyan-400" />
            <h1 className="text-5xl font-bold text-white">动态动态</h1>
          </div>
          <p className="text-gray-400 text-lg">
            关注最新的社区动态和活动
          </p>
        </motion.div>

        {/* 工具栏 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          {/* 过滤器 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                filterType === 'all'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              )}
            >
              <Filter className="w-4 h-4" />
              全部
            </button>
            <button
              onClick={() => setFilterType('posts')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                filterType === 'posts'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              )}
            >
              <Rss className="w-4 h-4" />
              文章
            </button>
            <button
              onClick={() => setFilterType('comments')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                filterType === 'comments'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              )}
            >
              <MessageCircle className="w-4 h-4" />
              评论
            </button>
            <button
              onClick={() => setFilterType('likes')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                filterType === 'likes'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              )}
            >
              <Heart className="w-4 h-4" />
              点赞
            </button>
          </div>

          {/* 自动刷新 */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
              autoRefresh
                ? 'bg-green-500/10 text-green-400 border border-green-500/50'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
            )}
          >
            <RefreshCw className={cn('w-4 h-4', autoRefresh && 'animate-spin')} />
            自动刷新
          </button>
        </motion.div>

        {/* 动态列表 */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingState type="spinner" size="lg" text="加载动态中..." />
          </div>
        ) : filteredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {filteredItems.map((item, index) => {
              const { icon: Icon, color, bg } = getFeedIcon(item.type);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex gap-4">
                    {/* 图标 */}
                    <div className={cn('flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center', bg)}>
                      <Icon className={cn('w-6 h-6', color)} />
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      {/* 用户信息和时间 */}
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/user/${item.actor.id}`}
                          className="font-semibold text-white hover:text-cyan-400 transition-colors"
                        >
                          {item.actor.name}
                        </Link>
                        <span className="text-gray-400 text-sm">
                          {getFeedText(item)}
                        </span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(item.createdAt)}
                        </span>
                      </div>

                      {/* 目标内容 */}
                      {item.target && (
                        <div className="bg-gray-800/50 rounded-lg p-4 mt-3">
                          <Link
                            href={`/blog/${item.target.slug}`}
                            className="text-white font-medium hover:text-cyan-400 transition-colors"
                          >
                            {item.target.title}
                          </Link>
                          {item.target.excerpt && (
                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                              {item.target.excerpt}
                            </p>
                          )}
                        </div>
                      )}

                      {/* 评论内容 */}
                      {item.content && (
                        <div className="bg-gray-800/50 rounded-lg p-4 mt-3">
                          <p className="text-gray-300 text-sm">{item.content}</p>
                        </div>
                      )}

                      {/* 关注信息 */}
                      {item.type === 'follow' && (
                        <div className="flex items-center gap-3 mt-3">
                          {item.actor.avatar ? (
                            <Image
                              src={item.actor.avatar}
                              alt={item.actor.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <span className="text-gray-400 text-sm">
                            开始关注你
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">暂无动态</h3>
            <p className="text-gray-400">
              {filterType !== 'all' ? '没有找到匹配的动态' : '开始关注其他用户来查看他们的动态吧！'}
            </p>
          </motion.div>
        )}

        {/* 统计信息 */}
        {!loading && filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center text-gray-400 text-sm"
          >
            显示 {filteredItems.length} 条动态
            {filterType !== 'all' && ` · 类型：${filterType}`}
            {autoRefresh && ' · 自动刷新开启'}
          </motion.div>
        )}
      </div>
    </div>
  );
}
