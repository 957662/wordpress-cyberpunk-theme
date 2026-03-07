/**
 * WordPress React Hooks
 * React Hooks for WordPress API integration
 */

'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { wpService, type PostsQueryParams, type SearchParams } from '../services/wp-service';
import type { WPPost, WPCategory, WPTag, WPPage, WPComment } from '../wordpress/types';

// Query keys factory
export const wpKeys = {
  all: ['wordpress'] as const,
  posts: () => [...wpKeys.all, 'posts'] as const,
  post: (id: number | string) => [...wpKeys.all, 'post', id] as const,
  categories: () => [...wpKeys.all, 'categories'] as const,
  category: (id: number) => [...wpKeys.all, 'category', id] as const,
  tags: () => [...wpKeys.all, 'tags'] as const,
  tag: (id: number) => [...wpKeys.all, 'tag', id] as const,
  pages: () => [...wpKeys.all, 'pages'] as const,
  page: (id: number | string) => [...wpKeys.all, 'page', id] as const,
  comments: (postId: number) => [...wpKeys.all, 'comments', postId] as const,
  search: (query: string) => [...wpKeys.all, 'search', query] as const,
};

/**
 * 获取文章列表
 */
export function usePosts(params: PostsQueryParams = {}) {
  return useQuery({
    queryKey: [...wpKeys.posts(), params],
    queryFn: () => wpService.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * 获取文章列表 (无限滚动)
 */
export function useInfinitePosts(params: Omit<PostsQueryParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: [...wpKeys.posts(), params],
    queryFn: ({ pageParam = 1 }) =>
      wpService.getPosts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.totalPages > allPages.length) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取单篇文章
 */
export function usePost(id: number | string, enabled = true) {
  return useQuery({
    queryKey: wpKeys.post(id),
    queryFn: () => wpService.getPost(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * 获取分类列表
 */
export function useCategories(params?: {
  page?: number;
  perPage?: number;
  hideEmpty?: boolean;
}) {
  return useQuery({
    queryKey: [...wpKeys.categories(), params],
    queryFn: () => wpService.getCategories(params),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * 获取单个分类
 */
export function useCategory(id: number) {
  return useQuery({
    queryKey: wpKeys.category(id),
    queryFn: () => wpService.getCategory(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * 获取标签列表
 */
export function useTags(params?: {
  page?: number;
  perPage?: number;
  hideEmpty?: boolean;
}) {
  return useQuery({
    queryKey: [...wpKeys.tags(), params],
    queryFn: () => wpService.getTags(params),
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * 获取单个标签
 */
export function useTag(id: number) {
  return useQuery({
    queryKey: wpKeys.tag(id),
    queryFn: () => wpService.getTag(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * 获取评论列表
 */
export function useComments(postId: number, params?: {
  page?: number;
  perPage?: number;
}) {
  return useQuery({
    queryKey: [...wpKeys.comments(postId), params],
    queryFn: () => wpService.getComments({ ...params, post: postId }),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * 提交评论
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      content,
      author,
      parentId,
    }: {
      postId: number;
      content: string;
      author: { name: string; email: string; url?: string };
      parentId?: number;
    }) => wpService.createComment(postId, content, author, parentId),
    onSuccess: (data, variables) => {
      // Invalidate and refetch comments
      queryClient.invalidateQueries({
        queryKey: wpKeys.comments(variables.postId),
      });
    },
  });
}

/**
 * 搜索内容
 */
export function useSearch(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: [...wpKeys.search(params.search), params],
    queryFn: () => wpService.search(params),
    enabled: enabled && params.search.length > 2,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 清除 WordPress 缓存
 */
export function useInvalidateCache() {
  const queryClient = useQueryClient();

  return (pattern?: string) => {
    wpService.clearCache(pattern);
    queryClient.invalidateQueries({
      queryKey: pattern ? [wpKeys.all[0], pattern] : wpKeys.all,
    });
  };
}
