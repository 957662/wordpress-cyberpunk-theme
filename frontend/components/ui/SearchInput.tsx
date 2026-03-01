'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Clock } from 'lucide-react';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showHistory?: boolean;
  maxHistoryItems?: number;
  className?: string;
}

export function SearchInput({
  onSearch,
  placeholder = 'Search...',
  showHistory = true,
  maxHistoryItems = 5,
  className = '',
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim()) {
        onSearch(searchQuery);

        // Add to search history
        const newHistoryItem: SearchHistoryItem = {
          query: searchQuery,
          timestamp: Date.now(),
        };

        setSearchHistory((prev) => {
          const filtered = prev.filter((item) => item.query !== searchQuery);
          return [newHistoryItem, ...filtered].slice(0, maxHistoryItems);
        });

        setQuery('');
      }
    },
    [onSearch, maxHistoryItems]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const removeFromHistory = (queryToRemove: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.query !== queryToRemove));
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center bg-gray-900/50 border rounded-xl transition-all ${
            isFocused ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'border-cyan-500/20'
          }`}
        >
          <Search className="w-5 h-5 text-cyan-600 ml-4 flex-shrink-0" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-cyan-100 placeholder-cyan-700 py-3 px-4"
          />

          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              type="button"
              onClick={() => setQuery('')}
              className="p-2 text-cyan-600 hover:text-cyan-400 transition-colors mr-2"
            >
              <X size={18} />
            </motion.button>
          )}
        </div>
      </form>

      {/* Search History Dropdown */}
      {isFocused &&
        showHistory &&
        searchHistory.length > 0 &&
        !query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden z-50"
          >
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-cyan-600 text-xs font-semibold uppercase">
                  Recent Searches
                </span>
                {searchHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-cyan-500 text-xs hover:text-cyan-400 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item.query)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-cyan-500/10 rounded-lg transition-colors text-left group"
                >
                  <Clock size={16} className="text-cyan-600 flex-shrink-0" />
                  <span className="flex-1 text-cyan-300 text-sm group-hover:text-cyan-100">
                    {item.query}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item.query);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-cyan-600 hover:text-red-400 transition-all"
                  >
                    <X size={14} />
                  </button>
                </button>
              ))}
            </div>
          </motion.div>
        )}
    </div>
  );
}
