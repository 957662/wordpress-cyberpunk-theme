'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  X,
  Search,
  TrendingUp,
  Flame
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  count?: number;
}

interface SearchHistoryProps {
  onSelect?: (query: string) => void;
  onClear?: () => void;
  maxItems?: number;
  showTrending?: boolean;
  className?: string;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  onSelect,
  onClear,
  maxItems = 10,
  showTrending = true,
  className = '',
}) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [trending, setTrending] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    // 从 localStorage 加载搜索历史
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('search-history');
        if (stored) {
          const parsed = JSON.parse(stored);
          const historyWithDates = parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));
          setHistory(historyWithDates.slice(0, maxItems));
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    };

    loadHistory();
  }, [maxItems]);

  useEffect(() => {
    // 模拟热门搜索（实际应从 API 获取）
    if (showTrending) {
      setTrending([
        { query: 'Cyberpunk 2077', timestamp: new Date(), count: 1234 },
        { query: 'Next.js 14', timestamp: new Date(), count: 987 },
        { query: 'TypeScript', timestamp: new Date(), count: 876 },
        { query: 'FastAPI', timestamp: new Date(), count: 765 },
        { query: 'React Server Components', timestamp: new Date(), count: 654 },
      ]);
    }
  }, [showTrending]);

  const addToHistory = (query: string) => {
    const newItem: SearchHistoryItem = {
      query,
      timestamp: new Date(),
    };

    // 移除重复项并添加到顶部
    const filtered = history.filter(item => item.query !== query);
    const newHistory = [newItem, ...filtered].slice(0, maxItems);

    setHistory(newHistory);

    // 保存到 localStorage
    try {
      localStorage.setItem('search-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const removeFromHistory = (query: string) => {
    const newHistory = history.filter(item => item.query !== query);
    setHistory(newHistory);

    try {
      localStorage.setItem('search-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to update search history:', error);
    }
  };

  const clearHistory = () => {
    setHistory([]);

    try {
      localStorage.removeItem('search-history');
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }

    onClear?.();
  };

  const handleSelect = (query: string) => {
    addToHistory(query);
    onSelect?.(query);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (history.length === 0 && !showTrending) {
    return null;
  }

  return (
    <div className={`search-history ${className}`}>
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        {/* Recent Searches */}
        {history.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-200">Recent Searches</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear all
              </motion.button>
            </div>

            <div className="space-y-2">
              {history.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between group"
                >
                  <button
                    onClick={() => handleSelect(item.query)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <Search className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm text-gray-300 group-hover:text-cyber-cyan transition-colors">
                      {item.query}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {formatTime(item.timestamp)}
                    </span>
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromHistory(item.query)}
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500 hover:text-red-400" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        {showTrending && trending.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold text-gray-200">Trending</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {trending.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(item.query)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-full text-sm hover:border-orange-500/50 transition-colors"
                >
                  <TrendingUp className="w-3 h-3 text-orange-400" />
                  <span className="text-gray-300">{item.query}</span>
                  {item.count && (
                    <span className="text-xs text-gray-500">
                      {item.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook 版本
export const useSearchHistory = (maxItems: number = 10) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('search-history');
      if (stored) {
        const parsed = JSON.parse(stored);
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(historyWithDates.slice(0, maxItems));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, [maxItems]);

  const addToHistory = (query: string) => {
    const newItem: SearchHistoryItem = {
      query,
      timestamp: new Date(),
    };

    const filtered = history.filter(item => item.query !== query);
    const newHistory = [newItem, ...filtered].slice(0, maxItems);

    setHistory(newHistory);

    try {
      localStorage.setItem('search-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('search-history');
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  return { history, addToHistory, clearHistory };
};

export default SearchHistory;
