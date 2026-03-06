'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface FuzzySearchProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
  onSelect: (item: T) => void;
  placeholder?: string;
  debounceMs?: number;
  threshold?: number;
  renderResult?: (item: T, query: string) => React.ReactNode;
  className?: string;
  renderInput?: (props: {
    value: string;
    onChange: (value: string) => void;
    isSearching: boolean;
  }) => React.ReactNode;
}

/**
 * 模糊搜索组件
 * 支持容错搜索和实时结果过滤
 */
export function FuzzySearch<T>({
  data,
  searchKeys,
  onSelect,
  placeholder = 'Search...',
  debounceMs = 300,
  threshold = 0.6,
  renderResult,
  className,
  renderInput
}: FuzzySearchProps<T>) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, debounceMs);

  /**
   * 计算字符串相似度（Levenshtein 距离）
   */
  const calculateSimilarity = useCallback((str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const costs: number[] = [];
    for (let i = 0; i <= longer.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= shorter.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[shorter.length] = lastValue;
    }

    return (longer.length - costs[shorter.length]) / longer.length;
  }, []);

  /**
   * 搜索过滤数据
   */
  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim()) return data.slice(0, 10);

    const query = debouncedQuery.toLowerCase();

    return data
      .map(item => {
        let maxScore = 0;

        searchKeys.forEach(key => {
          const value = String(item[key] || '').toLowerCase();
          const score = calculateSimilarity(query, value);
          maxScore = Math.max(maxScore, score);
        });

        return { item, score: maxScore };
      })
      .filter(result => result.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(result => result.item);
  }, [data, debouncedQuery, searchKeys, threshold, calculateSimilarity]);

  const defaultRenderResult = (item: T, queryStr: string) => {
    const firstValue = searchKeys
      .map(key => String(item[key] || ''))
      .find(v => v.toLowerCase().includes(queryStr.toLowerCase()));

    if (!firstValue) {
      return <div>{String(item[searchKeys[0]] || '')}</div>;
    }

    const parts = firstValue.split(new RegExp(`(${queryStr})`, 'gi'));

    return (
      <div className="text-cyber-cyan/80">
        {parts.map((part, index) =>
          part.toLowerCase() === queryStr.toLowerCase() ? (
            <mark key={index} className="bg-cyber-cyan/20 text-cyber-cyan rounded px-1">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </div>
    );
  };

  return (
    <div className={cn('fuzzy-search', className)}>
      {renderInput ? (
        renderInput({
          value: query,
          onChange: setQuery,
          isSearching
        })
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-cyan/50" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-cyber-cyan/50" />
          )}
        </div>
      )}

      {query && (
        <div className="mt-2 bg-cyber-dark border border-cyber-cyan/20 rounded-lg overflow-hidden shadow-lg">
          {filteredData.length > 0 ? (
            <div className="max-h-96 overflow-auto">
              {filteredData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelect(item);
                    setQuery('');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-cyber-muted/30 transition-colors border-b border-cyber-cyan/10 last:border-0"
                >
                  {renderResult ? renderResult(item, query) : defaultRenderResult(item, query)}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-cyber-cyan/60">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 快速搜索过滤器 Hook
 */
export const useFuzzyFilter = <T extends Record<string, any>>(
  data: T[],
  searchKeys: (keyof T)[],
  threshold: number = 0.6
) => {
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const costs: number[] = [];
    for (let i = 0; i <= longer.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= shorter.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[shorter.length] = lastValue;
    }

    return (longer.length - costs[shorter.length]) / longer.length;
  };

  const filter = useCallback(
    (query: string): T[] => {
      if (!query.trim()) return data;

      const queryLower = query.toLowerCase();

      return data
        .map(item => {
          let maxScore = 0;

          searchKeys.forEach(key => {
            const value = String(item[key] || '').toLowerCase();
            const score = calculateSimilarity(queryLower, value);
            maxScore = Math.max(maxScore, score);
          });

          return { item, score: maxScore };
        })
        .filter(result => result.score >= threshold)
        .sort((a, b) => b.score - a.score)
        .map(result => result.item);
    },
    [data, searchKeys, threshold]
  );

  return { filter };
};

export default FuzzySearch;
