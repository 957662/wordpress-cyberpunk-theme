/**
 * Comment Service
 * Handles all comment-related API calls
 */

import { API_BASE_URL } from '@/config/api';

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  replies?: Comment[];
  likesCount?: number;
  isLiked?: boolean;
}

class CommentService {
  private baseUrl = `${API_BASE_URL}/comments`;

  /**
   * Get comments for a post
   */
  async getComments(postSlug: string): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}?post=${postSlug}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  }

  /**
   * Add a new comment
   */
  async addComment(postSlug: string, content: string, parentId?: string): Promise<Comment> {
    const token = localStorage.getItem('token');
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        postSlug,
        content,
        parentId,
      }),
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  }

  /**
   * Update a comment
   */
  async updateComment(commentId: string, content: string): Promise<Comment> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete comment');
  }

  /**
   * Like a comment
   */
  async likeComment(commentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${commentId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to like comment');
  }

  /**
   * Unlike a comment
   */
  async unlikeComment(commentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${commentId}/like`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to unlike comment');
  }
}

export const commentService = new CommentService();
