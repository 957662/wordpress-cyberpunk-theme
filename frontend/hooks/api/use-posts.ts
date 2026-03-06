/**
 * usePosts Hook
 *
 * Custom hook for fetching posts with pagination, filtering, and caching.
 * Built on top of React Query for optimal performance.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/services/blog-service';
import type { Post, PaginationParams } from '@/types/models';

export interface UsePostsParams extends Partial<PaginationParams> {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  enabled?: boolean;
}

export interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
  totalItems: number;
  currentPage: number;
  refetch: () => void;
}

/**
 * Hook for fetching paginated posts
 */
export function usePosts(params: UsePostsParams = {}): UsePostsResult {
  const {
    page = 1,
    perPage = 10,
    category,
    tag,
    author,
    search,
    enabled = true,
  } = params;

  const queryKey = ['posts', { page, perPage, category, tag, author, search }];

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      blogService.getPosts({
        page,
        perPage,
        category,
        tag,
        author,
        search,
      }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    posts: data?.posts || [],
    loading,
    error: error as Error | null,
    totalPages: data?.pagination?.totalPages || 1,
    totalItems: data?.pagination?.totalItems || 0,
    currentPage: data?.pagination?.currentPage || page,
    refetch,
  };
}

/**
 * Hook for fetching a single post by slug
 */
export function usePost(slug: string) {
  const {
    data: post,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogService.getPost(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    post,
    loading,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Hook for prefetching a post
 */
export function usePrefetchPost() {
  const queryClient = useQueryClient();

  const prefetchPost = (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['post', slug],
      queryFn: () => blogService.getPost(slug),
      staleTime: 10 * 60 * 1000,
    });
  };

  return { prefetchPost };
}

/**
 * Hook for invalidating posts cache
 */
export function useInvalidatePosts() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  return { invalidate };
}

/**
 * Hook for fetching posts by category
 */
export function usePostsByCategory(categorySlug: string, page = 1, perPage = 10) {
  return usePosts({
    category: categorySlug,
    page,
    perPage,
  });
}

/**
 * Hook for fetching posts by tag
 */
export function usePostsByTag(tagSlug: string, page = 1, perPage = 10) {
  return usePosts({
    tag: tagSlug,
    page,
    perPage,
  });
}

/**
 * Hook for fetching posts by author
 */
export function usePostsByAuthor(authorId: string, page = 1, perPage = 10) {
  return usePosts({
    author: authorId,
    page,
    perPage,
  });
}

/**
 * Hook for searching posts
 */
export function useSearchPosts(query: string, page = 1, perPage = 10) {
  return usePosts({
    search: query,
    page,
    perPage,
    enabled: query.length > 0,
  });
}

/**
 * Hook for fetching related posts
 */
export function useRelatedPosts(postId: string, limit = 4) {
  const {
    data: posts,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['related-posts', postId, limit],
    queryFn: () => blogService.getRelatedPosts(postId, limit),
    enabled: !!postId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    posts: posts || [],
    loading,
    error: error as Error | null,
  };
}

/**
 * Hook for fetching featured/sticky posts
 */
export function useFeaturedPosts(limit = 5) {
  const {
    data: posts,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['featured-posts', limit],
    queryFn: () => blogService.getFeaturedPosts(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    posts: posts || [],
    loading,
    error: error as Error | null,
  };
}

export default usePosts;
