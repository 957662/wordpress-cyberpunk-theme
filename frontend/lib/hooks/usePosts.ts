/**
 * usePosts Hook
 * 文章数据管理 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { postService, PostQueryParams, PaginatedPostsResponse } from '@/lib/services/post.service';
import type { Post } from '@/types';

export interface UsePostsOptions extends PostQueryParams {
  autoFetch?: boolean;
}

export interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  fetchPosts: (params?: PostQueryParams) => Promise<void>;
  refetch: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  clearError: () => void;
}

export function usePosts(options: UsePostsOptions = {}, autoFetch: boolean = true): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(options.page || 1);

  // 获取文章
  const fetchPosts = useCallback(async (params?: PostQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = { ...options, ...params };
      const response: PaginatedPostsResponse = await postService.getPosts(queryParams);

      setPosts(response.posts);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [options]);

  // 重新获取
  const refetch = useCallback(async () => {
    await fetchPosts({ page: currentPage });
  }, [fetchPosts, currentPage]);

  // 跳转到指定页
  const goToPage = useCallback(async (page: number) => {
    if (page < 1 || page > totalPages) return;
    await fetchPosts({ page });
  }, [fetchPosts, totalPages]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 初始加载
  useEffect(() => {
    if (autoFetch) {
      fetchPosts();
    }
  }, [autoFetch]);

  return {
    posts,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    fetchPosts,
    refetch,
    goToPage,
    clearError,
  };
}

/**
 * usePost Hook
 * 单篇文章数据管理
 */
export interface UsePostReturn {
  post: Post | null;
  loading: boolean;
  error: string | null;
  fetchPost: (identifier: string | number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function usePost(): UsePostReturn {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIdentifier, setCurrentIdentifier] = useState<string | number | null>(null);

  const fetchPost = useCallback(async (identifier: string | number) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentIdentifier(identifier);

      let fetchedPost: Post;
      if (typeof identifier === 'string') {
        fetchedPost = await postService.getPostBySlug(identifier);
      } else {
        fetchedPost = await postService.getPostById(identifier);
      }

      setPost(fetchedPost);
    } catch (err: any) {
      console.error('Error fetching post:', err);
      setError(err.message || 'Failed to fetch post');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (currentIdentifier !== null) {
      await fetchPost(currentIdentifier);
    }
  }, [fetchPost, currentIdentifier]);

  return {
    post,
    loading,
    error,
    fetchPost,
    refetch,
  };
}

/**
 * useCategories Hook
 * 分类数据管理
 */
export interface UseCategoriesReturn {
  categories: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getCategories();
      setCategories(data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

/**
 * useTags Hook
 * 标签数据管理
 */
export interface UseTagsReturn {
  tags: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getTags();
      setTags(data);
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      setError(err.message || 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    refetch: fetchTags,
  };
}

/**
 * useLatestPosts Hook
 * 最新文章数据管理
 */
export interface UseLatestPostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLatestPosts(limit: number = 5): UseLatestPostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getLatestPosts(limit);
      setPosts(data);
    } catch (err: any) {
      console.error('Error fetching latest posts:', err);
      setError(err.message || 'Failed to fetch latest posts');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLatestPosts();
  }, [fetchLatestPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchLatestPosts,
  };
}

/**
 * useRelatedPosts Hook
 * 相关文章数据管理
 */
export interface UseRelatedPostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export function useRelatedPosts(
  postId: number,
  categories?: number[],
  tags?: number[]
): UseRelatedPostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postService.getRelatedPosts(postId, categories, tags);
        setPosts(data);
      } catch (err: any) {
        console.error('Error fetching related posts:', err);
        setError(err.message || 'Failed to fetch related posts');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [postId, categories, tags]);

  return {
    posts,
    loading,
    error,
  };
}

export default usePosts;
