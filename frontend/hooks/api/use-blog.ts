/**
 * Blog API Hooks
 *
 * Custom React Query hooks for blog operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/services/blog-service';
import type { Post, Category, Tag, Author } from '@/types';

/**
 * Get posts with pagination
 */
export function usePosts(params: {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  search?: string;
  author?: string;
  sticky?: boolean;
  enabled?: boolean;
}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['posts', queryParams],
    queryFn: () => blogService.getPosts(queryParams),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get a single post
 */
export function usePost(slugOrId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['post', slugOrId],
    queryFn: () => blogService.getPost(slugOrId),
    enabled: enabled && !!slugOrId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get categories
 */
export function useCategories(params: {
  page?: number;
  perPage?: number;
  hideEmpty?: boolean;
  parent?: string;
  enabled?: boolean;
} = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['categories', queryParams],
    queryFn: () => blogService.getCategories(queryParams),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Get a single category
 */
export function useCategory(slugOrId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['category', slugOrId],
    queryFn: () => blogService.getCategory(slugOrId),
    enabled: enabled && !!slugOrId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Get tags
 */
export function useTags(params: {
  page?: number;
  perPage?: number;
  hideEmpty?: boolean;
  enabled?: boolean;
} = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['tags', queryParams],
    queryFn: () => blogService.getTags(queryParams),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Get a single tag
 */
export function useTag(slugOrId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['tag', slugOrId],
    queryFn: () => blogService.getTag(slugOrId),
    enabled: enabled && !!slugOrId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Get authors
 */
export function useAuthors(params: {
  page?: number;
  perPage?: number;
  enabled?: boolean;
} = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['authors', queryParams],
    queryFn: () => blogService.getAuthors(queryParams),
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Get a single author
 */
export function useAuthor(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['author', id],
    queryFn: () => blogService.getAuthor(id),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Get posts by category
 */
export function usePostsByCategory(
  categorySlug: string,
  params: {
    page?: number;
    perPage?: number;
    enabled?: boolean;
  } = {}
) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['posts-by-category', categorySlug, queryParams],
    queryFn: () => blogService.getPostsByCategory(categorySlug, queryParams),
    enabled: enabled && !!categorySlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get posts by tag
 */
export function usePostsByTag(
  tagSlug: string,
  params: {
    page?: number;
    perPage?: number;
    enabled?: boolean;
  } = {}
) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['posts-by-tag', tagSlug, queryParams],
    queryFn: () => blogService.getPostsByTag(tagSlug, queryParams),
    enabled: enabled && !!tagSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get posts by author
 */
export function usePostsByAuthor(
  authorId: string,
  params: {
    page?: number;
    perPage?: number;
    enabled?: boolean;
  } = {}
) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['posts-by-author', authorId, queryParams],
    queryFn: () => blogService.getPostsByAuthor(authorId, queryParams),
    enabled: enabled && !!authorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get sticky posts
 */
export function useStickyPosts(params: {
  page?: number;
  perPage?: number;
  enabled?: boolean;
} = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['sticky-posts', queryParams],
    queryFn: () => blogService.getStickyPosts(queryParams),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get related posts
 */
export function useRelatedPosts(
  postId: string,
  tags: string[],
  limit: number = 4,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['related-posts', postId, tags, limit],
    queryFn: () => blogService.getRelatedPosts(postId, tags, limit),
    enabled: enabled && !!postId && tags.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Search posts
 */
export function useSearchPosts(
  query: string,
  params: {
    page?: number;
    perPage?: number;
    category?: string;
    tag?: string;
    enabled?: boolean;
  } = {}
) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['search-posts', query, queryParams],
    queryFn: () => blogService.searchPosts(query, queryParams),
    enabled: enabled && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Prefetch posts
 */
export function usePrefetchPosts() {
  const queryClient = useQueryClient();

  return (params: Parameters<typeof blogService.getPosts>[0]) => {
    queryClient.prefetchQuery({
      queryKey: ['posts', params],
      queryFn: () => blogService.getPosts(params),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Invalidate posts query
 */
export function useInvalidatePosts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };
}

/**
 * Invalidate post query
 */
export function useInvalidatePost() {
  const queryClient = useQueryClient();

  return (slugOrId: string) => {
    queryClient.invalidateQueries({ queryKey: ['post', slugOrId] });
  };
}
