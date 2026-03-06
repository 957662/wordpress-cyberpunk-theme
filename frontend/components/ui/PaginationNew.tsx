/**
 * 分页组件 - 增强版
 * 支持多种分页模式和样式
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  // 当前页码
  currentPage: number;
  // 总页数
  totalPages: number;
  // 每页条目数
  pageSize?: number;
  // 总条目数
  totalItems?: number;
  // 页码变化回调
  onPageChange: (page: number) => void;
  // 每页条目数变化回调
  onPageSizeChange?: (size: number) => void;
  // 显示的页码数量
  siblingCount?: number;
  // 是否显示边界页码
  showBoundaryCount?: number;
  // 是否禁用
  disabled?: boolean;
  // 样式变体
  variant?: 'default' | 'outline' | 'ghost' | 'neon';
  // 颜色主题
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  // 尺寸
  size?: 'sm' | 'md' | 'lg';
  // 是否显示快速跳转
  showQuickJump?: boolean;
  // 是否显示页码选择器
  showPageSelector?: boolean;
  // 是否显示总数信息
  showTotal?: boolean;
  // 自定义类名
  className?: string;
}

// 计算显示的页码范围
const calculatePageRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
  showBoundaryCount: number = 1
): (number | 'dots')[] => {
  const pages: (number | 'dots')[] = [];

  // 左边界
  for (let i = 1; i <= showBoundaryCount; i++) {
    if (i <= totalPages) pages.push(i);
  }

  // 左省略号
  const leftSiblingIndex = Math.max(currentPage - siblingCount, showBoundaryCount + 1);
  if (leftSiblingIndex > showBoundaryCount + 1) {
    pages.push('dots');
  }

  // 当前页附近的页码
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPages - showBoundaryCount
  );

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i > 0 && i <= totalPages) {
      pages.push(i);
    }
  }

  // 右省略号
  if (rightSiblingIndex < totalPages - showBoundaryCount) {
    pages.push('dots');
  }

  // 右边界
  for (let i = Math.max(totalPages - showBoundaryCount + 1, showBoundaryCount + 1); i <= totalPages; i++) {
    if (i > 0) pages.push(i);
  }

  return pages;
};

export const PaginationNew: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  siblingCount = 1,
  showBoundaryCount = 1,
  disabled = false,
  variant = 'default',
  color = 'cyan',
  size = 'md',
  showQuickJump = false,
  showPageSelector = false,
  showTotal = false,
  className = '',
}) => {
  const [jumpPage, setJumpPage] = useState('');

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const colorClasses = {
    cyan: 'hover:bg-cyber-cyan/10 text-cyber-cyan',
    purple: 'hover:bg-cyber-purple/10 text-cyber-purple',
    pink: 'hover:bg-cyber-pink/10 text-cyber-pink',
    green: 'hover:bg-cyber-green/10 text-cyber-green',
    yellow: 'hover:bg-cyber-yellow/10 text-cyber-yellow',
  };

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && !disabled) {
      onPageChange(page);
    }
  }, [currentPage, totalPages, disabled, onPageChange]);

  const handleJumpPage = useCallback(() => {
    const page = parseInt(jumpPage);
    if (!isNaN(page)) {
      handlePageChange(page);
      setJumpPage('');
    }
  }, [jumpPage, handlePageChange]);

  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    if (onPageSizeChange && !isNaN(newSize)) {
      onPageSizeChange(newSize);
    }
  }, [onPageSizeChange]);

  // 计算当前显示的条目范围
  const startItem = totalItems ? (currentPage - 1) * pageSize! + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize!, totalItems) : 0;

  const pageRange = calculatePageRange(
    currentPage,
    totalPages,
    siblingCount,
    showBoundaryCount
  );

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* 总数信息 */}
      {showTotal && totalItems && pageSize && (
        <div className="text-sm text-gray-400">
          显示 {startItem} - {endItem} 条，共 {totalItems} 条
        </div>
      )}

      {/* 分页控件 */}
      <div className="flex items-center gap-2">
        {/* 每页条目数选择器 */}
        {onPageSizeChange && pageSize && (
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={disabled}
            className={`px-3 py-2 bg-cyber-dark border border-cyber-border rounded text-white text-sm focus:outline-none focus:border-${color}-500 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value={10}>10 条/页</option>
            <option value={20}>20 条/页</option>
            <option value={50}>50 条/页</option>
            <option value={100}>100 条/页</option>
          </select>
        )}

        {/* 上一页按钮 */}
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          variant={variant}
          size={size}
          className={colorClasses[color]}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* 页码按钮 */}
        <div className="flex items-center gap-1">
          {pageRange.map((page, index) => {
            if (page === 'dots') {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-2 py-2 text-gray-500"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={disabled}
                variant={isActive ? 'default' : variant}
                size={size}
                className={`${sizeClasses[size]} ${
                  isActive
                    ? `bg-${color}-500 text-white`
                    : colorClasses[color]
                }`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* 下一页按钮 */}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          variant={variant}
          size={size}
          className={colorClasses[color]}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* 快速跳转 */}
        {showQuickJump && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-400">跳至</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJumpPage()}
              disabled={disabled}
              className={`w-16 px-2 py-2 bg-cyber-dark border border-cyber-border rounded text-white text-sm text-center focus:outline-none focus:border-${color}-500 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder="页"
            />
            <span className="text-sm text-gray-400">页</span>
            <Button
              onClick={handleJumpPage}
              disabled={disabled || !jumpPage}
              variant="outline"
              size="sm"
              className={colorClasses[color]}
            >
              跳转
            </Button>
          </div>
        )}

        {/* 页码选择器 */}
        {showPageSelector && (
          <select
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value))}
            disabled={disabled}
            className={`px-3 py-2 bg-cyber-dark border border-cyber-border rounded text-white text-sm focus:outline-none focus:border-${color}-500 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                第 {page} 页
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default PaginationNew;
