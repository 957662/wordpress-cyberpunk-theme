/**
 * 分页组件
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

// ============================================================================
// Components
// ============================================================================

/**
 * 分页组件
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  // 计算可见的页码范围
  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // 调整起始页,确保总是显示 maxVisiblePages 个页码
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)} aria-label="分页导航">
      {/* 首页按钮 */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrev}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
            hasPrev
              ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
              : 'cursor-not-allowed bg-gray-900 text-gray-600'
          )}
          aria-label="首页"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      )}

      {/* 上一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
          hasPrev
            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            : 'cursor-not-allowed bg-gray-900 text-gray-600'
        )}
        aria-label="上一页"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* 页码按钮 */}
      <div className="flex items-center gap-1">
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="flex h-10 items-center justify-center px-2 text-gray-600">
                ...
              </span>
            )}
          </>
        )}

        {visiblePages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-cyber-cyan text-black shadow-lg shadow-cyber-cyan/20'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            )}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="flex h-10 items-center justify-center px-2 text-gray-600">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* 下一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
          hasNext
            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            : 'cursor-not-allowed bg-gray-900 text-gray-600'
        )}
        aria-label="下一页"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* 末页按钮 */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
            hasNext
              ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
              : 'cursor-not-allowed bg-gray-900 text-gray-600'
          )}
          aria-label="末页"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
}

/**
 * 简单分页组件
 */
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          hasPrev
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'cursor-not-allowed bg-gray-900 text-gray-600'
        )}
      >
        上一页
      </button>

      <span className="text-sm text-gray-400">
        第 {currentPage} / {totalPages} 页
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          hasNext
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'cursor-not-allowed bg-gray-900 text-gray-600'
        )}
      >
        下一页
      </button>
    </div>
  );
}

/**
 * 加载更多分页
 */
export function LoadMorePagination({
  currentPage,
  totalPages,
  onLoadMore,
  isLoading,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onLoadMore: () => void;
  isLoading?: boolean;
  className?: string;
}) {
  const hasMore = currentPage < totalPages;

  if (!hasMore) {
    return (
      <div className={cn('text-center text-sm text-gray-500', className)}>
        没有更多内容了
      </div>
    );
  }

  return (
    <div className={cn('flex justify-center', className)}>
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className={cn(
          'rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-gray-300',
          'hover:bg-gray-700 transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {isLoading ? '加载中...' : '加载更多'}
      </button>
    </div>
  );
}

export default Pagination;
