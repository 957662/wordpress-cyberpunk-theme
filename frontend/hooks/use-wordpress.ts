/**
 * WordPress React Hooks
 *
 * Custom React Query hooks for WordPress API integration
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { wordpressClient } from '@/lib/wordpress/wordpress-client';
import type {
  WPPost,
  WPCategory,
  WPTag,
  WPComment,
  WPUser,
  WPPostParams,
} from '@/types/wordpress';

// ============================================================================
// Query Keys Factory
// ============================================================================

export const wpQueryKeys = {
  // Posts
  posts: () => ['wp', 'posts'] as const,
  post: (id: number | string) => ['wp', 'posts', id] as const,
  postBySlug: (slug: string) => ['wp', 'posts', 'slug', slug] as const,

  // Pages
  pages: () => ['wp', 'pages'] as const,
  page: (id: number) => ['wp', 'pages', id] as const,

  // Categories
  categories: () => ['wp', 'categories'] as const,
  category: (id: number | string) => ['wp', 'categories', id] as const,

  // Tags
  tags: () => ['wp', 'tags'] as const,
  tag: (id: number | string) => ['wp', 'tags', id] as const,

  // Comments
  comments: (postId?: number) => ['wp', 'comments', postId] as const,
  comment: (id: number) => ['wp', 'comments', id] as const,

  // Users
  users: () => ['wp', 'users'] as const,
  user: (id: number) => ['wp', 'users', id] as const,

  // Search
  search: (query: string) => ['wp', 'search', query] as const,
} as const;

// ============================================================================
// Posts Hooks
// ============================================================================

export interface UsePostsParams extends WPPostParams {
  enabled?: boolean;
}

/**
 * Hook for fetching posts
 */
export function usePosts(params?: UsePostsParams, options?: Omit<UseQueryOptions<WPPost[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [...wpQueryKeys.posts(), params],
    queryFn: () => wordpressClient.getPosts(params).then(res => res.data || []),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
    enabled: params?.enabled !== false && options?.enabled !== false,
  });
}

/**
 * Hook for fetching a single post
 */
export function usePost(id: number | string, options?: Omit<UseQueryOptions<WPPost>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: wpQueryKeys.post(id),
    queryFn: () => wordpressClient.getPost(id).then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for fetching featured posts
 */
export function useFeaturedPosts(options?: Omit<UseQueryOptions<WPPost[]>, 'queryKey' | 'queryFn'>) {
  return usePosts(
    { sticky: true, per_page: 5 },
    {
      ...options,
      queryKey: [...wpQueryKeys.posts(), { sticky: true, per_page: 5 }],
    }
  );
}

/**
 * Hook for fetching posts by category
 */
export function usePostsByCategory(categoryId: number, params?: UsePostsParams, options?: Omit<UseQueryOptions<WPPost[]>, 'queryKey' | 'queryFn'>) {
  return usePosts(
    { ...params, categories: [categoryId] },
    {
      ...options,
      queryKey: [...wpQueryKeys.posts(), { categories: [categoryId], ...params }],
    }
  );
}

/**
 * Hook for fetching posts by tag
 */
export function usePostsByTag(tagId: number, params?: UsePostsParams, options?: Omit<UseQueryOptions<WPPost[]>, 'queryKey' | 'queryFn'>) {
  return usePosts(
    { ...params, tags: [tagId] },
    {
      ...options,
      queryKey: [...wpQueryKeys.posts(), { tags: [tagId], ...params }],
    }
  );
}

/**
 * Hook for fetching posts by author
 */
export function usePostsByAuthor(authorId: number, params?: UsePostsParams, options?: Omit<UseQueryOptions<WPPost[]>, 'queryKey' | 'queryFn'>) {
  return usePosts(
    { ...params, author: authorId },
    {
      ...options,
      queryKey: [...wpQueryKeys.posts(), { author: authorId, ...params }],
    }
  );
}

// ============================================================================
// Pages Hooks
// ============================================================================

/**
 * Hook for fetching pages
 */
export function usePages(params?: UsePostsParams, options?: Omit<UseQueryOptions<WPPost[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [...wpQueryKeys.pages(), params],
    queryFn: () => wordpressClient.getPosts({ ...params, type: 'page' }).then(res => res.data || []),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for fetching a single page
 */
export function usePage(id: number, options?: Omit<UseQueryOptions<WPPost>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: wpQueryKeys.page(id),
    queryFn: () => wordpressClient.getPost(id).then(res => res.data),
    staleTime: 15 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// Categories Hooks
// ============================================================================

/**
 * Hook for fetching categories
 */
export function useCategories(params?: {
  page?: number;
  per_page?: number;
  exclude?: number[];
  include?: number[];
}, options?: Omit<UseQueryOptions<WPCategory[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [...wpQueryKeys.categories(), params],
    queryFn: () => wordpressClient.getCategories(params).then(res => res.data || []),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for fetching a single category
 */
export function useCategory(id: number | string, options?: Omit<UseQueryOptions<WPCategory>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: wpQueryKeys.category(id),
    queryFn: () => wordpressClient.getCategory(id).then(res => res.data),
    staleTime: 30 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// Tags Hooks
// ============================================================================

/**
 * Hook for fetching tags
 */
export function useTags(params?: {
  page?: number;
  per_page?: number;
  exclude?: number[];
  include?: number[];
}, options?: Omit<UseQueryOptions<WPTag[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [...wpQueryKeys.tags(), params],
    queryFn: () => wordpressClient.getTags(params).then(res => res.data || []),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for fetching a single tag
 */
export function useTag(id: number | string, options?: Omit<UseQueryOptions<WPTag>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: wpQueryKeys.tag(id),
    queryFn: () => wordpressClient.getTag(id).then(res => res.data),
    staleTime: 30 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// Comments Hooks
// ============================================================================

/**
 * Hook for fetching comments for a specific post
 */
export function usePostComments(postId: number, options?: Omit<UseQueryOptions<WPComment[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: wpQueryKeys.comments(postId),
    queryFn: () => wordpressClient.getComments(postId).then(res => res.data || []),
    staleTime: 2 * 60 * 1000,
    enabled: !!postId,
    ...options,
  });
}

// ============================================================================
// Users Hooks
// ============================================================================

/**
 * Hook for fetching users
 */
export function useUsers(params?: {
  page?: number;
  per_page?: number;
  roles?: string[];
}, options?: Omit<UseQueryOptions<WPUser[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [...wpQueryKeys.users(), params],
    queryFn: () => wordpressClient.getUsers(params).then(res => res.data || []),
    staleTime: 30 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for fetching a single user
 */
export function useUser(id: number, options?: Omit<UseQueryOptions<WPUser>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: wpQueryKeys.user(id),
    queryFn: () => wordpressClient.getUser(id).then(res => res.data),
    staleTime: 60 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// Search Hook
// ============================================================================

/**
 * Hook for searching content
 */
export function useSearch(query: string, params?: {
  page?: number;
  per_page?: number;
  type?: string[];
}, options?: Omit<UseQueryOptions<any[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [...wpQueryKeys.search(query), params],
    queryFn: () => wordpressClient.search(query, params).then(res => res.data || []),
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 2,
    ...options,
  });
}

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Hook for managing WordPress cache
 */
export function useWpCache() {
  const queryClient = useQueryClient();

  const clearPostsCache = () => {
    queryClient.invalidateQueries({ queryKey: wpQueryKeys.posts() });
  };

  const clearCategoriesCache = () => {
    queryClient.invalidateQueries({ queryKey: wpQueryKeys.categories() });
  };

  const clearTagsCache = () => {
    queryClient.invalidateQueries({ queryKey: wpQueryKeys.tags() });
  };

  const clearAllCache = () => {
    queryClient.invalidateQueries({ queryKey: ['wp'] });
  };

  const prefetchPost = (id: number | string) => {
    queryClient.prefetchQuery({
      queryKey: wpQueryKeys.post(id),
      queryFn: () => wordpressClient.getPost(id).then(res => res.data),
    });
  };

  return {
    clearPostsCache,
    clearCategoriesCache,
    clearTagsCache,
    clearAllCache,
    prefetchPost,
  };
}
