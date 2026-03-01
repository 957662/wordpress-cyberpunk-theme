'use client';

/**
 * 表格组件
 * 支持排序、筛选、分页的数据表格
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Column, TableProps } from '@/types';

// 排序方向
type SortDirection = 'asc' | 'desc' | null;

// 排序状态
interface SortState {
  key: string;
  direction: SortDirection;
}

// 表格组件
export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  onRowClick,
  className,
}: TableProps<T> & { className?: string }) {
  const [sort, setSort] = useState<SortState>({ key: '', direction: null });
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // 处理排序
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const key = String(column.key);
    const direction: SortDirection =
      sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';

    setSort({ key, direction });
  };

  // 排序后的数据
  const sortedData = useMemo(() => {
    if (!sort.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sort.key as keyof T];
      const bValue = b[sort.key as keyof T];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sort]);

  // 分页后的数据
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  // 渲染表头
  const renderHeader = () => (
    <thead>
      <tr className="border-b border-cyber-cyan/30">
        {columns.map((column, index) => (
          <th
            key={index}
            onClick={() => handleSort(column)}
            className={cn(
              'px-4 py-3 text-left text-sm font-semibold',
              'text-cyber-cyan',
              column.sortable && 'cursor-pointer hover:text-cyber-purple transition-colors',
              'select-none'
            )}
            style={{ width: column.width }}
          >
            <div className="flex items-center gap-2">
              {column.title}
              {column.sortable && (
                <div className="flex flex-col">
                  <ChevronUp
                    className={cn(
                      'w-3 h-3 -mb-1',
                      sort.key === String(column.key) && sort.direction === 'asc'
                        ? 'text-cyber-purple'
                        : 'text-gray-600'
                    )}
                  />
                  <ChevronDown
                    className={cn(
                      'w-3 h-3 -mt-1',
                      sort.key === String(column.key) && sort.direction === 'desc'
                        ? 'text-cyber-purple'
                        : 'text-gray-600'
                    )}
                  />
                </div>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  // 渲染单元格
  const renderCell = (column: Column<T>, record: T, index: number) => {
    const value = record[column.key as keyof T];

    if (column.render) {
      return column.render(value, record, index);
    }

    // 默认渲染
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }

    if (value instanceof Date) {
      return formatDate(value);
    }

    return String(value ?? '-');
  };

  // 渲染表格行
  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="px-4 py-8 text-center text-cyber-cyan"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              加载中...
            </div>
          </td>
        </tr>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="px-4 py-8 text-center text-gray-500"
          >
            暂无数据
          </td>
        </tr>
      );
    }

    return paginatedData.map((record, rowIndex) => (
      <motion.tr
        key={rowIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rowIndex * 0.05 }}
        onClick={() => {
          setSelectedRow(rowIndex);
          onRowClick?.(record, rowIndex);
        }}
        className={cn(
          'border-b border-gray-800 transition-colors',
          onRowClick && 'cursor-pointer hover:bg-cyber-cyan/5',
          selectedRow === rowIndex && 'bg-cyber-cyan/10'
        )}
      >
        {columns.map((column, colIndex) => (
          <td
            key={colIndex}
            className="px-4 py-3 text-sm text-gray-300"
          >
            {renderCell(column, record, rowIndex)}
          </td>
        ))}
      </motion.tr>
    ));
  };

  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="border border-cyber-cyan/30 rounded-lg overflow-hidden bg-cyber-dark/50 backdrop-blur-sm">
        <table className="w-full">
          {renderHeader()}
          <tbody>{renderRows()}</tbody>
        </table>

        {/* 分页 */}
        {pagination && !loading && data.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-cyber-cyan/30">
            <div className="text-sm text-gray-400">
              共 {data.length} 条记录，第 {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)} 页
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                disabled={pagination.current === 1}
                className={cn(
                  'px-3 py-1 rounded text-sm border transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10'
                )}
              >
                上一页
              </button>
              <button
                onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                className={cn(
                  'px-3 py-1 rounded text-sm border transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10'
                )}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Table;
