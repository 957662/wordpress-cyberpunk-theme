/**
 * ArticleGrid Component
 * 文章网格组件（网格视图）
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArticleCard } from './ArticleCard';
import type { BlogCardData } from '@/types/blog';

export interface ArticleGridProps {
  posts: BlogCardData[];
  loading?: boolean;
  error?: string | null;
  columns?: 1 | 2 | 3 | 4;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  className?: string;
}

export function ArticleGrid({
  posts,
  loading = false,
  error = null,
  columns = 3,
  showExcerpt = true,
  showAuthor = true,
  showReadingTime = true,
  className = '',
}: ArticleGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="cyber-card p-6 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="aspect-video bg-cyber-border rounded mb-4" />
            <div className="h-5 bg-cyber-border rounded mb-3" />
            <div className="h-4 bg-cyber-border rounded w-3/4 mb-2" />
            <div className="h-4 bg-cyber-border rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="cyber-card p-8 text-center">
        <div className="text-cyber-pink text-lg mb-2">加载失败</div>
        <div className="text-gray-400">{error}</div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="cyber-card p-12 text-center">
        <div className="text-gray-400 text-lg">暂无文章</div>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ArticleCard
            post={post}
            variant="grid"
            showExcerpt={showExcerpt}
            showAuthor={showAuthor}
            showReadingTime={showReadingTime}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default ArticleGrid;
