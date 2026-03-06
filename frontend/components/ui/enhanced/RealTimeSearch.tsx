'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import Input from '../Input';
import Button from '../Button';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'post' | 'page' | 'category' | 'tag';
  url: string;
  thumbnail?: string;
}

interface RealTimeSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  className?: string;
  maxResults?: number;
  showRecentSearches?: boolean;
  showSearchHistory?: boolean;
  minChars?: number;
}

const RealTimeSearch: React.FC<RealTimeSearchProps> = ({
  onSearch,
  placeholder = 'Search articles, pages, tags...',
  className = '',
  maxResults = 8,
  showRecentSearches = true,
  showSearchHistory = true,
  minChars = 2,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!showSearchHistory) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== searchTerm);
      const updated = [searchTerm, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, [showSearchHistory]);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < minChars) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await onSearch(debouncedQuery);
        setResults(searchResults.slice(0, maxResults));
        setShowResults(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, onSearch, maxResults, minChars]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showResults) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setShowResults(false);
          setSelectedIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResults, results, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    window.location.href = result.url;
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    saveRecentSearch(searchTerm);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getResultIcon = (type: SearchResult['type']) => {
    const icons = {
      post: '📝',
      page: '📄',
      category: '📁',
      tag: '🏷️',
    };
    return icons[type] || '🔍';
  };

  return (
    <div ref={searchRef} className={`real-time-search ${className}`} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          onFocus={() => query.length >= minChars && setShowResults(true)}
          className="search-input"
          style={{
            paddingRight: '40px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            color: '#fff',
          }}
        />
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#00f0ff',
              fontSize: '18px',
            }}
          >
            ⚡
          </motion.div>
        )}
        {!isLoading && query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#00f0ff',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="search-results"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              background: 'rgba(0, 0, 0, 0.95)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            {results.length > 0 ? (
              <>
                <ul style={{ listStyle: 'none', padding: '8px', margin: 0 }}>
                  {results.map((result, index) => (
                    <motion.li
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: selectedIndex === index ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{getResultIcon(result.type)}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#00f0ff',
                              marginBottom: '4px',
                            }}
                          >
                            {result.title}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.6)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {result.excerpt}
                          </div>
                        </div>
                      </button>
                    </motion.li>
                  ))}
                </ul>

                <div
                  style={{
                    padding: '8px',
                    borderTop: '1px solid rgba(0, 240, 255, 0.2)',
                    fontSize: '11px',
                    color: '#00f0ff',
                    textAlign: 'center',
                    opacity: 0.7,
                  }}
                >
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </div>
              </>
            ) : query.length >= minChars ? (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                <div>No results found</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Try different keywords
                </div>
              </div>
            ) : showRecentSearches && recentSearches.length > 0 ? (
              <>
                <div
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#00f0ff', fontWeight: 600 }}>
                    Recent Searches
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    Clear
                  </Button>
                </div>
                <ul style={{ listStyle: 'none', padding: '8px', margin: 0 }}>
                  {recentSearches.map((searchTerm, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleRecentSearchClick(searchTerm)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span>🕐</span>
                        {searchTerm}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .search-result-item:hover {
          background: rgba(0, 240, 255, 0.1) !important;
        }

        .search-results ::-webkit-scrollbar {
          width: 6px;
        }

        .search-results ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        .search-results ::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.3);
          border-radius: 3px;
        }

        .search-results ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default RealTimeSearch;
