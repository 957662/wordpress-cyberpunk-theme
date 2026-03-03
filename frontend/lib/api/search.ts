/**
 * Search API client
 */
import { ApiResponse } from './types';

export interface SearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  category_id?: number;
  author_id?: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SearchSuggestion {
  type: 'post' | 'category' | 'tag';
  id: number;
  title: string;
  url: string;
}

export interface SearchSuggestionResponse {
  suggestions: SearchSuggestion[];
}

export interface TrendingSearch {
  query: string;
  count: number;
}

export interface TrendingSearchesResponse {
  trending: TrendingSearch[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class SearchAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE}/search`;
  }

  /**
   * Search posts
   */
  async searchPosts(params: {
    query: string;
    category_id?: number;
    tag_ids?: number[];
    author_id?: number;
    page?: number;
    page_size?: number;
  }): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();

    searchParams.append('query', params.query);
    if (params.category_id) searchParams.append('category_id', params.category_id.toString());
    if (params.tag_ids) searchParams.append('tag_ids', params.tag_ids.join(','));
    if (params.author_id) searchParams.append('author_id', params.author_id.toString());
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.page_size) searchParams.append('page_size', params.page_size.toString());

    const response = await fetch(`${this.baseUrl}/posts?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(params: {
    query: string;
    limit?: number;
  }): Promise<SearchSuggestionResponse> {
    const searchParams = new URLSearchParams();

    searchParams.append('query', params.query);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${this.baseUrl}/suggestions?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Suggestions failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get trending searches
   */
  async getTrending(params?: {
    limit?: number;
  }): Promise<TrendingSearchesResponse> {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${this.baseUrl}/trending?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Trending failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Advanced search
   */
  async advancedSearch(params: {
    query: string;
    categories?: string[];
    tags?: string[];
    date_from?: string;
    date_to?: string;
    sort_by?: 'relevance' | 'date' | 'popularity';
    page?: number;
    page_size?: number;
  }): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();

    searchParams.append('query', params.query);
    if (params.categories) searchParams.append('categories', params.categories.join(','));
    if (params.tags) searchParams.append('tags', params.tags.join(','));
    if (params.date_from) searchParams.append('date_from', params.date_from);
    if (params.date_to) searchParams.append('date_to', params.date_to);
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.page_size) searchParams.append('page_size', params.page_size.toString());

    const response = await fetch(`${this.baseUrl}/advanced?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Advanced search failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const searchAPI = new SearchAPI();
