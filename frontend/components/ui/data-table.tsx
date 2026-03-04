'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ==========================================
// Types and Interfaces
// ==========================================

export interface Column<T> {
  key: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  searchable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  className?: string;
}

// ==========================================
// Helper Components
// ==========================================

interface SortIconProps {
  direction: 'asc' | 'desc' | null;
}

const SortIcon: React.FC<SortIconProps> = ({ direction }) => {
  return (
    <motion.svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      initial={{ rotate: 0 }}
      animate={{ rotate: direction === 'asc' ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="inline-block ml-1"
    >
      <path
        d="M3 4.5L6 1.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'px-3 py-1 rounded-lg border border-cyber-border/50',
          'text-cyber-cyan hover:bg-cyber-cyan/10',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200'
        )}
      >
        Previous
      </button>

      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="text-cyber-muted">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={cn(
                'px-3 py-1 rounded-lg border',
                'transition-all duration-200',
                currentPage === page
                  ? 'bg-cyber-cyan text-cyber-dark border-cyber-cyan'
                  : 'border-cyber-border/50 text-cyber-cyan hover:bg-cyber-cyan/10'
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'px-3 py-1 rounded-lg border border-cyber-border/50',
          'text-cyber-cyan hover:bg-cyber-cyan/10',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200'
        )}
      >
        Next
      </button>
    </div>
  );
};

// ==========================================
// Main DataTable Component
// ==========================================

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  searchable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
  rowClassName,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((row) =>
      columns.some((column) => {
        if (!column.searchable && !searchable) return false;
        const value = row[column.key];
        if (value == null) return false;
        return String(value)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, columns, searchable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Event handlers
  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-cyber-cyan">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Search */}
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              className={cn(
                'w-full px-4 py-2 pl-10',
                'bg-cyber-card border border-cyber-border/50',
                'rounded-lg text-cyber-cyan placeholder-cyber-muted',
                'focus:outline-none focus:border-cyber-cyan/50',
                'transition-all duration-200'
              )}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-cyber-border/50">
        <table className="w-full">
          <thead>
            <tr className="bg-cyber-muted/50 border-b border-cyber-border/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-semibold',
                    'text-cyber-cyan whitespace-nowrap',
                    column.sortable && sortable && 'cursor-pointer hover:bg-cyber-cyan/5',
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && sortable && (
                      <SortIcon direction={sortColumn === column.key ? sortDirection : null} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-cyber-muted"
                >
                  <div className="flex flex-col items-center gap-3">
                    <svg
                      className="w-12 h-12 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-lg">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={String(row[keyField])}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  className={cn(
                    'border-b border-cyber-border/30 last:border-0',
                    'hover:bg-cyber-cyan/5 transition-colors duration-150',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row)
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-sm',
                        'text-cyber-cyan/90',
                        column.className
                      )}
                    >
                      {column.cell ? column.cell(row) : String(row[column.key] ?? '')}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Info */}
      <div className="mt-4 text-sm text-cyber-muted text-center">
        Showing {paginatedData.length} of {sortedData.length} entries
        {searchQuery && ` (filtered from ${data.length} total entries)`}
      </div>
    </div>
  );
}

// ==========================================
// Export Default
// ==========================================

export default DataTable;
