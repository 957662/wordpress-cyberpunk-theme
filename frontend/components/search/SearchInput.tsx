'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'suggestion';
}

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

const DEFAULT_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', text: '赛博朋克设计', type: 'trending' },
  { id: '2', text: 'Next.js 14', type: 'trending' },
  { id: '3', text: 'TypeScript 最佳实践', type: 'trending' },
  { id: '4', text: 'React 性能优化', type: 'trending' },
];

export function SearchInput({
  placeholder = '搜索文章、标签、作者...',
  className,
  onSearch,
}: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // 更新建议
  useEffect(() => {
    if (query.trim()) {
      // 模拟搜索建议
      const filtered = DEFAULT_SUGGESTIONS.filter(s =>
        s.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      // 显示历史记录和热门搜索
      const historySuggestions = searchHistory.slice(0, 3).map((text, index) => ({
        id: `history-${index}`,
        text,
        type: 'history' as const,
      }));
      setSuggestions([...historySuggestions, ...DEFAULT_SUGGESTIONS.slice(0, 2)]);
    }
  }, [query, searchHistory]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    // 保存到历史记录
    const newHistory = [finalQuery, ...searchHistory.filter(h => h !== finalQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));

    // 执行搜索
    if (onSearch) {
      onSearch(finalQuery);
    } else {
      router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
    }

    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  };

  return (
    <div className={cn('relative', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-cyan" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-cyber-dark/50 border-cyber-cyan/30 focus:border-cyber-cyan text-white placeholder:text-gray-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 搜索建议下拉框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-cyber-dark border border-cyber-cyan/30 rounded-lg overflow-hidden z-50 shadow-lg shadow-cyber-cyan/10"
          >
            {/* 历史记录 */}
            {!query && searchHistory.length > 0 && (
              <div className="p-3 border-b border-cyber-cyan/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-orbitron">
                    <Clock className="w-3 h-3" />
                    搜索历史
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-cyber-pink hover:text-cyber-pink/80 transition-colors"
                  >
                    清除
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.slice(0, 3).map((item, index) => (
                    <button
                      key={`history-${index}`}
                      onClick={() => handleSearch(item)}
                      className="w-full text-left px-3 py-2 rounded text-sm text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors flex items-center gap-2"
                    >
                      <Clock className="w-3 h-3" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 热门搜索 */}
            {!query && (
              <div className="p-3 border-b border-cyber-cyan/20">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-orbitron mb-2">
                  <TrendingUp className="w-3 h-3" />
                  热门搜索
                </div>
                <div className="space-y-1">
                  {DEFAULT_SUGGESTIONS.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearch(item.text)}
                      className="w-full text-left px-3 py-2 rounded text-sm text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors"
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 搜索建议 */}
            {query && suggestions.length > 0 && (
              <div className="p-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSearch(suggestion.text)}
                    className="w-full text-left px-3 py-2 rounded text-sm text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            )}

            {/* 无结果 */}
            {query && suggestions.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-sm">
                没有找到相关建议
              </div>
            )}

            {/* 搜索按钮 */}
            <div className="p-3 border-t border-cyber-cyan/20">
              <Button
                onClick={() => handleSearch(query)}
                disabled={!query.trim()}
                className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white hover:opacity-90"
              >
                搜索 "{query || '...'}"
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
