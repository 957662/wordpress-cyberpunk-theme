'use client';

import React from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BlogFiltersProps {
  currentCategory?: string;
  currentTag?: string;
  searchQuery?: string;
  currentSort?: string;
  className?: string;
}

export function BlogFilters({
  currentCategory,
  currentTag,
  searchQuery,
  currentSort = 'latest',
  className,
}: BlogFiltersProps) {
  const [search, setSearch] = React.useState(searchQuery || '');
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 触发搜索
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (currentCategory) params.append('category', currentCategory);
    if (currentTag) params.append('tag', currentTag);
    if (currentSort) params.append('sort', currentSort);
    window.location.href = `/blog?${params.toString()}`;
  };

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Popular' },
    { value: 'trending', label: 'Trending' },
    { value: 'oldest', label: 'Oldest' },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className={cn(
            'w-full px-4 py-3 pl-12 pr-12',
            'bg-gray-900/50 border border-gray-700 rounded-lg',
            'text-white placeholder-gray-500',
            'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50',
            'outline-none transition-all duration-300'
          )}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2',
            'px-4 py-1.5',
            'bg-cyan-500 hover:bg-cyan-600',
            'text-white text-sm font-medium',
            'rounded-md transition-colors duration-200'
          )}
        >
          Search
        </motion.button>
      </form>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center gap-2 text-sm font-medium text-gray-300',
            'hover:text-cyan-400 transition-colors duration-200'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={currentSort}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              params.set('sort', e.target.value);
              window.location.href = `/blog?${params.toString()}`;
            }}
            className={cn(
              'px-3 py-1.5 text-sm',
              'bg-gray-900/50 border border-gray-700 rounded-lg',
              'text-white',
              'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50',
              'outline-none transition-all duration-300 cursor-pointer'
            )}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(currentCategory || currentTag) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2"
        >
          {currentCategory && (
            <Link
              href="/blog"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5',
                'bg-cyan-500/20 border border-cyan-500/50',
                'text-cyan-400 text-sm font-medium rounded-full',
                'hover:bg-cyan-500/30 transition-colors duration-200'
              )}
            >
              Category: {currentCategory}
              <span className="text-xs">×</span>
            </Link>
          )}
          {currentTag && (
            <Link
              href="/blog"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5',
                'bg-purple-500/20 border border-purple-500/50',
                'text-purple-400 text-sm font-medium rounded-full',
                'hover:bg-purple-500/30 transition-colors duration-200'
              )}
            >
              Tag: {currentTag}
              <span className="text-xs">×</span>
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default BlogFilters;
