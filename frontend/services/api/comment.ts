/**
 * 评论 API 服务
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  parentId?: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CreateCommentData {
  postId: string;
  content: string;
  parentId?: string;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class CommentService {
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * 获取文章评论列表
   */
  async getComments(
    postId: string,
    page = 1,
    pageSize = 20
  ): Promise<CommentListResponse> {
    const response = await this.client.get(`/blog/posts/${postId}/comments`, {
      params: { page, pageSize },
    });
    return response.data;
  }

  /**
   * 创建评论
   */
  async createComment(data: CreateCommentData): Promise<Comment> {
    const response = await this.client.post('/blog/comments', data);
    return response.data;
  }

  /**
   * 更新评论
   */
  async updateComment(
    commentId: string,
    content: string
  ): Promise<Comment> {
    const response = await this.client.put(`/blog/comments/${commentId}`, {
      content,
    });
    return response.data;
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId: string): Promise<void> {
    await this.client.delete(`/blog/comments/${commentId}`);
  }

  /**
   * 点赞评论
   */
  async likeComment(commentId: string): Promise<{ liked: boolean; likesCount: number }> {
    const response = await this.client.post(`/blog/comments/${commentId}/like`);
    return response.data;
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(commentId: string): Promise<{ liked: boolean; likesCount: number }> {
    const response = await this.client.delete(`/blog/comments/${commentId}/like`);
    return response.data;
  }

  /**
   * 举报评论
   */
  async reportComment(commentId: string, reason: string): Promise<void> {
    await this.client.post(`/blog/comments/${commentId}/report`, { reason });
  }
}

export const commentService = new CommentService();
