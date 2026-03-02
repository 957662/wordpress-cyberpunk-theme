'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Tag,
  FileText,
  ChevronRight,
  Sparkles,
  History,
  Filter
} from 'lucide-react';

/**
 * SearchSuggestion - 搜索建议组件
 *
 * 功能特性：
 * - 实时搜索建议
 * - 搜索历史记录
 * - 热门搜索推荐
 * - 智能关键词高亮
 * - 快捷键支持
 * - 分类筛选
 */

export interface SuggestionItem {
  id: string;
  type: 'history' | 'trending' | 'post' | 'tag' | 'category';
  title: string;
  url?: string;
  count?: number;
  highlight?: string[];
}

export interface SearchSuggestionProps {
  /** 占位符文本 */
  placeholder?: string;
  /** 热门搜索项 */
  trendingItems?: SuggestionItem[];
  /** 搜索建议API */
  onSearch?: (query: string) => Promise<SuggestionItem[]>;
  /** 最大建议数量 */
  maxSuggestions?: number;
  /** 是否显示历史记录 */
  showHistory?: boolean;
  /** 是否显示热门搜索 */
  showTrending?: boolean;
  /** 自定义容器类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 搜索回调 */
  onSearchSubmit?: (query: string) => void;
  /** 建议项点击回调 */
  onSuggestionClick?: (item: SuggestionItem) => void;
  /** 防抖延迟 */
  debounceDelay?: number;
}

/**
 * 搜索历史管理
 */
const useSearchHistory = (maxItems: number = 10) => {
  const [history, setHistory] = useState<string[]>([]);

  // 加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  // 添加搜索历史
  const addToHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== query);
      const newHistory = [query, ...filtered].slice(0, maxItems);
      localStorage.setItem('search-history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, [maxItems]);

  // 清除历史记录
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('search-history');
  }, []);

  // 删除单条历史
  const removeFromHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item !== query);
      localStorage.setItem('search-history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  return { history, addToHistory, clearHistory, removeFromHistory };
};

/**
 * 搜索建议项
 */
interface SuggestionItemProps {
  item: SuggestionItem;
  query: string;
  onClick: () => void;
  index: number;
}

const SuggestionItemComponent: React.FC<SuggestionItemProps> = ({
  item,
  query,
  onClick,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 图标映射
  const icons = {
    history: <History className="w-4 h-4 text-gray-400" />,
    trending: <TrendingUp className="w-4 h-4 text-cyber-cyan" />,
    post: <FileText className="w-4 h-4 text-gray-400" />,
    tag: <Tag className="w-4 h-4 text-cyber-purple" />,
    category: <Filter className="w-4 h-4 text-gray-400" />,
  };

  // 高亮关键词
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-cyber-cyan/30 text-cyber-cyan rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3',
        'hover:bg-gray-800/50 transition-colors',
        'text-left group'
      )}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4 }}
    >
      {/* 图标 */}
      <div className="flex-shrink-0">{icons[item.type]}</div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'text-sm truncate',
            isHovered ? 'text-cyber-cyan' : 'text-gray-200'
          )}
        >
          {highlightText(item.title, query)}
        </div>

        {/* 附加信息 */}
        {item.count !== undefined && (
          <div className="text-xs text-gray-500 mt-0.5">
            {item.count} 个结果
          </div>
        )}
      </div>

      {/* 箭头 */}
      <motion.div
        className="flex-shrink-0 text-gray-600"
        animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0 }}
      >
        <ChevronRight className="w-4 h-4" />
      </motion.div>
    </motion.button>
  );
};

/**
 * SearchSuggestion 主组件
 */
export const SearchSuggestion: React.FC<SearchSuggestionProps> = ({
  placeholder = '搜索文章、标签...',
  trendingItems = [],
  onSearch,
  maxSuggestions = 8,
  showHistory = true,
  showTrending = true,
  className,
  style,
  onSearchSubmit,
  onSuggestionClick,
  debounceDelay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const { history, addToHistory, clearHistory, removeFromHistory } =
    useSearchHistory(10);

  // 搜索建议
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      if (onSearch) {
        const results = await onSearch(searchQuery);
        setSuggestions(results.slice(0, maxSuggestions));
      } else {
        // 默认建议逻辑
        const defaultSuggestions: SuggestionItem[] = [
          {
            id: '1',
            type: 'post',
            title: `${searchQuery} 相关文章`,
            url: `/search?q=${encodeURIComponent(searchQuery)}`,
          },
        ];
        setSuggestions(defaultSuggestions);
      }
    } catch (e) {
      console.error('Failed to fetch suggestions:', e);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch, maxSuggestions]);

  // 防抖搜索
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, debounceDelay);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, fetchSuggestions, debounceDelay]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const allItems = getAllItems();

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < allItems.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : allItems.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && allItems[selectedIndex]) {
            handleItemClick(allItems[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 获取所有建议项
  const getAllItems = () => {
    const items: SuggestionItem[] = [];

    // 搜索建议
    if (query.trim()) {
      items.push(...suggestions);
    } else {
      // 历史记录
      if (showHistory && history.length > 0) {
        items.push(
          ...history.map((item) => ({
            id: `history-${item}`,
            type: 'history' as const,
            title: item,
          }))
        );
      }

      // 热门搜索
      if (showTrending && trendingItems.length > 0) {
        items.push(...trendingItems);
      }
    }

    return items;
  };

  // 处理搜索提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToHistory(query);
      onSearchSubmit?.(query);
      setIsOpen(false);
    }
  };

  // 处理建议项点击
  const handleItemClick = (item: SuggestionItem) => {
    if (item.type === 'history') {
      setQuery(item.title);
      addToHistory(item.title);
      onSearchSubmit?.(item.title);
    } else {
      onSuggestionClick?.(item);
      if (item.url) {
        window.location.href = item.url;
      }
    }
    setIsOpen(false);
  };

  // 清除输入
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const allItems = getAllItems();

  return (
    <div
      ref={containerRef}
      className={cn('search-suggestion relative', className)}
      style={style}
    >
      {/* 搜索输入框 */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-12 pr-12 py-3',
              'bg-gray-800/50 border border-gray-700 rounded-xl',
              'text-white placeholder-gray-500',
              'focus:outline-none focus:border-cyber-cyan',
              'transition-colors'
            )}
          />

          {query && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* 快捷键提示 */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
          <span className="hidden sm:inline">Ctrl K</span>
        </div>
      </form>

      {/* 建议下拉列表 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 w-full mt-2',
              'bg-gray-900/95 backdrop-blur-lg',
              'border border-gray-700 rounded-xl',
              'shadow-2xl overflow-hidden'
            )}
          >
            {/* 加载状态 */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Sparkles className="w-6 h-6 text-cyber-cyan animate-pulse" />
                <span className="ml-2 text-gray-400">搜索中...</span>
              </div>
            )}

            {/* 建议列表 */}
            {!isLoading && allItems.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {/* 分组标题 */}
                {!query.trim() && showHistory && history.length > 0 && (
                  <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400">
                        搜索历史
                      </span>
                      <button
                        onClick={clearHistory}
                        className="text-xs text-cyber-cyan hover:text-cyber-cyan/80"
                      >
                        清除
                      </button>
                    </div>
                  </div>
                )}

                {!query.trim() && showTrending && trendingItems.length > 0 && (
                  <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                    <span className="text-xs font-medium text-gray-400">
                      热门搜索
                    </span>
                  </div>
                )}

                {/* 建议项 */}
                <div className="py-2">
                  {allItems.map((item, index) => (
                    <SuggestionItemComponent
                      key={item.id}
                      item={item}
                      query={query}
                      onClick={() => handleItemClick(item)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 无结果 */}
            {!isLoading && allItems.length === 0 && query.trim() && (
              <div className="py-8 text-center text-gray-500">
                没有找到相关结果
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 全局搜索快捷键Hook
 */
export const useGlobalSearchHotkey = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput instanceof HTMLInputElement) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};

export default SearchSuggestion;
