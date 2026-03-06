/**
 * Search Service for CyberPress Platform
 * Provides real-time search functionality with debouncing and caching
 */

import { debounce } from '@/lib/utils/performance-enhanced';

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'post' | 'page' | 'category' | 'tag';
  url: string;
  thumbnail?: string;
  date?: string;
  author?: string;
}

export interface SearchOptions {
  limit?: number;
  types?: Array<'post' | 'page' | 'category' | 'tag'>;
  categories?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}

class SearchService {
  private cache = new Map<string, { data: SearchResponse; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Perform search with debouncing and caching
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    if (!query.trim()) {
      return { results: [], total: 0, hasMore: false };
    }

    const cacheKey = this.getCacheKey(query, options);

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('Search error:', error);
      return { results: [], total: 0, hasMore: false };
    }
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query.trim()) return [];

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }

  /**
   * Get recent searches from localStorage
   */
  getRecentSearches(limit: number = 5): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        const searches = JSON.parse(saved);
        return searches.slice(0, limit);
      }
    } catch (error) {
      console.error('Error reading recent searches:', error);
    }

    return [];
  }

  /**
   * Save search to recent searches
   */
  saveRecentSearch(query: string): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('recent_searches');
      const searches = saved ? JSON.parse(saved) : [];

      // Remove duplicates and add to front
      const filtered = searches.filter((s: string) => s !== query);
      filtered.unshift(query);

      // Keep only last 10
      const updated = filtered.slice(0, 10);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('recent_searches');
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Generate cache key
   */
  private getCacheKey(query: string, options: SearchOptions): string {
    return JSON.stringify({ query, ...options });
  }
}

// Create singleton instance
export const searchService = new SearchService();

// Export debounced search function
export const debouncedSearch = debounce(
  (query: string, options?: SearchOptions) => searchService.search(query, options),
  300
);

/**
 * React Hook for search
 */
export function useSearch(options?: SearchOptions) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchService.search(query, options);
      setResults(response.results);
      setTotal(response.total);
    } catch (err) {
      setError(err as Error);
      setResults([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search,
    results,
    isLoading,
    error,
    total,
  };
}
