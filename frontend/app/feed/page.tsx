/**
 * 动态 Feed 页面
 * 显示关注用户的动态
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FeedItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'follow';
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content?: string;
  createdAt: string;
}

export default function FeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);

  // TODO: 实现 Feed 数据获取
  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      // 这里应该调用 API 获取 Feed 数据
      // const response = await fetch('/api/feed?page=' + page);
      // const data = await response.json();
      // setFeedItems(data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedItemIcon = (type: FeedItem['type']) => {
    switch (type) {
      case 'post':
        return '📝';
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'follow':
        return '👥';
      default:
        return '📌';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyber-cyan mb-2">Your Feed</h1>
            <p className="text-muted-foreground">
              See what's happening with people you follow
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchFeed}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-cyber-cyan/10 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/20 disabled:opacity-50"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Feed 内容 */}
      {isLoading && feedItems.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-cyan" />
        </div>
      ) : feedItems.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <div className="mb-4 text-6xl">🔭</div>
          <h2 className="text-xl font-bold text-foreground mb-2">No Feed Yet</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Start following people to see their activity in your feed!
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {feedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-cyber-cyan/30 bg-background/50 backdrop-blur-sm p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4">
                {/* 用户头像 */}
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  className="h-10 w-10 rounded-full"
                />

                {/* 内容 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-foreground">
                      {item.user.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                    <span className="text-lg">
                      {getFeedItemIcon(item.type)}
                    </span>
                  </div>

                  {item.content && (
                    <p className="text-sm text-foreground">{item.content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 加载更多按钮 */}
      {feedItems.length > 0 && (
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setPage(page + 1);
              fetchFeed();
            }}
            disabled={isLoading}
            className="rounded-lg bg-cyber-cyan/10 px-6 py-3 text-cyber-cyan hover:bg-cyber-cyan/20 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
}
