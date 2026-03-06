/**
 * Newsletter Service
 * Handles all newsletter-related API calls and business logic
 */

import { apiClient } from './apiClient';

export interface NewsletterSubscription {
  email: string;
  tags?: string[];
  firstName?: string;
  lastName?: string;
  source?: 'popup' | 'widget' | 'section' | 'footer';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tags: string[];
  subscribedAt: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  metadata?: {
    source?: string;
    userAgent?: string;
    ipAddress?: string;
  };
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  newSubscribersThisWeek: number;
  newSubscribersThisMonth: number;
  unsubscribeRate: number;
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  scheduledAt?: string;
  sentAt?: string;
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
}

class NewsletterService {
  private baseUrl = '/newsletter';

  /**
   * Subscribe a new email to the newsletter
   */
  async subscribe(data: NewsletterSubscription): Promise<NewsletterSubscriber> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/subscribe`, {
        ...data,
        metadata: {
          source: data.source || 'direct',
          userAgent: navigator.userAgent,
        },
      });

      // Store subscription info locally
      if (typeof window !== 'undefined') {
        localStorage.setItem('newsletterSubscribed', 'true');
        localStorage.setItem('newsletterEmail', data.email);
        localStorage.setItem('newsletterSubscriberId', response.data.id);
      }

      return response.data;
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe an email from the newsletter
   */
  async unsubscribe(email: string, token: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/unsubscribe`, {
        email,
        token,
      });

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('newsletterSubscribed');
        localStorage.removeItem('newsletterEmail');
        localStorage.removeItem('newsletterSubscriberId');
      }

      return response.data;
    } catch (error) {
      console.error('Newsletter unsubscription failed:', error);
      throw error;
    }
  }

  /**
   * Check subscription status
   */
  async checkStatus(email: string): Promise<{ subscribed: boolean; subscriber?: NewsletterSubscriber }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/status`, {
        params: { email },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      throw error;
    }
  }

  /**
   * Get subscriber profile
   */
  async getSubscriber(subscriberId: string): Promise<NewsletterSubscriber> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/subscribers/${subscriberId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subscriber:', error);
      throw error;
    }
  }

  /**
   * Update subscriber preferences
   */
  async updatePreferences(
    subscriberId: string,
    preferences: { tags?: string[]; firstName?: string; lastName?: string }
  ): Promise<NewsletterSubscriber> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/subscribers/${subscriberId}`, preferences);
      return response.data;
    } catch (error) {
      console.error('Failed to update subscriber preferences:', error);
      throw error;
    }
  }

  /**
   * Get newsletter statistics (admin)
   */
  async getStats(): Promise<NewsletterStats> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch newsletter stats:', error);
      throw error;
    }
  }

  /**
   * Get all subscribers (admin)
   */
  async getSubscribers(params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'unsubscribed' | 'bounced';
    search?: string;
  }): Promise<{ items: NewsletterSubscriber[]; total: number; page: number; limit: number }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/subscribers`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
      throw error;
    }
  }

  /**
   * Delete subscriber (admin)
   */
  async deleteSubscriber(subscriberId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/subscribers/${subscriberId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
      throw error;
    }
  }

  /**
   * Export subscribers (admin)
   */
  async exportSubscribers(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/subscribers/export`, {
        params: { format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export subscribers:', error);
      throw error;
    }
  }

  /**
   * Get campaigns (admin)
   */
  async getCampaigns(): Promise<NewsletterCampaign[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/campaigns`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      throw error;
    }
  }

  /**
   * Create campaign (admin)
   */
  async createCampaign(data: {
    name: string;
    subject: string;
    content: string;
    scheduledAt?: string;
  }): Promise<NewsletterCampaign> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/campaigns`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw error;
    }
  }

  /**
   * Send campaign (admin)
   */
  async sendCampaign(campaignId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/campaigns/${campaignId}/send`);
      return response.data;
    } catch (error) {
      console.error('Failed to send campaign:', error);
      throw error;
    }
  }

  /**
   * Get locally stored subscription info
   */
  getLocalSubscription(): {
    isSubscribed: boolean;
    email: string | null;
    subscriberId: string | null;
  } {
    if (typeof window === 'undefined') {
      return { isSubscribed: false, email: null, subscriberId: null };
    }

    const isSubscribed = localStorage.getItem('newsletterSubscribed') === 'true';
    const email = localStorage.getItem('newsletterEmail');
    const subscriberId = localStorage.getItem('newsletterSubscriberId');

    return { isSubscribed, email, subscriberId };
  }

  /**
   * Clear locally stored subscription info
   */
  clearLocalSubscription(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('newsletterSubscribed');
      localStorage.removeItem('newsletterEmail');
      localStorage.removeItem('newsletterSubscriberId');
      localStorage.removeItem('newsletterPopupLastShown');
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate unsubscribe token
   */
  generateUnsubscribeToken(email: string): string {
    // In a real application, this would be done server-side
    // This is just a placeholder
    return btoa(`${email}-${Date.now()}`);
  }
}

// Export singleton instance
export const newsletterService = new NewsletterService();

// Export class for testing
export default NewsletterService;
