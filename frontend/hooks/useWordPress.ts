/**
 * WordPress API Hooks
 * 提供便捷的 React Hooks 用于访问 WordPress 数据
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { wpAPI, wpQueryKeys, WPPost, WPCategory, WPTag, WPAuthor, WPMedia, WPComment, WPPage } from '@/lib/wordpress-api-enhanced';
import { WPPostsQuery, WPCommentsQuery } from '@/lib/wordpress-api-enhanced';

// =====================================================
// Posts Hooks
// =====================================================

export function usePosts(query: WPPostsQuery = {}) {
  return useQuery({
    queryKey: [...wpQueryKeys.posts(), query],
    queryFn: () => wpAPI.getPosts(query),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

export function usePost(id: number | string) {
  return useQuery({
    queryKey: wpQueryKeys.post(id),
    queryFn: () => wpAPI.getPost(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: [...wpQueryKeys.posts(), { slug }],
    queryFn: () => wpAPI.getPosts({ slug: [slug] }),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

// =====================================================
// Categories Hooks
// =====================================================

export function useCategories() {
  return useQuery({
    queryKey: wpQueryKeys.categories(),
    queryFn: () => wpAPI.getCategories({ per_page: 100 }),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: wpQueryKeys.category(id),
    queryFn: () => wpAPI.getCategory(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}

export function usePostCategories(postId: number) {
  return useQuery({
    queryKey: [...wpQueryKeys.postCategories(postId)],
    queryFn: () => wpAPI.getPostCategories(postId),
    enabled: !!postId,
    staleTime: 15 * 60 * 1000,
  });
}

// =====================================================
// Tags Hooks
// =====================================================

export function useTags() {
  return useQuery({
    queryKey: wpQueryKeys.tags(),
    queryFn: () => wpAPI.getTags({ per_page: 100 }),
    staleTime: 15 * 60 * 1000,
  });
}

export function useTag(id: number) {
  return useQuery({
    queryKey: wpQueryKeys.tag(id),
    queryFn: () => wpAPI.getTag(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}

export function usePostTags(postId: number) {
  return useQuery({
    queryKey: [...wpQueryKeys.postTags(postId)],
    queryFn: () => wpAPI.getPostTags(postId),
    enabled: !!postId,
    staleTime: 15 * 60 * 1000,
  });
}

// =====================================================
// Authors Hooks
// =====================================================

export function useAuthors() {
  return useQuery({
    queryKey: wpQueryKeys.authors(),
    queryFn: () => wpAPI.getAuthors({ per_page: 100 }),
    staleTime: 30 * 60 * 1000, // 30分钟
  });
}

export function useAuthor(id: number) {
  return useQuery({
    queryKey: wpQueryKeys.author(id),
    queryFn: () => wpAPI.getAuthor(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}

// =====================================================
// Media Hooks
// =====================================================

export function useMedia(parentId?: number) {
  return useQuery({
    queryKey: [...wpQueryKeys.media(), { parentId }],
    queryFn: () => wpAPI.getMedia(parentId ? { parent: parentId } : {}),
    staleTime: 60 * 60 * 1000, // 1小时
  });
}

export function useMediaItem(id: number) {
  return useQuery({
    queryKey: wpQueryKeys.mediaItem(id),
    queryFn: () => wpAPI.getMediaItem(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}

// =====================================================
// Pages Hooks
// =====================================================

export function usePages(query: WPPostsQuery = {}) {
  return useQuery({
    queryKey: [...wpQueryKeys.pages(), query],
    queryFn: () => wpAPI.getPages(query),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePage(id: number | string) {
  return useQuery({
    queryKey: wpQueryKeys.page(id),
    queryFn: () => wpAPI.getPage(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

// =====================================================
// Comments Hooks
// =====================================================

export function useComments(query: WPCommentsQuery = {}) {
  return useQuery({
    queryKey: [...wpQueryKeys.comments(), query],
    queryFn: () => wpAPI.getComments(query),
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

export function useComment(id: number) {
  return useQuery({
    queryKey: wpQueryKeys.comment(id),
    queryFn: () => wpAPI.getComment(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePostComments(postId: number) {
  return useQuery({
    queryKey: wpQueryKeys.postComments(postId),
    queryFn: () => wpAPI.getPostComments(postId),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      content,
      author,
    }: {
      postId: number;
      content: string;
      author: { name: string; email: string; url?: string };
    }) => wpAPI.createComment(postId, content, author),
    onSuccess: (_, variables) => {
      // 刷新评论列表
      queryClient.invalidateQueries({
        queryKey: wpQueryKeys.postComments(variables.postId),
      });
    },
  });
}

// =====================================================
// Search Hooks
// =====================================================

export function useSearch(query: string, subtype?: string[], perPage: number = 10) {
  return useQuery({
    queryKey: wpQueryKeys.search(query),
    queryFn: () => wpAPI.search(query, subtype, perPage),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

// =====================================================
// Upload Hooks
// =====================================================

export function useUploadMedia() {
  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: number) => void;
    }) => {
      return await wpAPI.uploadMedia(file, onProgress);
    },
  });
}

// =====================================================
// Batch Queries Hooks
// =====================================================

export function useHomepageData() {
  const postsQuery = usePosts({ per_page: 10, sticky: true });
  const categoriesQuery = useCategories();

  return {
    posts: postsQuery.data?.posts || [],
    postsLoading: postsQuery.isLoading,
    categories: categoriesQuery.data || [],
    categoriesLoading: categoriesQuery.isLoading,
  };
}

export function useBlogPageData(page: number = 1, categoryId?: number) {
  const postsQuery = usePosts({
    page,
    per_page: 12,
    categories: categoryId ? [categoryId] : undefined,
  });

  return {
    posts: postsQuery.data?.posts || [],
    pagination: postsQuery.data?.pagination || { total: 0, totalPages: 0 },
    isLoading: postsQuery.isLoading,
  };
}

export function usePostPageData(id: number | string) {
  const postQuery = usePost(id);
  const commentsQuery = usePostComments(Number(id));
  const categoriesQuery = useCategories();

  return {
    post: postQuery.data,
    postLoading: postQuery.isLoading,
    comments: commentsQuery.data || [],
    commentsLoading: commentsQuery.isLoading,
    categories: categoriesQuery.data || [],
  };
}
