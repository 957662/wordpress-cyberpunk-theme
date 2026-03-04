/**
 * Follow Service
 * Handles user follow/unfollow operations
 */

import { Follow, FollowStats } from '@/types/follow.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class FollowService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/follows`;
  }

  /**
   * Follow a user
   */
  async followUser(userId: string): Promise<Follow> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followingId: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  /**
   * Check if current user is following a specific user
   */
  async isFollowing(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to check follow status');
      }

      const data = await response.json();
      return data.isFollowing || false;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  /**
   * Get user's follow stats
   */
  async getFollowStats(userId: string): Promise<FollowStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch follow stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching follow stats:', error);
      throw error;
    }
  }

  /**
   * Get list of users that the current user is following
   */
  async getFollowing(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    users: Follow[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${this.baseUrl}/following?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch following list');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching following list:', error);
      throw error;
    }
  }

  /**
   * Get list of followers
   */
  async getFollowers(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    users: Follow[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${this.baseUrl}/followers?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch followers list');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching followers list:', error);
      throw error;
    }
  }

  /**
   * Get mutual followers (users who follow each other)
   */
  async getMutualFollowers(userId: string): Promise<Follow[]> {
    try {
      const response = await fetch(`${this.baseUrl}/mutual/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch mutual followers');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching mutual followers:', error);
      throw error;
    }
  }

  /**
   * Remove a follower (unfollow someone who follows you)
   */
  async removeFollower(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/followers/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove follower');
      }
    } catch (error) {
      console.error('Error removing follower:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const followService = new FollowService();

// Export class for testing
export default FollowService;
