'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogFilters, BlogViewMode } from '@/types/blog';

export interface BlogFilterBarProps {
  filters: BlogFilters;
  onFiltersChange: (filters: BlogFilters) => void;
  viewMode: BlogViewMode;
  onViewModeChange: (mode: BlogViewMode) => void;
  categories?: Array<{ id: string | number; name: string; slug: string }>;
  tags?: Array<{ id: string | number; name: string; slug: string }>;
  totalResults?: number;
  className?: string;
}

export function BlogFilterBar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  categories = [],
  tags = [],
  totalResults,
  className,
}: BlogFilterBarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === filters.category ? undefined : category,
      page: 1,
    });
  };

  const handleSortChange = (sort: BlogFilters['sort']) => {
    onFiltersChange({ ...filters, sort, page: 1 });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({ page: 1, perPage: filters.perPage });
  };

  const hasActiveFilters = filters.category || filters.tag || filters.search;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and View Mode Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-cyan" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="搜索文章..."
            className="cyber-input w-full pl-10 pr-4"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 cyber-card p-1">
          <motion.button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-2 rounded transition-colors',
              viewMode === 'grid'
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'text-gray-400 hover:text-cyber-cyan'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Grid className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-2 rounded transition-colors',
              viewMode === 'list'
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'text-gray-400 hover:text-cyber-cyan'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <List className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Mobile Filter Toggle */}
        <motion.button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="sm:hidden cyber-button cyber-button--icon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Filters Row */}
      <AnimatePresence>
        {(showMobileFilters || hasActiveFilters || categories.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="cyber-card p-4 space-y-4"
          >
            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">分类</label>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    onClick={() => handleCategoryChange('')}
                    className={cn(
                      'cyber-badge',
                      !filters.category
                        ? 'cyber-badge--cyan'
                        : 'cyber-badge--muted hover:border-cyber-cyan/50'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    全部
                  </motion.button>
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={cn(
                        'cyber-badge',
                        filters.category === category.slug
                          ? 'cyber-badge--cyan'
                          : 'cyber-badge--muted hover:border-cyber-cyan/50'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">排序</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'latest', label: '最新' },
                  { value: 'popular', label: '热门' },
                  { value: 'trending', label: '趋势' },
                  { value: 'oldest', label: '最早' },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleSortChange(option.value as BlogFilters['sort'])}
                    className={cn(
                      'cyber-badge',
                      filters.sort === option.value
                        ? 'cyber-badge--purple'
                        : 'cyber-badge--muted hover:border-cyber-purple/50'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <motion.button
                onClick={clearFilters}
                className="cyber-button cyber-button--ghost flex items-center gap-2 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                清除筛选
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      {totalResults !== undefined && (
        <div className="text-sm text-gray-400">
          找到 <span className="text-cyber-cyan font-semibold">{totalResults}</span> 篇文章
        </div>
      )}
    </div>
  );
}

export default BlogFilterBar;
