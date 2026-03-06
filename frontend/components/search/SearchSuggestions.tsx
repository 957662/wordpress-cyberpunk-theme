'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Loader2, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface Suggestion {
  id: string;
  text: string;
  type?: 'history' | 'trending' | 'suggestion';
  category?: string;
}

interface SearchSuggestionsProps {
  onSearch: (query: string) => void;
  getSuggestions?: (query: string) => Promise<string[]>;
  recentSearches?: string[];
  trendingSearches?: string[];
  placeholder?: string;
  debounceMs?: number;
  maxSuggestions?: number;
  className?: string;
}

/**
 * 搜索建议组件
 * 提供智能搜索建议、历史记录和热门搜索
 */
export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSearch,
  getSuggestions,
  recentSearches = [],
  trendingSearches = [],
  placeholder = 'Search...',
  debounceMs = 300,
  maxSuggestions = 5,
  className
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, debounceMs);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 获取搜索建议
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        // 显示历史和热门搜索
        const historySuggestions: Suggestion[] = recentSearches.slice(0, maxSuggestions).map((text, index) => ({
          id: `history-${index}`,
          text,
          type: 'history'
        }));

        const trendingSuggestions: Suggestion[] = trendingSearches.slice(0, maxSuggestions).map((text, index) => ({
          id: `trending-${index}`,
          text,
          type: 'trending'
        }));

        setSuggestions([...historySuggestions, ...trendingSuggestions]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        if (getSuggestions) {
          const results = await getSuggestions(debouncedQuery);
          const suggestionItems: Suggestion[] = results.slice(0, maxSuggestions).map((text, index) => ({
            id: `suggestion-${index}`,
            text,
            type: 'suggestion'
          }));
          setSuggestions(suggestionItems);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, getSuggestions, recentSearches, trendingSearches, maxSuggestions]);

  // 键盘导航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex].text);
          } else if (query.trim()) {
            handleSelect(query);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [selectedIndex, suggestions, query]
  );

  // 选择建议
  const handleSelect = useCallback(
    (text: string) => {
      setQuery(text);
      setIsOpen(false);
      setSelectedIndex(-1);
      onSearch(text);
    },
    [onSearch]
  );

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSuggestionIcon = (type?: string) => {
    switch (type) {
      case 'history':
        return <Clock className="w-4 h-4 text-cyber-cyan/60" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-cyber-pink" />;
      default:
        return <Search className="w-4 h-4 text-cyber-cyan/60" />;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-cyber-cyan/20 text-cyber-cyan rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn('search-suggestions', className)}
      onFocus={() => setIsOpen(true)}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-cyan/50" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-12"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-cyber-cyan/50" />
        )}
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(true);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-cyan/50 hover:text-cyber-cyan"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-2 bg-cyber-dark border border-cyber-cyan/20 rounded-lg overflow-hidden shadow-lg z-50">
          {suggestions.length > 0 ? (
            <div className="max-h-80 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSelect(suggestion.text)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full px-4 py-3 text-left hover:bg-cyber-muted/30 transition-colors border-b border-cyber-cyan/10 last:border-0 flex items-center gap-3',
                    selectedIndex === index && 'bg-cyber-muted/30'
                  )}
                >
                  {getSuggestionIcon(suggestion.type)}
                  <span className="flex-1 text-cyber-cyan/80">
                    {highlightMatch(suggestion.text, query)}
                  </span>
                  {suggestion.category && (
                    <span className="text-xs text-cyber-cyan/50 px-2 py-1 bg-cyber-muted/50 rounded">
                      {suggestion.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : !isLoading && query.trim() ? (
            <div className="px-4 py-8 text-center text-cyber-cyan/60">
              No suggestions found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

/**
 * 搜索建议管理 Hook
 */
export const useSearchSuggestions = (maxHistory: number = 10) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // 从 localStorage 加载历史记录
  useEffect(() => {
    const stored = localStorage.getItem('search-history');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // 添加搜索历史
  const addSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== query);
      const updated = [query, ...filtered].slice(0, maxHistory);

      // 保存到 localStorage
      localStorage.setItem('search-history', JSON.stringify(updated));

      return updated;
    });
  }, [maxHistory]);

  // 清除搜索历史
  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('search-history');
  }, []);

  // 删除单个历史记录
  const removeSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== query);
      localStorage.setItem('search-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    recentSearches,
    addSearch,
    clearHistory,
    removeSearch
  };
};

export default SearchSuggestions;
