'use client';

/**
 * CyberPress Platform - Global Search Component
 * 全局搜索组件 - 支持快捷键、实时搜索、历史记录
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, FileText, User, Tag, Folder, TrendingUp } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { useSearch } from '@/services/data/dataService';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string | number;
  title: string;
  excerpt?: string;
  url: string;
  type: 'post' | 'page' | 'category' | 'tag' | 'author';
  meta?: {
    date?: string;
    category?: string;
    author?: string;
  };
}

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export function GlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // ==================== 初始化 ====================

  useEffect(() => {
    // 加载搜索历史
    const stored = localStorage.getItem('cyberpress-search-history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }

    // 注册键盘快捷键
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // ESC 关闭搜索
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // ==================== 自动聚焦 ====================

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // ==================== 搜索逻辑 ====================

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // 这里调用实际的搜索 API
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        } else {
          // 模拟结果（开发环境）
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (query.length > 2) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query, performSearch]);

  // ==================== 导航逻辑 ====================

  const navigateKeyboard = useCallback(
    (direction: 'up' | 'down') => {
      const maxIndex = results.length > 0 ? results.length - 1 : history.length - 1;

      if (direction === 'up') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
      } else {
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
      }
    },
    [results.length, history.length]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateKeyboard('down');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateKeyboard('up');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleResultClick(selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, navigateKeyboard]);

  // ==================== 事件处理 ====================

  const handleResultClick = (index: number) => {
    const items = results.length > 0 ? results : history;
    const item = items[index];

    if (results.length > 0) {
      router.push(item.url);
    } else if (history.length > 0) {
      setQuery(item.query);
    }

    setIsOpen(false);
    addToHistory(item.query || query);
  };

  const addToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const newHistory = [
      { query: searchQuery, timestamp: Date.now() },
      ...history.filter((h) => h.query !== searchQuery),
    ].slice(0, 10); // 保留最近 10 条

    setHistory(newHistory);
    localStorage.setItem('cyberpress-search-history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cyberpress-search-history');
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
        return <FileText className="w-4 h-4" />;
      case 'page':
        return <FileText className="w-4 h-4" />;
      case 'category':
        return <Folder className="w-4 h-4" />;
      case 'tag':
        return <Tag className="w-4 h-4" />;
      case 'author':
        return <User className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
        return 'text-cyber-cyan';
      case 'page':
        return 'text-cyber-purple';
      case 'category':
        return 'text-cyber-pink';
      case 'tag':
        return 'text-cyber-yellow';
      case 'author':
        return 'text-cyber-green';
      default:
        return 'text-gray-400';
    }
  };

  // ==================== 渲染 ====================

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          'bg-cyber-card border border-cyber-border',
          'hover:border-cyber-cyan/50 transition-all',
          'text-gray-400 hover:text-white',
          'w-full max-w-md'
        )}
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">搜索...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-cyber-dark rounded border border-cyber-border">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* 搜索弹窗 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* 搜索面板 */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
            >
              <div className="cyber-card mx-4 border-2 border-cyber-cyan/30 shadow-2xl overflow-hidden">
                {/* 搜索输入框 */}
                <div className="flex items-center gap-4 p-4 border-b border-cyber-border">
                  <Search className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索文章、页面、分类、标签..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
                  />
                  <button
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                    }}
                    className={cn(
                      'p-1 rounded transition-colors',
                      query ? 'text-gray-400 hover:text-white' : 'text-gray-600'
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs bg-cyber-dark rounded border border-cyber-border">
                    ESC
                  </kbd>
                </div>

                {/* 搜索结果 */}
                <div ref={searchResultsRef} className="max-h-[60vh] overflow-y-auto">
                  {/* 加载状态 */}
                  {isLoading && (
                    <div className="p-8 text-center text-gray-400">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-cyber-cyan border-t-transparent" />
                      <p className="mt-4">搜索中...</p>
                    </div>
                  )}

                  {/* 无结果 */}
                  {!isLoading && query.length > 2 && results.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>没有找到 &quot;{query}&quot; 的结果</p>
                      <p className="text-sm mt-2">试试其他关键词？</p>
                    </div>
                  )}

                  {/* 搜索结果列表 */}
                  {!isLoading && results.length > 0 && (
                    <div className="p-2">
                      <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                        搜索结果
                      </div>
                      {results.map((result, index) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(index)}
                          className={cn(
                            'w-full flex items-start gap-3 p-3 rounded-lg',
                            'text-left transition-colors',
                            index === selectedIndex
                              ? 'bg-cyber-cyan/10 text-white'
                              : 'hover:bg-cyber-card text-gray-300'
                          )}
                        >
                          <div className={cn('flex-shrink-0 mt-1', getTypeColor(result.type))}>
                            {getTypeIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{result.title}</div>
                            {result.excerpt && (
                              <div className="text-sm text-gray-500 truncate mt-0.5">
                                {result.excerpt}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 搜索历史 */}
                  {!isLoading && query.length === 0 && history.length > 0 && (
                    <div className="p-2">
                      <div className="flex items-center justify-between px-4 py-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          最近搜索
                        </div>
                        <button
                          onClick={clearHistory}
                          className="text-xs text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
                        >
                          清除
                        </button>
                      </div>
                      {history.map((item, index) => (
                        <button
                          key={item.timestamp}
                          onClick={() => {
                            setQuery(item.query);
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 p-3 rounded-lg',
                            'text-left transition-colors',
                            index === selectedIndex
                              ? 'bg-cyber-cyan/10 text-white'
                              : 'hover:bg-cyber-card text-gray-300'
                          )}
                        >
                          <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="flex-1">{item.query}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 快捷键提示 */}
                  {!isLoading && query.length === 0 && history.length === 0 && (
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <kbd className="px-2 py-1 bg-cyber-dark rounded border border-cyber-border">
                            ↑↓
                          </kbd>
                          <span>导航结果</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <kbd className="px-2 py-1 bg-cyber-dark rounded border border-cyber-border">
                            ↵
                          </kbd>
                          <span>打开结果</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <kbd className="px-2 py-1 bg-cyber-dark rounded border border-cyber-border">
                            ESC
                          </kbd>
                          <span>关闭</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <kbd className="px-2 py-1 bg-cyber-dark rounded border border-cyber-border">
                            ⌘K
                          </kbd>
                          <span>快捷打开</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 底部提示 */}
                <div className="px-4 py-2 border-t border-cyber-border text-xs text-gray-500">
                  由 CyberPress 搜索引擎驱动
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
