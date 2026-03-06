/**
 * WordPress API React Hooks
 * 提供 React 组件中使用 WordPress API 的便捷 hooks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  WordPressPost,
  WordPressCategory,
  WordPressTag,
  WordPressAuthor,
  WordPressComment,
  WPPaginationParams,
  wpClient,
} from '@/lib/wordpress-client';

/**
 * 使用文章列表的 Hook
 */
export function usePosts(params?: WPPaginationParams) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [data, totalCount, pagesCount] = await Promise.all([
        wpClient.getPostsWithEmbedded(params),
        wpClient.getTotalPosts(params),
        wpClient.getTotalPages(params),
      ]);

      setPosts(data);
      setTotal(totalCount);
      setTotalPages(pagesCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchPosts,
  };
}

/**
 * 使用单篇文章的 Hook
 */
export function usePost(id: number) {
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getPost(id);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  return { post, loading, error };
}

/**
 * 使用文章（通过 slug）的 Hook
 */
export function usePostBySlug(slug: string) {
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getPostBySlug(slug);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, loading, error };
}

/**
 * 使用分类列表的 Hook
 */
export function useCategories(params?: Partial<WPPaginationParams>) {
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getCategories(params);
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [params]);

  return { categories, loading, error, refetch: () => fetchCategories() };
}

/**
 * 使用单个分类的 Hook
 */
export function useCategory(id: number) {
  const [category, setCategory] = useState<WordPressCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getCategory(id);
        setCategory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCategory();
    }
  }, [id]);

  return { category, loading, error };
}

/**
 * 使用标签列表的 Hook
 */
export function useTags(params?: Partial<WPPaginationParams>) {
  const [tags, setTags] = useState<WordPressTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getTags(params);
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tags');
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, [params]);

  return { tags, loading, error, refetch: () => fetchTags() };
}

/**
 * 使用作者信息的 Hook
 */
export function useAuthor(id: number) {
  const [author, setAuthor] = useState<WordPressAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuthor() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getAuthor(id);
        setAuthor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch author');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAuthor();
    }
  }, [id]);

  return { author, loading, error };
}

/**
 * 使用评论列表的 Hook
 */
export function useComments(postId?: number, params?: Partial<WPPaginationParams>) {
  const [comments, setComments] = useState<WordPressComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getComments(postId, params);
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [postId, params]);

  return { comments, loading, error, refetch: () => fetchComments() };
}

/**
 * 使用搜索的 Hook
 */
export function useSearch() {
  const [results, setResults] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string, params?: Partial<WPPaginationParams>) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const data = await wpClient.search(searchQuery, params);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setQuery('');
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    query,
    search,
    clearSearch,
  };
}

/**
 * 使用最新文章的 Hook
 */
export function useLatestPosts(limit: number = 10) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getLatestPosts(limit);
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch latest posts');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [limit]);

  return { posts, loading, error, refetch: () => fetchPosts() };
}

/**
 * 使用相关文章的 Hook
 */
export function useRelatedPosts(postId: number, limit: number = 4) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getRelatedPosts(postId, { per_page: limit });
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch related posts');
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPosts();
    }
  }, [postId, limit]);

  return { posts, loading, error };
}

/**
 * 使用特色文章的 Hook
 */
export function useStickyPosts(limit: number = 10) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getStickyPosts({ per_page: limit });
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sticky posts');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * 使用分页文章的 Hook
 */
export function usePaginatedPosts(initialPage: number = 1, perPage: number = 10) {
  const [page, setPage] = useState(initialPage);
  const { posts, loading, error, total, totalPages, refetch } = usePosts({
    page,
    per_page: perPage,
  });

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(p => p + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }, [page]);

  const goToPage = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  }, [totalPages]);

  return {
    posts,
    loading,
    error,
    page,
    total,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    refetch,
  };
}

/**
 * 使用 WordPress API 健康状态的 Hook
 */
export function useWordPressHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      setLoading(true);
      setError(null);

      try {
        const healthy = await wpClient.healthCheck();
        setIsHealthy(healthy);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Health check failed');
        setIsHealthy(false);
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
  }, []);

  return { isHealthy, loading, error };
}

/**
 * 使用站点信息的 Hook
 */
export function useSiteInfo() {
  const [siteInfo, setSiteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSiteInfo() {
      setLoading(true);
      setError(null);

      try {
        const info = await wpClient.getSiteInfo();
        setSiteInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch site info');
      } finally {
        setLoading(false);
      }
    }

    fetchSiteInfo();
  }, []);

  return { siteInfo, loading, error };
}

/**
 * 使用分类文章的 Hook
 */
export function useCategoryPosts(categoryId: number, params?: WPPaginationParams) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getPosts({ ...params, categories: [categoryId] });
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category posts');
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) {
      fetchPosts();
    }
  }, [categoryId, params]);

  return { posts, loading, error, refetch: () => fetchPosts() };
}

/**
 * 使用标签文章的 Hook
 */
export function useTagPosts(tagId: number, params?: WPPaginationParams) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const data = await wpClient.getPosts({ ...params, tags: [tagId] });
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tag posts');
      } finally {
        setLoading(false);
      }
    }

    if (tagId) {
      fetchPosts();
    }
  }, [tagId, params]);

  return { posts, loading, error, refetch: () => fetchPosts() };
}
