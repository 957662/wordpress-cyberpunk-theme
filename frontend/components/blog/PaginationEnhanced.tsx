/**
 * Enhanced Pagination Component
 * 增强型分页组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationEnhancedProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  disabled?: boolean;
}

export const PaginationEnhanced: React.FC<PaginationEnhancedProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = '',
  variant = 'default',
  disabled = false,
}) => {
  // 生成页码数组
  const generatePageNumbers = (): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    pages.push(1);

    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    if (currentPage - halfVisible <= 2) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    }

    if (currentPage + halfVisible >= totalPages - 1) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handlePageClick = (page: number | string) => {
    if (disabled) return;
    if (typeof page === 'number' && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('cyber-pagination-minimal flex items-center justify-center gap-4', className)}>
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="cyber-pagination-button-minimal"
          aria-label="上一页"
        >
          上一页
        </button>

        <span className="text-gray-400 text-sm">
          第 {currentPage} / {totalPages} 页
        </span>

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="cyber-pagination-button-minimal"
          aria-label="下一页"
        >
          下一页
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('cyber-pagination-compact flex items-center justify-center gap-2', className)}>
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="cyber-pagination-button-compact"
          aria-label="上一页"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 text-gray-500">
                  <Ellipsis className="w-4 h-4" />
                </span>
              ) : (
                <button
                  onClick={() => handlePageClick(page)}
                  disabled={disabled}
                  className={cn(
                    'cyber-pagination-number-compact',
                    currentPage === page && 'active'
                  )}
                  aria-label={`第 ${page} 页`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="cyber-pagination-button-compact"
          aria-label="下一页"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('cyber-pagination flex items-center justify-center gap-2', className)}
    >
      {showFirstLast && totalPages > maxVisiblePages && (
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1 || disabled}
          className="cyber-pagination-button"
          aria-label="首页"
        >
          首页
        </button>
      )}

      {showPrevNext && (
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="cyber-pagination-button"
          aria-label="上一页"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 text-gray-500">
                <Ellipsis className="w-5 h-5" />
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(page)}
                disabled={disabled}
                className={cn(
                  'cyber-pagination-number',
                  currentPage === page && 'active'
                )}
                aria-label={`第 ${page} 页`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {showPrevNext && (
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="cyber-pagination-button"
          aria-label="下一页"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {showFirstLast && totalPages > maxVisiblePages && (
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages || disabled}
          className="cyber-pagination-button"
          aria-label="末页"
        >
          末页
        </button>
      )}
    </motion.div>
  );
};

export default PaginationEnhanced;
