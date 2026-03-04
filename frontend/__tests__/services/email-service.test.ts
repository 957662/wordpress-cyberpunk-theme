/**
 * 邮件服务测试
 * CyberPress Platform
 */

import { emailService } from '@/services/email-service';

// Mock API 客户端
jest.mock('@/services/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    it('应该成功订阅邮件', async () => {
      const mockSubscription = {
        id: '1',
        email: 'test@example.com',
        categories: ['tech'],
        status: 'active' as const,
        subscribedAt: new Date().toISOString(),
      };

      const { apiClient } = require('@/services/api-client');
      apiClient.post.mockResolvedValue({ data: mockSubscription });

      const result = await emailService.subscribe('test@example.com', ['tech']);

      expect(result).toEqual(mockSubscription);
      expect(apiClient.post).toHaveBeenCalledWith('/api/email/subscribe', {
        email: 'test@example.com',
        categories: ['tech'],
      });
    });

    it('应该处理订阅失败', async () => {
      const { apiClient } = require('@/services/api-client');
      apiClient.post.mockRejectedValue(new Error('订阅失败'));

      await expect(
        emailService.subscribe('test@example.com', ['tech'])
      ).rejects.toThrow('订阅失败');
    });
  });

  describe('unsubscribe', () => {
    it('应该成功取消订阅', async () => {
      const { apiClient } = require('@/services/api-client');
      apiClient.post.mockResolvedValue({ data: {} });

      await emailService.unsubscribe('token123');

      expect(apiClient.post).toHaveBeenCalledWith('/api/email/unsubscribe', {
        token: 'token123',
      });
    });
  });

  describe('getStats', () => {
    it('应该获取邮件统计', async () => {
      const mockStats = {
        sent: 1000,
        delivered: 950,
        opened: 500,
        clicked: 200,
        bounced: 50,
        unsubscribed: 30,
        openRate: 0.5,
        clickRate: 0.2,
        bounceRate: 0.05,
      };

      const { apiClient } = require('@/services/api-client');
      apiClient.get.mockResolvedValue({ data: mockStats });

      const result = await emailService.getStats();

      expect(result).toEqual(mockStats);
      expect(apiClient.get).toHaveBeenCalledWith('/api/email/stats', {
        params: {},
      });
    });

    it('应该支持日期范围过滤', async () => {
      const { apiClient } = require('@/services/api-client');
      apiClient.get.mockResolvedValue({ data: {} });

      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      await emailService.getStats({ startDate, endDate });

      expect(apiClient.get).toHaveBeenCalledWith('/api/email/stats', {
        params: { startDate, endDate },
      });
    });
  });

  describe('createCampaign', () => {
    it('应该创建邮件活动', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        name: '测试活动',
        subject: '测试主题',
        templateId: 'template-1',
        status: 'draft' as const,
        sentCount: 0,
        totalRecipients: 0,
        openRate: 0,
        clickRate: 0,
      };

      const { apiClient } = require('@/services/api-client');
      apiClient.post.mockResolvedValue({ data: mockCampaign });

      const campaignData = {
        name: '测试活动',
        subject: '测试主题',
        templateId: 'template-1',
      };

      const result = await emailService.createCampaign(campaignData);

      expect(result).toEqual(mockCampaign);
      expect(apiClient.post).toHaveBeenCalledWith('/api/email/campaigns', campaignData);
    });
  });

  describe('sendBulkEmail', () => {
    it('应该发送批量邮件', async () => {
      const { apiClient } = require('@/services/api-client');
      apiClient.post.mockResolvedValue({
        data: { jobId: 'job-123' }
      });

      const result = await emailService.sendBulkEmail({
        templateId: 'template-1',
        recipients: ['user1@example.com', 'user2@example.com'],
        subject: '批量邮件主题',
      });

      expect(result).toEqual({ jobId: 'job-123' });
      expect(apiClient.post).toHaveBeenCalledWith('/api/email/bulk', {
        templateId: 'template-1',
        recipients: ['user1@example.com', 'user2@example.com'],
        subject: '批量邮件主题',
      });
    });
  });

  describe('getBulkJobStatus', () => {
    it('应该获取批量任务状态', async () => {
      const mockStatus = {
        status: 'processing' as const,
        total: 100,
        sent: 50,
        failed: 5,
        progress: 0.5,
      };

      const { apiClient } = require('@/services/api-client');
      apiClient.get.mockResolvedValue({ data: mockStatus });

      const result = await emailService.getBulkJobStatus('job-123');

      expect(result).toEqual(mockStatus);
      expect(apiClient.get).toHaveBeenCalledWith('/api/email/bulk/job-123/status');
    });
  });
});
