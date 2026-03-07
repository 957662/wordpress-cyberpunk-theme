/**
 * Blog React Query Hooks - Enhanced
 * 博客相关的 React Query Hooks - 增强版完整实现
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

// ==================== Types ====================

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  comment_count: number;
  like_count?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  author: {
    id: number;
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export interface BlogListResponse {
  data: BlogPost[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface BlogParams {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'trending';
  status?: 'draft' | 'published' | 'archived';
  author?: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  category_id?: number;
  tags?: number[];
  featured_image_url?: string;
  status?: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  category_id?: number;
  tags?: number[];
  featured_image_url?: string;
  status?: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

// ==================== Query Keys ====================

export const blogKeys = {
  all: ['blog'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (params: BlogParams) => [...blogKeys.lists(), params] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: number) => [...blogKeys.details(), id] as const,
  detailBySlug: (slug: string) => [...blogKeys.details(), slug] as const,
  featured: () => [...blogKeys.all, 'featured'] as const,
  trending: () => [...blogKeys.all, 'trending'] as const,
  related: (id: number) => [...blogKeys.all, 'related', id] as const,
  search: (query: string) => [...blogKeys.all, 'search', query] as const,
  recommended: () => [...blogKeys.all, 'recommended'] as const,
};

// ==================== Query Hooks ====================

/**
 * 获取博客文章列表
 */
export function useBlogPosts(
  params: BlogParams = {},
  options?: Omit<UseQueryOptions<BlogListResponse>, 'queryKey' | 'queryFn'>
) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: async () => {
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/posts/?${queryString}` : '/posts/';

      const response = await apiClient.get<BlogListResponse>(endpoint);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5分钟
    ...options,
  });
}

/**
 * 获取单篇文章（通过ID）
 */
export function useBlogPost(
  id: number,
  options?: Omit<UseQueryOptions<BlogPost>, 'queryKey' | 'queryFn'>
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<BlogPost>(`/posts/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      // 预取相关文章
      if (data?.id) {
        queryClient.prefetchQuery({
          queryKey: blogKeys.related(data.id),
          queryFn: () => getRelatedPosts(data.id),
        });
      }
    },
    ...options,
  });
}

/**
 * 获取单篇文章（通过slug）
 */
export function useBlogPostBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<BlogPost>, 'queryKey' | 'queryFn'>
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: blogKeys.detailBySlug(slug),
    queryFn: async () => {
      const response = await apiClient.get<BlogPost>(`/posts/slug/${slug}`);
      return response.data;
    },
    onSuccess: (data) => {
      // 预取相关文章
      if (data?.id) {
        queryClient.prefetchQuery({
          queryKey: blogKeys.related(data.id),
          queryFn: () => getRelatedPosts(data.id),
        });
      }
    },
    ...options,
  });
}

/**
 * 获取精选文章
 */
export function useFeaturedPosts(
  limit: number = 5,
  options?: Omit<UseQueryOptions<BlogPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...blogKeys.featured(), limit],
    queryFn: async () => {
      const response = await apiClient.get<BlogPost[]>(`/posts/?featured=true&per_page=${limit}`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10分钟
    ...options,
  });
}

/**
 * 获取热门文章
 */
export function useTrendingPosts(
  limit: number = 10,
  options?: Omit<UseQueryOptions<BlogPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...blogKeys.trending(), limit],
    queryFn: async () => {
      const response = await apiClient.get<BlogPost[]>(`/posts/trending/list?limit=${limit}`);
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15分钟
    ...options,
  });
}

/**
 * 获取推荐文章
 */
export function useRecommendedPosts(
  limit: number = 10,
  options?: Omit<UseQueryOptions<BlogPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...blogKeys.recommended(), limit],
    queryFn: async () => {
      const response = await apiClient.get<BlogPost[]>(`/posts/recommended/list?limit=${limit}`);
      return response.data;
    },
    staleTime: 20 * 60 * 1000, // 20分钟
    ...options,
  });
}

/**
 * 获取相关文章
 */
export function useRelatedPosts(
  postId: number,
  limit: number = 4,
  options?: Omit<UseQueryOptions<BlogPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: blogKeys.related(postId),
    queryFn: async () => {
      const response = await apiClient.get<BlogPost[]>(`/posts/${postId}/related?limit=${limit}`);
      return response.data;
    },
    enabled: !!postId,
    ...options,
  });
}

/**
 * 搜索文章
 */
export function useBlogSearch(
  query: string,
  params: Omit<BlogParams, 'search'> = {},
  options?: Omit<UseQueryOptions<BlogListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: blogKeys.search(query),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('search', query);

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const queryString = queryParams.toString();
      const response = await apiClient.get<BlogListResponse>(`/posts/?${queryString}`);
      return response.data;
    },
    enabled: query.length > 0,
    ...options,
  });
}

// ==================== Mutation Hooks ====================

/**
 * 创建文章
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await apiClient.post<BlogPost>('/posts/', data);
      return response.data;
    },
    onSuccess: (data) => {
      // 使列表缓存失效
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });

      toast.success('文章创建成功！');

      // 可以选择跳转到新文章页面
      // router.push(`/blog/${data.slug}`);
    },
    onError: (error: Error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });
}

/**
 * 更新文章
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePostData }) => {
      const response = await apiClient.patch<BlogPost>(`/posts/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 更新详情缓存
      queryClient.setQueryData(blogKeys.detail(variables.id), data);

      // 使列表缓存失效
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });

      toast.success('文章更新成功！');
    },
    onError: (error: Error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
}

/**
 * 删除文章
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/posts/${id}`);
      return id;
    },
    onSuccess: (id) => {
      // 移除详情缓存
      queryClient.removeQueries({ queryKey: blogKeys.detail(id) });

      // 使列表缓存失效
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });

      toast.success('文章已删除');
    },
    onError: (error: Error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });
}

/**
 * 点赞文章
 */
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiClient.post<{ message: string }>(`/posts/${postId}/like`);
      return response.data;
    },
    onSuccess: (_, postId) => {
      // 使相关缓存失效
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });

      toast.success('已点赞！');
    },
    onError: (error: Error) => {
      toast.error(`操作失败: ${error.message}`);
    },
  });
}

/**
 * 取消点赞
 */
export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiClient.delete<{ message: string }>(`/posts/${postId}/like`);
      return response.data;
    },
    onSuccess: (_, postId) => {
      // 使相关缓存失效
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });

      toast.success('已取消点赞');
    },
    onError: (error: Error) => {
      toast.error(`操作失败: ${error.message}`);
    },
  });
}

/**
 * 收藏文章
 */
export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiClient.post<{ message: string }>(`/posts/${postId}/bookmark`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('已收藏！');
    },
    onError: (error: Error) => {
      toast.error(`操作失败: ${error.message}`);
    },
  });
}

/**
 * 取消收藏
 */
export function useUnbookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiClient.delete<{ message: string }>(`/posts/${postId}/bookmark`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('已取消收藏');
    },
    onError: (error: Error) => {
      toast.error(`操作失败: ${error.message}`);
    },
  });
}

// ==================== Helper Functions ====================

/**
 * 获取相关文章（辅助函数）
 */
async function getRelatedPosts(postId: number, limit: number = 4): Promise<BlogPost[]> {
  const response = await apiClient.get<BlogPost[]>(`/posts/${postId}/related?limit=${limit}`);
  return response.data;
}

/**
 * 组合 Hook：获取博客首页数据
 */
export function useBlogHomePage() {
  const featuredPosts = useFeaturedPosts(5);
  const trendingPosts = useTrendingPosts(10);
  const latestPosts = useBlogPosts({ page: 1, per_page: 10, sort: 'latest' });

  return {
    featuredPosts: featuredPosts.data ?? [],
    trendingPosts: trendingPosts.data ?? [],
    latestPosts: latestPosts.data?.data ?? [],
    isLoading:
      featuredPosts.isLoading ||
      trendingPosts.isLoading ||
      latestPosts.isLoading,
    error:
      featuredPosts.error ||
      trendingPosts.error ||
      latestPosts.error,
  };
}

/**
 * 组合 Hook：文章详情页数据
 */
export function useBlogDetailPage(id?: number, slug?: string) {
  // 优先使用 slug，其次使用 id
  const postQuery = slug
    ? useBlogPostBySlug(slug)
    : id
    ? useBlogPost(id)
    : { data: undefined, isLoading: false, error: new Error('ID or slug required') };

  const relatedPosts = useRelatedPosts(
    postQuery.data?.id ?? 0,
    4,
    { enabled: !!postQuery.data }
  );

  return {
    post: postQuery.data,
    relatedPosts: relatedPosts.data ?? [],
    isLoading: postQuery.isLoading || relatedPosts.isLoading,
    error: postQuery.error || relatedPosts.error,
  };
}

/**
 * Hook: 分页加载文章
 */
export function usePaginatedPosts(initialParams: BlogParams = {}) {
  const [params, setParams] = React.useState<BlogParams>({
    page: 1,
    per_page: 10,
    ...initialParams,
  });

  const query = useBlogPosts(params);

  const nextPage = () => {
    if (query.data && params.page! < query.data.total_pages) {
      setParams(prev => ({ ...prev, page: prev.page! + 1 }));
    }
  };

  const prevPage = () => {
    if (params.page! > 1) {
      setParams(prev => ({ ...prev, page: prev.page! - 1 }));
    }
  };

  const goToPage = (page: number) => {
    if (query.data && page >= 1 && page <= query.data.total_pages) {
      setParams(prev => ({ ...prev, page }));
    }
  };

  return {
    ...query,
    params,
    setParams,
    nextPage,
    prevPage,
    goToPage,
    currentPage: params.page ?? 1,
    totalPages: query.data?.total_pages ?? 0,
  };
}

import React from 'react';
