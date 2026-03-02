'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  className,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }

    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
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

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  const buttonClasses = cn(
    'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const activePageClasses = cn(
    buttonClasses,
    'bg-gradient-to-r from-cyan-500 to-blue-500 border-transparent text-white'
  );

  const inactivePageClasses = cn(
    buttonClasses,
    'border-cyan-500/30 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-500/10'
  );

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)} aria-label="分页导航">
      {/* 上一页 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={inactivePageClasses}
        aria-label="上一页"
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      {/* 页码 */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="flex items-center justify-center w-10 h-10 text-gray-500">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <motion.button
            key={pageNum}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(pageNum)}
            className={isActive ? activePageClasses : inactivePageClasses}
            aria-label={`第 ${pageNum} 页`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </motion.button>
        );
      })}

      {/* 下一页 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={inactivePageClasses}
        aria-label="下一页"
      >
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </nav>
  );
};

export default Pagination;
