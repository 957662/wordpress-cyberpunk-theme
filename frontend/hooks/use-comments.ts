/**
 * useComments Hook
 * 评论数据获取 Hook
 *
 * 提供评论列表、创建、删除等功能
 */

'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { blogService } from '@/lib/services/blog.service';

// ==================== 类型定义 ====================

export interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  author_email?: string;
  author_avatar?: string;
  content: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  like_count: number;
  is_liked?: boolean;
  replies?: Comment[];
  depth?: number;
}

export interface CommentCreate {
  content: string;
  author_name?: string;
  author_email?: string;
  parent_id?: number;
}

export interface CommentListParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest' | 'popular';
}

// ==================== 查询 Keys ====================

export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (postId: number, filters?: any) => [...commentKeys.lists(), postId, filters] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (commentId: number) => [...commentKeys.details(), commentId] as const,
};

// ==================== 评论列表 ====================

/**
 * 获取文章评论列表
 */
export function useComments(postId: number, params?: CommentListParams) {
  return useQuery({
    queryKey: commentKeys.list(postId, params),
    queryFn: () => blogService.getComments(postId, params),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 分钟
  });
}

/**
 * 获取评论无限列表
 */
export function useInfiniteComments(postId: number, params?: Omit<CommentListParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...commentKeys.lists(), postId, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      blogService.getComments(postId, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
  });
}

// ==================== 评论操作 ====================

/**
 * 创建评论
 */
export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentCreate) =>
      blogService.createComment(postId, data),
    onSuccess: () => {
      // 刷新评论列表
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId)
      });
    },
  });
}

/**
 * 删除评论
 */
export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      blogService.deleteComment(postId, commentId),
    onSuccess: () => {
      // 刷新评论列表
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId)
      });
    },
  });
}

/**
 * 点赞评论
 */
export function useLikeComment(postId: number, commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      blogService.likeComment(postId, commentId),
    onSuccess: () => {
      // 刷新评论列表
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId)
      });
    },
  });
}

/**
 * 回复评论
 */
export function useReplyComment(postId: number, parentCommentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CommentCreate, 'parent_id'>) =>
      blogService.createComment(postId, {
        ...data,
        parent_id: parentCommentId
      }),
    onSuccess: () => {
      // 刷新评论列表
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId)
      });
    },
  });
}

// ==================== 评论统计 ====================

/**
 * 获取评论数量
 */
export function useCommentCount(postId: number) {
  return useQuery({
    queryKey: ['comments', 'count', postId],
    queryFn: async () => {
      const response = await blogService.getComments(postId, { limit: 1 });
      return response.total;
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}

// ==================== 评论树结构 ====================

/**
 * 将评论列表转换为树形结构
 */
export function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  // 第一遍：创建映射
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 第二遍：构建树
  comments.forEach(comment => {
    const mappedComment = commentMap.get(comment.id)!;

    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies!.push(mappedComment);
        mappedComment.depth = (parent.depth || 0) + 1;
      }
    } else {
      rootComments.push(mappedComment);
    }
  });

  return rootComments;
}

/**
 * 扁平化评论树
 */
export function flattenCommentTree(comments: Comment[]): Comment[] {
  const result: Comment[] = [];

  function traverse(comments: Comment[]) {
    comments.forEach(comment => {
      result.push(comment);
      if (comment.replies && comment.replies.length > 0) {
        traverse(comment.replies);
      }
    });
  }

  traverse(comments);
  return result;
}

// ==================== Hook 辅助函数 ====================

/**
 * 格式化评论时间
 */
export function formatCommentTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * 截断评论内容
 */
export function truncateComment(content: string, maxLength: number = 200): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + '...';
}
