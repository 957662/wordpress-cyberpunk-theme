/**
 * Like Service
 * Handles like/unlike operations for posts and comments
 */

import { Like, LikeStats } from '@/types/like.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class LikeService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/likes`;
  }

  /**
   * Like a post or comment
   */
  async likeItem(itemType: 'post' | 'comment', itemId: string): Promise<Like> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemType,
          itemId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to like ${itemType}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error liking ${itemType}:`, error);
      throw error;
    }
  }

  /**
   * Unlike a post or comment
   */
  async unlikeItem(itemType: 'post' | 'comment', itemId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${itemType}/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to unlike ${itemType}`);
      }
    } catch (error) {
      console.error(`Error unliking ${itemType}:`, error);
      throw error;
    }
  }

  /**
   * Check if current user liked an item
   */
  async hasLiked(itemType: 'post' | 'comment', itemId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check/${itemType}/${itemId}`);

      if (!response.ok) {
        throw new Error('Failed to check like status');
      }

      const data = await response.json();
      return data.hasLiked || false;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }

  /**
   * Get like stats for an item
   */
  async getLikeStats(itemType: 'post' | 'comment', itemId: string): Promise<LikeStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats/${itemType}/${itemId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch like stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching like stats:', error);
      throw error;
    }
  }

  /**
   * Get list of users who liked an item
   */
  async getLikes(itemType: 'post' | 'comment', itemId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    likes: Like[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(
        `${this.baseUrl}/${itemType}/${itemId}?${queryParams}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch likes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching likes:', error);
      throw error;
    }
  }

  /**
   * Get current user's liked posts
   */
  async getLikedPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    posts: Like[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${this.baseUrl}/my/posts?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch liked posts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      throw error;
    }
  }

  /**
   * Get current user's liked comments
   */
  async getLikedComments(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    comments: Like[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${this.baseUrl}/my/comments?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch liked comments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching liked comments:', error);
      throw error;
    }
  }

  /**
   * Toggle like (like if not liked, unlike if liked)
   */
  async toggleLike(itemType: 'post' | 'comment', itemId: string): Promise<{ liked: boolean; like?: Like }> {
    try {
      const hasLiked = await this.hasLiked(itemType, itemId);

      if (hasLiked) {
        await this.unlikeItem(itemType, itemId);
        return { liked: false };
      } else {
        const like = await this.likeItem(itemType, itemId);
        return { liked: true, like };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const likeService = new LikeService();

// Export class for testing
export default LikeService;
