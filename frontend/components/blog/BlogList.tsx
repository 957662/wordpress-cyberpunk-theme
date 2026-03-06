'use client';

import React, { useState } from 'react';
import { BlogCard } from './BlogCard';
import { Pagination } from '../pagination';
import type { BlogPost } from '@/types/models';
import { cn } from '@/lib/utils';

export interface BlogListProps {
  posts: BlogPost[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
}

export function BlogList({
  posts,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSize = 10,
  emptyMessage = '暂无文章',
  className,
}: BlogListProps) {
  const [pageSizeState, setPageSizeState] = useState(pageSize);

  const handlePageSizeChange = (newSize: number) => {
    setPageSizeState(newSize);
    onPageSizeChange?.(newSize);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: pageSizeState }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-64"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">暂无文章</h3>
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 文章列表 */}
      <div className="space-y-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
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

export default BlogList;
