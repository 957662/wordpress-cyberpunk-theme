/**
 * Blog Hooks
 *
 * Custom React hooks for blog functionality
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
import type {
  Post,
  Category,
  Tag,
  PaginatedResponse,
  PostFilters,
} from '../lib/types/blog';

// Services
import { blogService } from '../lib/services/blog-service';

// =====================================================
// usePosts Hook
// =====================================================

export interface UsePostsParams {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  author?: number;
  search?: string;
  status?: 'publish' | 'draft';
  enabled?: boolean;
}

export interface UsePostsResult {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  refetch: () => void;
  setPage: (page: number) => void;
}

export function usePosts(params: UsePostsParams = {}): UsePostsResult {
  const [result, setResult] = useState<PaginatedResponse<Post>>({
    data: [],
    meta: { total: 0, totalPages: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [currentPage, setCurrentPage] = useState(params.page || 1);

  const fetchPosts = useCallback(async () => {
    if (params.enabled === false) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    try {
      const response = await blogService.getPosts({
        page: currentPage,
        per_page: params.per_page || 10,
        categories: params.category,
        tags: params.tag,
        author: params.author,
        search: params.search,
        status: params.status || 'publish',
      });
      setResult(response);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, params]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    posts: result.data,
    total: result.meta.total,
    totalPages: result.meta.totalPages,
    currentPage,
    isLoading,
    isError,
    error,
    refetch: fetchPosts,
    setPage,
  };
}

// =====================================================
// usePost Hook
// =====================================================

export interface UsePostResult {
  post: Post | null;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  refetch: () => void;
}

export function usePost(slugOrId: string | number, enabled: boolean = true): UsePostResult {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const fetchPost = useCallback(async () => {
    if (!enabled || !slugOrId) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    try {
      const data = await blogService.getPost(slugOrId);
      setPost(data);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to fetch post'));
    } finally {
      setIsLoading(false);
    }
  }, [slugOrId, enabled]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    isLoading,
    isError,
    error,
    refetch: fetchPost,
  };
}

// =====================================================
// useCategories Hook
// =====================================================

export interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  refetch: () => void;
}

export function useCategories(params: { per_page?: number; include_empty?: boolean } = {}): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    try {
      const data = await blogService.getCategories(params);
      setCategories(data);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    isError,
    error,
    refetch: fetchCategories,
  };
}

// =====================================================
// useTags Hook
// =====================================================

export interface UseTagsResult {
  tags: Tag[];
  popularTags: Tag[];
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  refetch: () => void;
}

export function useTags(params: { per_page?: number; include_empty?: boolean } = {}): UseTagsResult {
  const [tags, setTags] = useState<Tag[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    try {
      const [allTags, popular] = await Promise.all([
        blogService.getTags(params),
        blogService.getPopularTags(params.per_page || 20),
      ]);
      setTags(allTags);
      setPopularTags(popular);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to fetch tags'));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    popularTags,
    isLoading,
    isError,
    error,
    refetch: fetchTags,
  };
}

// =====================================================
// usePostView Hook
// =====================================================

/**
 * Hook to track post views
 * Automatically increments view count when post is viewed
 */
export function usePostView(postId: number | null | undefined) {
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    if (postId && !tracked) {
      // Increment view count
      blogService.incrementPostViews(postId).catch(console.error);
      setTracked(true);
    }
  }, [postId, tracked]);

  return { tracked };
}

// =====================================================
// usePostLike Hook
// =====================================================

export interface UsePostLikeResult {
  liked: boolean;
  likeCount: number;
  isLoading: boolean;
  toggleLike: () => Promise<void>;
}

export function usePostLike(postId: number | null | undefined, initialLiked = false, initialCount = 0): UsePostLikeResult {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (postId) {
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
      setLiked(!!likedPosts[postId]);
    }
  }, [postId]);

  const toggleLike = useCallback(async () => {
    if (!postId || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await blogService.togglePostLike(postId);

      // Update state
      setLiked(result.liked);
      setLikeCount(result.count);

      // Store in localStorage
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
      if (result.liked) {
        likedPosts[postId] = true;
      } else {
        delete likedPosts[postId];
      }
      localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId, isLoading]);

  return {
    liked,
    likeCount,
    isLoading,
    toggleLike,
  };
}

// =====================================================
// useRelatedPosts Hook
// =====================================================

export function useRelatedPosts(postId: number | null, limit: number = 4) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      setIsLoading(true);
      blogService
        .getRelatedPosts(postId, limit)
        .then(setPosts)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [postId, limit]);

  return { posts, isLoading };
}

// =====================================================
// useSearchPosts Hook
// =====================================================

export interface UseSearchPostsResult {
  results: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  search: (query: string, page?: number) => Promise<void>;
  clearSearch: () => void;
  query: string;
}

export function useSearchPosts() {
  const [results, setResults] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setQuery(searchQuery);
    setCurrentPage(page);

    try {
      const response = await blogService.searchPosts({
        query: searchQuery,
        page,
        per_page: 10,
      });
      setResults(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setIsError(true);
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setTotal(0);
    setTotalPages(0);
    setCurrentPage(1);
    setQuery('');
    setIsError(false);
  }, []);

  return {
    results,
    total,
    totalPages,
    currentPage,
    isLoading,
    isError,
    search,
    clearSearch,
    query,
  };
}
