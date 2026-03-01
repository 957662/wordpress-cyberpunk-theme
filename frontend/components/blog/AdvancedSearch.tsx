/**
 * 高级搜索组件
 * 支持全文搜索、过滤和排序
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface SearchFilters {
  query: string;
  categories?: number[];
  tags?: number[];
  dateFrom?: string;
  dateTo?: string;
  author?: number;
  sortBy?: 'relevance' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface AdvancedSearchProps {
  categories?: Category[];
  tags?: Tag[];
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  resultCount?: number;
  placeholder?: string;
  showFilters?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  categories = [],
  tags = [],
  onSearch,
  loading = false,
  resultCount,
  placeholder = '搜索文章、页面、标签...',
  showFilters = true,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'relevance',
    sortOrder: 'desc',
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedQuery !== filters.query) {
        setFilters((prev) => ({ ...prev, query: debouncedQuery }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  // 执行搜索
  useEffect(() => {
    if (filters.query || filters.categories?.length || filters.tags?.length) {
      onSearch(filters);
    }
  }, [filters]);

  // 更新查询
  const handleQueryChange = (value: string) => {
    setDebouncedQuery(value);
  };

  // 清空搜索
  const handleClear = () => {
    setDebouncedQuery('');
    setFilters({
      query: '',
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
  };

  // 切换分类
  const toggleCategory = (categoryId: number) => {
    setFilters((prev) => {
      const current = prev.categories || [];
      const updated = current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId];
      return { ...prev, categories: updated };
    });
  };

  // 切换标签
  const toggleTag = (tagId: number) => {
    setFilters((prev) => {
      const current = prev.tags || [];
      const updated = current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId];
      return { ...prev, tags: updated };
    });
  };

  // 获取活跃过滤器数量
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.categories?.length) count++;
    if (filters.tags?.length) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const hasFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <Card className="p-4 border-cyber-cyan/20">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
          <div className="flex-1">
            <Input
              type="search"
              value={debouncedQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={placeholder}
              className="border-0 focus:ring-0 bg-transparent px-0"
            />
          </div>
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="p-2 hover:bg-cyber-dark/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            )}
          </AnimatePresence>
          {showFilters && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2 rounded-full transition-colors ${
                showAdvancedFilters
                  ? 'bg-cyber-cyan/20 text-cyber-cyan'
                  : 'hover:bg-cyber-dark/50 text-gray-400'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}
          <Button
            onClick={() => onSearch(filters)}
            disabled={loading || !hasFilters}
            variant="primary"
            size="sm"
          >
            {loading ? '搜索中...' : '搜索'}
          </Button>
        </div>

        {/* 结果统计 */}
        {resultCount !== undefined && hasFilters && (
          <div className="mt-3 text-sm text-gray-400">
            找到 <span className="text-cyber-cyan font-semibold">{resultCount}</span> 个结果
          </div>
        )}

        {/* 活跃过滤器标签 */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex flex-wrap gap-2"
            >
              {filters.query && (
                <Badge
                  variant="primary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setDebouncedQuery('')}
                >
                  搜索: {filters.query}
                  <X className="w-3 h-3" />
                </Badge>
              )}
              {filters.categories?.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                return cat ? (
                  <Badge
                    key={catId}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => toggleCategory(catId)}
                  >
                    {cat.name}
                    <X className="w-3 h-3" />
                  </Badge>
                ) : null;
              })}
              {filters.tags?.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return tag ? (
                  <Badge
                    key={tagId}
                    variant="outline"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => toggleTag(tagId)}
                  >
                    #{tag.name}
                    <X className="w-3 h-3" />
                  </Badge>
                ) : null;
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 高级过滤器 */}
      <AnimatePresence>
        {showAdvancedFilters && showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 border-cyber-purple/20">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-cyber-purple" />
                <h3 className="text-lg font-semibold">高级过滤</h3>
              </div>

              <div className="space-y-6">
                {/* 分类过滤 */}
                {categories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">分类</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const isSelected = filters.categories?.includes(category.id);
                        return (
                          <button
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              isSelected
                                ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple'
                                : 'bg-cyber-dark/30 text-gray-400 border border-gray-700 hover:border-gray-500'
                            }`}
                          >
                            {category.name}
                            {category.count !== undefined && (
                              <span className="ml-1 text-xs opacity-60">
                                ({category.count})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 标签过滤 */}
                {tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">标签</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 20).map((tag) => {
                        const isSelected = filters.tags?.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                              isSelected
                                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan'
                                : 'bg-cyber-dark/30 text-gray-400 border border-gray-700 hover:border-gray-500'
                            }`}
                          >
                            #{tag.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 日期范围 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      开始日期
                    </label>
                    <Input
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, dateFrom: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      结束日期
                    </label>
                    <Input
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, dateTo: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 排序选项 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      排序方式
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sortBy: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan transition-all"
                    >
                      <option value="relevance">相关性</option>
                      <option value="date">日期</option>
                      <option value="title">标题</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      排序顺序
                    </label>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sortOrder: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan transition-all"
                    >
                      <option value="desc">降序</option>
                      <option value="asc">升序</option>
                    </select>
                  </div>
                </div>

                {/* 清空所有过滤器 */}
                <div className="flex justify-end pt-4 border-t border-gray-800">
                  <Button
                    onClick={() => {
                      setDebouncedQuery('');
                      setFilters({
                        query: '',
                        sortBy: 'relevance',
                        sortOrder: 'desc',
                      });
                      setShowAdvancedFilters(false);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    清空所有过滤器
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;
