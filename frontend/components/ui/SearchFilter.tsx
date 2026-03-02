/**
 * 高级搜索过滤器组件
 * 支持多条件过滤、排序、分页
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type FilterType = 'text' | 'select' | 'date' | 'number' | 'boolean';

export interface FilterOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterField {
  name: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface SortOption {
  field: string;
  label: string;
  direction?: 'asc' | 'desc';
}

export interface SearchFilterProps<T extends Record<string, any>> {
  data: T[];
  fields: FilterField[];
  sortOptions?: SortOption[];
  onFilteredDataChange?: (data: T[]) => void;
  onSearchChange?: (query: string) => void;
  placeholder?: string;
  showPagination?: boolean;
  pageSize?: number;
  enableExport?: boolean;
  className?: string;
}

export function SearchFilter<T extends Record<string, any>>({
  data,
  fields,
  sortOptions = [],
  onFilteredDataChange,
  onSearchChange,
  placeholder = '搜索...',
  showPagination = false,
  pageSize = 10,
  enableExport = false,
  className,
}: SearchFilterProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [currentSort, setCurrentSort] = useState<SortOption | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // 过滤和排序数据
  const processedData = useMemo(() => {
    let result = [...data];

    // 文本搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    // 应用过滤器
    Object.entries(activeFilters).forEach(([field, value]) => {
      if (value === '' || value === undefined || value === null) return;

      result = result.filter(item => {
        const itemValue = item[field];

        if (typeof value === 'boolean') {
          return itemValue === value;
        }

        if (typeof value === 'number') {
          return itemValue === value;
        }

        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      });
    });

    // 排序
    if (currentSort) {
      result.sort((a, b) => {
        const aValue = a[currentSort.field];
        const bValue = b[currentSort.field];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return currentSort.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, activeFilters, currentSort]);

  // 分页
  const paginatedData = useMemo(() => {
    if (!showPagination) return processedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage, showPagination, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // 通知父组件数据变化
  React.useEffect(() => {
    onFilteredDataChange?.(paginatedData);
  }, [paginatedData]);

  React.useEffect(() => {
    onSearchChange?.(searchQuery);
  }, [searchQuery]);

  const handleFilterChange = (field: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleClearFilter = (field: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setCurrentSort(null);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csv = [
      Object.keys(processedData[0] || {}).join(','),
      ...processedData.map(row => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
  };

  const activeFilterCount = Object.keys(activeFilters).filter(
    key => activeFilters[key] !== '' && activeFilters[key] !== undefined
  ).length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* 搜索栏 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 pl-10 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none"
          />
          <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'relative px-4 py-2.5 rounded-lg border-2 transition-all',
            'hover:shadow-lg',
            showFilters ? 'border-cyber-cyan bg-cyber-cyan/10' : 'border-cyber-purple/30 bg-cyber-purple/5'
          )}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-pink text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {sortOptions.length > 0 && (
          <select
            value={currentSort?.field || ''}
            onChange={(e) => {
              const sort = sortOptions.find(s => s.field === e.target.value);
              setCurrentSort(sort || null);
            }}
            className="px-4 py-2.5 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none"
          >
            <option value="">排序方式</option>
            {sortOptions.map(option => (
              <option key={option.field} value={option.field}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {enableExport && (
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90 transition-colors"
          >
            导出
          </button>
        )}
      </div>

      {/* 过滤器面板 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-cyber-purple/5 border-2 border-cyber-purple/30 rounded-lg"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>

                  {field.type === 'select' ? (
                    <select
                      value={activeFilters[field.name] || ''}
                      onChange={(e) => handleFilterChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none"
                    >
                      <option value="">全部</option>
                      {field.options?.map(option => (
                        <option key={String(option.value)} value={String(option.value)}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'boolean' ? (
                    <select
                      value={activeFilters[field.name] || ''}
                      onChange={(e) => handleFilterChange(field.name, e.target.value === 'true')}
                      className="w-full px-3 py-2 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none"
                    >
                      <option value="">全部</option>
                      <option value="true">是</option>
                      <option value="false">否</option>
                    </select>
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      value={activeFilters[field.name] || ''}
                      onChange={(e) => handleFilterChange(field.name, parseFloat(e.target.value))}
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      className="w-full px-3 py-2 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={activeFilters[field.name] || ''}
                      onChange={(e) => handleFilterChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 活跃过滤器标签 */}
            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([field, value]) => {
                  if (!value) return null;
                  const fieldConfig = fields.find(f => f.name === field);
                  return (
                    <span
                      key={field}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan rounded-full text-sm"
                    >
                      <strong>{fieldConfig?.label}:</strong> {String(value)}
                      <button
                        onClick={() => handleClearFilter(field)}
                        className="hover:text-cyber-pink"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* 清除按钮 */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2 text-cyber-pink hover:bg-cyber-pink/10 rounded-lg transition-colors"
              >
                清除所有过滤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 结果统计 */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          找到 {processedData.length} 条结果
          {searchQuery && ` (搜索: "${searchQuery}")`}
        </span>

        {showPagination && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-cyber-purple/30 disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyber-purple/50"
            >
              上一页
            </button>

            <span>
              第 {currentPage} / {totalPages} 页
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-cyber-purple/30 disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyber-purple/50"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 快速过滤器标签
export interface QuickFilterProps {
  options: Array<{ label: string; value: string; count?: number }>;
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
  className?: string;
}

export function QuickFilter({
  options,
  value,
  onChange,
  allLabel = '全部',
  className,
}: QuickFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <button
        onClick={() => onChange('')}
        className={cn(
          'px-4 py-2 rounded-lg border-2 transition-all',
          value === ''
            ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
            : 'border-cyber-purple/30 text-gray-400 hover:border-cyber-purple/50'
        )}
      >
        {allLabel}
      </button>

      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-2 rounded-lg border-2 transition-all',
            value === option.value
              ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
              : 'border-cyber-purple/30 text-gray-400 hover:border-cyber-purple/50'
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="ml-2 text-sm opacity-60">({option.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
