'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T = any> {
  key: string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface DataGridProps<T = any> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: {
    header: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    selected: 'bg-cyan-500/20',
    hover: 'hover:bg-cyan-500/10',
    sort: 'text-cyan-400',
  },
  purple: {
    header: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    selected: 'bg-purple-500/20',
    hover: 'hover:bg-purple-500/10',
    sort: 'text-purple-400',
  },
  pink: {
    header: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    selected: 'bg-pink-500/20',
    hover: 'hover:bg-pink-500/10',
    sort: 'text-pink-400',
  },
  green: {
    header: 'bg-green-500/10 text-green-400 border-green-500/30',
    selected: 'bg-green-500/20',
    hover: 'hover:bg-green-500/10',
    sort: 'text-green-400',
  },
};

const sizeClasses = {
  sm: { cell: 'px-3 py-2 text-sm', checkbox: 'w-4 h-4' },
  md: { cell: 'px-4 py-3 text-base', checkbox: 'w-5 h-5' },
  lg: { cell: 'px-6 py-4 text-lg', checkbox: 'w-6 h-6' },
};

export function DataGrid<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  selectable = false,
  onSelectionChange,
  sortable = false,
  pagination = false,
  pageSize = 10,
  color = 'cyan',
  size = 'md',
  striped = false,
  hoverable = true,
  bordered = true,
  className,
}: DataGridProps<T>) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortable) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection, sortable]);

  // Pagination
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pagination, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = new Set(data.map(item => String(item[keyField])));
      setSelectedKeys(allKeys);
      onSelectionChange?.(data);
    } else {
      setSelectedKeys(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (key: string, checked: boolean, record: T) => {
    const newSelection = new Set(selectedKeys);

    if (checked) {
      newSelection.add(key);
    } else {
      newSelection.delete(key);
    }

    setSelectedKeys(newSelection);

    const selectedRecords = data.filter(item =>
      newSelection.has(String(item[keyField]))
    );
    onSelectionChange?.(selectedRecords);
  };

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const isAllSelected = data.length > 0 && selectedKeys.size === data.length;
  const isSomeSelected = selectedKeys.size > 0 && !isAllSelected;

  return (
    <div className={cn('w-full', className)}>
      {/* Table Container */}
      <div className={cn(
        'overflow-x-auto rounded-xl border',
        bordered && colors.header
      )}>
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className={colors.header}>
              {selectable && (
                <th className={cn('text-left', sizes.cell)}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className={cn('rounded cursor-pointer', sizes.checkbox)}
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={cn(
                    'text-left font-semibold cursor-pointer transition-all select-none',
                    sizes.cell,
                    column.sortable && sortable && 'hover:opacity-80'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {sortable && column.sortable && sortColumn === column.key && (
                      <span className={cn('text-xs', colors.sort)}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedData.map((record, rowIndex) => {
              const key = String(record[keyField]);
              const isSelected = selectedKeys.has(key);

              return (
                <tr
                  key={key}
                  className={cn(
                    'transition-all border-b border-gray-800/50',
                    striped && rowIndex % 2 === 0 && 'bg-gray-900/30',
                    hoverable && colors.hover,
                    isSelected && colors.selected
                  )}
                >
                  {selectable && (
                    <td className={cn(sizes.cell)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(key, e.target.checked, record)}
                        className={cn('rounded cursor-pointer', sizes.checkbox)}
                      />
                    </td>
                  )}
                  {columns.map(column => (
                    <td key={column.key} className={cn(sizes.cell)}>
                      {column.render
                        ? column.render(record[column.key], record, rowIndex)
                        : String(record[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Empty State */}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-12 text-gray-400"
                >
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm text-gray-400">
            共 {sortedData.length} 条记录，第 {currentPage} / {totalPages} 页
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                'px-3 py-1 rounded-lg text-sm font-medium transition-all',
                currentPage === 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : colors.hover
              )}
            >
              上一页
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-sm font-medium transition-all',
                    currentPage === pageNum
                      ? colors.selected
                      : colors.hover
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                'px-3 py-1 rounded-lg text-sm font-medium transition-all',
                currentPage === totalPages
                  ? 'text-gray-600 cursor-not-allowed'
                  : colors.hover
              )}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
