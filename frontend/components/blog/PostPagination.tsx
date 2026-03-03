/**
 * PostPagination Component
 * 文章分页组件
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  baseUrl?: string;
  onPageChange?: (page: number) => void;
  showFirstLast?: boolean;
  showTotal?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function PostPagination({
  currentPage,
  totalPages,
  total,
  perPage,
  baseUrl = '',
  onPageChange,
  showFirstLast = true,
  showTotal = true,
  maxVisiblePages = 5,
  className = '',
}: PostPaginationProps) {
  // 生成页码数组
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // 调整开始和结束页码，确保显示 maxVisiblePages 个页码
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    // 添加第一页
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 添加最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // 创建页码 URL
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // 处理页码点击
  const handlePageClick = (page: number) => {
    if (onPageChange && page !== currentPage) {
      onPageChange(page);
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 分页按钮样式
  const buttonStyles = `
    px-4 py-2 rounded-lg border border-cyber-cyan/30
    text-cyber-cyan hover:bg-cyber-cyan/10
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const activeButtonStyles = `
    px-4 py-2 rounded-lg border border-cyber-cyan
    bg-cyber-cyan/20 text-cyber-cyan
  `;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* 总数信息 */}
      {showTotal && (
        <div className="text-sm text-cyber-text-secondary">
          Showing {(currentPage - 1) * perPage + 1} to{' '}
          {Math.min(currentPage * perPage, total)} of {total} posts
        </div>
      )}

      {/* 分页按钮 */}
      <nav className="flex items-center gap-2" aria-label="Pagination">
        {/* 第一页按钮 */}
        {showFirstLast && (
          <Link
            href={createPageUrl(1)}
            className={buttonStyles}
            aria-label="First page"
            onClick={() => handlePageClick(1)}
            tabIndex={isFirstPage ? -1 : 0}
            aria-disabled={isFirstPage}
          >
            <ChevronsLeft className="w-5 h-5" />
          </Link>
        )}

        {/* 上一页按钮 */}
        <Link
          href={createPageUrl(Math.max(1, currentPage - 1))}
          className={buttonStyles}
          aria-label="Previous page"
          onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
          tabIndex={isFirstPage ? -1 : 0}
          aria-disabled={isFirstPage}
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* 页码按钮 */}
        <div className="hidden sm:flex items-center gap-2">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-cyber-text-tertiary">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <Link
                key={page}
                href={createPageUrl(page as number)}
                className={isActive ? activeButtonStyles : buttonStyles}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handlePageClick(page as number)}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {/* 移动端显示当前页/总页数 */}
        <div className="sm:hidden px-4 py-2 text-cyber-text-tertiary">
          {currentPage} / {totalPages}
        </div>

        {/* 下一页按钮 */}
        <Link
          href={createPageUrl(Math.min(totalPages, currentPage + 1))}
          className={buttonStyles}
          aria-label="Next page"
          onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
          tabIndex={isLastPage ? -1 : 0}
          aria-disabled={isLastPage}
        >
          <ChevronRight className="w-5 h-5" />
        </Link>

        {/* 最后一页按钮 */}
        {showFirstLast && (
          <Link
            href={createPageUrl(totalPages)}
            className={buttonStyles}
            aria-label="Last page"
            onClick={() => handlePageClick(totalPages)}
            tabIndex={isLastPage ? -1 : 0}
            aria-disabled={isLastPage}
          >
            <ChevronsRight className="w-5 h-5" />
          </Link>
        )}
      </nav>
    </div>
  );
}

/**
 * LoadMorePagination Component
 * 加载更多分页组件
 */
export interface LoadMorePaginationProps {
  currentPage: number;
  totalPages: number;
  onLoadMore: () => void;
  loading?: boolean;
  className?: string;
}

export function LoadMorePagination({
  currentPage,
  totalPages,
  onLoadMore,
  loading = false,
  className = '',
}: LoadMorePaginationProps) {
  const hasMore = currentPage < totalPages;

  if (!hasMore) {
    return (
      <div className={`text-center text-cyber-text-tertiary py-8 ${className}`}>
        No more posts to load
      </div>
    );
  }

  return (
    <div className={`text-center py-8 ${className}`}>
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="cyber-button px-8 py-3 text-cyber-cyan border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : 'Load More Posts'}
      </button>
    </div>
  );
}

export default PostPagination;
