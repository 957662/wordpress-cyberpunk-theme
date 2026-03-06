/**
 * Pagination - 分页组件
 * 支持页码跳转、上一页/下一页
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  current: number;
  total: number;
  perPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisible?: number;
}

export const PaginationComponent: React.FC<PaginationProps> = ({
  current,
  total,
  perPage = 10,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisible = 7,
}) => {
  const totalPages = Math.ceil(total / perPage);

  // 计算显示的页码范围
  const getPageRange = () => {
    const range: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, current - halfVisible);
    let end = Math.min(totalPages, current + halfVisible);

    // 调整范围确保显示足够的页码
    if (end - start < maxVisible - 1) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisible - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    // 添加首页
    if (showFirstLast && start > 1) {
      range.push(1);
      if (start > 2) {
        range.push('...');
      }
    }

    // 添加页码
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // 添加尾页
    if (showFirstLast && end < totalPages) {
      if (end < totalPages - 1) {
        range.push('...');
      }
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageRange();

  return (
    <nav
      className={cn('flex items-center justify-center gap-2', className)}
      aria-label="分页导航"
    >
      {/* 上一页 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className={cn(
          'p-2 rounded-lg border transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'border-cyber-cyan/30 bg-deep-black/80',
          'hover:border-cyber-cyan hover:bg-cyber-cyan/10',
          'text-gray-400 hover:text-cyber-cyan'
        )}
        aria-label="上一页"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* 页码 */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === current;

          return (
            <motion.button
              key={pageNum}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'min-w-[40px] px-3 py-2 rounded-lg border transition-colors font-mono text-sm',
                'border-cyber-cyan/30 bg-deep-black/80',
                isActive
                  ? 'bg-cyber-cyan text-deep-black border-cyber-cyan'
                  : 'text-gray-400 hover:border-cyber-cyan hover:bg-cyber-cyan/10 hover:text-cyber-cyan'
              )}
              aria-label={`第 ${pageNum} 页`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </motion.button>
          );
        })}
      </div>

      {/* 下一页 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(Math.min(totalPages, current + 1))}
        disabled={current === totalPages}
        className={cn(
          'p-2 rounded-lg border transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'border-cyber-cyan/30 bg-deep-black/80',
          'hover:border-cyber-cyan hover:bg-cyber-cyan/10',
          'text-gray-400 hover:text-cyber-cyan'
        )}
        aria-label="下一页"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* 页码信息 */}
      <div className="hidden md:block text-sm text-gray-500 ml-4 font-mono">
        {current} / {totalPages}
      </div>
    </nav>
  );
};

export default PaginationComponent;
