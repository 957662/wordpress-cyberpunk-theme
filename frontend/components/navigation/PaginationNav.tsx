import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * PaginationNav - 分页导航组件
 * 用于浏览多页内容
 */
export const PaginationNav: React.FC<PaginationNavProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg',
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage - halfVisible <= 0) {
      endPage = Math.min(totalPages, endPage + (halfVisible - (currentPage - 1)));
    }

    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, startPage - ((currentPage + halfVisible) - totalPages));
    }

    if (showFirstLast && startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (showFirstLast && endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className={cn('flex items-center space-x-1', className)}>
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            sizeClasses[size],
            'rounded-lg border border-gray-800 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentPage === 1
              ? 'text-gray-600'
              : 'text-gray-400 hover:text-white hover:border-gray-700'
          )}
        >
          首页
        </button>
      )}

      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            sizeClasses[size],
            'rounded-lg border border-gray-800 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentPage === 1
              ? 'text-gray-600'
              : 'text-gray-400 hover:text-white hover:border-gray-700'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className={cn(sizeClasses[size], 'text-gray-600')}>
              <MoreHorizontal className="w-4 h-4" />
            </span>
          );
        }

        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              sizeClasses[size],
              'rounded-lg border transition-colors',
              isActive
                ? 'bg-cyan-600 border-cyan-600 text-white'
                : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
            )}
          >
            {pageNumber}
          </button>
        );
      })}

      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            sizeClasses[size],
            'rounded-lg border border-gray-800 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentPage === totalPages
              ? 'text-gray-600'
              : 'text-gray-400 hover:text-white hover:border-gray-700'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            sizeClasses[size],
            'rounded-lg border border-gray-800 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentPage === totalPages
              ? 'text-gray-600'
              : 'text-gray-400 hover:text-white hover:border-gray-700'
          )}
        >
          末页
        </button>
      )}
    </nav>
  );
};

export default PaginationNav;
