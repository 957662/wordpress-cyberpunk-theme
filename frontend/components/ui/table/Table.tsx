'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  title: string;
  width?: string | number;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T, index: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  emptyMessage?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'simple' | 'bordered' | 'striped';
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = false,
  pagination,
  onRowClick,
  onSort,
  emptyMessage = '暂无数据',
  className,
  size = 'md',
  variant = 'bordered',
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  React.useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value && String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data, columns]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
    onSort?.(key, direction);

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredData(sorted);
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  };

  const variants = {
    simple: 'border-0',
    bordered: 'border border-cyber-cyan/20',
    striped: 'border border-cyber-cyan/20 even:bg-cyber-cyan/5',
  };

  return (
    <div className={cn('space-y-4', className)}>
      {searchable && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索..."
              className="w-full pl-10 pr-4 py-2 bg-cyber-darker border border-cyber-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyber-cyan/20">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'text-left font-semibold text-white whitespace-nowrap',
                    sizes[size],
                    column.className
                  )}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex flex-col items-center"
                      >
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-3 h-3 text-cyber-cyan" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-cyber-cyan" />
                          )
                        ) : (
                          <div className="flex flex-col">
                            <ChevronUp className="w-3 h-3 text-gray-600" />
                            <ChevronDown className="w-3 h-3 text-gray-600 -mt-2" />
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className={sizes[size]}>
                      <div className="h-4 bg-cyber-cyan/20 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <p className="text-gray-400">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {filteredData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'border-b border-cyber-cyan/10 transition-colors',
                      variants[variant],
                      onRowClick && 'cursor-pointer hover:bg-cyber-cyan/10'
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn('text-gray-300', sizes[size], column.className)}
                      >
                        {column.render
                          ? column.render(row[column.key], row, index)
                          : row[column.key]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">总计 {pagination.total} 条记录</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg bg-cyber-darker border border-cyber-cyan/30 text-white hover:bg-cyber-cyan/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) })
                .slice(Math.max(0, pagination.page - 2), pagination.page + 1)
                .map((_, i) => {
                  const pageNum = Math.max(1, pagination.page - 1) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => pagination.onPageChange(pageNum)}
                      className={cn(
                        'w-10 h-10 rounded-lg font-semibold transition-colors',
                        pagination.page === pageNum
                          ? 'bg-cyber-cyan text-black'
                          : 'bg-cyber-darker border border-cyber-cyan/30 text-white hover:bg-cyber-cyan/10'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
            </div>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              className="p-2 rounded-lg bg-cyber-darker border border-cyber-cyan/30 text-white hover:bg-cyber-cyan/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
