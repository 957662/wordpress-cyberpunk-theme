/**
 * 社交功能 API 服务
 */

import { apiClient, createAuthApiClient } from './api-client';

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  parentId?: string;
  createdAt: string;
  replies?: Comment[];
}

export class SocialService {
  async toggleLike(postId: string, token: string) {
    const client = createAuthApiClient(token);
    const { data } = await client.post(`/api/posts/${postId}/like`);
    return data;
  }

  async toggleBookmark(postId: string, token: string) {
    const client = createAuthApiClient(token);
    const { data } = await client.post(`/api/posts/${postId}/bookmark`);
    return data;
  }

  async toggleFollow(userId: string, token: string) {
    const client = createAuthApiClient(token);
    const { data } = await client.post(`/api/users/${userId}/follow`);
    return data;
  }

  async getComments(postId: string, page = 1, limit = 20) {
    const { data } = await apiClient.get(`/api/posts/${postId}/comments`, { page, limit });
    return data;
  }

  async addComment(postId: string, content: string, parentId?: string, token?: string): Promise<Comment> {
    const client = token ? createAuthApiClient(token) : apiClient;
    const { data } = await client.post<Comment>(`/api/posts/${postId}/comments`, { content, parentId });
    return data;
  }

  async deleteComment(commentId: string, token: string): Promise<void> {
    const client = createAuthApiClient(token);
    await client.delete(`/api/comments/${commentId}`);
  }
}

export const socialService = new SocialService();
