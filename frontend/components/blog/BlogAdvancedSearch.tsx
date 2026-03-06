/**
 * BlogAdvancedSearch - 博客高级搜索组件
 * 支持关键词、分类、标签、日期范围等多维度搜索
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, Filter, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category, Tag } from '@/types';

export interface BlogAdvancedSearchProps {
  categories?: Category[];
  tags?: Tag[];
  onSearch: (params: SearchParams) => void;
  onReset: () => void;
  loading?: boolean;
  className?: string;
}

export interface SearchParams {
  keyword: string;
  categoryId?: string;
  tagIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'latest' | 'popular' | 'views';
}

export const BlogAdvancedSearch: React.FC<BlogAdvancedSearchProps> = ({
  categories = [],
  tags = [],
  onSearch,
  onReset,
  loading = false,
  className,
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest');
  const [isExpanded, setIsExpanded] = useState(false);

  // 处理搜索
  const handleSearch = useCallback(() => {
    onSearch({
      keyword: keyword.trim(),
      categoryId: selectedCategory || undefined,
      tagIds: selectedTags.length > 0 ? selectedTags : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
    });
  }, [keyword, selectedCategory, selectedTags, dateFrom, dateTo, sortBy, onSearch]);

  // 处理重置
  const handleReset = useCallback(() => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedTags([]);
    setDateFrom('');
    setDateTo('');
    setSortBy('latest');
    onReset();
  }, [onReset]);

  // 切换标签选择
  const toggleTag = useCallback((tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  }, []);

  // 检查是否有活动过滤器
  const hasActiveFilters = useMemo(() => {
    return (
      keyword.trim() !== '' ||
      selectedCategory !== '' ||
      selectedTags.length > 0 ||
      dateFrom !== '' ||
      dateTo !== ''
    );
  }, [keyword, selectedCategory, selectedTags, dateFrom, dateTo]);

  // 获取活动过滤器数量
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (keyword.trim()) count++;
    if (selectedCategory) count++;
    if (selectedTags.length > 0) count++;
    if (dateFrom || dateTo) count++;
    return count;
  }, [keyword, selectedCategory, selectedTags, dateFrom, dateTo]);

  return (
    <div className={cn('bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6', className)}>
      {/* 主搜索栏 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="搜索文章..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyber-cyan/50 transition-colors"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          disabled={loading}
          className={cn(
            'px-6 py-3 rounded-lg font-semibold transition-colors',
            loading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-cyber-cyan text-gray-900 hover:bg-cyber-cyan/80'
          )}
        >
          {loading ? '搜索中...' : '搜索'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'p-3 rounded-lg transition-colors relative',
            isExpanded
              ? 'bg-cyber-cyan/20 text-cyber-cyan'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </motion.button>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="p-3 rounded-lg bg-gray-800 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* 高级过滤器 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-6">
              {/* 分类筛选 */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    分类
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        selectedCategory === ''
                          ? 'bg-cyber-cyan text-gray-900'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      )}
                    >
                      全部
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(String(category.id))}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                          selectedCategory === String(category.id)
                            ? 'bg-cyber-cyan text-gray-900'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 标签筛选 */}
              {tags.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    标签
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(String(tag.id))}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                          selectedTags.includes(String(tag.id))
                            ? 'bg-cyber-cyan text-gray-900'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        )}
                      >
                        #{tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 日期范围 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    发布日期
                  </div>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyber-cyan/50 transition-colors"
                    />
                  </div>
                  <span className="text-gray-500">至</span>
                  <div className="flex-1">
                    <input
                      type="date"
                      value={dateTo}
                      onChange={e => setDateTo(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyber-cyan/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 排序方式 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  排序方式
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'latest', label: '最新发布' },
                    { value: 'popular', label: '最多点赞' },
                    { value: 'views', label: '最多浏览' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as any)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        sortBy === option.value
                          ? 'bg-cyber-cyan text-gray-900'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">
                    {hasActiveFilters ? (
                      <>
                        已应用 <span className="text-cyber-cyan font-semibold">{activeFiltersCount}</span> 个筛选条件
                      </>
                    ) : (
                      '未应用任何筛选条件'
                    )}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  disabled={loading}
                  className={cn(
                    'px-6 py-2 rounded-lg font-semibold transition-colors',
                    loading
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-cyber-cyan text-gray-900 hover:bg-cyber-cyan/80'
                  )}
                >
                  应用筛选
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogAdvancedSearch;
