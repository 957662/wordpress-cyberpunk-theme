'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  type: 'post' | 'page' | 'category';
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = 'Search articles, topics...',
  className,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }

    // Load trending searches (could be from API)
    setTrending(['Next.js', 'TypeScript', 'Cyberpunk', 'Web Development']);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);

    try {
      // API call to search
      // const response = await api.get(`/api/search?q=${searchQuery}`);
      // setResults(response.data);

      // Mock results for now
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: `Result for "${searchQuery}"`,
          excerpt: 'This is a sample search result...',
          slug: 'sample-post',
          type: 'post',
        },
      ];

      setResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      // Add to search history
      const newHistory = [query, ...searchHistory.filter((q) => q !== query)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));

      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(query)}`);

      setIsOpen(false);

      if (onSearch) {
        onSearch(query);
      }
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    router.push(`/${result.type}/${result.slug}`);
  };

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    handleSubmit(new Event('submit') as any);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 transition-colors',
              isOpen ? 'text-cyber-cyan' : 'text-gray-400'
            )}
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-12 pr-12 py-4 bg-cyber-dark/80 border rounded-lg',
              'text-white placeholder:text-gray-500',
              'focus:outline-none focus:border-cyber-cyan',
              'transition-all duration-200',
              isOpen ? 'border-cyber-cyan shadow-lg shadow-cyber-cyan/20' : 'border-cyber-cyan/30'
            )}
          />
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </motion.button>
          )}
        </div>

        {/* Quick shortcut hint */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
          <kbd className="px-2 py-1 bg-cyber-dark/60 border border-cyber-cyan/30 rounded text-xs text-gray-400">
            ⌘K
          </kbd>
        </div>
      </form>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg shadow-2xl overflow-hidden z-50"
          >
            {/* Search Results */}
            {query.length > 2 && (
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-cyber-cyan border-t-transparent" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result) => (
                      <motion.button
                        key={result.id}
                        whileHover={{ x: 4 }}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left p-3 rounded-lg hover:bg-cyber-cyan/10 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white mb-1 truncate">{result.title}</h4>
                            <p className="text-sm text-gray-400 line-clamp-2">{result.excerpt}</p>
                          </div>
                          <span className="px-2 py-1 bg-cyber-purple/20 text-cyber-purple text-xs rounded border border-cyber-purple/30 flex-shrink-0">
                            {result.type}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <Search size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No results found for "{query}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Suggestions */}
            {query.length <= 2 && (
              <div className="p-4">
                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div className="mb-4">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3">
                      <Clock size={16} />
                      Recent Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((term) => (
                        <motion.button
                          key={term}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickSearch(term)}
                          className="px-3 py-1.5 bg-cyber-dark/60 border border-cyber-cyan/30 rounded-full text-sm text-cyber-cyan hover:border-cyber-pink/50 hover:text-cyber-pink transition-all"
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                {trending.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3">
                      <TrendingUp size={16} />
                      Trending
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((term) => (
                        <motion.button
                          key={term}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickSearch(term)}
                          className="px-3 py-1.5 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/30 rounded-full text-sm text-cyber-cyan hover:border-cyber-pink/50 hover:text-cyber-pink transition-all"
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Search command palette (keyboard shortcut)
export function SearchCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/60 border border-cyber-cyan/30 rounded-lg text-gray-400 hover:text-white hover:border-cyber-cyan transition-all"
      >
        <Search size={18} />
        <span>Search...</span>
        <kbd className="ml-auto px-2 py-1 bg-cyber-dark/60 border border-cyber-cyan/30 rounded text-xs">
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-4"
          >
            <SearchBar className="shadow-2xl" />
            <div
              className="mt-2 text-center text-sm text-gray-400"
              onClick={() => setIsOpen(false)}
            >
              Press ESC to close
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
