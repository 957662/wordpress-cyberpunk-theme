'use client';

/**
 * 高级搜索组件
 * 提供多条件筛选和搜索功能
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Calendar, Tag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { CyberInput } from '@/components/ui/CyberInput';
import { CyberSelect } from '@/components/ui/CyberSelect';
import { CyberCheckbox } from '@/components/ui/CyberCheckbox';

export interface SearchFilters {
  query: string;
  categories: string[];
  tags: string[];
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  categories?: string[];
  tags?: string[];
  authors?: string[];
  placeholder?: string;
  className?: string;
}

export function AdvancedSearch({
  onSearch,
  categories = [],
  tags = [],
  authors = [],
  placeholder = '搜索文章、标签、分类...',
  className,
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    tags: [],
    sortBy: 'relevance',
    sortOrder: 'desc',
  });

  const handleSearch = useCallback(() => {
    onSearch(filters);
  }, [filters, onSearch]);

  const handleReset = useCallback(() => {
    setFilters({
      query: '',
      categories: [],
      tags: [],
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
    onSearch({
      query: '',
      categories: [],
      tags: [],
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
  }, [onSearch]);

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const hasActiveFilters =
    filters.query ||
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.author ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className={cn('w-full', className)}>
      {/* 搜索栏 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-cyan/50" />
          <CyberInput
            type="text"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          筛选
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-cyan rounded-full animate-pulse" />
          )}
        </Button>
        <Button variant="primary" size="md" onClick={handleSearch}>
          搜索
        </Button>
      </div>

      {/* 高级筛选面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-6 cyber-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-bold text-cyber-cyan">
                  高级筛选
                </h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-cyber-pink hover:text-cyber-pink/80"
                  >
                    <X className="w-4 h-4 mr-1" />
                    清空筛选
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 分类 */}
                {categories.length > 0 && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                      <Tag className="w-4 h-4" />
                      分类
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={cn(
                            'px-3 py-1.5 text-sm rounded border transition-all',
                            filters.categories.includes(category)
                              ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                              : 'border-cyber-border text-gray-400 hover:border-cyber-cyan/50'
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 标签 */}
                {tags.length > 0 && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                      <Tag className="w-4 h-4" />
                      标签
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {tags.slice(0, 20).map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            'px-3 py-1.5 text-sm rounded border transition-all',
                            filters.tags.includes(tag)
                              ? 'border-cyber-purple bg-cyber-purple/10 text-cyber-purple'
                              : 'border-cyber-border text-gray-400 hover:border-cyber-purple/50'
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 作者 */}
                {authors.length > 0 && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                      <User className="w-4 h-4" />
                      作者
                    </label>
                    <CyberSelect
                      value={filters.author || ''}
                      onValueChange={(value) =>
                        setFilters(prev => ({ ...prev, author: value || undefined }))
                      }
                      options={[
                        { value: '', label: '全部作者' },
                        ...authors.map(author => ({ value: author, label: author })),
                      ]}
                    />
                  </div>
                )}

                {/* 排序 */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Filter className="w-4 h-4" />
                    排序方式
                  </label>
                  <div className="flex gap-2">
                    <CyberSelect
                      value={filters.sortBy || 'relevance'}
                      onValueChange={(value) =>
                        setFilters(prev => ({
                          ...prev,
                          sortBy: value as SearchFilters['sortBy'],
                        }))
                      }
                      options={[
                        { value: 'relevance', label: '相关性' },
                        { value: 'date', label: '日期' },
                        { value: 'title', label: '标题' },
                      ]}
                    />
                    <CyberSelect
                      value={filters.sortOrder || 'desc'}
                      onValueChange={(value) =>
                        setFilters(prev => ({
                          ...prev,
                          sortOrder: value as SearchFilters['sortOrder'],
                        }))
                      }
                      options={[
                        { value: 'asc', label: '升序' },
                        { value: 'desc', label: '降序' },
                      ]}
                    />
                  </div>
                </div>

                {/* 日期范围 */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    日期范围
                  </label>
                  <div className="flex gap-2">
                    <CyberInput
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) =>
                        setFilters(prev => ({ ...prev, dateFrom: e.target.value || undefined }))
                      }
                      className="flex-1"
                    />
                    <span className="text-gray-500">至</span>
                    <CyberInput
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) =>
                        setFilters(prev => ({ ...prev, dateTo: e.target.value || undefined }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* 应用筛选按钮 */}
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  取消
                </Button>
                <Button variant="primary" onClick={handleSearch}>
                  应用筛选
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
