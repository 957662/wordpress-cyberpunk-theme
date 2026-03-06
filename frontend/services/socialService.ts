/**
 * Social Service
 * Handles all social-related API calls (follow, like, bookmark, etc.)
 */

import { API_BASE_URL } from '@/config/api';

class SocialService {
  private baseUrl = `${API_BASE_URL}/social`;

  /**
   * Follow a user
   */
  async followUser(userId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error('Failed to follow user');
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(userId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/follow`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error('Failed to unfollow user');
  }

  /**
   * Get followers
   */
  async getFollowers(userId: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/followers/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch followers');
    return response.json();
  }

  /**
   * Get following
   */
  async getFollowing(userId: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/following/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch following');
    return response.json();
  }

  /**
   * Check if following a user
   */
  async isFollowing(userId: string): Promise<boolean> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/following/check/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.isFollowing;
  }
}

export const socialService = new SocialService();
