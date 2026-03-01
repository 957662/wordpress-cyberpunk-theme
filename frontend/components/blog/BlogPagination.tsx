'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 mt-12"
    >
      {/* 上一页 */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'p-2 rounded-lg border transition-all',
          currentPage === 1
            ? 'border-cyber-border text-gray-600 cursor-not-allowed'
            : 'border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan'
        )}
        whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        aria-label="上一页"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* 页码 */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <motion.button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
            className={cn(
              'min-w-[40px] h-10 rounded-lg border transition-all font-mono text-sm',
              page === currentPage
                ? 'border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan'
                : typeof page === 'number'
                ? 'border-cyber-border text-gray-400 hover:border-cyber-cyan/50 hover:text-cyber-cyan'
                : 'border-transparent text-gray-600 cursor-default'
            )}
            whileHover={
              typeof page === 'number' && page !== currentPage
                ? { scale: 1.05, borderColor: '#00f0ff' }
                : {}
            }
            whileTap={typeof page === 'number' ? { scale: 0.95 } : {}}
          >
            {page}
          </motion.button>
        ))}
      </div>

      {/* 下一页 */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-2 rounded-lg border transition-all',
          currentPage === totalPages
            ? 'border-cyber-border text-gray-600 cursor-not-allowed'
            : 'border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan'
        )}
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        aria-label="下一页"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
