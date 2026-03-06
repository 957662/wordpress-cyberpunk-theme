/**
 * BlogGrid - 优化的博客网格组件
 * 支持响应式布局、动画过渡
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from './BlogCard';
import { Post } from '@/types';
import { cn } from '@/lib/utils';

export interface BlogGridProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BlogGridOptimized: React.FC<BlogGridProps> = ({
  posts,
  loading = false,
  error = null,
  columns = 3,
  gap = 'md',
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

  // 骨架屏
  if (loading && posts.length === 0) {
    return (
      <div className={cn('grid', gridCols[columns], gapSize[gap], className)}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-deep-black/80 border border-cyber-cyan/20 rounded-lg overflow-hidden"
          >
            <div className="aspect-video bg-cyber-cyan/10 animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-cyber-cyan/10 rounded animate-pulse w-1/3" />
              <div className="h-6 bg-cyber-cyan/10 rounded animate-pulse w-full" />
              <div className="h-4 bg-cyber-cyan/10 rounded animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={cn('grid', gridCols[columns], gapSize[gap], className)}
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
          <BlogCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BlogGridOptimized;
