'use client';

/**
 * SearchModal - 全局搜索模态框组件
 * 提供快速搜索功能，支持文章、分类、标签搜索
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Folder, Tag, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { debounce } from '@/lib/utils';
import { useSearch, useSearchSuggestions } from '@/lib/wordpress/hooks';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface SearchResult {
  id: number;
  type: 'post' | 'category' | 'tag';
  title: string;
  url: string;
  excerpt?: string;
  date?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchType, setSearchType] = useState<'all' | 'posts' | 'categories' | 'tags'>('all');

  const { results, loading: searchLoading } = useSearch();
  const { suggestions, loading: suggestionsLoading } = useSearchSuggestions();

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setQuery(value);
    }, 300),
    []
  );

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    onClose();
    setQuery('');
  };

  const getSuggestions = () => {
    if (query.length < 2) return [];
    return suggestions.slice(0, 5);
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'post':
        return <FileText className="w-4 h-4" />;
      case 'category':
        return <Folder className="w-4 h-4" />;
      case 'tag':
        return <Tag className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post':
        return '文章';
      case 'category':
        return '分类';
      case 'tag':
        return '标签';
      default:
        return '其他';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* 模态框 */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 搜索头部 */}
              <div className="flex items-center gap-4 p-6 border-b border-gray-800">
                <Search className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="搜索文章、分类、标签..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 outline-none"
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* 搜索类型切换 */}
              <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-800 bg-gray-900/50">
                <button
                  onClick={() => setSearchType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchType === 'all'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setSearchType('posts')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchType === 'posts'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  文章
                </button>
                <button
                  onClick={() => setSearchType('categories')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchType === 'categories'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  分类
                </button>
                <button
                  onClick={() => setSearchType('tags')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchType === 'tags'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  标签
                </button>
              </div>

              {/* 搜索结果 */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query.length < 2 ? (
                  /* 空状态 - 显示热门搜索 */
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                      <TrendingUp className="w-5 h-5" />
                      <h3 className="text-sm font-medium">热门搜索</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', '赛博朋克'].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchLoading || suggestionsLoading ? (
                  /* 加载状态 */
                  <div className="p-12 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-4 text-gray-400">搜索中...</p>
                  </div>
                ) : results.length > 0 ? (
                  /* 搜索结果列表 */
                  <div className="p-4">
                    {results.map((result, index) => (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl transition-colors text-left ${
                          index === selectedIndex
                            ? 'bg-cyan-500/10 border border-cyan-500/30'
                            : 'hover:bg-gray-800 border border-transparent'
                        }`}
                      >
                        <div className="mt-1 text-cyan-400">
                          {getIconByType(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-medium truncate">{result.title}</h4>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          {result.excerpt && (
                            <p className="text-sm text-gray-400 line-clamp-2">{result.excerpt}</p>
                          )}
                          {result.date && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{result.date}</span>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  /* 无结果 */
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-white mb-2">未找到结果</h3>
                    <p className="text-gray-400">试试其他关键词吧</p>
                  </div>
                )}
              </div>

              {/* 搜索提示 */}
              <div className="px-6 py-3 border-t border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-gray-800 rounded">↑↓</kbd>
                      导航
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-gray-800 rounded">Enter</kbd>
                      选择
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-gray-800 rounded">Esc</kbd>
                      关闭
                    </span>
                  </div>
                  <span>{results.length} 个结果</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
