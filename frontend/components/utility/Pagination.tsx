'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisiblePages = 7
}) => {
  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // 总是显示第一页
    if (showFirstLast && currentPage > halfVisible + 1) {
      pages.push(1);
      if (currentPage > halfVisible + 2) {
        pages.push('...');
      }
    }

    // 计算起始和结束页码
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // 调整以确保始终显示 maxVisiblePages 个页码
    if (endPage - startPage < maxVisiblePages - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 总是显示最后一页
    if (showFirstLast && currentPage < totalPages - halfVisible) {
      if (currentPage < totalPages - halfVisible - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)} aria-label="分页导航">
      {/* 上一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'px-3 py-2 rounded-lg border transition-all duration-200',
          'flex items-center justify-center',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentPage === 1
            ? 'border-gray-800 text-gray-600'
            : 'border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan/50'
        )}
        aria-label="上一页"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* 页码按钮 */}
      {pageNumbers.map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={cn(
              'px-4 py-2 rounded-lg border transition-all duration-200',
              'min-w-[40px] font-medium',
              page === currentPage
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-lg shadow-cyber-cyan/20'
                : 'border-cyber-cyan/30 text-gray-400 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/50 hover:text-cyber-cyan'
            )}
            aria-label={`第 ${page} 页`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ) : (
          <span
            key={index}
            className="px-2 py-2 text-gray-500"
            aria-hidden="true"
          >
            <MoreHorizontal className="w-5 h-5" />
          </span>
        )
      ))}

      {/* 下一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'px-3 py-2 rounded-lg border transition-all duration-200',
          'flex items-center justify-center',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentPage === totalPages
            ? 'border-gray-800 text-gray-600'
            : 'border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan/50'
        )}
        aria-label="下一页"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

// 简化的分页组件（只显示上一页/下一页）
export const SimplePagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}> = ({ currentPage, totalPages, onPageChange, className }) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'px-4 py-2 rounded-lg border transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentPage === 1
            ? 'border-gray-800 text-gray-600'
            : 'border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10'
        )}
      >
        上一页
      </button>

      <span className="text-gray-400 text-sm">
        第 {currentPage} / {totalPages} 页
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'px-4 py-2 rounded-lg border transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentPage === totalPages
            ? 'border-gray-800 text-gray-600'
            : 'border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10'
        )}
      >
        下一页
      </button>
    </div>
  );
};

// 加载更多按钮
export const LoadMoreButton: React.FC<{
  onClick: () => void;
  loading?: boolean;
  hasMore: boolean;
  className?: string;
}> = ({ onClick, loading, hasMore, className }) => {
  if (!hasMore) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        没有更多内容了
      </div>
    );
  }

  return (
    <div className={cn('text-center py-8', className)}>
      <button
        onClick={onClick}
        disabled={loading}
        className={cn(
          'px-8 py-3 bg-cyber-cyan/10 border border-cyber-cyan/50 text-cyber-cyan rounded-lg',
          'hover:bg-cyber-cyan/20 transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'font-medium'
        )}
      >
        {loading ? '加载中...' : '加载更多'}
      </button>
    </div>
  );
};

export default Pagination;
