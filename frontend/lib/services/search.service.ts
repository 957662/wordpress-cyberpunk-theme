/**
 * Search Service
 * 搜索服务 - 处理搜索相关的业务逻辑
 */

import { wpApi } from '../api/wordpress-api';
import type { Post, Page, Category, Tag } from '@/types';

export interface SearchResult {
  type: 'post' | 'page' | 'category' | 'tag';
  id: number;
  title: string;
  excerpt: string;
  url: string;
  relevance?: number;
}

export interface SearchOptions {
  posts?: boolean;
  pages?: boolean;
  categories?: boolean;
  tags?: boolean;
  limit?: number;
}

export interface SearchSuggestions {
  query: string;
  suggestions: string[];
}

class SearchService {
  private searchHistory: string[] = [];
  private maxHistorySize = 10;
  private searchCache = new Map<string, SearchResult[]>();

  /**
   * 执行全局搜索
   */
  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const trimmedQuery = query.trim();
    const cacheKey = `${trimmedQuery}-${JSON.stringify(options)}`;

    // 检查缓存
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!;
    }

    // 默认选项
    const searchOptions: SearchOptions = {
      posts: true,
      pages: true,
      categories: false,
      tags: false,
      limit: 10,
      ...options,
    };

    const results: SearchResult[] = [];
    const searchPromises: Promise<void>[] = [];

    // 搜索文章
    if (searchOptions.posts) {
      searchPromises.push(
        this.searchPosts(trimmedQuery, searchOptions.limit).then(posts => {
          results.push(...posts);
        })
      );
    }

    // 搜索页面
    if (searchOptions.pages) {
      searchPromises.push(
        this.searchPages(trimmedQuery, searchOptions.limit).then(pages => {
          results.push(...pages);
        })
      );
    }

    // 搜索分类
    if (searchOptions.categories) {
      searchPromises.push(
        this.searchCategories(trimmedQuery).then(categories => {
          results.push(...categories);
        })
      );
    }

    // 搜索标签
    if (searchOptions.tags) {
      searchPromises.push(
        this.searchTags(trimmedQuery).then(tags => {
          results.push(...tags);
        })
      );
    }

    // 等待所有搜索完成
    await Promise.all(searchPromises);

    // 按相关性排序
    const sortedResults = this.sortByRelevance(results, trimmedQuery);

    // 限制结果数量
    const limitedResults = sortedResults.slice(0, searchOptions.limit || 10);

    // 缓存结果
    this.searchCache.set(cacheKey, limitedResults);

    // 添加到搜索历史
    this.addToHistory(trimmedQuery);

    return limitedResults;
  }

  /**
   * 搜索文章
   */
  private async searchPosts(
    query: string,
    limit: number = 10
  ): Promise<SearchResult[]> {
    try {
      const response = await wpApi.get('/posts', {
        params: {
          search: query,
          per_page: limit,
          status: 'publish',
          _embed: true,
        },
      });

      return response.data.map((post: Post) => ({
        type: 'post' as const,
        id: post.id,
        title: post.title.rendered.replace(/<[^>]*>/g, ''),
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150),
        url: `/blog/${post.slug}`,
        relevance: this.calculateRelevance(post.title.rendered, query),
      }));
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }

  /**
   * 搜索页面
   */
  private async searchPages(
    query: string,
    limit: number = 5
  ): Promise<SearchResult[]> {
    try {
      const response = await wpApi.get('/pages', {
        params: {
          search: query,
          per_page: limit,
          status: 'publish',
        },
      });

      return response.data.map((page: Page) => ({
        type: 'page' as const,
        id: page.id,
        title: page.title.rendered.replace(/<[^>]*>/g, ''),
        excerpt: page.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150),
        url: page.slug === 'home' ? '/' : `/${page.slug}`,
        relevance: this.calculateRelevance(page.title.rendered, query),
      }));
    } catch (error) {
      console.error('Error searching pages:', error);
      return [];
    }
  }

  /**
   * 搜索分类
   */
  private async searchCategories(query: string): Promise<SearchResult[]> {
    try {
      const response = await wpApi.get('/categories', {
        params: {
          search: query,
          per_page: 5,
        },
      });

      return response.data.map((category: Category) => ({
        type: 'category' as const,
        id: category.id,
        title: category.name,
        excerpt: category.description || '',
        url: `/category/${category.slug}`,
        relevance: this.calculateRelevance(category.name, query),
      }));
    } catch (error) {
      console.error('Error searching categories:', error);
      return [];
    }
  }

  /**
   * 搜索标签
   */
  private async searchTags(query: string): Promise<SearchResult[]> {
    try {
      const response = await wpApi.get('/tags', {
        params: {
          search: query,
          per_page: 5,
        },
      });

      return response.data.map((tag: Tag) => ({
        type: 'tag' as const,
        id: tag.id,
        title: tag.name,
        excerpt: tag.description || '',
        url: `/tag/${tag.slug}`,
        relevance: this.calculateRelevance(tag.name, query),
      }));
    } catch (error) {
      console.error('Error searching tags:', error);
      return [];
    }
  }

  /**
   * 获取搜索建议
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const trimmedQuery = query.trim().toLowerCase();
    const suggestions = new Set<string>();

    // 添加历史匹配
    this.searchHistory.forEach(historyItem => {
      if (historyItem.toLowerCase().startsWith(trimmedQuery)) {
        suggestions.add(historyItem);
      }
    });

    // 如果已经有足够的建议，返回
    if (suggestions.size >= 5) {
      return Array.from(suggestions).slice(0, 5);
    }

    // 尝试从分类获取建议
    try {
      const [categoriesResponse, tagsResponse] = await Promise.all([
        wpApi.get('/categories', { params: { search: query, per_page: 5 } }),
        wpApi.get('/tags', { params: { search: query, per_page: 5 } }),
      ]);

      categoriesResponse.data.forEach((cat: Category) => {
        suggestions.add(cat.name);
      });

      tagsResponse.data.forEach((tag: Tag) => {
        suggestions.add(tag.name);
      });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * 计算相关性分数
   */
  private calculateRelevance(text: string, query: string): number {
    const cleanText = text.toLowerCase().replace(/<[^>]*>/g, '');
    const cleanQuery = query.toLowerCase();
    let score = 0;

    // 完全匹配
    if (cleanText === cleanQuery) {
      score += 100;
    }

    // 开头匹配
    if (cleanText.startsWith(cleanQuery)) {
      score += 50;
    }

    // 包含匹配
    if (cleanText.includes(cleanQuery)) {
      score += 20;
    }

    // 单词匹配
    const queryWords = cleanQuery.split(/\s+/);
    const textWords = cleanText.split(/\s+/);
    queryWords.forEach(word => {
      if (textWords.includes(word)) {
        score += 10;
      }
    });

    return score;
  }

  /**
   * 按相关性排序
   */
  private sortByRelevance(results: SearchResult[], query: string): SearchResult[] {
    return results.sort((a, b) => {
      const aRelevance = a.relevance || this.calculateRelevance(a.title, query);
      const bRelevance = b.relevance || this.calculateRelevance(b.title, query);
      return bRelevance - aRelevance;
    });
  }

  /**
   * 搜索历史管理
   */
  addToHistory(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // 移除重复项
    this.searchHistory = this.searchHistory.filter(item => item !== trimmedQuery);

    // 添加到开头
    this.searchHistory.unshift(trimmedQuery);

    // 限制历史大小
    if (this.searchHistory.length > this.maxHistorySize) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize);
    }
  }

  getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  clearSearchHistory(): void {
    this.searchHistory = [];
  }

  removeFromHistory(query: string): void {
    this.searchHistory = this.searchHistory.filter(item => item !== query);
  }

  /**
   * 热门搜索词
   */
  async getTrendingSearches(): Promise<string[]> {
    // 这里可以实现热门搜索的逻辑
    // 例如：从分析服务获取，或者基于历史记录
    return ['React', 'TypeScript', 'Next.js', 'WordPress', 'Tailwind CSS'];
  }

  /**
   * 清除搜索缓存
   */
  clearCache(): void {
    this.searchCache.clear();
  }
}

// 导出单例
export const searchService = new SearchService();
export default searchService;
