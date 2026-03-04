'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
}

export interface Action<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: 'default' | 'danger' | 'success';
  show?: (row: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  actions?: Action<T>[];
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  loading?: boolean;
  pagination?: {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onRefresh?: () => void;
  onExport?: () => void;
  emptyMessage?: string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  actions,
  searchable = true,
  filterable = true,
  sortable = true,
  selectable = false,
  onSelectionChange,
  loading = false,
  pagination,
  onRefresh,
  onExport,
  emptyMessage = '暂无数据',
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // 过滤和排序数据
  const processedData = useMemo(() => {
    let result = [...data];

    // 搜索过滤
    if (searchQuery) {
      result = result.filter((row) =>
        columns.some((column) => {
          const value = getCellValue(row, column);
          return String(value)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        })
      );
    }

    // 排序
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const column = columns.find((col) => col.id === sortColumn);
        if (!column) return 0;

        const aValue = getCellValue(a, column);
        const bValue = getCellValue(b, column);

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortColumn, sortDirection, columns]);

  // 获取单元格值
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  // 处理排序
  const handleSort = (columnId: string) => {
    if (!sortable) return;

    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // 处理选择
  const handleSelectRow = (row: T) => {
    const keyValue = String(row[keyField]);
    const newSelection = new Set(selectedRows);

    if (newSelection.has(keyValue)) {
      newSelection.delete(keyValue);
    } else {
      newSelection.add(keyValue);
    }

    setSelectedRows(newSelection);

    if (onSelectionChange) {
      const selectedData = processedData.filter((row) =>
        newSelection.has(String(row[keyField]))
      );
      onSelectionChange(selectedData);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === processedData.length) {
      setSelectedRows(new Set());
    } else {
      const allKeys = processedData.map((row) => String(row[keyField]));
      setSelectedRows(new Set(allKeys));
    }

    if (onSelectionChange) {
      if (selectedRows.size === processedData.length) {
        onSelectionChange([]);
      } else {
        onSelectionChange(processedData);
      }
    }
  };

  // 渲染排序图标
  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4 text-cyber-cyan" />;
    }
    return <ChevronDown className="w-4 h-4 text-cyber-cyan" />;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-4">
        {/* 搜索 */}
        {searchable && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索..."
              className="w-full pl-10 pr-4 py-2 bg-cyber-card border border-cyber-border
                rounded-lg text-white placeholder-gray-500
                focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              className="p-2 rounded-lg bg-cyber-card border border-cyber-border
                hover:border-cyber-cyan transition-colors"
              disabled={loading}
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </motion.button>
          )}

          {onExport && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
              className="p-2 rounded-lg bg-cyber-card border border-cyber-border
                hover:border-cyber-cyan transition-colors"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          )}

          {filterable && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-cyber-card border border-cyber-border
                hover:border-cyber-cyan transition-colors"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-cyber-card border border-cyber-border
              hover:border-cyber-cyan transition-colors"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto rounded-lg border border-cyber-border bg-cyber-card">
        <table className="w-full">
          <thead className="bg-cyber-muted">
            <tr>
              {selectable && (
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === processedData.length && processedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-cyber-border bg-cyber-card
                      text-cyber-cyan focus:ring-cyber-cyan"
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  className={cn(
                    'p-4 text-left text-sm font-medium text-gray-400',
                    'whitespace-nowrap cursor-pointer hover:text-white transition-colors',
                    column.className
                  )}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sortable && column.sortable !== false && renderSortIcon(column.id)}
                  </div>
                </th>
              ))}

              {actions && actions.length > 0 && (
                <th className="p-4 w-12">
                  <span className="sr-only">操作</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-cyber-border">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <div className="p-8 text-center text-gray-500">加载中...</div>
                </td>
              </tr>
            ) : processedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <div className="p-8 text-center text-gray-500">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              processedData.map((row, index) => (
                <motion.tr
                  key={String(row[keyField])}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn(
                    'hover:bg-cyber-muted/50 transition-colors',
                    selectedRows.has(String(row[keyField])) && 'bg-cyber-cyan/5'
                  )}
                >
                  {selectable && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(String(row[keyField]))}
                        onChange={() => handleSelectRow(row)}
                        className="w-4 h-4 rounded border-cyber-border bg-cyber-card
                          text-cyber-cyan focus:ring-cyber-cyan"
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn('p-4 text-sm text-gray-300', column.className)}
                    >
                      {column.cell
                        ? column.cell(getCellValue(row, column), row)
                        : String(getCellValue(row, column) ?? '-')}
                    </td>
                  ))}

                  {actions && actions.length > 0 && (
                    <td className="p-4">
                      <div className="relative group">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded hover:bg-cyber-muted transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </motion.button>

                        {/* 下拉菜单 */}
                        <div className="absolute right-0 top-full mt-1 w-48 bg-cyber-card
                          border border-cyber-border rounded-lg shadow-xl opacity-0 invisible
                          group-hover:opacity-100 group-hover:visible transition-all
                          z-10">
                          {actions.map((action, actionIndex) => {
                            if (action.show && !action.show(row)) return null;

                            return (
                              <button
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                className={cn(
                                  'w-full px-4 py-2 text-left text-sm hover:bg-cyber-muted',
                                  'transition-colors flex items-center gap-2',
                                  action.variant === 'danger' && 'text-cyber-pink',
                                  action.variant === 'success' && 'text-cyber-green'
                                )}
                              >
                                {action.icon && <action.icon className="w-4 h-4" />}
                                {action.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            共 {processedData.length} 条记录
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-cyber-card border border-cyber-border
                hover:border-cyber-cyan disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              上一页
            </motion.button>

            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                )
                .map((page, index, arr) => {
                  const prevPage = arr[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => pagination.onPageChange(page)}
                        className={cn(
                          'min-w-[32px] px-3 py-1.5 rounded-lg border transition-colors',
                          pagination.currentPage === page
                            ? 'bg-cyber-cyan text-black border-cyber-cyan'
                            : 'bg-cyber-card border-cyber-border hover:border-cyber-cyan'
                        )}
                      >
                        {page}
                      </motion.button>
                    </React.Fragment>
                  );
                })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1.5 rounded-lg bg-cyber-card border border-cyber-border
                hover:border-cyber-cyan disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              下一页
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
