/**
 * 搜索栏组件
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, debounce } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

// ============================================================================
// Components
// ============================================================================

/**
 * 搜索栏组件
 */
export function SearchBar({
  placeholder = '搜索文章...',
  className,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [isFocused, setIsFocused] = useState(false);

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (onSearch) {
        onSearch(value);
      } else {
        // 更新URL参数
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
          params.set('search', value);
        } else {
          params.delete('search');
        }
        params.delete('page'); // 重置页码
        router.push(`/blog?${params.toString()}`);
      }
    }, 300),
    [onSearch, router, searchParams]
  );

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // 清除搜索
  const handleClear = () => {
    setQuery('');
    debouncedSearch('');
  };

  // 提交搜索
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border bg-gray-900/50 px-4 py-3 transition-all',
          isFocused
            ? 'border-cyber-cyan ring-2 ring-cyber-cyan/20'
            : 'border-gray-800 hover:border-gray-700'
        )}
      >
        <Search className="h-5 w-5 flex-shrink-0 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-600"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 rounded-full p-1 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

/**
 * 高级搜索栏
 */
export function AdvancedSearchBar({
  className,
}: {
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    tag: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={cn('space-y-4', className)}>
      {/* 主搜索框 */}
      <SearchBar
        placeholder="搜索文章标题、内容..."
        value={query}
        onSearch={setQuery}
      />

      {/* 筛选按钮 */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
      >
        <span>{showFilters ? '隐藏' : '显示'}高级筛选</span>
      </button>

      {/* 高级筛选 */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* 分类筛选 */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                分类
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 outline-none focus:ring-2 focus:ring-cyber-cyan"
              >
                <option value="">全部分类</option>
                {/* 从API获取分类列表 */}
              </select>
            </div>

            {/* 标签筛选 */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                标签
              </label>
              <select
                value={filters.tag}
                onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 outline-none focus:ring-2 focus:ring-cyber-cyan"
              >
                <option value="">全部标签</option>
                {/* 从API获取标签列表 */}
              </select>
            </div>

            {/* 日期范围 */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                开始日期
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                结束日期
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>
          </div>

          {/* 清除筛选 */}
          <button
            onClick={() => setFilters({
              category: '',
              tag: '',
              dateFrom: '',
              dateTo: '',
            })}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            清除所有筛选
          </button>
        </motion.div>
      )}
    </div>
  );
}

/**
 * 搜索建议
 */
export function SearchWithSuggestions({
  suggestions,
  className,
}: {
  suggestions: string[];
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={cn('relative', className)}>
      <SearchBar
        value={query}
        onSearch={setQuery}
        onFocus={() => setShowSuggestions(true)}
      />

      {/* 建议列表 */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-800 bg-gray-900 shadow-lg">
          <ul className="py-2">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-300 cursor-pointer transition-colors"
                onClick={() => {
                  setQuery(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
