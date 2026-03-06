'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface SearchOverlayProps {
  placeholder?: string;
  recentSearches?: string[];
  trendingSearches?: string[];
  popularTags?: string[];
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  placeholder = 'Search posts, tags, authors...',
  recentSearches = [],
  trendingSearches = [],
  popularTags = [],
  onSearch,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const suggestions = [
    ...recentSearches.map((s) => ({ type: 'recent' as const, text: s })),
    ...trendingSearches.map((s) => ({ type: 'trending' as const, text: s })),
  ];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'relative flex items-center gap-3 px-4 py-3',
          'bg-cyber-dark/50 border border-cyber-muted/30 rounded-lg',
          'hover:border-cyber-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]',
          'transition-all duration-300',
          'w-full max-w-md',
          className
        )}
      >
        <Search className="h-5 w-5 text-cyber-muted flex-shrink-0" />
        <span className="flex-1 text-left text-cyber-muted text-sm">{placeholder}</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-cyber-muted/10 text-cyber-muted rounded">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Content */}
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-cyber-dark border border-cyber-cyan/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-6 border-b border-cyber-muted/20">
                <form onSubmit={handleSubmit} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyber-cyan" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                      'w-full pl-12 pr-12 py-4',
                      'bg-cyber-dark/50 border border-cyber-muted/30 rounded-xl',
                      'text-white text-lg placeholder:text-cyber-muted',
                      'focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
                      'transition-all duration-300'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-cyber-muted/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-cyber-muted" />
                  </button>
                </form>
              </div>

              {/* Suggestions */}
              {!query && (
                <div className="max-h-[400px] overflow-y-auto">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="p-6 border-b border-cyber-muted/20">
                      <h3 className="text-sm font-semibold text-cyber-muted mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recent
                      </h3>
                      <div className="space-y-2">
                        {recentSearches.slice(0, 5).map((search, i) => (
                          <button
                            key={i}
                            onClick={() => handleSearch(search)}
                            className={cn(
                              'w-full text-left px-4 py-3 rounded-lg',
                              'hover:bg-cyber-cyan/10 transition-all duration-300',
                              'flex items-center justify-between group'
                            )}
                          >
                            <span className="text-white group-hover:text-cyber-cyan">{search}</span>
                            <X className="h-4 w-4 text-cyber-muted opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  {trendingSearches.length > 0 && (
                    <div className="p-6 border-b border-cyber-muted/20">
                      <h3 className="text-sm font-semibold text-cyber-muted mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Trending
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((search, i) => (
                          <button
                            key={i}
                            onClick={() => handleSearch(search)}
                            className={cn(
                              'px-3 py-1.5 text-sm rounded-lg',
                              'bg-cyber-dark/50 text-cyber-cyan border border-cyber-cyan/30',
                              'hover:bg-cyber-cyan/10 hover:border-cyber-cyan/50',
                              'transition-all duration-300'
                            )}
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Tags */}
                  {popularTags.length > 0 && (
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-cyber-muted mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Popular Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag, i) => (
                          <button
                            key={i}
                            onClick={() => handleSearch(`#${tag}`)}
                            className={cn(
                              'px-3 py-1.5 text-sm rounded-lg',
                              'bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30',
                              'hover:bg-cyber-purple/20',
                              'transition-all duration-300'
                            )}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="p-4 border-t border-cyber-muted/20 flex items-center justify-between text-xs text-cyber-muted">
                <div className="flex items-center gap-4">
                  <span>↑↓ to navigate</span>
                  <span>↵ to select</span>
                  <span>esc to close</span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>powered by CyberPress</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchOverlay;
