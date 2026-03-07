'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showTotalItems?: boolean;
  className?: string;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize = 10,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showTotalItems = true,
  className,
  siblingCount = 1,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  // Generate page numbers to show
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always add first page
    pages.push(1);

    // Add left ellipsis if needed
    if (currentPage - siblingCount > 2) {
      pages.push('...');
    }

    // Add pages around current page
    const start = Math.max(2, currentPage - siblingCount);
    const end = Math.min(totalPages - 1, currentPage + siblingCount);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add right ellipsis if needed
    if (currentPage + siblingCount < totalPages - 1) {
      pages.push('...');
    }

    // Always add last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {/* Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        {showTotalItems && totalItems && (
          <span>
            显示 {startItem} - {endItem} 条，共 {totalItems} 条
          </span>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>每页</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>条</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1" aria-label="分页导航">
        {/* First Page */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'text-gray-600 dark:text-gray-400'
          )}
          aria-label="第一页"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'text-gray-600 dark:text-gray-400'
          )}
          aria-label="上一页"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === 'string' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    'min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    currentPage === page
                      ? 'bg-cyber-cyan text-white hover:bg-cyber-cyan/90'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile: Current / Total */}
        <div className="sm:hidden px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
          {currentPage} / {totalPages}
        </div>

        {/* Next Page */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'text-gray-600 dark:text-gray-400'
          )}
          aria-label="下一页"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'text-gray-600 dark:text-gray-400'
          )}
          aria-label="最后一页"
        >
          <ChevronsRight size={18} />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
