/**
 * BlogList - 优化的博客列表组件
 * 支持虚拟滚动、懒加载、无限滚动
 */

'use client';

import React, { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogCard } from './BlogCard';
import { Post } from '@/types';
import { cn } from '@/lib/utils';

export interface BlogListProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  columns?: 1 | 2 | 3;
  className?: string;
}

export const BlogListOptimized: React.FC<BlogListProps> = ({
  posts,
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  columns = 1,
  className,
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  // 无限滚动回调
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading && onLoadMore) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  // 设置 Intersection Observer
  React.useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '100px',
      threshold: 0.1,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);

  // 计算网格列数
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-red-400 text-lg mb-2">加载失败</div>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-gray-400 text-lg mb-2">暂无文章</div>
        <p className="text-gray-500 text-sm">还没有发布任何文章</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* 文章列表 */}
      <motion.div
        layout
        className={cn('grid gap-6', gridCols[columns])}
      >
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.05, 0.3),
                layout: { duration: 0.3 },
              }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 加载更多指示器 */}
      <div ref={observerTarget} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center gap-2 text-cyber-cyan">
            <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">加载中...</span>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-gray-500 text-sm">
            已加载全部文章
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListOptimized;
