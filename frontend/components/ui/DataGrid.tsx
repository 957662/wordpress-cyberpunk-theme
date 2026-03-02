/**
 * DataGrid - 数据表格组件
 * 支持排序、筛选、分页等功能
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataGrid<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  sortable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = '暂无数据',
  className,
  onRowClick,
  onSort,
}: DataGridProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const processedData = useMemo(() => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter(row =>
        columns.some(col => {
          const value = row[col.key as keyof T];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = aVal > bVal ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pagination, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !sortable) return;

    const key = column.key as string;
    let newDirection: SortDirection = 'asc';

    if (sortColumn === key) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
        setSortColumn(null);
        setSortDirection(null);
        return;
      }
    }

    setSortColumn(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-cyber-cyan rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {filterable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-cyber-cyan/30">
        <table className="w-full">
          <thead>
            <tr className="bg-cyber-dark/80 border-b border-cyber-cyan/30">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-semibold text-cyber-cyan whitespace-nowrap',
                    column.sortable && sortable && 'cursor-pointer hover:bg-cyber-cyan/10 transition-colors',
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            'w-3 h-3 -mb-1',
                            sortColumn === column.key && sortDirection === 'asc'
                              ? 'text-cyber-cyan'
                              : 'text-gray-500'
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            'w-3 h-3 -mt-1',
                            sortColumn === column.key && sortDirection === 'desc'
                              ? 'text-cyber-cyan'
                              : 'text-gray-500'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <motion.tr
                    key={String(row[keyField])}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: rowIndex * 0.05 }}
                    className={cn(
                      'border-b border-cyber-cyan/20 hover:bg-cyber-cyan/5 transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row, rowIndex)}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn('px-4 py-3 text-sm text-gray-300', column.className)}
                      >
                        {column.render
                          ? column.render(row[column.key as keyof T], row, rowIndex)
                          : String(row[column.key as keyof T] ?? '')}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            显示 {Math.min((currentPage - 1) * pageSize + 1, processedData.length)} -{' '}
            {Math.min(currentPage * pageSize, processedData.length)} 条，共 {processedData.length} 条
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-cyber-dark border border-cyber-cyan/30 rounded text-cyber-cyan disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyber-cyan/10 transition-colors"
            >
              上一页
            </motion.button>
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
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    'px-3 py-1 border border-cyber-cyan/30 rounded transition-colors',
                    currentPage === pageNum
                      ? 'bg-cyber-cyan text-cyber-dark'
                      : 'bg-cyber-dark text-cyber-cyan hover:bg-cyber-cyan/10'
                  )}
                >
                  {pageNum}
                </motion.button>
              );
            })}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-cyber-dark border border-cyber-cyan/30 rounded text-cyber-cyan disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyber-cyan/10 transition-colors"
            >
              下一页
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
