'use client';

/**
 * DataTable Component - 数据表格组件
 * 支持排序、筛选、分页、选择、自定义单元格
 */

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Settings,
} from 'lucide-react';

// 排序方向
export type SortDirection = 'asc' | 'desc' | null;

// 列配置
export interface ColumnConfig<T> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

// 排序配置
export interface SortConfig {
  key: string;
  direction: SortDirection;
}

// 分页配置
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
}

// 组件Props
export interface DataTableProps<T> {
  /** 数据源 */
  data: T[];
  /** 列配置 */
  columns: ColumnConfig<T>[];
  /** 行Key */
  rowKey?: keyof T | ((record: T) => string);
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否斑马纹 */
  striped?: boolean;
  /** 行点击回调 */
  onRowClick?: (record: T, index: number) => void;
  /** 排序变化回调 */
  onSortChange?: (sort: SortConfig | null) => void;
  /** 筛选变化回调 */
  onFilterChange?: (filters: Record<string, any>) => void;
  /** 分页变化回调 */
  onPageChange?: (page: number, pageSize: number) => void;
  /** 初始排序 */
  defaultSort?: SortConfig;
  /** 初始筛选 */
  defaultFilters?: Record<string, any>;
  /** 分页配置 */
  pagination?: PaginationConfig | false;
  /** 空状态渲染 */
  emptyText?: React.ReactNode;
  /** 加载状态 */
  loading?: boolean;
  /** 是否可选择行 */
  selectable?: boolean;
  /** 选择变化回调 */
  onSelectionChange?: (selectedKeys: string[], selectedRows: T[]) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 表格样式 */
  style?: React.CSSProperties;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey = 'id',
  bordered = true,
  striped = true,
  onRowClick,
  onSortChange,
  onFilterChange,
  onPageChange,
  defaultSort,
  defaultFilters = {},
  pagination: paginationProp,
  emptyText = '暂无数据',
  loading = false,
  selectable = false,
  onSelectionChange,
  className = '',
  style,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSort || null);
  const [filters, setFilters] = useState<Record<string, any>>(defaultFilters);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState('');

  // 获取行Key
  const getRowKey = useCallback((record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] || index);
  }, [rowKey]);

  // 处理排序
  const handleSort = useCallback((columnKey: string) => {
    setSortConfig((prev) => {
      let direction: SortDirection = 'asc';

      if (prev?.key === columnKey) {
        if (prev.direction === 'asc') {
          direction = 'desc';
        } else if (prev.direction === 'desc') {
          direction = null;
        }
      }

      const newConfig = direction ? { key: columnKey, direction } : null;
      onSortChange?.(newConfig);
      return newConfig;
    });
  }, [onSortChange]);

  // 处理筛选
  const handleFilter = useCallback((columnKey: string, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [columnKey]: value };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  // 处理搜索
  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  // 处理行选择
  const handleRowSelect = useCallback((record: T) => {
    const key = getRowKey(record, 0);
    setSelectedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, [getRowKey]);

  // 处理全选
  const handleSelectAll = useCallback(() => {
    const allKeys = new Set(processedData.map((item, index) => getRowKey(item, index)));
    setSelectedKeys(allKeys);
  }, [processedData, getRowKey]);

  // 处理清空选择
  const handleClearSelection = useCallback(() => {
    setSelectedKeys(new Set());
  }, []);

  // 处理分页变化
  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    onPageChange?.(page, pageSize || pagination?.pageSize || 10);
  }, [onPageChange, pagination]);

  // 处理排序和筛选
  const processedData = useMemo(() => {
    let result = [...data];

    // 搜索过滤
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter((record) =>
        columns.some((column) => {
          const value = record[column.key as keyof T];
          return String(value).toLowerCase().includes(lowerSearchText);
        })
      );
    }

    // 列筛选
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result = result.filter((record) => record[key] === value);
      }
    });

    // 排序
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, filters, sortConfig, searchText, columns]);

  // 分页数据
  const paginatedData = useMemo(() => {
    if (!paginationProp) return processedData;

    const { current = 1, pageSize = 10 } = paginationProp;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    return processedData.slice(start, end);
  }, [processedData, paginationProp]);

  // 计算选中行
  const selectedRows = useMemo(() => {
    return data.filter((item, index) => {
      const key = getRowKey(item, index);
      return selectedKeys.has(key);
    });
  }, [data, selectedKeys, getRowKey]);

  // 触发选择变化回调
  useMemo(() => {
    onSelectionChange?.(Array.from(selectedKeys), selectedRows);
  }, [selectedKeys, selectedRows, onSelectionChange]);

  return (
    <div className={`space-y-4 ${className}`} style={style}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-4">
        {/* 搜索框 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cyber-card border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none"
          />
          {searchText && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 操作按钮 */}
        {selectable && (
          <div className="flex items-center gap-2">
            {selectedKeys.size > 0 && (
              <>
                <span className="text-sm text-gray-400">
                  已选择 {selectedKeys.size} 项
                </span>
                <button
                  onClick={handleClearSelection}
                  className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  清空
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 表格容器 */}
      <div className="overflow-x-auto">
        <table className={`w-full ${bordered ? 'border border-cyber-border' : ''}`}>
          <thead className="bg-cyber-card">
            <tr>
              {/* 选择列 */}
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedKeys.size === processedData.length && processedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-cyber-border text-cyber-cyan focus:ring-cyber-cyan"
                  />
                </th>
              )}

              {/* 数据列 */}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    px-4 py-3 text-left text-sm font-semibold text-gray-300
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${bordered ? 'border-b border-r border-cyber-border last:border-r-0' : ''}
                  `}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>

                    {/* 排序按钮 */}
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(String(column.key))}
                        className="flex items-center"
                      >
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4 text-cyber-cyan" />
                          ) : sortConfig.direction === 'desc' ? (
                            <ChevronDown className="w-4 h-4 text-cyber-cyan" />
                          ) : null
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400 hover:text-cyber-cyan transition-colors" />
                        )}
                      </button>
                    )}

                    {/* 筛选按钮 */}
                    {column.filterable && (
                      <button className="text-gray-400 hover:text-cyber-cyan transition-colors">
                        <Filter className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="w-5 h-5 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                    加载中...
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-gray-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => (
                <motion.tr
                  key={getRowKey(record, index)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`
                    group cursor-pointer transition-colors
                    ${onRowClick ? 'hover:bg-cyber-card/50' : ''}
                    ${striped && index % 2 === 0 ? 'bg-cyber-dark/30' : ''}
                    ${bordered ? 'border-b border-cyber-border' : ''}
                  `}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {/* 选择列 */}
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedKeys.has(getRowKey(record, index))}
                        onChange={() => handleRowSelect(record)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 rounded border-cyber-border text-cyber-cyan focus:ring-cyber-cyan"
                      />
                    </td>
                  )}

                  {/* 数据列 */}
                  {columns.map((column) => {
                    const value = record[column.key as keyof T];
                    const alignClass = column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left';

                    return (
                      <td
                        key={String(column.key)}
                        className={`
                          px-4 py-3 text-sm text-gray-300
                          ${bordered ? 'border-r border-cyber-border last:border-r-0' : ''}
                          ${alignClass}
                        `}
                      >
                        {column.render ? column.render(value, record, index) : String(value ?? '')}
                      </td>
                    );
                  })}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {paginationProp && (
        <div className="flex items-center justify-between">
          {/* 总数显示 */}
          {paginationProp.showTotal && (
            <div className="text-sm text-gray-400">
              {paginationProp.showTotal(
                paginationProp.total,
                [
                  ((paginationProp.current - 1) * paginationProp.pageSize) + 1,
                  Math.min(paginationProp.current * paginationProp.pageSize, paginationProp.total),
                ]
              )}
            </div>
          )}

          {/* 分页按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(paginationProp.current - 1)}
              disabled={paginationProp.current === 1}
              className="p-2 border border-cyber-border rounded hover:border-cyber-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* 页码 */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(paginationProp.total / paginationProp.pageSize) }, (_, i) => i + 1)
                .filter((page) => {
                  // 显示当前页、首页、末页和当前页附近的页码
                  return (
                    page === 1 ||
                    page === Math.ceil(paginationProp.total / paginationProp.pageSize) ||
                    Math.abs(page - paginationProp.current) <= 2
                  );
                })
                .map((page, index, arr) => {
                  const prevPage = arr[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <div key={page}>
                      {showEllipsis && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`
                          min-w-[32px] px-2 py-1 text-sm rounded transition-colors
                          ${page === paginationProp.current
                            ? 'bg-cyber-cyan text-cyber-dark'
                            : 'text-gray-400 hover:text-white hover:bg-cyber-card'
                          }
                        `}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(paginationProp.current + 1)}
              disabled={paginationProp.current >= Math.ceil(paginationProp.total / paginationProp.pageSize)}
              className="p-2 border border-cyber-border rounded hover:border-cyber-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* 每页显示数量 */}
            {paginationProp.showSizeChanger && (
              <select
                value={paginationProp.pageSize}
                onChange={(e) => handlePageChange(1, Number(e.target.value))}
                className="ml-4 px-3 py-1 bg-cyber-card border border-cyber-border rounded text-white text-sm focus:border-cyber-cyan focus:outline-none"
              >
                {paginationProp.pageSizeOptions?.map((size) => (
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

export default DataTable;
