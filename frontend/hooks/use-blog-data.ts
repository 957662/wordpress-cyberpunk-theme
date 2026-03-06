/**
 * 博客数据 Hooks
 * 简化博客组件的数据获取和状态管理
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseBlogDataOptions {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  search?: string;
  enabled?: boolean;
}

export interface BlogDataResult {
  posts: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 博客列表数据 Hook
 */
export function useBlogData(options: UseBlogDataOptions = {}): BlogDataResult {
  const [data, setData] = useState({
    posts: [],
    total: 0,
    totalPages: 0,
    currentPage: options.page || 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (options.enabled === false) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.perPage) params.append('per_page', options.perPage.toString());
      if (options.category) params.append('category', options.category);
      if (options.tag) params.append('tag', options.tag);
      if (options.search) params.append('search', options.search);

      const response = await fetch(
        \`/api/blog/posts?\${params.toString()}\`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(\`Failed to fetch blog data: \${response.statusText}\`);
      }

      const totalCount = response.headers.get('X-WP-Total');
      const totalPages = response.headers.get('X-WP-TotalPages');
      const posts = await response.json();

      setData({
        posts,
        total: totalCount ? parseInt(totalCount) : 0,
        totalPages: totalPages ? parseInt(totalPages) : 0,
        currentPage: options.page || 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching blog data:', err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * 单篇文章数据 Hook
 */
export interface UseBlogPostResult {
  post: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBlogPost(slug: string, enabled = true): UseBlogPostResult {
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!slug || !enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(\`/api/blog/posts/\${slug}\`);

      if (!response.ok) {
        throw new Error(\`Failed to fetch post: \${response.statusText}\`);
      }

      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching blog post:', err);
    } finally {
      setLoading(false);
    }
  }, [slug, enabled]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    loading,
    error,
    refetch: fetchPost,
  };
}

/**
 * 分类数据 Hook
 */
export function useCategories(enabled = true) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories');

        if (!response.ok) {
          throw new Error(\`Failed to fetch categories: \${response.statusText}\`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [enabled]);

  return { categories, loading, error };
}

/**
 * 标签数据 Hook
 */
export function useTags(enabled = true) {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchTags = async () => {
      try {
        const response = await fetch('/api/blog/tags');

        if (!response.ok) {
          throw new Error(\`Failed to fetch tags: \${response.statusText}\`);
        }

        const data = await response.json();
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [enabled]);

  return { tags, loading, error };
}
