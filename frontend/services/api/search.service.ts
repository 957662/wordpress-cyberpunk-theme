/**
 * Search Service
 * 搜索服务 - 处理搜索相关操作
 */

interface SearchResult {
  id: string;
  type: 'post' | 'page' | 'comment' | 'user' | 'tag';
  title: string;
  excerpt?: string;
  url: string;
  thumbnail?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  date: string;
  relevance: number;
}

interface SearchFilters {
  type?: string[];
  date?: {
    from?: string;
    to?: string;
  };
  author?: string[];
  tags?: string[];
}

interface SearchSuggestions {
  queries: string[];
  tags: string[];
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultCount: number;
}

interface SearchAnalytics {
  totalSearches: number;
  topQueries: Array<{
    query: string;
    count: number;
  }>;
  noResultQueries: string[];
}

class SearchService {
  private baseUrl: string;
  private endpoints = {
    search: '/api/search',
    suggestions: '/api/search/suggestions',
    history: '/api/search/history',
    analytics: '/api/search/analytics',
    trending: '/api/search/trending',
  };

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * 执行搜索
   */
  async search(
    query: string,
    options?: {
      page?: number;
      limit?: number;
      filters?: SearchFilters;
      sortBy?: 'relevance' | 'date' | 'popularity';
    }
  ): Promise<{ results: SearchResult[]; total: number; facets: Record<string, any> }> {
    const params = new URLSearchParams();
    params.set('q', query);
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.sortBy) params.set('sort', options.sortBy);
    if (options?.filters) params.set('filters', JSON.stringify(options.filters));

    const response = await fetch(
      `${this.baseUrl}${this.endpoints.search}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('Search failed');
    }

    return response.json();
  }

  /**
   * 获取搜索建议
   */
  async getSuggestions(query: string): Promise<SearchSuggestions> {
    const response = await fetch(
      `${this.baseUrl}${this.endpoints.suggestions}?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    return response.json();
  }

  /**
   * 获取搜索历史
   */
  async getHistory(limit: number = 10): Promise<SearchHistoryItem[]> {
    const response = await fetch(
      `${this.baseUrl}${this.endpoints.history}?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search history');
    }

    return response.json();
  }

  /**
   * 清除搜索历史
   */
  async clearHistory(): Promise<void> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.history}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to clear search history');
    }
  }

  /**
   * 保存搜索到历史
   */
  async saveToHistory(query: string, resultCount: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.history}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, resultCount }),
    });

    if (!response.ok) {
      throw new Error('Failed to save search history');
    }
  }

  /**
   * 获取热门搜索
   */
  async getTrending(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.trending}?limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch trending searches');
    }

    return response.json();
  }

  /**
   * 获取搜索分析数据
   */
  async getAnalytics(): Promise<SearchAnalytics> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.analytics}`);

    if (!response.ok) {
      throw new Error('Failed to fetch search analytics');
    }

    return response.json();
  }

  /**
   * 高级搜索
   */
  async advancedSearch(params: {
    query?: string;
    exactPhrase?: string;
    anyWords?: string;
    withoutWords?: string;
    filters?: SearchFilters;
    page?: number;
    limit?: number;
  }): Promise<{ results: SearchResult[]; total: number }> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.search}/advanced`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Advanced search failed');
    }

    return response.json();
  }

  /**
   * 语音搜索
   */
  async voiceSearch(audioBlob: Blob): Promise<{ transcript: string; results?: SearchResult[] }> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch(`${this.baseUrl}${this.endpoints.search}/voice`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Voice search failed');
    }

    return response.json();
  }

  /**
   * 获取相关搜索
   */
  async getRelatedSearches(query: string, limit: number = 5): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}${this.endpoints.search}/related?q=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch related searches');
    }

    return response.json();
  }
}

// 导出单例实例
export const searchService = new SearchService();
export default searchService;
