'use client';

import React, { useState } from 'react';
import { BlogCard } from './BlogCard';
import { Pagination } from '../pagination';
import type { BlogPost } from '@/types/models';
import { cn } from '@/lib/utils';

export interface BlogGridProps {
  posts: BlogPost[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSize?: number;
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
  className?: string;
}

export function BlogGrid({
  posts,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSize = 9,
  columns = 3,
  emptyMessage = '暂无文章',
  className,
}: BlogGridProps) {
  const [pageSizeState, setPageSizeState] = useState(pageSize);

  const handlePageSizeChange = (newSize: number) => {
    setPageSizeState(newSize);
    onPageSizeChange?.(newSize);
  };

  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={cn('grid gap-6', gridColumns[columns], className)}>
        {Array.from({ length: pageSizeState }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-80"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center col-span-full">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">暂无文章</h3>
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 文章网格 */}
      <div className={cn('grid gap-6', gridColumns[columns])}>
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} variant="grid" />
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSizeState}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}

export default BlogGrid;
