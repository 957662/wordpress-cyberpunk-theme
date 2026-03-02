/**
 * 评论 API 服务
 * 处理所有评论相关的 API 请求
 */

import { ApiResponse } from '@/types/api.types';
import {
  Comment,
  CommentListResponse,
  CommentQueryParams,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentStats,
  CommentFilter,
  CommentExportData,
  CommentActivity,
} from '@/types/comment.types';

class CommentApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  private endpoint = '/comments';

  /**
   * 获取评论列表
   */
  async getComments(params?: CommentQueryParams): Promise<CommentListResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(
      `${this.baseUrl}${this.endpoint}?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return response.json();
  }

  /**
   * 获取单个评论
   */
  async getComment(id: string): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch comment');
    }

    return response.json();
  }

  /**
   * 获取文章的评论
   */
  async getCommentsByPost(
    postId: string,
    params?: Omit<CommentQueryParams, 'postId'>
  ): Promise<CommentListResponse> {
    return this.getComments({ ...params, postId });
  }

  /**
   * 获取评论回复
   */
  async getCommentReplies(
    commentId: string,
    page = 1,
    pageSize = 20
  ): Promise<CommentListResponse> {
    return this.getComments({
      parentId: commentId,
      page,
      pageSize,
      sortBy: 'date',
      sortOrder: 'asc',
    });
  }

  /**
   * 创建评论
   */
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create comment');
    }

    return response.json();
  }

  /**
   * 更新评论
   */
  async updateComment(
    id: string,
    data: UpdateCommentRequest
  ): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update comment');
    }

    return response.json();
  }

  /**
   * 删除评论
   */
  async deleteComment(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  }

  /**
   * 点赞评论
   */
  async likeComment(id: string): Promise<{ likes: number; isLiked: boolean }> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}/like`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to like comment');
    }

    return response.json();
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(id: string): Promise<{ likes: number; isLiked: boolean }> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}/unlike`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to unlike comment');
    }

    return response.json();
  }

  /**
   * 审核评论（管理员）
   */
  async moderateComment(
    id: string,
    action: 'approve' | 'spam' | 'trash'
  ): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}/moderate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      throw new Error('Failed to moderate comment');
    }

    return response.json();
  }

  /**
   * 批量操作评论
   */
  async bulkModerateComments(
    commentIds: string[],
    action: 'approve' | 'spam' | 'trash' | 'delete'
  ): Promise<{ success: number; failed: number }> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentIds, action }),
    });

    if (!response.ok) {
      throw new Error('Failed to bulk moderate comments');
    }

    return response.json();
  }

  /**
   * 获取评论统计
   */
  async getCommentStats(): Promise<CommentStats> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch comment stats');
    }

    return response.json();
  }

  /**
   * 搜索评论
   */
  async searchComments(
    filter: CommentFilter,
    page = 1,
    pageSize = 20
  ): Promise<CommentListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('pageSize', String(pageSize));

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    const response = await fetch(
      `${this.baseUrl}${this.endpoint}/search?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to search comments');
    }

    return response.json();
  }

  /**
   * 导出评论
   */
  async exportComments(filter?: CommentFilter): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(
      `${this.baseUrl}${this.endpoint}/export?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to export comments');
    }

    return response.blob();
  }

  /**
   * 获取评论活动日志
   */
  async getActivityLog(
    commentId?: string,
    page = 1,
    pageSize = 50
  ): Promise<{ activities: CommentActivity[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('pageSize', String(pageSize));

    if (commentId) {
      queryParams.append('commentId', commentId);
    }

    const response = await fetch(
      `${this.baseUrl}${this.endpoint}/activity?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch activity log');
    }

    return response.json();
  }

  /**
   * 标记评论为举报
   */
  async reportComment(id: string, reason: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to report comment');
    }
  }
}

// 导出单例实例
export const commentApiService = new CommentApiService();
