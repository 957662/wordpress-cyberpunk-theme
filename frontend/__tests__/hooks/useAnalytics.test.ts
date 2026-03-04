/**
 * useAnalytics Hook 测试
 * CyberPress Platform
 */

import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from '@/hooks/useAnalytics';

// Mock analytics service
jest.mock('@/services/analytics-service', () => ({
  analyticsService: {
    getAnalytics: jest.fn(),
    getRealtimeVisitors: jest.fn(),
    trackPageView: jest.fn(),
    trackEvent: jest.fn(),
  },
}));

describe('useAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('应该在挂载时获取分析数据', async () => {
    const mockData = {
      pageViews: 1000,
      uniqueVisitors: 500,
      bounceRate: 0.4,
      avgSessionDuration: 180,
      topPages: [],
      trafficSources: [],
      deviceBreakdown: [],
      geographicData: [],
    };

    const { analyticsService } = require('@/services/analytics-service');
    analyticsService.getAnalytics.mockResolvedValue(mockData);
    analyticsService.getRealtimeVisitors.mockResolvedValue(50);

    const { result } = renderHook(() => useAnalytics());

    // 等待异步操作完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.realtimeVisitors).toBe(50);
    expect(result.current.loading).toBe(false);
  });

  it('应该处理错误状态', async () => {
    const { analyticsService } = require('@/services/analytics-service');
    analyticsService.getAnalytics.mockRejectedValue(new Error('获取失败'));
    analyticsService.getRealtimeVisitors.mockRejectedValue(new Error('获取失败'));

    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.loading).toBe(false);
  });

  it('应该支持手动刷新', async () => {
    const mockData = {
      pageViews: 1000,
      uniqueVisitors: 500,
      bounceRate: 0.4,
      avgSessionDuration: 180,
      topPages: [],
      trafficSources: [],
      deviceBreakdown: [],
      geographicData: [],
    };

    const { analyticsService } = require('@/services/analytics-service');
    analyticsService.getAnalytics.mockResolvedValue(mockData);
    analyticsService.getRealtimeVisitors.mockResolvedValue(50);

    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // 手动刷新
    await act(async () => {
      await result.current.refresh();
    });

    expect(analyticsService.getAnalytics).toHaveBeenCalledTimes(2);
    expect(analyticsService.getRealtimeVisitors).toHaveBeenCalledTimes(2);
  });

  it('应该追踪页面访问', async () => {
    const { analyticsService } = require('@/services/analytics-service');
    analyticsService.getAnalytics.mockResolvedValue({});
    analyticsService.getRealtimeVisitors.mockResolvedValue(0);
    analyticsService.trackPageView.mockResolvedValue({});

    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      await result.current.trackPageView('/test', '测试页面');
    });

    expect(analyticsService.trackPageView).toHaveBeenCalledWith({
      path: '/test',
      title: '测试页面',
      timestamp: expect.any(String),
    });
  });

  it('应该追踪自定义事件', async () => {
    const { analyticsService } = require('@/services/analytics-service');
    analyticsService.getAnalytics.mockResolvedValue({});
    analyticsService.getRealtimeVisitors.mockResolvedValue(0);
    analyticsService.trackEvent.mockResolvedValue({});

    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      await result.current.trackEvent('button_click', { buttonId: 'submit' });
    });

    expect(analyticsService.trackEvent).toHaveBeenCalledWith({
      name: 'button_click',
      properties: { buttonId: 'submit' },
      timestamp: expect.any(String),
    });
  });

  it('应该支持自定义刷新间隔', async () => {
    const { analyticsService } = require('@/services/analytics-service');
    analyticsService.getAnalytics.mockResolvedValue({});
    analyticsService.getRealtimeVisitors.mockResolvedValue(0);

    renderHook(() => useAnalytics({ refreshInterval: 5000 }));

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(analyticsService.getAnalytics).toHaveBeenCalledTimes(2); // 初始 + 刷新
  });

  it('应该支持禁用自动刷新', async () => {
    const { analyticsService } = require('@/services/analytics-service');
    analyticsService.getAnalytics.mockResolvedValue({});
    analyticsService.getRealtimeVisitors.mockResolvedValue(0);

    renderHook(() => useAnalytics({ refreshInterval: 0 }));

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(analyticsService.getAnalytics).toHaveBeenCalledTimes(1); // 仅初始
  });
});
