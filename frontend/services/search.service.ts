/**
 * 搜索服务
 * 提供实时搜索、搜索建议、搜索历史等功能
 */

import { httpClient } from './http-client';

// 搜索结果类型
export interface SearchResult {
  id: string;
  type: 'post' | 'tag' | 'category' | 'author';
  title: string;
  excerpt?: string;
  slug: string;
  imageUrl?: string;
  score?: number;
  highlighted?: {
    title?: string;
    excerpt?: string;
  };
}

// 搜索建议类型
export interface SearchSuggestion {
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

// 搜索过滤器
export interface SearchFilters {
  type?: SearchResult['type'][];
  category?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  author?: string[];
}

// 搜索参数
export interface SearchParams {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'popularity';
}

// 搜索响应
export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  suggestions?: SearchSuggestion[];
}

// 搜索历史项
interface SearchHistoryItem {
  query: string;
  timestamp: Date;
}

class SearchService {
  private searchHistory: SearchHistoryItem[] = [];
  private readonly MAX_HISTORY_ITEMS = 10;
  private readonly HISTORY_STORAGE_KEY = 'search_history';

  constructor() {
    this.loadSearchHistory();
  }

  /**
   * 执行搜索
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    try {
      const response = await httpClient.post('/api/v1/search', params);

      // 保存到搜索历史
      if (params.query.trim()) {
        this.addToSearchHistory(params.query);
      }

      return response.data;
    } catch (error) {
      console.error('搜索失败:', error);
      throw error;
    }
  }

  /**
   * 获取搜索建议
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    try {
      if (!query.trim()) {
        return this.getTrendingSearches();
      }

      const response = await httpClient.get('/api/v1/search/suggestions', {
        params: { q: query },
      });

      return response.data;
    } catch (error) {
      console.error('获取搜索建议失败:', error);
      return [];
    }
  }

  /**
   * 获取热门搜索
   */
  async getTrendingSearches(): Promise<SearchSuggestion[]> {
    try {
      const response = await httpClient.get('/api/v1/search/trending');
      return response.data;
    } catch (error) {
      console.error('获取热门搜索失败:', error);
      return [];
    }
  }

  /**
   * 获取搜索历史
   */
  getSearchHistory(): SearchSuggestion[] {
    return this.searchHistory
      .slice(0, 5)
      .map(item => ({
        text: item.query,
        type: 'history' as const,
      }));
  }

  /**
   * 添加到搜索历史
   */
  private addToSearchHistory(query: string): void {
    // 移除重复项
    this.searchHistory = this.searchHistory.filter(
      item => item.query !== query
    );

    // 添加新项到开头
    this.searchHistory.unshift({
      query,
      timestamp: new Date(),
    });

    // 限制历史记录数量
    this.searchHistory = this.searchHistory.slice(0, this.MAX_HISTORY_ITEMS);

    // 保存到本地存储
    this.saveSearchHistory();
  }

  /**
   * 清空搜索历史
   */
  clearSearchHistory(): void {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  /**
   * 从本地存储加载搜索历史
   */
  private loadSearchHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.HISTORY_STORAGE_KEY);
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error);
    }
  }

  /**
   * 保存搜索历史到本地存储
   */
  private saveSearchHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        this.HISTORY_STORAGE_KEY,
        JSON.stringify(this.searchHistory)
      );
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  }

  /**
   * 高亮搜索关键词
   */
  highlightKeywords(text: string, query: string): string {
    if (!query.trim()) return text;

    const keywords = query.split(/\s+/).filter(k => k.length > 0);
    let highlighted = text;

    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlighted = highlighted.replace(
        regex,
        '<mark class="bg-cyber-cyan/20 text-cyber-cyan">$1</mark>'
      );
    });

    return highlighted;
  }

  /**
   * 计算搜索相关性得分
   */
  calculateRelevanceScore(
    item: SearchResult,
    query: string
  ): number {
    let score = 0;
    const keywords = query.toLowerCase().split(/\s+/);

    keywords.forEach(keyword => {
      // 标题匹配权重更高
      if (item.title.toLowerCase().includes(keyword)) {
        score += 10;
      }

      // 摘要匹配
      if (item.excerpt?.toLowerCase().includes(keyword)) {
        score += 5;
      }

      // 完全匹配加分
      if (item.title.toLowerCase() === keyword) {
        score += 20;
      }
    });

    return score;
  }

  /**
   * 过滤和排序搜索结果
   */
  filterAndSortResults(
    results: SearchResult[],
    filters?: SearchFilters,
    sortBy: SearchParams['sortBy'] = 'relevance'
  ): SearchResult[] {
    let filtered = [...results];

    // 应用类型过滤
    if (filters?.type && filters.type.length > 0) {
      filtered = filtered.filter(item => filters.type!.includes(item.type));
    }

    // 应用分类过滤
    if (filters?.category && filters.category.length > 0) {
      // 需要根据实际数据结构调整
    }

    // 应用标签过滤
    if (filters?.tags && filters.tags.length > 0) {
      // 需要根据实际数据结构调整
    }

    // 应用日期范围过滤
    if (filters?.dateRange) {
      // 需要根据实际数据结构调整
    }

    // 排序
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => {
          // 需要根据实际日期字段排序
          return 0;
        });
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case 'relevance':
      default:
        filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
    }

    return filtered;
  }
}

// 导出单例
export const searchService = new SearchService();

// 导出类型
export type { SearchHistoryItem };
