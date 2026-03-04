/**
 * 邮件服务 - 处理邮件发送和订阅管理
 * CyberPress Platform
 */

import { apiClient } from './api-client';

export interface EmailSubscription {
  id: string;
  email: string;
  userId?: string;
  categories: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  unsubscribedAt?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface CampaignData {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  status: 'draft' | 'sending' | 'sent' | 'paused';
  scheduledFor?: string;
  sentCount: number;
  totalRecipients: number;
  openRate: number;
  clickRate: number;
}

export interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

class EmailService {
  private readonly baseUrl = '/api/email';

  /**
   * 订阅新闻邮件
   */
  async subscribe(email: string, categories: string[] = []): Promise<EmailSubscription> {
    const response = await apiClient.post(`${this.baseUrl}/subscribe`, {
      email,
      categories,
    });
    return response.data;
  }

  /**
   * 取消订阅
   */
  async unsubscribe(token: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/unsubscribe`, { token });
  }

  /**
   * 验证订阅状态
   */
  async verifySubscription(token: string): Promise<EmailSubscription> {
    const response = await apiClient.get(`${this.baseUrl}/verify/${token}`);
    return response.data;
  }

  /**
   * 更新订阅偏好
   */
  async updatePreferences(
    token: string,
    categories: string[]
  ): Promise<EmailSubscription> {
    const response = await apiClient.put(`${this.baseUrl}/preferences`, {
      token,
      categories,
    });
    return response.data;
  }

  /**
   * 发送测试邮件
   */
  async sendTestEmail(
    templateId: string,
    recipientEmail: string,
    data?: Record<string, any>
  ): Promise<void> {
    await apiClient.post(`${this.baseUrl}/test`, {
      templateId,
      recipientEmail,
      data,
    });
  }

  /**
   * 创建邮件活动
   */
  async createCampaign(data: {
    name: string;
    subject: string;
    templateId: string;
    scheduledFor?: string;
  }): Promise<CampaignData> {
    const response = await apiClient.post(`${this.baseUrl}/campaigns`, data);
    return response.data;
  }

  /**
   * 获取邮件活动列表
   */
  async getCampaigns(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<CampaignData[]> {
    const response = await apiClient.get(`${this.baseUrl}/campaigns`, { params });
    return response.data;
  }

  /**
   * 获取邮件活动详情
   */
  async getCampaign(id: string): Promise<CampaignData> {
    const response = await apiClient.get(`${this.baseUrl}/campaigns/${id}`);
    return response.data;
  }

  /**
   * 发送邮件活动
   */
  async sendCampaign(id: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/campaigns/${id}/send`);
  }

  /**
   * 获取邮件统计
   */
  async getStats(params?: {
    startDate?: string;
    endDate?: string;
    campaignId?: string;
  }): Promise<EmailStats> {
    const response = await apiClient.get(`${this.baseUrl}/stats`, { params });
    return response.data;
  }

  /**
   * 获取订阅者列表
   */
  async getSubscribers(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<EmailSubscription[]> {
    const response = await apiClient.get(`${this.baseUrl}/subscribers`, { params });
    return response.data;
  }

  /**
   * 导出订阅者
   */
  async exportSubscribers(format: 'csv' | 'json'): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/subscribers/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * 获取邮件模板列表
   */
  async getTemplates(): Promise<EmailTemplate[]> {
    const response = await apiClient.get(`${this.baseUrl}/templates`);
    return response.data;
  }

  /**
   * 预览邮件模板
   */
  async previewTemplate(
    templateId: string,
    data?: Record<string, any>
  ): Promise<{ html: string; text: string }> {
    const response = await apiClient.post(
      `${this.baseUrl}/templates/${templateId}/preview`,
      { data }
    );
    return response.data;
  }

  /**
   * 批量发送邮件
   */
  async sendBulkEmail(data: {
    templateId: string;
    recipients: string[];
    subject?: string;
    data?: Record<string, any>;
  }): Promise<{ jobId: string }> {
    const response = await apiClient.post(`${this.baseUrl}/bulk`, data);
    return response.data;
  }

  /**
   * 取消批量发送任务
   */
  async cancelBulkJob(jobId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/bulk/${jobId}`);
  }

  /**
   * 获取批量发送任务状态
   */
  async getBulkJobStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    total: number;
    sent: number;
    failed: number;
    progress: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/bulk/${jobId}/status`);
    return response.data;
  }
}

export const emailService = new EmailService();
