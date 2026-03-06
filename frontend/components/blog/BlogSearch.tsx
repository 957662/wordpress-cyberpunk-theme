'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Calendar, User } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { apiClient } from '@/services/api/client';

interface BlogSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  slug: string;
}

/**
 * 博客搜索组件
 * 支持实时搜索、搜索建议和高亮显示
 *
 * @example
 * <BlogSearch
 *   onSearch={(query) => console.log('搜索:', query)}
 *   placeholder="搜索文章..."
 *   autoFocus={true}
 * />
 */
export const BlogSearch: React.FC<BlogSearchProps> = ({
  onSearch,
  placeholder = '搜索文章标题、内容、标签...',
  className = '',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);

  /**
   * 执行搜索
   */
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiClient.get<{ results: SearchResult[] }>(
        `/api/blog/search?q=${encodeURIComponent(searchQuery)}`
      );
      setResults(response.data.results || []);
    } catch (error) {
      console.error('搜索失败:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * 当防抖搜索词变化时执行搜索
   */
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  /**
   * 通知父组件搜索变化
   */
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  /**
   * 处理键盘事件
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          window.location.href = `/blog/${results[selectedIndex].slug}`;
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  /**
   * 清除搜索
   */
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  /**
   * 高亮搜索词
   */
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-cyber-cyan/20 text-cyber-cyan px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  /**
   * 格式化日期
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="cyber-input w-full pl-12 pr-12 py-3 bg-cyber-dark border border-cyber-cyan/30 rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-cyber-dark border border-cyber-cyan/30 rounded-lg shadow-2xl shadow-cyber-cyan/10 overflow-hidden z-50"
          >
            {/* 搜索状态 */}
            {isSearching && (
              <div className="p-4 text-center text-gray-400">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                  <span>搜索中...</span>
                </div>
              </div>
            )}

            {/* 无结果 */}
            {!isSearching && results.length === 0 && query && (
              <div className="p-8 text-center text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>未找到相关文章</p>
                <p className="text-sm mt-1">试试其他关键词</p>
              </div>
            )}

            {/* 搜索结果列表 */}
            {!isSearching && results.length > 0 && (
              <>
                <div className="px-4 py-2 bg-cyber-muted/30 border-b border-cyber-cyan/10">
                  <span className="text-sm text-gray-400">
                    找到 {results.length} 篇相关文章
                  </span>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <a
                      key={result.id}
                      href={`/blog/${result.slug}`}
                      className={`block px-4 py-3 hover:bg-cyber-cyan/5 transition-colors ${
                        index === selectedIndex ? 'bg-cyber-cyan/10' : ''
                      }`}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start gap-3">
                        {/* 图标 */}
                        <div className="flex-shrink-0 mt-1">
                          <FileText className="w-5 h-5 text-cyber-cyan" />
                        </div>

                        {/* 内容 */}
                        <div className="flex-1 min-w-0">
                          {/* 标题 */}
                          <h4 className="font-medium text-white mb-1 line-clamp-1">
                            {highlightText(result.title, query)}
                          </h4>

                          {/* 摘要 */}
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                            {highlightText(result.excerpt, query)}
                          </p>

                          {/* 元信息 */}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {result.author}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(result.publishedAt)}
                            </span>
                            <span className="px-2 py-0.5 bg-cyber-purple/20 text-cyber-purple rounded">
                              {result.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* 底部提示 */}
                <div className="px-4 py-2 bg-cyber-muted/30 border-t border-cyber-cyan/10 text-xs text-gray-500 text-center">
                  使用 ↑ ↓ 键导航，Enter 键打开，Esc 键关闭
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogSearch;
