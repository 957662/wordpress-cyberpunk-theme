/**
 * BlogPaginationEnhanced - 增强版博客分页组件
 * 支持多种分页样式和动画效果
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BlogPaginationEnhancedProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'compact' | 'minimal' | 'numbers';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function BlogPaginationEnhanced({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'default',
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
}: BlogPaginationEnhancedProps) {
  // 生成可见页码
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 第一页
    if (showFirstLast && startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 最后一页
    if (showFirstLast && endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  // 渲染默认样式的分页
  const renderDefault = () => {
    return (
      <div className={cn(
        'flex items-center justify-center gap-2 flex-wrap',
        className
      )}>
        {showPrevNext && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all',
              'border-2 border-cyber-cyan/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              currentPage === 1
                ? 'bg-cyber-dark/50 text-cyber-muted/50'
                : 'bg-cyber-dark/50 text-cyber-cyan hover:border-cyber-cyan/60 hover:bg-cyber-cyan/10'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}

        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="text-cyber-muted/50 px-2">
                ...
              </span>
            );
          }

          return (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page as number)}
              className={cn(
                'min-w-[40px] px-4 py-2 rounded-lg font-medium transition-all',
                'border-2',
                page === currentPage
                  ? 'border-cyber-cyan bg-cyber-cyan/20 text-white shadow-lg shadow-cyber-cyan/30'
                  : 'border-cyber-cyan/30 bg-cyber-dark/50 text-cyber-cyan hover:border-cyber-cyan/60 hover:bg-cyber-cyan/10'
              )}
            >
              {page}
            </motion.button>
          );
        })}

        {showPrevNext && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all',
              'border-2 border-cyber-cyan/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              currentPage === totalPages
                ? 'bg-cyber-dark/50 text-cyber-muted/50'
                : 'bg-cyber-dark/50 text-cyber-cyan hover:border-cyber-cyan/60 hover:bg-cyber-cyan/10'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </div>
    );
  };

  // 渲染紧凑样式
  const renderCompact = () => {
    return (
      <div className={cn(
        'flex items-center justify-center gap-4',
        className
      )}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-full transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-cyber-dark/50 text-cyber-cyan hover:bg-cyber-cyan/20'
          )}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-cyber-muted/60">第</span>
          <span className="px-3 py-1 bg-cyber-cyan/20 text-cyber-cyan rounded font-bold">
            {currentPage}
          </span>
          <span className="text-cyber-muted/60">/ {totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-full transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-cyber-dark/50 text-cyber-cyan hover:bg-cyber-cyan/20'
          )}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  // 渲染极简样式
  const renderMinimal = () => {
    return (
      <div className={cn(
        'flex items-center justify-center gap-6 text-sm',
        className
      )}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'text-cyber-cyan hover:text-cyber-cyan/80 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          ← 上一页
        </button>

        <div className="flex items-center gap-2">
          <span className="text-cyber-muted/60">{currentPage}</span>
          <span className="text-cyber-muted/40">/</span>
          <span className="text-cyber-muted/60">{totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'text-cyber-cyan hover:text-cyber-cyan/80 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          下一页 →
        </button>
      </div>
    );
  };

  // 渲染纯数字样式
  const renderNumbers = () => {
    return (
      <div className={cn(
        'flex items-center justify-center gap-1 flex-wrap',
        className
      )}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPageChange(page)}
            className={cn(
              'w-10 h-10 rounded-lg font-medium transition-all',
              page === currentPage
                ? 'bg-cyber-cyan text-white shadow-lg shadow-cyber-cyan/30'
                : 'bg-cyber-dark/50 text-cyber-muted/70 hover:bg-cyber-cyan/20 hover:text-cyber-cyan'
            )}
          >
            {page}
          </motion.button>
        ))}
      </div>
    );
  };

  // 根据变体渲染不同的样式
  const renderVariant = () => {
    switch (variant) {
      case 'compact':
        return renderCompact();
      case 'minimal':
        return renderMinimal();
      case 'numbers':
        return renderNumbers();
      default:
        return renderDefault();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      {renderVariant()}

      {/* 页面信息 */}
      {variant !== 'minimal' && (
        <div className="mt-4 text-center text-sm text-cyber-muted/50">
          第 {currentPage} 页，共 {totalPages} 页
        </div>
      )}
    </motion.div>
  );
}

export default BlogPaginationEnhanced;
