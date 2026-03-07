'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CyberArticleCard } from './CyberArticleCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { cn } from '@/lib/utils';
import type { BlogCardData } from '@/types/blog';

interface CyberBlogGridProps {
  posts: BlogCardData[];
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSize?: number;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showStats?: boolean;
  onPostClick?: (post: BlogCardData) => void;
  emptyMessage?: string;
  className?: string;
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export const CyberBlogGrid: React.FC<CyberBlogGridProps> = ({
  posts,
  loading = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSize = 9,
  columns = 3,
  gap = 'md',
  showExcerpt = true,
  showAuthor = true,
  showReadingTime = true,
  showStats = true,
  onPostClick,
  emptyMessage = '暂无文章',
  className,
}) => {
  // 加载状态
  if (loading) {
    return (
      <div className={cn('grid', columnClasses[columns], gapClasses[gap], className)}>
        {Array.from({ length: pageSize }).map((_, index) => (
          <LoadingState key={index} variant="card" />
        ))}
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="加载失败"
        message={error}
        action={{
          label: '重试',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  // 空状态
  if (posts.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="暂无文章"
        message={emptyMessage}
      />
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* 博客网格 */}
      <motion.div
        layout
        className={cn('grid', columnClasses[columns], gapClasses[gap])}
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CyberArticleCard
              post={post}
              showExcerpt={showExcerpt}
              showAuthor={showAuthor}
              showReadingTime={showReadingTime}
              showStats={showStats}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 分页 */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-cyber-cyan/20"
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            variant="cyber"
          />
        </motion.div>
      )}
    </div>
  );
};

export default CyberBlogGrid;
