/**
 * BlogListUnified - 统一的博客列表组件
 * 支持无限滚动、分页、虚拟化
 */

'use client';

import React, { useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticleCardUnified } from './ArticleCardUnified';
import { Post } from '@/types';
import { cn } from '@/lib/utils';
import { LoadingState } from './LoadingState';

export interface BlogListUnifiedProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  layout?: 'list' | 'grid';
  columns?: 1 | 2 | 3;
  showLoadMore?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const BlogListUnified: React.FC<BlogListUnifiedProps> = ({
  posts,
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  layout = 'list',
  columns = 1,
  showLoadMore = false,
  emptyMessage = '暂无文章',
  className,
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [localLoading, setLocalLoading] = useState(false);

  // 无限滚动回调
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading && !localLoading && onLoadMore) {
        setLocalLoading(true);
        onLoadMore();
        setTimeout(() => setLocalLoading(false), 1000);
      }
    },
    [hasMore, loading, localLoading, onLoadMore]
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

  // 处理加载更多
  const handleLoadMore = () => {
    if (!loading && !localLoading && hasMore && onLoadMore) {
      setLocalLoading(true);
      onLoadMore();
      setTimeout(() => setLocalLoading(false), 1000);
    }
  };

  // 计算网格列数
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  // 错误状态
  if (error && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">加载失败</h3>
        <p className="text-gray-400 text-sm text-center max-w-md">{error}</p>
      </div>
    );
  }

  // 空状态
  if (posts.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-cyber-cyan/10 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-cyber-cyan"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">暂无内容</h3>
        <p className="text-gray-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* 文章列表/网格 */}
      <motion.div
        layout
        className={cn(
          'gap-6',
          layout === 'grid' && gridCols[columns],
          layout === 'list' && 'grid-cols-1'
        )}
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
              <ArticleCardUnified
                post={post}
                variant={layout === 'list' ? 'default' : 'compact'}
                showStats={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 加载更多指示器 */}
      <div ref={observerTarget} className="flex flex-col items-center justify-center py-8 gap-4">
        {/* 加载中 */}
        {(loading || localLoading) && (
          <div className="flex items-center gap-3">
            <LoadingState type="spinner" size="sm" />
            <span className="text-sm text-gray-400">加载中...</span>
          </div>
        )}

        {/* 手动加载更多按钮 */}
        {showLoadMore && hasMore && !loading && !localLoading && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLoadMore}
            className="px-6 py-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-colors font-mono text-sm"
          >
            加载更多
          </motion.button>
        )}

        {/* 没有更多 */}
        {!hasMore && posts.length > 0 && (
          <div className="text-gray-500 text-sm font-mono">
            —— 没有更多了 ——
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListUnified;
