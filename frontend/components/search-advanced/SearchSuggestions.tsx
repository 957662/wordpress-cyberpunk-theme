'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';

interface Suggestion {
  id: string;
  text: string;
  type: 'query' | 'post' | 'tag' | 'category';
  slug?: string;
}

interface SearchSuggestionsProps {
  onSearch: (query: string) => Promise<Suggestion[]>;
  onSelectSuggestion?: (suggestion: Suggestion) => void;
  placeholder?: string;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSearch,
  onSelectSuggestion,
  placeholder = 'Search...',
  className = '',
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async (searchQuery: string) => {
    setIsSearching(true);
    try {
      const results = await onSearch(searchQuery);
      setSuggestions(results);
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSubmit();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSubmit = () => {
    if (!query.trim()) return;

    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  const handleSelect = (suggestion: Suggestion) => {
    if (suggestion.slug) {
      router.push(`/blog/${suggestion.slug}`);
    } else {
      setQuery(suggestion.text);
      handleSubmit();
    }
    setIsOpen(false);

    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
  };

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'query':
        return <Search size={16} />;
      case 'post':
        return <TrendingUp size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getSuggestionColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'query':
        return 'text-cyber-cyan';
      case 'post':
        return 'text-cyber-purple';
      case 'tag':
        return 'text-cyber-pink';
      case 'category':
        return 'text-cyber-green';
      default:
        return 'text-cyber-muted';
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyber-cyan/60" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 || recentSearches.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-cyber-dark/50 backdrop-blur-md border border-cyber-cyan/30 rounded-lg text-white placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-cyan/60 transition-colors"
        />
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-cyber-dark/95 backdrop-blur-md border border-cyber-cyan/30 rounded-lg shadow-xl overflow-hidden"
          >
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-cyber-muted uppercase">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={search}
                    whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                    onClick={() => handleSelect({ id: `recent-${index}`, text: search, type: 'query' })}
                    className="w-full px-3 py-2 text-left text-white hover:text-cyber-cyan transition-colors rounded flex items-center gap-3"
                  >
                    <Clock size={16} className="text-cyber-muted" />
                    <span>{search}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.id}
                    whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                    onClick={() => handleSelect(suggestion)}
                    className={`w-full px-3 py-2 text-left rounded flex items-center gap-3 transition-colors ${
                      selectedIndex === index
                        ? 'bg-cyber-cyan/20 text-cyber-cyan'
                        : 'text-white hover:text-cyber-cyan'
                    }`}
                  >
                    <span className={getSuggestionColor(suggestion.type)}>
                      {getSuggestionIcon(suggestion.type)}
                    </span>
                    <span className="flex-1">{suggestion.text}</span>
                    <span className="text-xs text-cyber-muted capitalize">
                      {suggestion.type}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Searching State */}
            {isSearching && (
              <div className="p-4 text-center text-cyber-muted">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </div>
              </div>
            )}

            {/* No Results */}
            {!isSearching && query && suggestions.length === 0 && (
              <div className="p-4 text-center text-cyber-muted">
                No suggestions found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchSuggestions;
