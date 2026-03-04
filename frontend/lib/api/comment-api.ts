/**
 * Comment API Service
 * 评论相关 API 服务
 */

import { apiClient } from './api-client';

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  post: {
    id: string;
    title: string;
    slug: string;
  };
  parent?: {
    id: string;
    content: string;
    author: {
      id: string;
      username: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLiked: boolean;
}

export interface CreateCommentDto {
  postId: string;
  content: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  content: string;
}

export const commentApi = {
  /**
   * 获取文章评论
   */
  getPostComments: async (postId: string): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/api/comments/post/${postId}`);
    return response.data;
  },

  /**
   * 获取评论详情
   */
  getCommentById: async (id: string): Promise<Comment> => {
    const response = await apiClient.get<Comment>(`/api/comments/${id}`);
    return response.data;
  },

  /**
   * 创建评论
   */
  createComment: async (data: CreateCommentDto): Promise<Comment> => {
    const response = await apiClient.post<Comment>('/api/comments', data);
    return response.data;
  },

  /**
   * 更新评论
   */
  updateComment: async (id: string, data: UpdateCommentDto): Promise<Comment> => {
    const response = await apiClient.patch<Comment>(`/api/comments/${id}`, data);
    return response.data;
  },

  /**
   * 删除评论
   */
  deleteComment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/comments/${id}`);
  },

  /**
   * 点赞评论
   */
  likeComment: async (id: string): Promise<void> => {
    await apiClient.post(`/api/comments/${id}/like`);
  },

  /**
   * 取消点赞评论
   */
  unlikeComment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/comments/${id}/like`);
  },

  /**
   * 获取评论回复
   */
  getCommentReplies: async (commentId: string): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/api/comments/${commentId}/replies`);
    return response.data;
  },
};

export default commentApi;
