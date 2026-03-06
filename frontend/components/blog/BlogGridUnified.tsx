/**
 * BlogGridUnified - 统一的博客网格组件
 * 优化的网格布局，支持响应式和动画
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArticleCardUnified } from './ArticleCardUnified';
import { Post } from '@/types';
import { cn } from '@/lib/utils';

export interface BlogGridUnifiedProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  cardVariant?: 'default' | 'compact' | 'featured' | 'minimal';
  showLoadMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
  className?: string;
}

export const BlogGridUnified: React.FC<BlogGridUnifiedProps> = ({
  posts,
  loading = false,
  error = null,
  columns = 3,
  gap = 'md',
  cardVariant = 'compact',
  showLoadMore = false,
  hasMore = false,
  onLoadMore,
  emptyMessage = '暂无文章',
  className,
}) => {
  // 计算网格列数
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  // 计算间距
  const gapSize = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
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

  // 骨架屏
  if (loading && posts.length === 0) {
    const skeletonCount = columns * 2;
    return (
      <div className={cn('grid', gridCols[columns], gapSize[gap], className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="bg-deep-black/80 border border-cyber-cyan/20 rounded-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-cyber-cyan/10" />
            <div className="p-6 space-y-3">
              <div className="h-3 bg-cyber-cyan/10 rounded w-1/4" />
              <div className="h-5 bg-cyber-cyan/10 rounded w-full" />
              <div className="h-4 bg-cyber-cyan/10 rounded w-2/3" />
              <div className="h-3 bg-cyber-cyan/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* 文章网格 */}
      <motion.div
        layout
        className={cn('grid', gridCols[columns], gapSize[gap])}
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: Math.min(index * 0.05, 0.3),
              layout: { duration: 0.3 },
            }}
          >
            <ArticleCardUnified
              post={post}
              variant={cardVariant}
              showStats={false}
              showExcerpt={cardVariant !== 'minimal'}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 加载更多按钮 */}
      {showLoadMore && (
        <div className="flex justify-center mt-8">
          {hasMore ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLoadMore}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-colors font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '加载中...' : '加载更多'}
            </motion.button>
          ) : (
            <div className="text-gray-500 text-sm font-mono">
              —— 没有更多了 ——
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogGridUnified;
