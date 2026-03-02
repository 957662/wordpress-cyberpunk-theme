/**
 * CyberDataTable - 赛博朋克风格数据表格组件
 *
 * 用于展示结构化数据的表格组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface Column<T> {
  key: string;
  title: string;
  width?: string | number;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface CyberDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  /** 行唯一标识字段 */
  rowKey: keyof T;
  /** 是否可点击行 */
  clickable?: boolean;
  /** 行点击事件 */
  onRowClick?: (record: T, index: number) => void;
  /** 是否显示斑马纹 */
  striped?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否悬停高亮 */
  hoverable?: boolean;
  /** 空状态提示 */
  emptyText?: string;
  /** 额外的类名 */
  className?: string;
}

export function CyberDataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  rowKey,
  clickable = false,
  onRowClick,
  striped = true,
  bordered = true,
  hoverable = true,
  emptyText = '暂无数据',
  className,
}: CyberDataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 处理排序
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const key = column.key;
    if (sortColumn === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortOrder('asc');
    }
  };

  // 排序数据
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (aVal === bVal) return 0;

    const comparison = aVal < bVal ? -1 : 1;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 获取单元格值
  const getCellValue = (record: T, column: Column<T>, index: number) => {
    const value = record[column.key];
    return column.render ? column.render(value, record, index) : value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        {/* 表头 */}
        <thead>
          <tr className="border-b border-cyber-border">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-sm font-semibold text-gray-300',
                  column.sortable && 'cursor-pointer hover:text-cyber-cyan transition-colors'
                )}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center gap-2">
                  {column.title}
                  {column.sortable && sortColumn === column.key && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-cyber-cyan"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </motion.span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* 表体 */}
        <tbody>
          {sortedData.map((record, rowIndex) => (
            <motion.tr
              key={String(record[rowKey])}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className={cn(
                'border-b border-cyber-border/50 transition-colors',
                striped && rowIndex % 2 === 0 && 'bg-cyber-muted/30',
                hoverable && 'hover:bg-cyber-muted/50',
                clickable && 'cursor-pointer',
                clickable && onRowClick && 'hover:shadow-lg hover:shadow-cyber-cyan/10'
              )}
              onClick={() => clickable && onRowClick?.(record, rowIndex)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-sm text-gray-400"
                >
                  {getCellValue(record, column, rowIndex)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * CyberDataTablePagination - 带分页的数据表格
 */
export interface CyberDataTablePaginationProps<T> extends CyberDataTableProps<T> {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function CyberDataTablePagination<T extends Record<string, any>>({
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  ...tableProps
}: CyberDataTablePaginationProps<T>) {
  const totalPages = Math.ceil(total / pageSize);

  const paginationItems = [];
  const showPages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  return (
    <div className="space-y-4">
      <CyberDataTable {...tableProps} />

      {/* 分页 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          共 {total} 条记录，第 {currentPage} / {totalPages} 页
        </div>

        <div className="flex items-center gap-2">
          {/* 页面大小选择 */}
          {onPageSizeChange && (
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1 bg-cyber-card border border-cyber-border rounded text-sm text-gray-300 focus:outline-none focus:border-cyber-cyan"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} 条/页
                </option>
              ))}
            </select>
          )}

          {/* 分页按钮 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                'px-3 py-1 rounded border border-cyber-border text-sm',
                currentPage === 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan'
              )}
            >
              上一页
            </button>

            {startPage > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-1 rounded border border-cyber-border text-sm text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan"
                >
                  1
                </button>
                {startPage > 2 && <span className="px-2 text-gray-600">...</span>}
              </>
            )}

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  'px-3 py-1 rounded border text-sm',
                  page === currentPage
                    ? 'border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan'
                    : 'border-cyber-border text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan'
                )}
              >
                {page}
              </button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="px-2 text-gray-600">...</span>}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-1 rounded border border-cyber-border text-sm text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                'px-3 py-1 rounded border border-cyber-border text-sm',
                currentPage === totalPages
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan'
              )}
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
