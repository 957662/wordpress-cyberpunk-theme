/**
 * WordPress React Hooks
 * 使用 React Query 集成的 WordPress 数据获取 Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { WordPressClient } from './wordpress-client';
import {
  WordPressPost,
  WordPressCategory,
  WordPressTag,
  WordPressComment,
  WordPressMedia,
  WordPressUser,
  WordPressPostsQueryParams,
  LocalizedPost,
  WordPressPostsResponse,
  CreatePostData,
  UpdatePostData,
  CreateCommentData,
} from './types';

// ==================== WordPress Query Keys ====================

export const wpQueryKeys = {
  all: ['wordpress'] as const,
  posts: () => [...wpQueryKeys.all, 'posts'] as const,
  post: (id: number) => [...wpQueryKeys.posts(), id] as const,
  postBySlug: (slug: string) => [...wpQueryKeys.posts(), 'slug', slug] as const,
  categories: () => [...wpQueryKeys.all, 'categories'] as const,
  category: (id: number) => [...wpQueryKeys.categories(), id] as const,
  tags: () => [...wpQueryKeys.all, 'tags'] as const,
  tag: (id: number) => [...wpQueryKeys.tags(), id] as const,
  comments: (postId?: number) => [...wpQueryKeys.all, 'comments', postId] as const,
  media: () => [...wpQueryKeys.all, 'media'] as const,
  mediaItem: (id: number) => [...wpQueryKeys.media(), id] as const,
  users: () => [...wpQueryKeys.all, 'users'] as const,
  user: (id: number) => [...wpQueryKeys.users(), id] as const,
  search: (query: string) => [...wpQueryKeys.all, 'search', query] as const,
};

// ==================== Posts Hooks ====================

export interface UsePostsParams extends WordPressPostsQueryParams {
  enabled?: boolean;
}

export function usePosts(params?: UsePostsParams) {
  const { enabled = true, ...queryParams } = params || {};

  return useQuery({
    queryKey: [...wpQueryKeys.posts(), queryParams],
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getPosts({ ...queryParams, _embed: true });
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePost(
  id: number,
  options?: Omit<UseQueryOptions<WordPressPost>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: wpQueryKeys.post(id),
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getPost(id, { _embed: true });
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function usePostBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<WordPressPost>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: wpQueryKeys.postBySlug(slug),
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getPostBySlug(slug, { _embed: true });
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useFeaturedPosts(limit: number = 5) {
  return useQuery({
    queryKey: [...wpQueryKeys.posts(), 'featured', limit],
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getPosts({
        sticky: true,
        per_page: limit,
        _embed: true,
      });
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useRecentPosts(limit: number = 10) {
  return useQuery({
    queryKey: [...wpQueryKeys.posts(), 'recent', limit],
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getPosts({
        per_page: limit,
        orderby: 'date',
        order: 'desc',
        _embed: true,
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ==================== Categories Hooks ====================

export function useCategories(params?: {
  hide_empty?: boolean;
  per_page?: number;
}) {
  return useQuery({
    queryKey: [...wpQueryKeys.categories(), params],
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getCategories({
        hide_empty: true,
        per_page: 100,
        ...params,
      });
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: wpQueryKeys.category(id),
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getCategory(id);
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCategoryPosts(categoryId: number, perPage: number = 10) {
  return useQuery({
    queryKey: [...wpQueryKeys.posts(), 'category', categoryId, perPage],
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getPosts({
        categories: categoryId,
        per_page: perPage,
        _embed: true,
      });
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== Tags Hooks ====================

export function useTags(params?: {
  hide_empty?: boolean;
  per_page?: number;
}) {
  return useQuery({
    queryKey: [...wpQueryKeys.tags(), params],
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getTags({
        hide_empty: true,
        per_page: 100,
        ...params,
      });
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useTag(id: number) {
  return useQuery({
    queryKey: wpQueryKeys.tag(id),
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getTag(id);
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}

export function useTagPosts(tagId: number, perPage: number = 10) {
  return useQuery({
    queryKey: [...wpQueryKeys.posts(), 'tag', tagId, perPage],
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getPosts({
        tags: tagId,
        per_page: perPage,
        _embed: true,
      });
    },
    enabled: !!tagId,
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== Comments Hooks ====================

export function useComments(postId?: number) {
  return useQuery({
    queryKey: wpQueryKeys.comments(postId),
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getComments({
        post: postId,
        status: 'approved',
        per_page: 100,
      });
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePostComments(postId: number) {
  return useComments(postId);
}

// ==================== Media Hooks ====================

export function useMedia(params?: {
  per_page?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: [...wpQueryKeys.media(), params],
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getMedia(params);
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useMediaItem(id: number) {
  return useQuery({
    queryKey: wpQueryKeys.mediaItem(id),
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getMediaItem(id);
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// ==================== Users Hooks ====================

export function useUsers(params?: {
  per_page?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: [...wpQueryKeys.users(), params],
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getUsers(params);
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: wpQueryKeys.user(id),
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.getUser(id);
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}

// ==================== Search Hooks ====================

export function useSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: wpQueryKeys.search(query),
    queryFn: async () => {
      const client = WordPressClient.getInstance();
      return await client.search({
        search: query,
        per_page: 20,
        subtype: ['post', 'page'],
      });
    },
    enabled: enabled && query.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== Mutations ====================

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      const client = WordPressClient.getInstance();
      return await client.createPost(data);
    },
    onSuccess: () => {
      // Invalidate posts queries
      queryClient.invalidateQueries({ queryKey: wpQueryKeys.posts() });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdatePostData) => {
      const client = WordPressClient.getInstance();
      return await client.updatePost(id, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate specific post and posts list
      queryClient.invalidateQueries({ queryKey: wpQueryKeys.post(variables.id) });
      queryClient.invalidateQueries({ queryKey: wpQueryKeys.posts() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const client = WordPressClient.getInstance();
      await client.deletePost(id);
    },
    onSuccess: (_, id) => {
      // Remove deleted post from cache
      queryClient.invalidateQueries({ queryKey: wpQueryKeys.posts() });
      queryClient.removeQueries({ queryKey: wpQueryKeys.post(id) });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      const client = WordPressClient.getInstance();
      return await client.createComment(data);
    },
    onSuccess: (_, variables) => {
      // Invalidate comments for the post
      queryClient.invalidateQueries({ queryKey: wpQueryKeys.comments(variables.post) });
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const client = WordPressClient.getInstance();
      return await client.uploadMedia(file);
    },
    onSuccess: () => {
      // Invalidate media queries
      queryClient.invalidateQueries({ queryKey: wpQueryKeys.media() });
    },
  });
}

// ==================== Prefetch Functions ====================

export function prefetchPost(client: any, id: number) {
  client.prefetchQuery({
    queryKey: wpQueryKeys.post(id),
    queryFn: async () => {
      const wpClient = WordPressClient.getInstance();
      return await wpClient.getPost(id, { _embed: true });
    },
  });
}

export function prefetchPostsByCategory(client: any, categoryId: number) {
  client.prefetchQuery({
    queryKey: [...wpQueryKeys.posts(), 'category', categoryId],
    queryFn: async () => {
      const wpClient = WordPressClient.getInstance();
      return await wpClient.getPosts({
        categories: categoryId,
        per_page: 10,
        _embed: true,
      });
    },
  });
}

// ==================== Utility Hooks ====================

export function useWordPressLoading() {
  const postsQuery = usePosts();
  const categoriesQuery = useCategories();
  const tagsQuery = useTags();

  return {
    isLoading: postsQuery.isLoading || categoriesQuery.isLoading || tagsQuery.isLoading,
    isError: postsQuery.isError || categoriesQuery.isError || tagsQuery.isError,
    error: postsQuery.error || categoriesQuery.error || tagsQuery.error,
  };
}
