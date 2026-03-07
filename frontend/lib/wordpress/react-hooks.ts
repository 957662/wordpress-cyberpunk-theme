/**
 * WordPress React Hooks
 *
 * 提供用于 WordPress 数据获取的 React Hooks
 * 基于 TanStack Query 实现
 */

'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { WordPressClient, getWordPressClient, Post, Category, Tag, Comment, User, PostsParams, TaxonomyParams } from './wordpress-api';

// ============================================================================
// Post Hooks
// ============================================================================

export function usePosts(params: PostsParams = {}, options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getWordPressClient().getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function usePost(id: number, options?: Omit<UseQueryOptions<Post, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getWordPressClient().getPost(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function usePostBySlug(slug: string, options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['post', 'slug', slug],
    queryFn: () => getWordPressClient().getPostBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useFeaturedPosts(options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => getWordPressClient().getPosts({ sticky: true, per_page: 5 }),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

export function useLatestPosts(limit = 10, options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['posts', 'latest', limit],
    queryFn: () => getWordPressClient().getPosts({ per_page: limit, orderby: 'date', order: 'desc' }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function usePostsByCategory(categoryId: number, params: PostsParams = {}, options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['posts', 'category', categoryId, params],
    queryFn: () => getWordPressClient().getPosts({ ...params, categories: [categoryId] }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function usePostsByTag(tagId: number, params: PostsParams = {}, options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['posts', 'tag', tagId, params],
    queryFn: () => getWordPressClient().getPosts({ ...params, tags: [tagId] }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useSearchPosts(searchQuery: string, options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['posts', 'search', searchQuery],
    queryFn: () => getWordPressClient().getPosts({ search: searchQuery }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: searchQuery.length > 2,
    ...options,
  });
}

// ============================================================================
// Category Hooks
// ============================================================================

export function useCategories(params: TaxonomyParams = {}, options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getWordPressClient().getCategories(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

export function useCategory(id: number, options?: Omit<UseQueryOptions<Category, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getWordPressClient().getCategory(id),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

export function useCategoriesWithCount(options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['categories', 'with-count'],
    queryFn: () => getWordPressClient().getCategories({ hide_empty: true, orderby: 'count', order: 'desc' }),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

// ============================================================================
// Tag Hooks
// ============================================================================

export function useTags(params: TaxonomyParams = {}, options?: Omit<UseQueryOptions<Tag[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => getWordPressClient().getTags(params),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

export function useTag(id: number, options?: Omit<UseQueryOptions<Tag, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: () => getWordPressClient().getTag(id),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

export function usePopularTags(limit = 20, options?: Omit<UseQueryOptions<Tag[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['tags', 'popular', limit],
    queryFn: () => getWordPressClient().getTags({ hide_empty: true, per_page: limit, orderby: 'count', order: 'desc' }),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

// ============================================================================
// Comment Hooks
// ============================================================================

export function useComments(postId?: number, options?: Omit<UseQueryOptions<Comment[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getWordPressClient().getComments(postId),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useComment(id: number, options?: Omit<UseQueryOptions<Comment, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['comment', id],
    queryFn: () => getWordPressClient().getComment(id),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Partial<Comment>) => {
      return getWordPressClient().createComment(comment);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch comments
      queryClient.invalidateQueries({ queryKey: ['comments', variables.post] });
    },
  });
}

// ============================================================================
// User Hooks
// ============================================================================

export function useUsers(options?: Omit<UseQueryOptions<User[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getWordPressClient().getUsers(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

export function useUser(id: number, options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getWordPressClient().getUser(id),
    staleTime: 30 * 60 * 1000,
    ...options,
  });
}

// ============================================================================
// Media Hooks
// ============================================================================

export function useMedia(options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['media'],
    queryFn: () => getWordPressClient().getMedia(),
    staleTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useMediaItem(id: number, options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['media', id],
    queryFn: () => getWordPressClient().getMediaItem(id),
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}

// ============================================================================
// Search Hook
// ============================================================================

export function useSearch(query: string, type?: string[], options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: () => getWordPressClient().search(query, type),
    staleTime: 2 * 60 * 1000,
    enabled: query.length > 2,
    ...options,
  });
}

// ============================================================================
// Utility Hooks
// ============================================================================

export function useWordPressClient() {
  return getWordPressClient();
}
