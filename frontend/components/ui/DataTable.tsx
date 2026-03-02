'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Search, Filter, MoreVertical } from 'lucide-react';

export interface Column<T> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  pagination?: {
    pageSize: number;
  };
  emptyMessage?: string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

/**
 * 高级数据表格组件
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  selectable = false,
  onSelectionChange,
  pagination,
  emptyMessage = '暂无数据',
  className = '',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // 搜索和排序
  const processedData = useMemo(() => {
    let filtered = [...data];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return (
            value !== null &&
            value !== undefined &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }

    // 排序
    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection, columns]);

  // 分页
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;

    const startIndex = (currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage, pagination]);

  const totalPages = pagination ? Math.ceil(processedData.length / pagination.pageSize) : 1;

  // 排序处理
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // 选择处理
  const handleSelectRow = (index: number, selected: boolean) => {
    const newSelection = new Set(selectedRows);
    if (selected) {
      newSelection.add(index);
    } else {
      newSelection.delete(index);
    }
    setSelectedRows(newSelection);

    if (onSelectionChange) {
      const selectedData = processedData.filter((_, i) => newSelection.has(i));
      onSelectionChange(selectedData);
    }
  };

  const handleSelectAll = (selected: boolean) => {
    const newSelection = new Set<number>();
    if (selected) {
      paginatedData.forEach((_, index) => {
        // 使用原始数据中的索引
        const originalIndex = processedData.indexOf(paginatedData[index]);
        newSelection.add(originalIndex);
      });
    }
    setSelectedRows(newSelection);

    if (onSelectionChange) {
      const selectedData = processedData.filter((_, i) => newSelection.has(i));
      onSelectionChange(selectedData);
    }
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((_, index) => {
    const originalIndex = processedData.indexOf(paginatedData[index]);
    return selectedRows.has(originalIndex);
  });

  const isSomeSelected = paginatedData.some((_, index) => {
    const originalIndex = processedData.indexOf(paginatedData[index]);
    return selectedRows.has(originalIndex);
  });

  return (
    <div className={`cyber-card overflow-hidden ${className}`}>
      {/* 工具栏 */}
      {searchable && (
        <div className="p-4 border-b border-cyber-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cyber-darker border border-cyber-border rounded-lg focus:border-cyber-cyan focus:outline-none text-white text-sm"
            />
          </div>

          {selectable && selectedRows.size > 0 && (
            <div className="text-sm text-gray-400">
              已选择 {selectedRows.size} 项
            </div>
          )}
        </div>
      )}

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyber-border bg-cyber-darker/50">
              {selectable && (
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isSomeSelected && !isAllSelected;
                      }
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-cyber-border text-cyber-cyan focus:ring-cyber-cyan"
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-cyber-cyan">
                        {sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              <th className="px-4 py-3 text-right w-12">
                <MoreVertical className="w-4 h-4 mx-auto text-gray-500" />
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-cyber-border">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                const originalIndex = processedData.indexOf(row);
                const isSelected = selectedRows.has(originalIndex);

                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`hover:bg-cyber-darker/30 transition-colors ${isSelected ? 'bg-cyber-cyan/10' : ''}`}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(originalIndex, e.target.checked)}
                          className="w-4 h-4 rounded border-cyber-border text-cyber-cyan focus:ring-cyber-cyan"
                        />
                      </td>
                    )}

                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm text-gray-300">
                        {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                      </td>
                    ))}

                    <td className="px-4 py-3 text-right">
                      <button className="text-gray-500 hover:text-cyber-cyan transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (selectable ? 2 : 1)} className="px-4 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-4xl">📊</div>
                    <div>{emptyMessage}</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t border-cyber-border flex items-center justify-between">
          <div className="text-sm text-gray-500">
            显示 {((currentPage - 1) * pagination.pageSize) + 1} - {Math.min(currentPage * pagination.pageSize, processedData.length)} 条，
            共 {processedData.length} 条
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-cyber-border rounded hover:border-cyber-cyan hover:text-cyber-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>

            <div className="flex gap-1">
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
                    className={`w-8 h-8 text-sm rounded transition-all ${
                      currentPage === pageNum
                        ? 'bg-cyber-cyan text-cyber-dark font-bold'
                        : 'border border-cyber-border hover:border-cyber-cyan'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-cyber-border rounded hover:border-cyber-cyan hover:text-cyber-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
