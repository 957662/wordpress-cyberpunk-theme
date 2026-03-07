/**
 * Search Service
 * Advanced search functionality with fuzzy matching and filters
 */

export interface SearchOptions {
  fuzzy?: boolean;
  threshold?: number;
  caseSensitive?: boolean;
  includeScore?: boolean;
  limit?: number;
}

export interface SearchResult<T> {
  item: T;
  score?: number;
  matches?: Array<{
    key: string;
    value: string;
    indices: Array<[number, number]>;
  }>;
}

export interface SearchFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
}

export class SearchService {
  /**
   * Simple text search
   */
  static search<T>(
    items: T[],
    query: string,
    keys: (keyof T)[],
    options: SearchOptions = {}
  ): SearchResult<T>[] {
    const {
      fuzzy = false,
      threshold = 0.6,
      caseSensitive = false,
      includeScore = true,
      limit,
    } = options;

    if (!query.trim()) {
      return items.map((item) => ({ item }));
    }

    const searchQuery = caseSensitive ? query : query.toLowerCase();
    const results: SearchResult<T>[] = [];

    for (const item of items) {
      let score = 0;
      const matches: SearchResult<T>['matches'] = [];

      for (const key of keys) {
        const value = String(item[key] || '');
        const searchValue = caseSensitive ? value : value.toLowerCase();

        if (fuzzy) {
          const fuzzyScore = this.fuzzyMatch(searchQuery, searchValue, threshold);
          if (fuzzyScore > 0) {
            score += fuzzyScore;
            matches.push({
              key: String(key),
              value,
              indices: this.findMatchIndices(searchQuery, searchValue),
            });
          }
        } else {
          if (searchValue.includes(searchQuery)) {
            score += 1;
            matches.push({
              key: String(key),
              value,
              indices: this.findMatchIndices(searchQuery, searchValue),
            });
          }
        }
      }

      if (score > 0) {
        results.push({
          item,
          ...(includeScore && { score }),
          ...(matches.length > 0 && { matches }),
        });
      }
    }

    // Sort by score descending
    results.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Apply limit
    return limit ? results.slice(0, limit) : results;
  }

  /**
   * Fuzzy match using Levenshtein distance
   */
  static fuzzyMatch(query: string, text: string, threshold: number): number {
    const distance = this.levenshteinDistance(query, text);
    const maxLen = Math.max(query.length, text.length);
    const similarity = 1 - distance / maxLen;

    return similarity >= threshold ? similarity : 0;
  }

  /**
   * Calculate Levenshtein distance
   */
  static levenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Find match indices in text
   */
  static findMatchIndices(query: string, text: string): Array<[number, number]> {
    const indices: Array<[number, number]> = [];
    let index = 0;

    while ((index = text.indexOf(query, index)) !== -1) {
      indices.push([index, index + query.length]);
      index += query.length;
    }

    return indices;
  }

  /**
   * Advanced search with filters
   */
  static searchWithFilters<T>(
    items: T[],
    query: string,
    keys: (keyof T)[],
    filters: SearchFilter[],
    options: SearchOptions = {}
  ): SearchResult<T>[] {
    let results = this.search(items, query, keys, options);

    // Apply filters
    if (filters.length > 0) {
      results = results.filter(({ item }) => {
        return filters.every((filter) => {
          const itemValue = item[filter.field as keyof T];

          switch (filter.operator) {
            case 'eq':
              return itemValue === filter.value;
            case 'ne':
              return itemValue !== filter.value;
            case 'gt':
              return itemValue > filter.value;
            case 'lt':
              return itemValue < filter.value;
            case 'gte':
              return itemValue >= filter.value;
            case 'lte':
              return itemValue <= filter.value;
            case 'in':
              return Array.isArray(filter.value) && filter.value.includes(itemValue);
            case 'contains':
              return String(itemValue).includes(filter.value);
            default:
              return true;
          }
        });
      });
    }

    return results;
  }

  /**
   * Highlight search matches
   */
  static highlightMatches(text: string, query: string, caseSensitive = false): string {
    if (!query) return text;

    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(`(${this.escapeRegex(query)})`, flags);

    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escape special regex characters
   */
  static escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get search suggestions
   */
  static getSuggestions<T>(
    items: T[],
    query: string,
    key: keyof T,
    limit = 5
  ): string[] {
    if (!query.trim()) return [];

    const values = items.map((item) => String(item[key] || ''));
    const uniqueValues = [...new Set(values)];

    const results = this.search(
      uniqueValues.map((val) => ({ value: val })),
      query,
      ['value'],
      { fuzzy: true, limit }
    );

    return results.map((r) => r.item.value);
  }

  /**
   * Debounced search
   */
  static createDebouncedSearch<T>(
    delay = 300
  ): (
    items: T[],
    query: string,
    keys: (keyof T)[],
    options?: SearchOptions
  ) => SearchResult<T>[] {
    let timeout: NodeJS.Timeout;

    return (items, query, keys, options) => {
      clearTimeout(timeout);

      return new Promise((resolve) => {
        timeout = setTimeout(() => {
          resolve(this.search(items, query, keys, options));
        }, delay);
      }) as any;
    };
  }

  /**
   * Paginated search
   */
  static searchPaginated<T>(
    items: T[],
    query: string,
    keys: (keyof T)[],
    page = 1,
    pageSize = 10,
    options: SearchOptions = {}
  ): {
    results: SearchResult<T>[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    const allResults = this.search(items, query, keys, options);
    const total = allResults.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      results: allResults.slice(start, end),
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}

export default SearchService;
