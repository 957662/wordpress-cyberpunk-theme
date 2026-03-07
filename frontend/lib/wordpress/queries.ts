/**
 * WordPress React Query Hooks
 * 使用 TanStack Query 进行数据获取和缓存
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { getWordPress } from './api';

// Query Keys
export const queryKeys = {
  posts: (params?: any) => ['posts', params] as const,
  post: (id: number | string) => ['post', id] as const,
  postBySlug: (slug: string) => ['post', 'slug', slug] as const,
  pages: (params?: any) => ['pages', params] as const,
  page: (id: number | string) => ['page', id] as const,
  categories: (params?: any) => ['categories', params] as const,
  tags: (params?: any) => ['tags', params] as const,
  authors: (params?: any) => ['authors', params] as const,
  media: (id: number) => ['media', id] as const,
  search: (query: string, params?: any) => ['search', query, params] as const,
};

/**
 * 获取文章列表
 */
export function usePosts(
  params?: {
    page?: number;
    per_page?: number;
    categories?: number[];
    tags?: number[];
    search?: string;
    orderby?: string;
    order?: string;
  },
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.posts(params),
    queryFn: () => getWordPress().getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 分钟
    ...options,
  });
}

/**
 * 获取单篇文章
 */
export function usePost(
  id: number | string,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.post(id),
    queryFn: () => getWordPress().getPost(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * 通过 slug 获取文章
 */
export function usePostBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.postBySlug(slug),
    queryFn: () => getWordPress().getPostBySlug(slug),
    enabled: !!slug,
    ...options,
  });
}

/**
 * 创建文章
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => getWordPress().createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
    },
  });
}

/**
 * 更新文章
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      getWordPress().updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.post(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
    },
  });
}

/**
 * 删除文章
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => getWordPress().deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
    },
  });
}

/**
 * 获取页面列表
 */
export function usePages(
  params?: {
    page?: number;
    per_page?: number;
    search?: string;
  },
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.pages(params),
    queryFn: () => getWordPress().getPages(params),
    staleTime: 10 * 60 * 1000, // 10 分钟
    ...options,
  });
}

/**
 * 获取单个页面
 */
export function usePage(
  id: number | string,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.page(id),
    queryFn: () => getWordPress().getPage(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * 获取分类列表
 */
export function useCategories(
  params?: {
    page?: number;
    per_page?: number;
    search?: string;
  },
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.categories(params),
    queryFn: () => getWordPress().getCategories(params),
    staleTime: 15 * 60 * 1000, // 15 分钟
    ...options,
  });
}

/**
 * 获取标签列表
 */
export function useTags(
  params?: {
    page?: number;
    per_page?: number;
    search?: string;
  },
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.tags(params),
    queryFn: () => getWordPress().getTags(params),
    staleTime: 15 * 60 * 1000, // 15 分钟
    ...options,
  });
}

/**
 * 获取作者列表
 */
export function useAuthors(
  params?: {
    page?: number;
    per_page?: number;
  },
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.authors(params),
    queryFn: () => getWordPress().getAuthors(params),
    staleTime: 30 * 60 * 1000, // 30 分钟
    ...options,
  });
}

/**
 * 搜索内容
 */
export function useSearch(
  query: string,
  params?: {
    subtype?: string;
    per_page?: number;
    page?: number;
  },
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.search(query, params),
    queryFn: () => getWordPress().search({ search: query, ...params }),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 分钟
    ...options,
  });
}

/**
 * 上传媒体文件
 */
export function useUploadMedia() {
  return useMutation({
    mutationFn: (file: File) => getWordPress().uploadMedia(file),
  });
}

/**
 * 创建评论
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      post: number;
      author_name: string;
      author_email: string;
      content: string;
      parent?: number;
    }) => getWordPress().createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.post(variables.post) });
    },
  });
}

// 重新导出 useComments from hooks-final
export { useComments } from './hooks-final';

