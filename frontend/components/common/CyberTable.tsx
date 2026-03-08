'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Search, Filter, Download } from 'lucide-react';
import clsx from 'clsx';

export type SortDirection = 'asc' | 'desc' | null;

interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  cellClassName?: string;
}

interface CyberTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export function CyberTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  sortable = true,
  filterable = true,
  searchable = true,
  exportable = true,
  pagination = true,
  pageSize = 10,
  className,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
}: CyberTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter and search data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = row[col.key as keyof T];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((row) =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchQuery, filters, sortColumn, sortDirection, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return processedData.slice(start, end);
  }, [processedData, currentPage, pagination, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Handle sort
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !sortable) return;

    const key = String(column.key);
    if (sortColumn === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  // Handle export
  const handleExport = () => {
    const headers = columns.map((col) => col.title).join(',');
    const rows = processedData.map((row) =>
      columns.map((col) => {
        const value = row[col.key as keyof T];
        return col.render ? String(col.render(value, row, 0)) : String(value);
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render cell
  const renderCell = (column: Column<T>, row: T, index: number) => {
    const value = row[column.key as keyof T];
    if (column.render) {
      return column.render(value, row, index);
    }
    return value;
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className={clsx('w-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Search */}
        {searchable && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {exportable && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 hover:border-cyan-900/50 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/30">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider',
                    column.sortable && sortable && 'cursor-pointer hover:bg-gray-700/50 transition-colors'
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={clsx(
                            'w-3 h-3 -mb-1.5 transition-colors',
                            sortColumn === String(column.key) && sortDirection === 'asc'
                              ? 'text-cyan-400'
                              : 'text-gray-600'
                          )}
                        />
                        <ChevronDown
                          className={clsx(
                            'w-3 h-3 -mt-1.5 transition-colors',
                            sortColumn === String(column.key) && sortDirection === 'desc'
                              ? 'text-cyan-400'
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
          <tbody className="divide-y divide-gray-800">
            <AnimatePresence mode="popLayout">
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={String(row[keyField])}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => onRowClick?.(row, index)}
                  className={clsx(
                    'transition-colors duration-200',
                    onRowClick && 'cursor-pointer hover:bg-gray-800/30'
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={clsx(
                        'px-4 py-3 text-sm text-gray-300',
                        column.cellClassName
                      )}
                    >
                      {renderCell(column, row, index)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
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
                    className={clsx(
                      'min-w-[2.5rem] px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                      currentPage === pageNum
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-300 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton loader
function TableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-800/30 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

// Status cell component
export function StatusCell({ status }: { status: 'success' | 'warning' | 'error' | 'info' }) {
  const colors = {
    success: 'bg-green-500/20 text-green-400 border-green-500/50',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    error: 'bg-red-500/20 text-red-400 border-red-500/50',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  };

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', colors[status])}>
      {status}
    </span>
  );
}

// Action cell component
export function ActionCell({ actions }: { actions: Array<{ label: string; onClick: () => void; variant?: 'primary' | 'danger' }> }) {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={clsx(
            'text-xs font-medium px-2.5 py-1 rounded transition-colors',
            action.variant === 'danger'
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-cyan-400 hover:bg-cyan-500/10'
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
