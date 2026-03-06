/**
 * 社交交互相关的 React Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialService } from '@/services/api/social-service';
import { Like, Bookmark, Comment } from '@/types';

/**
 * 点赞功能
 */
export function useLike(postId: string | number) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => socialService.toggleLike(postId),
    onSuccess: (data) => {
      // 更新缓存
      queryClient.setQueryData(['like', postId], {
        liked: data.liked,
        likesCount: data.likesCount,
      });
    },
  });

  const { data: isLiked, isLoading } = useQuery({
    queryKey: ['like', postId],
    queryFn: () => socialService.checkLike(postId),
    enabled: !!postId,
    initialData: false,
  });

  return {
    isLiked,
    isLoading,
    toggleLike: mutation.mutate,
    isToggling: mutation.isPending,
  };
}

/**
 * 收藏功能
 */
export function useBookmark(postId: string | number) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => socialService.toggleBookmark(postId),
    onSuccess: (data) => {
      // 更新缓存
      queryClient.setQueryData(['bookmark', postId], data.bookmarked);
      // 无效化收藏列表缓存
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  const { data: isBookmarked, isLoading } = useQuery({
    queryKey: ['bookmark', postId],
    queryFn: () => socialService.checkBookmark(postId),
    enabled: !!postId,
    initialData: false,
  });

  return {
    isBookmarked,
    isLoading,
    toggleBookmark: mutation.mutate,
    isToggling: mutation.isPending,
  };
}

/**
 * 获取收藏列表
 */
export function useBookmarks(params: { page?: number; perPage?: number } = {}) {
  return useQuery({
    queryKey: ['bookmarks', params],
    queryFn: () => socialService.getBookmarks(params),
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

/**
 * 关注功能
 */
export function useFollow(userId: string | number) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => socialService.toggleFollow(userId),
    onSuccess: (data) => {
      // 更新缓存
      queryClient.setQueryData(['follow', userId], data.following);
      // 无效化相关缓存
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
  });

  const { data: isFollowing, isLoading } = useQuery({
    queryKey: ['follow', userId],
    queryFn: () => socialService.checkFollow(userId),
    enabled: !!userId,
    initialData: false,
  });

  return {
    isFollowing,
    isLoading,
    toggleFollow: mutation.mutate,
    isToggling: mutation.isPending,
  };
}

/**
 * 获取关注列表
 */
export function useFollowing(params: { page?: number; perPage?: number } = {}) {
  return useQuery({
    queryKey: ['following', params],
    queryFn: () => socialService.getFollowing(params),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 获取粉丝列表
 */
export function useFollowers(params: { page?: number; perPage?: number } = {}) {
  return useQuery({
    queryKey: ['followers', params],
    queryFn: () => socialService.getFollowers(params),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 评论功能
 */
export function useComments(postId: string | number, params?: { parent?: number }) {
  return useQuery({
    queryKey: ['comments', postId, params],
    queryFn: () => socialService.getComments(postId, params),
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // 1分钟
  });
}

/**
 * 发表评论
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      postId: string | number;
      content: string;
      parentId?: string | number;
    }) => socialService.createComment(data),
    onSuccess: (data, variables) => {
      // 无效化评论列表缓存
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
      // 无效化文章统计缓存
      queryClient.invalidateQueries({
        queryKey: ['post-stats', variables.postId],
      });
    },
  });
}

/**
 * 删除评论
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string | number) =>
      socialService.deleteComment(commentId),
    onSuccess: () => {
      // 无效化所有评论列表缓存
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

/**
 * 点赞评论
 */
export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string | number) =>
      socialService.likeComment(commentId),
    onSuccess: () => {
      // 无效化评论列表缓存
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

/**
 * 获取用户统计
 */
export function useUserStats(userId: string | number) {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: () => socialService.getUserStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 获取活动流
 */
export function useActivityFeed(params: { page?: number; perPage?: number } = {}) {
  return useQuery({
    queryKey: ['activity-feed', params],
    queryFn: () => socialService.getActivityFeed(params),
    staleTime: 1 * 60 * 1000, // 1分钟
  });
}
