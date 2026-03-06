/**
 * WordPress API Hooks
 * 提供 React hooks 用于访问 WordPress 数据
 */

import { useState, useEffect, useCallback } from 'react';

// 类型定义
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _links: any;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links: any;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  _links: any;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: any;
  _links: any;
}

// API 配置
const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '/wp-json/wp/v2';

/**
 * 通用 fetch hook
 */
function useApi<T>(endpoint: string, params?: Record<string, any>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryString = params
          ? '?' + new URLSearchParams(params as any).toString()
          : '';
        const response = await fetch(`${WP_API_URL}${endpoint}${queryString}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  return { data, loading, error, refetch: () => fetchData() };
}

/**
 * 获取文章列表
 */
export function usePosts(params?: {
  page?: number;
  per_page?: number;
  categories?: string;
  tags?: string;
  search?: string;
  author?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
}) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryString = params
          ? '?' + new URLSearchParams(params as any).toString()
          : '';
        const response = await fetch(`${WP_API_URL}/posts${queryString}&_embed=true`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json: WPPost[] = await response.json();
        setPosts(json);

        // 从响应头获取分页信息
        const totalPagesHeader = response.headers.get('X-WP-TotalPages');
        const totalHeader = response.headers.get('X-WP-Total');
        setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 0);
        setTotal(totalHeader ? parseInt(totalHeader) : 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [params]);

  return { posts, loading, error, totalPages, total };
}

/**
 * 获取单篇文章
 */
export function usePost(slug: string) {
  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${WP_API_URL}/posts?slug=${slug}&_embed=true`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json: WPPost[] = await response.json();
        setPost(json.length > 0 ? json[0] : null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}

/**
 * 获取分类列表
 */
export function useCategories() {
  return useApi<WPCategory[]>('/categories', { per_page: 100 });
}

/**
 * 获取标签列表
 */
export function useTags() {
  return useApi<WPTag[]>('/tags', { per_page: 100 });
}

/**
 * 获取作者列表
 */
export function useAuthors() {
  return useApi<WPAuthor[]>('/users', { per_page: 100 });
}

/**
 * 搜索文章
 */
export function useSearch(query: string, delay = 300) {
  const [results, setResults] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${WP_API_URL}/posts?search=${encodeURIComponent(query)}&per_page=10&_embed=true`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json: WPPost[] = await response.json();
        setResults(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error searching posts:', err);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return { results, loading, error };
}

/**
 * 获取相关文章
 */
export function useRelatedPosts(postId: number, limit = 4) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchRelated = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${WP_API_URL}/posts?exclude=${postId}&per_page=${limit}&_embed=true`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json: WPPost[] = await response.json();
        setPosts(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching related posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [postId, limit]);

  return { posts, loading, error };
}

/**
 * 计算阅读时间
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  // 移除HTML标签
  const text = content.replace(/<[^>]*>/g, '');
  // 分割单词
  const words = text.split(/\s+/).filter(word => word.length > 0);
  // 计算阅读时间（分钟）
  return Math.ceil(words.length / wordsPerMinute);
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string, locale = 'zh-CN'): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(dateString: string, locale = 'zh-CN'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(dateString, locale);
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (days > 0) return rtf.format(-days, 'day');
  if (hours > 0) return rtf.format(-hours, 'hour');
  if (minutes > 0) return rtf.format(-minutes, 'minute');
  return rtf.format(-seconds, 'second');
}
