/**
 * CyberDataTable - 赛博朋克风格数据表格
 * 支持排序、筛选、分页等功能
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
}

interface CyberDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination?: PaginationConfig;
  loading?: boolean;
  rowKey?: keyof T | string;
  onRowClick?: (row: T, index: number) => void;
  onSort?: (key: string, order: 'asc' | 'desc' | null) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  className?: string;
}

export function CyberDataTable<T extends Record<string, any>>({
  columns,
  data,
  pagination,
  loading = false,
  rowKey = 'id',
  onRowClick,
  onSort,
  onFilter,
  onPageChange,
  className,
}: CyberDataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: 'asc' | 'desc' | null;
  }>({ key: '', order: null });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // 排序
  const handleSort = (key: string) => {
    let newOrder: 'asc' | 'desc' | null = 'asc';

    if (sortConfig.key === key) {
      if (sortConfig.order === 'asc') {
        newOrder = 'desc';
      } else if (sortConfig.order === 'desc') {
        newOrder = null;
      }
    }

    setSortConfig({ key, order: newOrder });
    onSort?.(key, newOrder);
  };

  // 筛选
  const handleFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  // 搜索
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // 获取排序图标
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key || !sortConfig.order) {
      return null;
    }
    return sortConfig.order === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // 渲染单元格
  const renderCell = (column: Column<T>, row: T, index: number) => {
    if (column.render) {
      return column.render(row[column.key as keyof T], row, index);
    }
    return row[column.key as keyof T];
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-4">
        {/* 搜索 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2',
              'bg-gray-900/50 border border-gray-700/50 rounded-lg',
              'text-gray-300 placeholder-gray-500',
              'focus:outline-none focus:border-cyan-500/50',
              'transition-colors'
            )}
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2',
              'bg-gray-800/50 border border-gray-700/50 rounded-lg',
              'text-gray-400 hover:text-gray-300',
              'hover:border-cyan-500/30',
              'transition-all flex items-center gap-2'
            )}
          >
            <Filter className="w-4 h-4" />
            <span>筛选</span>
          </motion.button>
        </div>
      </div>

      {/* 表格 */}
      <div className={cn(
        'relative overflow-x-auto rounded-lg border border-gray-700/50',
        'bg-gray-900/30 backdrop-blur-sm'
      )}>
        {/* 加载遮罩 */}
        {loading && (
          <div className={cn(
            'absolute inset-0 z-10',
            'bg-gray-900/80 backdrop-blur-sm',
            'flex items-center justify-center'
          )}>
            <div className="flex items-center gap-2 text-cyan-400">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">加载中...</span>
            </div>
          </div>
        )}

        <table className="w-full">
          {/* 表头 */}
          <thead>
            <tr className={cn(
              'border-b border-gray-700/50',
              'bg-gray-800/30'
            )}>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={cn(
                    'px-6 py-4 text-left',
                    'text-sm font-semibold text-gray-400',
                    'select-none'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(String(column.key))}
                        className={cn(
                          'flex items-center justify-center',
                          'hover:text-cyan-400 transition-colors',
                          sortConfig.key === String(column.key) && 'text-cyan-400'
                        )}
                      >
                        {getSortIcon(String(column.key))}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {/* 操作列 */}
              <th className="w-12 px-4 py-4" />
            </tr>
          </thead>

          {/* 表体 */}
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={String(row[rowKey])}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => onRowClick?.(row, index)}
                className={cn(
                  'border-b border-gray-700/30 last:border-b-0',
                  'hover:bg-gray-800/30 transition-colors cursor-pointer',
                  'group'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4"
                  >
                    <div className="text-sm text-gray-300">
                      {renderCell(column, row, index)}
                    </div>
                  </td>
                ))}
                {/* 操作列 */}
                <td className="px-4 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // 处理操作
                    }}
                    className={cn(
                      'p-1 rounded',
                      'hover:bg-gray-700/50',
                      'opacity-0 group-hover:opacity-100',
                      'transition-all'
                  )}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </motion.tr>
            ))}

            {/* 空状态 */}
            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className={cn(
                    'px-6 py-12',
                    'text-center text-gray-500'
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg">暂无数据</p>
                    <p className="text-sm">请尝试调整搜索条件</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination && (
        <div className="flex items-center justify-between">
          {/* 信息 */}
          <div className="text-sm text-gray-500">
            共 {pagination.total} 条记录
          </div>

          {/* 分页控件 */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange?.(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current === 1}
              className={cn(
                'px-3 py-1 rounded',
                'bg-gray-800/50 border border-gray-700/50',
                'text-gray-400 hover:text-gray-300',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {/* 页码 */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => i + 1)
                .filter((page) => {
                  // 显示当前页前后2页
                  const diff = Math.abs(page - pagination.current);
                  return diff <= 2 || page === 1 || page === Math.ceil(pagination.total / pagination.pageSize);
                })
                .map((page, index, array) => {
                  // 添加省略号
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  return (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onPageChange?.(page, pagination.pageSize)}
                      className={cn(
                        'min-w-[32px] px-2 py-1 rounded',
                        'text-sm',
                        pagination.current === page
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-gray-300',
                        'transition-all'
                      )}
                    >
                      {page}
                    </motion.button>
                  );
                })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange?.(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              className={cn(
                'px-3 py-1 rounded',
                'bg-gray-800/50 border border-gray-700/50',
                'text-gray-400 hover:text-gray-300',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all'
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            {/* 每页显示 */}
            {pagination.showSizeChanger && (
              <select
                value={pagination.pageSize}
                onChange={(e) => onPageChange?.(1, Number(e.target.value))}
                className={cn(
                  'ml-4 px-3 py-1 rounded',
                  'bg-gray-800/50 border border-gray-700/50',
                  'text-gray-400 text-sm',
                  'focus:outline-none focus:border-cyan-500/50'
                )}
              >
                {pagination.pageSizeOptions?.map((size) => (
                  <option key={size} value={size}>
                    {size} 条/页
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CyberDataTable;
