'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPreviousNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPreviousNext = true,
  maxVisiblePages = 7,
  className = '',
  variant = 'default'
}) => {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage - halfVisible <= 0) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }

    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-400">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {showFirstLast && (
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            icon={<ChevronsLeft className="w-4 h-4" />}
            ariaLabel="第一页"
          />
        )}

        {showPreviousNext && (
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            icon={<ChevronLeft className="w-4 h-4" />}
            ariaLabel="上一页"
          />
        )}

        <span className="px-3 py-1 text-sm text-gray-400">
          {currentPage} / {totalPages}
        </span>

        {showPreviousNext && (
          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon={<ChevronRight className="w-4 h-4" />}
            ariaLabel="下一页"
          />
        )}

        {showFirstLast && (
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            icon={<ChevronsRight className="w-4 h-4" />}
            ariaLabel="最后一页"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* First Page */}
      {showFirstLast && (
        <PaginationButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          icon={<ChevronsLeft className="w-5 h-5" />}
          ariaLabel="第一页"
        />
      )}

      {/* Previous Page */}
      {showPreviousNext && (
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={<ChevronLeft className="w-5 h-5" />}
          ariaLabel="上一页"
        />
      )}

      {/* Page Numbers */}
      {pages[0] > 1 && (
        <>
          <PageNumber page={1} isActive={false} onClick={() => onPageChange(1)} />
          {pages[0] > 2 && (
            <div className="px-3 py-2 text-gray-500">
              <MoreHorizontal className="w-5 h-5" />
            </div>
          )}
        </>
      )}

      {pages.map(page => (
        <PageNumber
          key={page}
          page={page}
          isActive={page === currentPage}
          onClick={() => onPageChange(page)}
        />
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <div className="px-3 py-2 text-gray-500">
              <MoreHorizontal className="w-5 h-5" />
            </div>
          )}
          <PageNumber
            page={totalPages}
            isActive={false}
            onClick={() => onPageChange(totalPages)}
          />
        </>
      )}

      {/* Next Page */}
      {showPreviousNext && (
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={<ChevronRight className="w-5 h-5" />}
          ariaLabel="下一页"
        />
      )}

      {/* Last Page */}
      {showFirstLast && (
        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          icon={<ChevronsRight className="w-5 h-5" />}
          ariaLabel="最后一页"
        />
      )}
    </div>
  );
};

// Pagination Button Component
interface PaginationButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  ariaLabel: string;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  onClick,
  disabled,
  icon,
  ariaLabel
}) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`
      p-2 rounded-lg border transition-all duration-300
      ${disabled
        ? 'border-dark-border text-gray-600 cursor-not-allowed opacity-30'
        : 'border-dark-border text-gray-400 hover:border-cyber-cyan/50 hover:text-white hover:shadow-neon-cyan'
      }
    `}
  >
    {icon}
  </motion.button>
);

// Page Number Component
interface PageNumberProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

const PageNumber: React.FC<PageNumberProps> = ({ page, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
      min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all duration-300
      ${isActive
        ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-neon-cyan'
        : 'border border-dark-border text-gray-400 hover:border-cyber-cyan/50 hover:text-white'
      }
    `}
  >
    {page}
  </motion.button>
);

// Pagination with Info
interface PaginationWithInfoProps extends PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  showInfo?: boolean;
}

export const PaginationWithInfo: React.FC<PaginationWithInfoProps> = ({
  totalItems,
  itemsPerPage,
  showInfo = true,
  ...paginationProps
}) => {
  const startItem = (paginationProps.currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(paginationProps.currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {showInfo && (
        <div className="text-sm text-gray-500">
          显示 <span className="text-white font-medium">{startItem}</span> 到{' '}
          <span className="text-white font-medium">{endItem}</span> 条，
          共 <span className="text-white font-medium">{totalItems}</span> 条
        </div>
      )}

      <Pagination {...paginationProps} />
    </div>
  );
};

export default Pagination;
