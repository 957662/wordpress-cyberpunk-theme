/**
 * React Hooks - 文章相关
 * 用于获取和管理文章数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWordPressClient } from '@/lib/wordpress/client';
import type { Post, PostsResponse, PostQueryParams } from '@/types/post';

/**
 * 获取文章列表 Hook
 */
export function usePosts(params?: PostQueryParams) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['posts', params],
    queryFn: () => getWordPressClient().getPosts(params),
    staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
  });

  // 预取下一页数据
  const prefetchNextPage = async () => {
    if (data && data.page < data.totalPages) {
      await queryClient.prefetchQuery({
        queryKey: ['posts', { ...params, page: (data?.page || 1) + 1 }],
        queryFn: () => getWordPressClient().getPosts({ ...params, page: (data?.page || 1) + 1 }),
      });
    }
  };

  return {
    posts: data?.posts || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    error: error as Error | null,
    isError,
    refetch,
    prefetchNextPage,
    hasMore: (data?.page || 1) < (data?.totalPages || 1),
  };
}

/**
 * 获取单篇文章 Hook
 */
export function usePost(slug: string) {
  const {
    data: post,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => getWordPressClient().getPost(slug),
    enabled: !!slug, // 只有在 slug 存在时才执行查询
    staleTime: 10 * 60 * 1000, // 10分钟内数据视为新鲜
  });

  return {
    post,
    isLoading,
    error: error as Error | null,
    isError,
  };
}

/**
 * 搜索文章 Hook
 */
export function useSearchPosts(query: string, params?: Omit<PostQueryParams, 'search'>) {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['search', query, params],
    queryFn: () => getWordPressClient().searchPosts(query, params),
    enabled: query.length > 2, // 只有在查询长度大于2时才执行
    staleTime: 2 * 60 * 1000, // 2分钟内数据视为新鲜
  });

  return {
    posts: data?.posts || [],
    total: data?.total || 0,
    isLoading,
    error: error as Error | null,
    isError,
  };
}

/**
 * 获取分类文章 Hook
 */
export function useCategoryPosts(categoryId: string | number, params?: PostQueryParams) {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['category-posts', categoryId, params],
    queryFn: () => getWordPressClient().getPosts({ ...params, category: categoryId }),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    posts: data?.posts || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    error: error as Error | null,
    isError,
  };
}

/**
 * 获取标签文章 Hook
 */
export function useTagPosts(tagId: string | number, params?: PostQueryParams) {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['tag-posts', tagId, params],
    queryFn: () => getWordPressClient().getPosts({ ...params, tag: tagId }),
    enabled: !!tagId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    posts: data?.posts || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    error: error as Error | null,
    isError,
  };
}

/**
 * 获取作者文章 Hook
 */
export function useAuthorPosts(authorId: string | number, params?: PostQueryParams) {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['author-posts', authorId, params],
    queryFn: () => getWordPressClient().getPosts({ ...params, author: authorId }),
    enabled: !!authorId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    posts: data?.posts || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    error: error as Error | null,
    isError,
  };
}
