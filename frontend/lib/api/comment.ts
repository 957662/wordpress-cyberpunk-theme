/**
 * Comment API Service
 * 处理评论相关的API请求
 */

import { API_BASE_URL } from '@/lib/config';

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  replies?: Comment[];
  likeCount: number;
  isLiked?: boolean;
}

export interface CreateCommentData {
  postId: string;
  content: string;
  parentId?: string;
}

export interface CommentListResponse {
  data: Comment[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

class CommentApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/comments`;
  }

  /**
   * 获取文章的评论列表
   */
  async getComments(
    postId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<CommentListResponse> {
    const response = await fetch(
      `${this.baseUrl}/posts/${postId}?page=${page}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return response.json();
  }

  /**
   * 创建评论
   */
  async createComment(
    token: string,
    data: CreateCommentData
  ): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create comment');
    }

    return response.json();
  }

  /**
   * 更新评论
   */
  async updateComment(
    token: string,
    commentId: string,
    content: string
  ): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to update comment');
    }

    return response.json();
  }

  /**
   * 删除评论
   */
  async deleteComment(token: string, commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  }

  /**
   * 点赞评论
   */
  async likeComment(token: string, commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${commentId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to like comment');
    }
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(token: string, commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${commentId}/like`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to unlike comment');
    }
  }

  /**
   * 获取评论的回复
   */
  async getReplies(commentId: string): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}/${commentId}/replies`);

    if (!response.ok) {
      throw new Error('Failed to fetch replies');
    }

    return response.json();
  }

  /**
   * 举报评论
   */
  async reportComment(
    token: string,
    commentId: string,
    reason: string
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${commentId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to report comment');
    }
  }
}

// 导出单例实例
export const commentApi = new CommentApiService();

// 导出类型
export type {
  Comment,
  CreateCommentData,
  CommentListResponse,
};
