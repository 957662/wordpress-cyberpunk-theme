/**
 * 评论服务
 * 处理评论的增删改查和审核
 */

import { apiClient } from '../api/client';

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  status: 'approved' | 'pending' | 'spam' | 'trash';
  date: string;
  modified: string;
  likes: number;
  replies?: Comment[];
}

export interface CommentFormData {
  postId: string;
  parentId?: string;
  author: string;
  authorEmail: string;
  authorUrl?: string;
  content: string;
}

export interface CommentStats {
  total: number;
  approved: number;
  pending: number;
  spam: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

/**
 * 评论服务类
 */
export class CommentService {
  private readonly baseURL = '/comments';

  /**
   * 获取文章的评论列表
   */
  async getPostComments(postId: string, params?: {
    status?: string;
    page?: number;
    perPage?: number;
    orderBy?: 'date' | 'likes';
    order?: 'asc' | 'desc';
  }): Promise<{
    data: Comment[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/post/${postId}`, { params });
    return response.data;
  }

  /**
   * 获取评论详情
   */
  async getComment(commentId: string): Promise<Comment> {
    const response = await apiClient.get(`${this.baseURL}/${commentId}`);
    return response.data;
  }

  /**
   * 创建评论
   */
  async createComment(data: CommentFormData): Promise<Comment> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  /**
   * 更新评论
   */
  async updateComment(commentId: string, data: Partial<CommentFormData>): Promise<Comment> {
    const response = await apiClient.put(`${this.baseURL}/${commentId}`, data);
    return response.data;
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${commentId}`);
  }

  /**
   * 批量删除评论
   */
  async bulkDeleteComments(commentIds: string[]): Promise<void> {
    await Promise.all(commentIds.map(id => this.deleteComment(id)));
  }

  /**
   * 批量更新评论状态
   */
  async bulkUpdateStatus(commentIds: string[], status: Comment['status']): Promise<void> {
    await apiClient.put(`${this.baseURL}/bulk`, {
      ids: commentIds,
      action: 'update-status',
      status,
    });
  }

  /**
   * 批量标记为垃圾评论
   */
  async bulkMarkSpam(commentIds: string[]): Promise<void> {
    await this.bulkUpdateStatus(commentIds, 'spam');
  }

  /**
   * 批量批准评论
   */
  async bulkApprove(commentIds: string[]): Promise<void> {
    await this.bulkUpdateStatus(commentIds, 'approved');
  }

  /**
   * 批量移至回收站
   */
  async bulkTrash(commentIds: string[]): Promise<void> {
    await this.bulkUpdateStatus(commentIds, 'trash');
  }

  /**
   * 获取管理后台的评论列表
   */
  async getAdminComments(params?: {
    status?: Comment['status'];
    postId?: string;
    search?: string;
    page?: number;
    perPage?: number;
  }): Promise<{
    data: Comment[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/admin`, { params });
    return response.data;
  }

  /**
   * 获取评论统计数据
   */
  async getCommentStats(): Promise<CommentStats> {
    const response = await apiClient.get(`${this.baseURL}/stats`);
    return response.data;
  }

  /**
   * 点赞评论
   */
  async likeComment(commentId: string): Promise<{ likes: number }> {
    const response = await apiClient.post(`${this.baseURL}/${commentId}/like`);
    return response.data;
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(commentId: string): Promise<{ likes: number }> {
    const response = await apiClient.delete(`${this.baseURL}/${commentId}/like`);
    return response.data;
  }

  /**
   * 举报评论
   */
  async reportComment(commentId: string, reason: string): Promise<void> {
    await apiClient.post(`${this.baseURL}/${commentId}/report`, { reason });
  }

  /**
   * 获取评论回复
   */
  async getReplies(commentId: string, params?: {
    page?: number;
    perPage?: number;
  }): Promise<{
    data: Comment[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/${commentId}/replies`, { params });
    return response.data;
  }

  /**
   * 搜索评论
   */
  async searchComments(query: string, params?: {
    status?: Comment['status'];
    page?: number;
    perPage?: number;
  }): Promise<{
    data: Comment[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/search`, {
      params: { q: query, ...params },
    });
    return response.data;
  }

  /**
   * 获取最新评论
   */
  async getRecentComments(limit = 10): Promise<Comment[]> {
    const response = await apiClient.get(`${this.baseURL}/recent`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 获取热门评论（按点赞数）
   */
  async getPopularComments(postId?: string, limit = 10): Promise<Comment[]> {
    const response = await apiClient.get(`${this.baseURL}/popular`, {
      params: { postId, limit },
    });
    return response.data;
  }
}

// 导出单例
export const commentService = new CommentService();

/**
 * React Query hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...commentKeys.lists(), filters] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  stats: () => [...commentKeys.all, 'stats'] as const,
};

/**
 * 获取文章评论
 */
export function usePostComments(postId: string, params?: {
  status?: string;
  page?: number;
  perPage?: number;
}) {
  return useQuery({
    queryKey: commentKeys.list({ postId, ...params }),
    queryFn: () => commentService.getPostComments(postId, params),
    enabled: !!postId,
  });
}

/**
 * 获取评论详情
 */
export function useComment(commentId: string) {
  return useQuery({
    queryKey: commentKeys.detail(commentId),
    queryFn: () => commentService.getComment(commentId),
    enabled: !!commentId,
  });
}

/**
 * 获取管理后台评论列表
 */
export function useAdminComments(params?: {
  status?: Comment['status'];
  postId?: string;
  search?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: commentKeys.list({ admin: true, ...params }),
    queryFn: () => commentService.getAdminComments(params),
  });
}

/**
 * 获取评论统计
 */
export function useCommentStats() {
  return useQuery({
    queryKey: commentKeys.stats(),
    queryFn: () => commentService.getCommentStats(),
    refetchInterval: 30000, // 每30秒刷新
  });
}

/**
 * 创建评论
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.createComment.bind(commentService),
    onSuccess: (data) => {
      toast.success('评论已提交，等待审核');
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      return data;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '评论提交失败';
      toast.error(message);
    },
  });
}

/**
 * 更新评论
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: Partial<CommentFormData> }) =>
      commentService.updateComment(commentId, data),
    onSuccess: () => {
      toast.success('评论已更新');
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
    onError: () => {
      toast.error('更新失败');
    },
  });
}

/**
 * 删除评论
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.deleteComment.bind(commentService),
    onSuccess: () => {
      toast.success('评论已删除');
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
    onError: () => {
      toast.error('删除失败');
    },
  });
}

/**
 * 批量操作评论
 */
export function useBulkCommentAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, action }: { ids: string[]; action: 'approve' | 'spam' | 'trash' | 'delete' }) => {
      switch (action) {
        case 'approve':
          return commentService.bulkApprove(ids);
        case 'spam':
          return commentService.bulkMarkSpam(ids);
        case 'trash':
          return commentService.bulkTrash(ids);
        case 'delete':
          return commentService.bulkDeleteComments(ids);
        default:
          throw new Error('Invalid action');
      }
    },
    onSuccess: () => {
      toast.success('操作成功');
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
    onError: () => {
      toast.error('操作失败');
    },
  });
}

/**
 * 点赞评论
 */
export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.likeComment.bind(commentService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
}

/**
 * 取消点赞评论
 */
export function useUnlikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.unlikeComment.bind(commentService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
}
