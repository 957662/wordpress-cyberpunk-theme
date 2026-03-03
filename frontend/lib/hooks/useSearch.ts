/**
 * useSearch Hook
 * 搜索功能 Hook
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { searchService, SearchResult, SearchOptions } from '@/lib/services/search.service';

export interface UseSearchOptions extends SearchOptions {
  debounceMs?: number;
  minLength?: number;
}

export interface UseSearchReturn {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  suggestions: string[];
  hasResults: boolean;
  hasSuggestions: boolean;
  setQuery: (query: string) => void;
  clearSearch: () => void;
  selectResult: (result: SearchResult) => void;
  search: (q: string) => Promise<void>;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceMs = 300,
    minLength = 2,
    ...searchOptions
  } = options;

  const [query, setQueryState] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const debounceRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // 执行搜索
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < minLength) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();

      // 执行搜索
      const searchResults = await searchService.search(searchQuery, searchOptions);
      setResults(searchResults);

      // 获取建议
      const searchSuggestions = await searchService.getSearchSuggestions(searchQuery);
      setSuggestions(searchSuggestions);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Search error:', err);
        setError(err.message || 'Search failed');
      }
    } finally {
      setLoading(false);
    }
  }, [minLength, searchOptions]);

  // 设置查询（带防抖）
  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);

    // 清除之前的定时器
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 设置新的定时器
    debounceRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, debounceMs);
  }, [debounceMs, performSearch]);

  // 立即搜索
  const search = useCallback(async (q: string) => {
    setQueryState(q);
    await performSearch(q);
  }, [performSearch]);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setQueryState('');
    setResults([]);
    setSuggestions([]);
    setError(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  // 选择结果
  const selectResult = useCallback((result: SearchResult) => {
    // 这里可以处理选择结果的逻辑
    // 例如：导航到结果页面
    if (typeof window !== 'undefined') {
      window.location.href = result.url;
    }
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 计算属性
  const hasResults = results.length > 0;
  const hasSuggestions = suggestions.length > 0;

  return {
    query,
    results,
    loading,
    error,
    suggestions,
    hasResults,
    hasSuggestions,
    setQuery,
    clearSearch,
    selectResult,
    search,
  };
}

/**
 * useSearchHistory Hook
 * 搜索历史管理
 */
export interface UseSearchHistoryReturn {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
}

export function useSearchHistory(): UseSearchHistoryReturn {
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('search-history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 添加到历史
  const addToHistory = useCallback((query: string) => {
    if (!query || query.trim().length === 0) return;

    searchService.addToHistory(query);
    const updatedHistory = searchService.getSearchHistory();
    setHistory(updatedHistory);

    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('search-history', JSON.stringify(updatedHistory));
    }
  }, []);

  // 从历史移除
  const removeFromHistory = useCallback((query: string) => {
    searchService.removeFromHistory(query);
    const updatedHistory = searchService.getSearchHistory();
    setHistory(updatedHistory);

    if (typeof window !== 'undefined') {
      localStorage.setItem('search-history', JSON.stringify(updatedHistory));
    }
  }, []);

  // 清除历史
  const clearHistory = useCallback(() => {
    searchService.clearSearchHistory();
    setHistory([]);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('search-history');
    }
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}

/**
 * useTrendingSearches Hook
 * 热门搜索
 */
export interface UseTrendingSearchesReturn {
  trending: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useTrendingSearches(): UseTrendingSearchesReturn {
  const [trending, setTrending] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchService.getTrendingSearches();
      setTrending(data);
    } catch (err: any) {
      console.error('Error fetching trending searches:', err);
      setError(err.message || 'Failed to fetch trending searches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return {
    trending,
    loading,
    error,
    refresh: fetchTrending,
  };
}

export default useSearch;
