'use client';

/**
 * SearchSuggestion Component
 * 搜索建议组件
 * 提供智能搜索建议和自动完成
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, TrendingUp, Tag } from 'lucide-react';

interface SuggestionItem {
  id: string;
  type: 'history' | 'trending' | 'tag' | 'post';
  text: string;
  url?: string;
  count?: number;
}

interface SearchSuggestionProps {
  /** 搜索关键词 */
  query: string;
  /** 搜索建议数据 */
  suggestions?: SuggestionItem[];
  /** 是否显示 */
  show: boolean;
  /** 隐藏建议框 */
  onHide: () => void;
  /** 选择建议 */
  onSelect: (suggestion: SuggestionItem) => void;
  /** 搜索历史 */
  searchHistory?: string[];
  /** 热门搜索 */
  trendingSearches?: string[];
  /** 热门标签 */
  popularTags?: string[];
  /** 自定义样式类名 */
  className?: string;
}

export function SearchSuggestion({
  query,
  suggestions = [],
  show,
  onHide,
  onSelect,
  searchHistory = [],
  trendingSearches = [],
  popularTags = [],
  className = '',
}: SearchSuggestionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onHide();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onHide]);

  if (!show) {
    return null;
  }

  // 过滤建议
  const filteredSuggestions = query
    ? suggestions.filter(s =>
        s.text.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // 是否显示搜索历史和热门搜索（仅在没有输入时）
  showDefaultSection = !query;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        absolute top-full left-0 right-0 mt-2 z-50
        cyber-card border border-cyber-border/50
        max-h-96 overflow-y-auto
        ${className}
      `}
    >
      {/* 搜索建议 */}
      {query && filteredSuggestions.length > 0 && (
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-mono text-gray-500 uppercase">
            搜索建议
          </div>
          {filteredSuggestions.map((suggestion) => (
            <motion.button
              key={suggestion.id}
              onClick={() => onSelect(suggestion)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-left transition-colors
                hover:bg-cyber-muted/30
              `}
              whileHover={{ x: 4 }}
            >
              {suggestion.type === 'history' && <Clock className="w-4 h-4 text-gray-500" />}
              {suggestion.type === 'trending' && <TrendingUp className="w-4 h-4 text-cyber-pink" />}
              {suggestion.type === 'tag' && <Tag className="w-4 h-4 text-cyber-cyan" />}

              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-300 truncate">
                  {suggestion.text}
                </div>
                {suggestion.count !== undefined && (
                  <div className="text-xs text-gray-500">
                    {suggestion.count} 个结果
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* 搜索历史 */}
      {!query && searchHistory.length > 0 && (
        <div className="p-2 border-b border-cyber-border">
          <div className="px-3 py-2 text-xs font-mono text-gray-500 uppercase flex items-center justify-between">
            <span>搜索历史</span>
            <button className="text-cyber-cyan hover:text-cyber-purple transition-colors">
              清除
            </button>
          </div>
          {searchHistory.slice(0, 5).map((item, index) => (
            <motion.button
              key={index}
              onClick={() => onSelect({
                id: `history-${index}`,
                type: 'history',
                text: item,
              })}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-left transition-colors
                hover:bg-cyber-muted/30
              `}
              whileHover={{ x: 4 }}
            >
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-300 truncate">{item}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* 热门搜索 */}
      {!query && trendingSearches.length > 0 && (
        <div className="p-2 border-b border-cyber-border">
          <div className="px-3 py-2 text-xs font-mono text-gray-500 uppercase flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-cyber-pink" />
            <span>热门搜索</span>
          </div>
          <div className="flex flex-wrap gap-2 px-3 pb-2">
            {trendingSearches.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => onSelect({
                  id: `trending-${index}`,
                  type: 'trending',
                  text: item,
                })}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  text-xs font-medium border
                  bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink
                  hover:bg-cyber-pink/20
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrendingUp className="w-3 h-3" />
                {item}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* 热门标签 */}
      {!query && popularTags.length > 0 && (
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-mono text-gray-500 uppercase flex items-center gap-2">
            <Tag className="w-3 h-3 text-cyber-cyan" />
            <span>热门标签</span>
          </div>
          <div className="flex flex-wrap gap-2 px-3 pb-2">
            {popularTags.map((tag, index) => (
              <motion.button
                key={index}
                onClick={() => onSelect({
                  id: `tag-${index}`,
                  type: 'tag',
                  text: tag,
                })}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  text-xs font-medium border
                  bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan
                  hover:bg-cyber-cyan/20
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* 无结果提示 */}
      {query && filteredSuggestions.length === 0 && (
        <div className="p-8 text-center">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            未找到相关建议
          </p>
          <p className="text-gray-500 text-xs mt-1">
            试试其他关键词
          </p>
        </div>
      )}
    </motion.div>
  );
}

/**
 * SearchInput Component
 * 带建议的搜索输入框
 */
interface SearchInputProps {
  /** 搜索值 */
  value: string;
  /** 值变化 */
  onChange: (value: string) => void;
  /** 搜索回调 */
  onSearch: (query: string) => void;
  /** 占位符 */
  placeholder?: string;
  /** 搜索建议数据 */
  suggestions?: SuggestionItem[];
  /** 搜索历史 */
  searchHistory?: string[];
  /** 热门搜索 */
  trendingSearches?: string[];
  /** 热门标签 */
  popularTags?: string[];
  /** 自定义样式类名 */
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = '搜索文章、标签、作者...',
  suggestions = [],
  searchHistory = [],
  trendingSearches = [],
  popularTags = [],
  className = '',
}: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (suggestion: SuggestionItem) => {
    onChange(suggestion.text);
    setShowSuggestions(false);
    onSearch(suggestion.text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      setShowSuggestions(false);
      onSearch(value.trim());
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className={`
              w-full pl-12 pr-4 py-3 bg-cyber-dark
              border border-cyber-border rounded-lg
              text-white placeholder-gray-500
              focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20
              transition-all
            `}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      <SearchSuggestion
        query={value}
        suggestions={suggestions}
        show={showSuggestions}
        onHide={() => setShowSuggestions(false)}
        onSelect={handleSelect}
        searchHistory={searchHistory}
        trendingSearches={trendingSearches}
        popularTags={popularTags}
      />
    </div>
  );
}
