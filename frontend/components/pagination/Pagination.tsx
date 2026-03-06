'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 分页组件属性
 */
export interface PaginationProps {
  /** 当前页码 */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 每页显示的页码按钮数量 */
  siblingCount?: number;
  /** 页码变化回调 */
  onPageChange: (page: number) => void;
  /** 是否显示快速跳转（首页/末页） */
  showFastNavigation?: boolean;
  /** 是否显示页码信息 */
  showPageInfo?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 按钮变体 */
  variant?: 'default' | 'outline' | 'ghost';
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 上一页按钮文本 */
  previousLabel?: string;
  /** 下一页按钮文本 */
  nextLabel?: string;
}

/**
 * 计算要显示的页码范围
 */
function getPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | string)[] {
  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [
      ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
      '...',
      totalPages,
    ];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [
      1,
      '...',
      ...Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      ),
    ];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    return [
      1,
      '...',
      ...Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      ),
      '...',
      totalPages,
    ];
  }

  return [];
}

/**
 * 分页按钮组件
 */
interface PaginationButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function PaginationButton({
  children,
  onClick,
  disabled,
  active,
  variant = 'outline',
  size = 'md',
  className,
}: PaginationButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-200';

  const sizeStyles = {
    sm: 'h-8 min-w-[2rem] px-2 text-xs',
    md: 'h-10 min-w-[2.5rem] px-3 text-sm',
    lg: 'h-12 min-w-[3rem] px-4 text-base',
  };

  const variantStyles = {
    default: cn(
      'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-2 border-transparent',
      'hover:from-cyan-600 hover:to-purple-600',
      'shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]'
    ),
    outline: cn(
      'bg-transparent border-2 border-cyan-500 text-cyan-400',
      'hover:bg-cyan-500/10 hover:border-purple-500 hover:text-purple-400',
      active && 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-purple-500 text-white'
    ),
    ghost: cn(
      'bg-transparent text-gray-400 hover:text-cyan-400',
      active && 'bg-cyan-500/20 text-cyan-400'
    ),
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed hover:opacity-50';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        disabled && disabledStyles,
        'rounded-md',
        className
      )}
    >
      {active && (
        <motion.span
          layoutId="activePage"
          className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/**
 * 分页组件
 *
 * 提供完整的分页功能，支持页码导航、快速跳转、页码信息显示
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={(page) => setCurrentPage(page)}
 *   showFastNavigation={true}
 *   showPageInfo={true}
 * />
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  siblingCount = 1,
  onPageChange,
  showFastNavigation = true,
  showPageInfo = true,
  className,
  variant = 'outline',
  size = 'md',
  disabled = false,
  loading = false,
  previousLabel = '上一页',
  nextLabel = '下一页',
}: PaginationProps) {
  const pageRange = getPageRange(currentPage, totalPages, siblingCount);

  const handlePrevious = () => {
    if (currentPage > 1 && !disabled && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1 && !disabled && !loading) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages && !disabled && !loading) {
      onPageChange(totalPages);
    }
  };

  const isPreviousDisabled = currentPage <= 1 || disabled || loading;
  const isNextDisabled = currentPage >= totalPages || disabled || loading;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* 页码信息 */}
      {showPageInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-400"
        >
          第 <span className="text-cyan-400 font-semibold">{currentPage}</span> 页，
          共 <span className="text-purple-400 font-semibold">{totalPages}</span> 页
        </motion.div>
      )}

      {/* 分页按钮 */}
      <nav
        aria-label="分页导航"
        className="flex items-center gap-2"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4"
            >
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400">加载中...</span>
            </motion.div>
          ) : (
            <motion.div
              key="pagination"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {/* 快速回到第一页 */}
              {showFastNavigation && totalPages > 5 && (
                <PaginationButton
                  onClick={handleFirst}
                  disabled={isPreviousDisabled}
                  variant={variant}
                  size={size}
                  aria-label="第一页"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </PaginationButton>
              )}

              {/* 上一页 */}
              <PaginationButton
                onClick={handlePrevious}
                disabled={isPreviousDisabled}
                variant={variant}
                size={size}
                aria-label="上一页"
              >
                <ChevronLeft className="w-4 h-4" />
              </PaginationButton>

              {/* 页码按钮 */}
              <div className="flex items-center gap-1">
                <AnimatePresence mode="popLayout">
                  {pageRange.map((page, index) => (
                    <motion.div
                      key={typeof page === 'number' ? `page-${page}` : `dots-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      {typeof page === 'number' ? (
                        <PaginationButton
                          onClick={() => {
                            if (!disabled && !loading && page !== currentPage) {
                              onPageChange(page);
                            }
                          }}
                          disabled={disabled || loading}
                          active={page === currentPage}
                          variant={variant}
                          size={size}
                          aria-label={`第 ${page} 页`}
                          aria-current={page === currentPage ? 'page' : undefined}
                        >
                          {page}
                        </PaginationButton>
                      ) : (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* 下一页 */}
              <PaginationButton
                onClick={handleNext}
                disabled={isNextDisabled}
                variant={variant}
                size={size}
                aria-label="下一页"
              >
                <ChevronRight className="w-4 h-4" />
              </PaginationButton>

              {/* 快速跳转到最后一页 */}
              {showFastNavigation && totalPages > 5 && (
                <PaginationButton
                  onClick={handleLast}
                  disabled={isNextDisabled}
                  variant={variant}
                  size={size}
                  aria-label="最后一页"
                >
                  <ChevronsRight className="w-4 h-4" />
                </PaginationButton>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}

/**
 * 分页信息组件
 */
export interface PaginationInfoProps {
  /** 当前页码 */
  currentPage: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  totalItems: number;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 显示分页统计信息
 *
 * @example
 * ```tsx
 * <PaginationInfo
 *   currentPage={1}
 *   pageSize={10}
 *   totalItems={100}
 * />
 * // 显示: 显示 1-10 条，共 100 条
 * ```
 */
export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  className,
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn('text-sm text-gray-400', className)}>
      显示 <span className="text-cyan-400 font-semibold">{startItem}</span> -
      <span className="text-cyan-400 font-semibold"> {endItem}</span> 条，
      共 <span className="text-purple-400 font-semibold">{totalItems}</span> 条
    </div>
  );
}

/**
 * 每页条数选择器
 */
export interface PageSizeSelectorProps {
  /** 当前每页条数 */
  pageSize: number;
  /** 可选的每页条数列表 */
  options?: number[];
  /** 选择变化回调 */
  onChange: (size: number) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 每页条数选择器组件
 *
 * @example
 * ```tsx
 * <PageSizeSelector
 *   pageSize={10}
 *   onChange={(size) => setPageSize(size)}
 *   options={[10, 20, 50, 100]}
 * />
 * ```
 */
export function PageSizeSelector({
  pageSize,
  options = [10, 20, 50, 100],
  onChange,
  className,
  disabled = false,
}: PageSizeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-gray-400">每页显示</span>
      <select
        value={pageSize}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={cn(
          'px-3 py-2 text-sm rounded-md border-2 border-cyan-500/30',
          'bg-transparent text-cyan-400',
          'focus:outline-none focus:border-purple-500 focus:text-purple-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200'
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-400">条</span>
    </div>
  );
}

/**
 * 完整的分页控制栏
 */
export interface PaginationControlsProps extends PaginationProps {
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  totalItems: number;
  /** 每页条数选项 */
  pageSizeOptions?: number[];
  /** 每页条数变化回调 */
  onPageSizeChange?: (size: number) => void;
  /** 是否显示每页条数选择器 */
  showPageSizeSelector?: boolean;
}

/**
 * 完整的分页控制栏，包含分页按钮、页码信息和每页条数选择器
 *
 * @example
 * ```tsx
 * <PaginationControls
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   pageSize={pageSize}
 *   totalItems={totalItems}
 *   onPageChange={(page) => setCurrentPage(page)}
 *   onPageSizeChange={(size) => setPageSize(size)}
 *   showPageSizeSelector={true}
 * />
 * ```
 */
export function PaginationControls({
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageSizeChange,
  showPageSizeSelector = true,
  ...paginationProps
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      {/* 分页信息 */}
      <PaginationInfo
        currentPage={paginationProps.currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
      />

      {/* 右侧控制 */}
      <div className="flex items-center gap-4">
        {/* 每页条数选择器 */}
        {showPageSizeSelector && onPageSizeChange && (
          <PageSizeSelector
            pageSize={pageSize}
            options={pageSizeOptions}
            onChange={onPageSizeChange}
            disabled={paginationProps.disabled}
          />
        )}

        {/* 分页按钮 */}
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}

export default Pagination;
