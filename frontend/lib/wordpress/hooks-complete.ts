/**
 * WordPress React Query Hooks
 * 完整的 WordPress 数据获取 hooks
 */

'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import defaultClient, { WordPressClient } from './client-new';
import type { Post, Category, Tag, Author, Comment } from './types';

// 默认查询选项
const defaultOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
};

/**
 * 获取所有文章
 */
export function usePosts(
  options: {
    page?: number;
    perPage?: number;
    category?: number;
    tag?: number;
    search?: string;
    author?: number;
    orderBy?: 'date' | 'title' | 'relevance';
    order?: 'asc' | 'desc';
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true, ...apiOptions } = options;

  return useQuery({
    queryKey: ['posts', apiOptions],
    queryFn: () => defaultClient.getPosts(apiOptions),
    enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 获取单篇文章
 */
export function usePost(
  id: number | string,
  options: {
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Post, Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['post', id],
    queryFn: () => defaultClient.getPost(id),
    enabled: !!id && enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 通过 slug 获取文章
 */
export function usePostBySlug(
  slug: string,
  options: {
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Post, Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['post', 'slug', slug],
    queryFn: () => defaultClient.getPostBySlug(slug),
    enabled: !!slug && enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 获取分类列表
 */
export function useCategories(
  options: {
    page?: number;
    perPage?: number;
    hideEmpty?: boolean;
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true, ...apiOptions } = options;

  return useQuery({
    queryKey: ['categories', apiOptions],
    queryFn: () => defaultClient.getCategories(apiOptions),
    enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 获取单个分类
 */
export function useCategory(
  id: number,
  options: {
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Category, Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['category', id],
    queryFn: () => defaultClient.getCategory(id),
    enabled: !!id && enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 获取标签列表
 */
export function useTags(
  options: {
    page?: number;
    perPage?: number;
    hideEmpty?: boolean;
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Tag[], Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true, ...apiOptions } = options;

  return useQuery({
    queryKey: ['tags', apiOptions],
    queryFn: () => defaultClient.getTags(apiOptions),
    enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 获取作者列表
 */
export function useAuthors(
  options: {
    page?: number;
    perPage?: number;
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Author[], Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true, ...apiOptions } = options;

  return useQuery({
    queryKey: ['authors', apiOptions],
    queryFn: () => defaultClient.getAuthors(apiOptions),
    enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 获取单个作者
 */
export function useAuthor(
  id: number,
  options: {
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Author, Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['author', id],
    queryFn: () => defaultClient.getAuthor(id),
    enabled: !!id && enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 获取文章评论
 */
export function useComments(
  postId: number,
  options: {
    page?: number;
    perPage?: number;
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Comment[], Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true, ...apiOptions } = options;

  return useQuery({
    queryKey: ['comments', postId, apiOptions],
    queryFn: () => defaultClient.getComments(postId, apiOptions),
    enabled: !!postId && enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 提交评论
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      postId: number;
      comment: {
        author: string;
        authorEmail: string;
        content: string;
        parentId?: number;
      };
    }) => defaultClient.createComment(params.postId, params.comment),
    onSuccess: (data, variables) => {
      // 使评论缓存失效
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
}

/**
 * 搜索文章
 */
export function useSearch(
  query: string,
  options: {
    page?: number;
    perPage?: number;
    enabled?: boolean;
  } = {},
  queryOptions?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>
) {
  const { enabled = true, ...apiOptions } = options;

  return useQuery({
    queryKey: ['search', query, apiOptions],
    queryFn: () => defaultClient.search(query, apiOptions),
    enabled: !!query && enabled,
    ...defaultOptions,
    ...queryOptions,
  });
}

/**
 * 获取总文章数
 */
export function useTotalPosts(options: {
  enabled?: boolean;
} = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['total-posts'],
    queryFn: () => defaultClient.getTotalPosts(),
    enabled,
    ...defaultOptions,
  });
}

/**
 * 获取总页数
 */
export function useTotalPages(options: {
  enabled?: boolean;
} = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['total-pages'],
    queryFn: () => defaultClient.getTotalPages(),
    enabled,
    ...defaultOptions,
  });
}

/**
 * 预取文章数据
 */
export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (id: number | string) => {
    queryClient.prefetchQuery({
      queryKey: ['post', id],
      queryFn: () => defaultClient.getPost(id),
      ...defaultOptions,
    });
  };
}

/**
 * 预取分类数据
 */
export function usePrefetchCategory() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['category', id],
      queryFn: () => defaultClient.getCategory(id),
      ...defaultOptions,
    });
  };
}
