'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchFilter {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'range';
  options?: { label: string; value: string }[];
}

interface AdvancedSearchProps {
  placeholder?: string;
  filters?: SearchFilter[];
  onSearch: (query: string, activeFilters: Record<string, any>) => void;
  className?: string;
}

export function AdvancedSearch({
  placeholder = '搜索...',
  filters = [],
  onSearch,
  className,
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, activeFilters);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-2 p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showFilters ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-2 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="text-xs text-gray-400">{filter.label}</label>
                {filter.type === 'select' && filter.options && (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value="">全部</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
