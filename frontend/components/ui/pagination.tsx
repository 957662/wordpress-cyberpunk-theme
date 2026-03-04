'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'neon' | 'holographic' | 'minimal';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  size?: 'sm' | 'md' | 'lg';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxPages?: number;
  hrefPrefix?: string;
  className?: string;
  disabled?: boolean;
}

const colorStyles = {
  cyan: {
    border: 'border-cyber-cyan/50',
    text: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/20',
    hover: 'hover:bg-cyber-cyan/30 hover:border-cyber-cyan/50',
    glow: 'shadow-lg shadow-cyber-cyan/20',
    active: 'bg-cyber-cyan text-cyber-dark border-cyber-cyan',
  },
  purple: {
    border: 'border-cyber-purple/50',
    text: 'text-cyber-purple',
    bg: 'bg-cyber-purple/20',
    hover: 'hover:bg-cyber-purple/30 hover:border-cyber-purple/50',
    glow: 'shadow-lg shadow-cyber-purple/20',
    active: 'bg-cyber-purple text-cyber-dark border-cyber-purple',
  },
  pink: {
    border: 'border-cyber-pink/50',
    text: 'text-cyber-pink',
    bg: 'bg-cyber-pink/20',
    hover: 'hover:bg-cyber-pink/30 hover:border-cyber-pink/50',
    glow: 'shadow-lg shadow-cyber-pink/20',
    active: 'bg-cyber-pink text-cyber-dark border-cyber-pink',
  },
  green: {
    border: 'border-cyber-green/50',
    text: 'text-cyber-green',
    bg: 'bg-cyber-green/20',
    hover: 'hover:bg-cyber-green/30 hover:border-cyber-green/50',
    glow: 'shadow-lg shadow-cyber-green/20',
    active: 'bg-cyber-green text-cyber-dark border-cyber-green',
  },
};

const variantStyles = {
  neon: 'border-2 bg-cyber-dark/80 backdrop-blur-sm',
  holographic: 'border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md',
  minimal: 'border border-gray-700 bg-gray-900/50',
};

const sizeStyles = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

const iconSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'neon',
  color = 'cyan',
  size = 'md',
  showFirstLast = true,
  showPrevNext = true,
  maxPages = 7,
  hrefPrefix,
  className,
  disabled = false,
}: PaginationProps) {
  const styles = colorStyles[color];

  // 生成页码范围
  const getPageRange = () => {
    const range: (number | string)[] = [];
    const half = Math.floor(maxPages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, maxPages);
    }

    if (currentPage >= totalPages - half) {
      start = Math.max(1, totalPages - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 1) {
      if (start > 2) {
        range.unshift('...');
      } else {
        range.unshift(1);
      }
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        range.push('...');
      } else {
        range.push(totalPages);
      }
    }

    return range;
  };

  const pageRange = getPageRange();

  const PageButton = ({
    page,
    isActive = false,
    isDisabled = false,
    children,
    onClick,
    href,
  }: {
    page?: number;
    isActive?: boolean;
    isDisabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
  }) => {
    const baseStyles = cn(
      'flex items-center justify-center rounded-lg transition-all duration-300',
      variantStyles[variant],
      styles.border,
      sizeStyles[size],
      isActive ? styles.active : `${styles.bg} ${styles.hover} ${styles.text}`,
      isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100'
    );

    const content = (
      <motion.button
        whileHover={isDisabled ? {} : { scale: 1.05, y: -2 }}
        whileTap={isDisabled ? {} : { scale: 0.95 }}
        onClick={onClick}
        disabled={isDisabled}
        className={baseStyles}
      >
        {children}
      </motion.button>
    );

    if (href && !isDisabled) {
      return <Link href={href}>{content}</Link>;
    }

    return content;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Pagination"
    >
      {showFirstLast && (
        <PageButton
          page={1}
          isDisabled={disabled || currentPage === 1}
          onClick={() => onPageChange(1)}
          href={hrefPrefix ? `${hrefPrefix}?page=1` : undefined}
        >
          <ChevronsLeft className={iconSizeStyles[size]} />
        </PageButton>
      )}

      {showPrevNext && (
        <PageButton
          page={currentPage - 1}
          isDisabled={disabled || currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          href={hrefPrefix ? `${hrefPrefix}?page=${currentPage - 1}` : undefined}
        >
          <ChevronLeft className={iconSizeStyles[size]} />
        </PageButton>
      )}

      {pageRange.map((page, index) => {
        if (page === '...') {
          return (
            <div
              key={`ellipsis-${index}`}
              className={cn(
                'flex items-center justify-center',
                sizeStyles[size],
                'text-gray-500'
              )}
            >
              <MoreHorizontal className={iconSizeStyles[size]} />
            </div>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <PageButton
            key={pageNum}
            page={pageNum}
            isActive={isActive}
            isDisabled={disabled}
            onClick={() => onPageChange(pageNum)}
            href={hrefPrefix ? `${hrefPrefix}?page=${pageNum}` : undefined}
          >
            {pageNum}
          </PageButton>
        );
      })}

      {showPrevNext && (
        <PageButton
          page={currentPage + 1}
          isDisabled={disabled || currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          href={hrefPrefix ? `${hrefPrefix}?page=${currentPage + 1}` : undefined}
        >
          <ChevronRight className={iconSizeStyles[size]} />
        </PageButton>
      )}

      {showFirstLast && (
        <PageButton
          page={totalPages}
          isDisabled={disabled || currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          href={hrefPrefix ? `${hrefPrefix}?page=${totalPages}` : undefined}
        >
          <ChevronsRight className={iconSizeStyles[size]} />
        </PageButton>
      )}
    </nav>
  );
}

// 简化的分页组件（只显示上一页/下一页）
export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
  disabled?: boolean;
  showPageInfo?: boolean;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  color = 'cyan',
  className,
  disabled = false,
  showPageInfo = true,
}: SimplePaginationProps) {
  const styles = colorStyles[color];

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <motion.button
        whileHover={disabled || currentPage === 1 ? {} : { scale: 1.05 }}
        whileTap={disabled || currentPage === 1 ? {} : { scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
          'border-2',
          variantStyles.neon,
          styles.border,
          styles.bg,
          styles.hover,
          styles.text,
          (disabled || currentPage === 1) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <ChevronLeft className="w-5 h-5" />
        <span>上一页</span>
      </motion.button>

      {showPageInfo && (
        <div className="text-gray-400">
          <span className="text-white font-medium">{currentPage}</span>
          <span className="mx-2">/</span>
          <span>{totalPages}</span>
        </div>
      )}

      <motion.button
        whileHover={disabled || currentPage === totalPages ? {} : { scale: 1.05 }}
        whileTap={disabled || currentPage === totalPages ? {} : { scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
          'border-2',
          variantStyles.neon,
          styles.border,
          styles.bg,
          styles.hover,
          styles.text,
          (disabled || currentPage === totalPages) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span>下一页</span>
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// 加载更多分页
export interface LoadMorePaginationProps {
  hasNextPage: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export function LoadMorePagination({
  hasNextPage,
  onLoadMore,
  isLoading = false,
  color = 'cyan',
  className,
}: LoadMorePaginationProps) {
  const styles = colorStyles[color];

  if (!hasNextPage) return null;

  return (
    <div className={cn('flex justify-center mt-8', className)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLoadMore}
        disabled={isLoading}
        className={cn(
          'px-8 py-3 rounded-lg font-medium transition-all duration-300',
          'border-2',
          variantStyles.neon,
          styles.border,
          styles.bg,
          styles.hover,
          styles.text,
          styles.glow,
          isLoading && 'opacity-70 cursor-not-allowed'
        )}
      >
        {isLoading ? '加载中...' : '加载更多'}
      </motion.button>
    </div>
  );
}

// 无限滚动触发器
export interface InfiniteScrollTriggerProps {
  hasNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function InfiniteScrollTrigger({
  hasNextPage,
  isLoading,
  onLoadMore,
  className,
}: InfiniteScrollTriggerProps) {
  const triggerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = triggerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isLoading, onLoadMore]);

  if (!hasNextPage) return null;

  return (
    <div ref={triggerRef} className={cn('py-8 text-center', className)}>
      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
          <span>加载中...</span>
        </div>
      )}
    </div>
  );
}

// 页码跳转组件
export interface PageJumperProps {
  currentPage: number;
  totalPages: number;
  onJump: (page: number) => void;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export function PageJumper({
  currentPage,
  totalPages,
  onJump,
  color = 'cyan',
  className,
}: PageJumperProps) {
  const [input, setInput] = React.useState(String(currentPage));
  const styles = colorStyles[color];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(input, 10);
    if (page >= 1 && page <= totalPages) {
      onJump(page);
    } else {
      setInput(String(currentPage));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex items-center gap-2', className)}>
      <span className="text-gray-400 text-sm">跳转到</span>
      <input
        type="number"
        min={1}
        max={totalPages}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={cn(
          'w-16 px-2 py-1 text-center rounded border-2 bg-cyber-dark/50',
          styles.border,
          'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50'
        )}
      />
      <span className="text-gray-400 text-sm">/ {totalPages}</span>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className={cn(
          'px-3 py-1 rounded text-sm font-medium transition-all duration-300',
          'border-2',
          variantStyles.neon,
          styles.border,
          styles.bg,
          styles.hover,
          styles.text
        )}
      >
        跳转
      </motion.button>
    </form>
  );
}

export default Pagination;
