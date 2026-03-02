/**
 * WordPress API React Hooks
 * 提供便捷的 React Hooks 用于访问 WordPress 数据
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getWordPressClient,
  Post,
  Category,
  Tag,
  Comment,
  Media,
  User,
} from './api-client';

// ==================== 通用 Hook ====================

interface UseWordPressResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 通用 WordPress 数据获取 Hook
 */
function useWordPress<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = []
): UseWordPressResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ==================== 文章相关 Hooks ====================

/**
 * 获取文章列表
 */
export function usePosts(params: {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  orderby?: 'date' | 'relevance' | 'id' | 'title' | 'slug';
  order?: 'asc' | 'desc';
} = {}) {
  const client = getWordPressClient();

  return useWordPress<Post[]>(async () => {
    const response = await client.getPosts(params);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data!;
  }, [JSON.stringify(params)]);
}

/**
 * 获取单篇文章
 */
export function usePost(id: number | string) {
  const client = getWordPressClient();

  return useWordPress<Post>(async () => {
    const response = await client.getPost(id);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data!;
  }, [id]);
}

/**
 * 根据slug获取文章
 */
export function usePostBySlug(slug: string) {
  const client = getWordPressClient();

  return useWordPress<Post | null>(async () => {
    const response = await client.getPostBySlug(slug);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data && response.data.length > 0 ? response.data[0] : null;
  }, [slug]);
}

/**
 * 获取相关文章
 */
export function useRelatedPosts(postId: number, categories: number[], limit: number = 4) {
  const client = getWordPressClient();

  return useWordPress<Post[]>(async () => {
    const response = await client.getPosts({
      categories,
      per_page: limit,
      orderby: 'date',
      order: 'desc',
    });

    if (response.error) {
      throw new Error(response.error);
    }

    // 排除当前文章
    return response.data!.filter(post => post.id !== postId);
  }, [postId, JSON.stringify(categories), limit]);
}

// ==================== 分类相关 Hooks ====================

/**
 * 获取所有分类
 */
export function useCategories(params: {
  hide_empty?: boolean;
  parent?: number;
} = {}) {
  const client = getWordPressClient();

  return useWordPress<Category[]>(async () => {
    const response = await client.getCategories({
      per_page: 100,
      ...params,
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data!;
  }, [JSON.stringify(params)]);
}

/**
 * 获取单个分类
 */
export function useCategory(id: number) {
  const client = getWordPressClient();

  return useWordPress<Category>(async () => {
    const response = await client.getCategory(id);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data!;
  }, [id]);
}

// ==================== 标签相关 Hooks ====================

/**
 * 获取所有标签
 */
export function useTags(params: {
  hide_empty?: boolean;
} = {}) {
  const client = getWordPressClient();

  return useWordPress<Tag[]>(async () => {
    const response = await client.getTags({
      per_page: 100,
      ...params,
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data!;
  }, [JSON.stringify(params)]);
}

/**
 * 获取单个标签
 */
export function useTag(id: number) {
  const client = getWordPressClient();

  return useWordPress<Tag>(async () => {
    const response = await client.getTag(id);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data!;
  }, [id]);
}

/**
 * 获取热门标签
 */
export function usePopularTags(limit: number = 20) {
  const client = getWordPressClient();

  return useWordPress<Tag[]>(async () => {
    const response = await client.getTags({
      per_page: limit,
      hide_empty: true,
    });
    if (response.error) {
      throw new Error(response.error);
    }

    // 按文章数量排序
    return response.data!.sort((a, b) => b.count - a.count);
  }, [limit]);
}

// ==================== 评论相关 Hooks ====================

/**
 * 获取文章评论
 */
export function useComments(postId: number) {
  const client = getWordPressClient();

  return useWordPress<Comment[]>(async () => {
    const response = await client.getComments({
      post: postId,
      status: 'approved',
      per_page: 100,
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data!;
  }, [postId]);
}

/**
 * 评论提交 Hook
 */
export function useSubmitComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitComment = useCallback(async (comment: Partial<Comment>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const client = getWordPressClient();
      const response = await client.createComment(comment);

      if (response.error) {
        setError(response.error);
        return false;
      }

      setSuccess(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交评论失败');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitComment, loading, error, success };
}

// ==================== 媒体相关 Hooks ====================

/**
 * 获取特色图片
 */
export function useFeaturedImage(mediaId: number) {
  const client = getWordPressClient();

  return useWordPress<Media | null>(async () => {
    if (!mediaId) return null;

    const response = await client.getMediaItem(mediaId);
    if (response.error) {
      return null;
    }
    return response.data!;
  }, [mediaId]);
}

/**
 * 媒体上传 Hook
 */
export function useUploadMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadMedia = useCallback(async (file: File, additionalData?: any) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const client = getWordPressClient();
      const response = await client.uploadMedia(file, additionalData);

      if (response.error) {
        setError(response.error);
        return null;
      }

      setProgress(100);
      return response.data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadMedia, loading, error, progress };
}

// ==================== 用户相关 Hooks ====================

/**
 * 获取用户信息
 */
export function useUser(userId: number) {
  const client = getWordPressClient();

  return useWordPress<User>(async () => {
    const response = await client.getUser(userId);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data!;
  }, [userId]);
}

/**
 * 获取当前用户
 */
export function useCurrentUser() {
  const client = getWordPressClient();

  return useWordPress<User | null>(async () => {
    const response = await client.getCurrentUser();
    if (response.error) {
      return null;
    }
    return response.data!;
  }, []);
}

// ==================== 搜索相关 Hooks ====================

/**
 * 搜索 Hook
 */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const client = getWordPressClient();
        const response = await client.search(query, {
          per_page: 20,
          type: ['post', 'page'],
        });

        if (response.error) {
          setError(response.error);
        } else {
          setResults(response.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '搜索失败');
      } finally {
        setLoading(false);
      }
    }, 500); // 防抖 500ms

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return { query, setQuery, results, loading, error };
}

/**
 * 搜索建议 Hook
 */
export function useSearchSuggestions(minLength: number = 3) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < minLength) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);

      try {
        const client = getWordPressClient();
        const response = await client.search(query, {
          per_page: 5,
          type: ['post'],
        });

        if (response.data) {
          const titles = response.data
            .map((item: any) => item.title?.rendered)
            .filter(Boolean)
            .map((html: string) => html.replace(/<[^>]*>/g, '')); // 移除 HTML 标签

          setSuggestions(titles);
        }
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, minLength]);

  return { query, setQuery, suggestions, loading };
}

// ==================== 分页相关 ====================

/**
 * 分页 Hook
 */
export function usePagination(totalItems: number, itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [hasNextPage, currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      goToPage(currentPage - 1);
    }
  }, [hasPrevPage, currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
  };
}

// ==================== 缓存管理 ====================

/**
 * 缓存管理 Hook
 */
export function useCacheManager() {
  const clearCache = useCallback((pattern?: string) => {
    const client = getWordPressClient();
    client.clearCache(pattern);
  }, []);

  return { clearCache };
}
