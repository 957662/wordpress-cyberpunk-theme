/**
 * SearchDialog Component
 * 全局搜索对话框组件
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Folder, User } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'post' | 'page' | 'category' | 'tag' | 'author';
  title: string;
  url: string;
  description?: string;
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const debouncedQuery = useDebounce(query, 300);

  // 搜索函数
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // 这里应该调用实际的搜索 API
      // 暂时使用模拟数据
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'post',
          title: `${searchQuery} 相关文章 1`,
          url: `/blog/${searchQuery}-1`,
          description: '这是一篇关于...',
        },
        {
          id: '2',
          type: 'post',
          title: `${searchQuery} 相关文章 2`,
          url: `/blog/${searchQuery}-2`,
          description: '另一篇相关文章...',
        },
        {
          id: '3',
          type: 'category',
          title: searchQuery,
          url: `/categories/${searchQuery}`,
        },
      ];

      setResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 监听查询变化
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            window.location.href = results[selectedIndex].url;
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // 重置状态
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
      case 'page':
        return FileText;
      case 'category':
      case 'tag':
        return Folder;
      case 'author':
        return User;
      default:
        return FileText;
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl mx-4"
            >
              <div className="cyber-card overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-cyber-border">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索文章、页面、分类..."
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                    autoFocus
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-1 hover:bg-cyber-muted rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  <kbd className="px-2 py-1 text-xs bg-cyber-muted border border-cyber-border rounded text-gray-500">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {isLoading && (
                    <div className="p-8 text-center text-gray-400">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p>搜索中...</p>
                    </div>
                  )}

                  {!isLoading && query && results.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>没有找到相关结果</p>
                      <p className="text-sm mt-2">试试其他关键词</p>
                    </div>
                  )}

                  {!isLoading && results.length > 0 && (
                    <div className="p-2">
                      {results.map((result, index) => {
                        const Icon = getIcon(result.type);
                        return (
                          <a
                            key={result.id}
                            href={result.url}
                            onClick={onClose}
                            className={cn(
                              'flex items-start gap-3 p-3 rounded-lg transition-colors',
                              'hover:bg-cyber-muted',
                              index === selectedIndex && 'bg-cyber-muted'
                            )}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', getTypeColor(result.type))} />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white truncate">{result.title}</div>
                              {result.description && (
                                <div className="text-sm text-gray-400 truncate">{result.description}</div>
                              )}
                            </div>
                            <kbd
                              className={cn(
                                'px-2 py-1 text-xs bg-cyber-dark border border-cyber-border rounded text-gray-500',
                                index === selectedIndex && 'border-cyber-cyan text-cyber-cyan'
                              )}
                            >
                              {index + 1}
                            </kbd>
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {!query && (
                    <div className="p-8">
                      <p className="text-sm text-gray-400 mb-4">快速导航</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: '博客', href: '/blog' },
                          { label: '作品集', href: '/portfolio' },
                          { label: '关于', href: '/about' },
                          { label: '联系', href: '/contact' },
                        ].map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="p-3 text-center bg-cyber-muted border border-cyber-border rounded-lg text-gray-300 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-colors"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-cyber-border text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-cyber-muted border border-cyber-border rounded">↑↓</kbd>
                      导航
                    </span>
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-cyber-muted border border-cyber-border rounded">↵</kbd>
                      选择
                    </span>
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-cyber-muted border border-cyber-border rounded">ESC</kbd>
                      关闭
                    </span>
                  </div>
                  {results.length > 0 && (
                    <span>找到 {results.length} 个结果</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchDialog;
