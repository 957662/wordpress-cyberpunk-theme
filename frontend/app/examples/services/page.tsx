/**
 * 服务演示页面
 * 展示分析服务、缓存服务和通知服务的使用
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAnalytics } from '@/lib/services/analytics/AnalyticsService';
import { useCache, CacheTTL, CacheTags } from '@/lib/services/cache/CacheService';
import { useNotification } from '@/lib/services/notifications/NotificationService';

export default function ServicesDemoPage() {
  const analytics = useAnalytics();
  const cache = useCache();
  const notification = useNotification();

  const [cacheKey, setCacheKey] = useState('example_key');
  const [cacheValue, setCacheValue] = useState('example_value');
  const [cacheResult, setCacheResult] = useState<string>('');

  const [eventData, setEventData] = useState('');
  const [analyticsResult, setAnalyticsResult] = useState<string>('');

  // 缓存操作
  const handleSetCache = () => {
    cache.set(cacheKey, cacheValue, {
      ttl: CacheTTL.MINUTE,
      tags: [CacheTags.API],
      persist: true,
    });
    setCacheResult(`已设置缓存: ${cacheKey} = ${cacheValue}`);
    notification.success('缓存设置成功');
  };

  const handleGetCache = () => {
    const value = cache.get(cacheKey);
    setCacheResult(value ? `获取缓存: ${value}` : '缓存不存在或已过期');
    analytics.trackInteraction('cache', 'get', { key: cacheKey });
  };

  const handleDeleteCache = () => {
    cache.delete(cacheKey);
    setCacheResult(`已删除缓存: ${cacheKey}`);
    notification.info('缓存已删除');
  };

  const handleClearCache = () => {
    cache.clear();
    setCacheResult('已清除所有缓存');
    notification.warning('所有缓存已清除');
  };

  const handleGetStats = () => {
    const stats = cache.getStats();
    setCacheResult(JSON.stringify(stats, null, 2));
  };

  // 分析操作
  const handleTrackEvent = () => {
    analytics.trackCustom('demo_event', { data: eventData || 'test' });
    setAnalyticsResult(`已追踪事件: demo_event`);
    notification.success('事件已追踪');
  };

  const handleTrackPageView = () => {
    analytics.trackPageView({
      path: '/demo',
      title: '服务演示',
    });
    setAnalyticsResult('已追踪页面访问');
    notification.success('页面访问已追踪');
  };

  const handleTrackError = () => {
    analytics.trackError(new Error('示例错误'), { context: 'demo' });
    setAnalyticsResult('已追踪错误');
    notification.error('错误已追踪');
  };

  const handleGetSessionStats = () => {
    const stats = analytics.getSessionStats();
    setAnalyticsResult(JSON.stringify(stats, null, 2));
  };

  // 通知操作
  const handleShowSuccess = () => {
    notification.success('操作成功完成！');
  };

  const handleShowError = () => {
    notification.error('发生错误，请重试！');
  };

  const handleShowWarning = () => {
    notification.warning('请注意潜在问题！');
  };

  const handleShowInfo = () => {
    notification.info('这是一条信息提示');
  };

  const handleShowConfirm = () => {
    notification.confirm('确定要执行此操作吗？', {
      onConfirm: () => {
        notification.success('已确认操作');
      },
      onCancel: () => {
        notification.info('已取消操作');
      },
    });
  };

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div>
          <h1 className="font-display font-bold text-4xl text-cyber-cyan mb-2">
            服务演示
          </h1>
          <p className="text-gray-400">
            展示 CyberPress 平台核心服务的使用方法
          </p>
        </div>

        {/* 缓存服务 */}
        <Card>
          <h2 className="font-display font-semibold text-2xl text-cyber-cyan mb-6">
            缓存服务 (Cache Service)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">缓存键</label>
                <Input
                  value={cacheKey}
                  onChange={(e) => setCacheKey(e.target.value)}
                  placeholder="输入缓存键"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">缓存值</label>
                <Input
                  value={cacheValue}
                  onChange={(e) => setCacheValue(e.target.value)}
                  placeholder="输入缓存值"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSetCache}>设置缓存</Button>
                <Button onClick={handleGetCache} variant="secondary">获取缓存</Button>
                <Button onClick={handleDeleteCache} variant="outline">删除缓存</Button>
                <Button onClick={handleClearCache} variant="danger">清除所有</Button>
                <Button onClick={handleGetStats} variant="ghost">统计信息</Button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">操作结果</label>
              <pre className="bg-cyber-dark border border-cyber-border rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-48">
                {cacheResult || '等待操作...'}
              </pre>
            </div>
          </div>
        </Card>

        {/* 分析服务 */}
        <Card>
          <h2 className="font-display font-semibold text-2xl text-cyber-cyan mb-6">
            分析服务 (Analytics Service)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">事件数据</label>
                <Input
                  value={eventData}
                  onChange={(e) => setEventData(e.target.value)}
                  placeholder="输入事件数据"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleTrackEvent}>追踪事件</Button>
                <Button onClick={handleTrackPageView} variant="secondary">追踪页面</Button>
                <Button onClick={handleTrackError} variant="danger">追踪错误</Button>
                <Button onClick={handleGetSessionStats} variant="ghost">会话统计</Button>
              </div>

              <div className="text-sm text-gray-400">
                <p>提示: 打开浏览器控制台查看详细日志</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">操作结果</label>
              <pre className="bg-cyber-dark border border-cyber-border rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-48">
                {analyticsResult || '等待操作...'}
              </pre>
            </div>
          </div>
        </Card>

        {/* 通知服务 */}
        <Card>
          <h2 className="font-display font-semibold text-2xl text-cyber-cyan mb-6">
            通知服务 (Notification Service)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={handleShowSuccess} fullWidth>成功通知</Button>
            <Button onClick={handleShowError} variant="danger" fullWidth>错误通知</Button>
            <Button onClick={handleShowWarning} variant="secondary" fullWidth>警告通知</Button>
            <Button onClick={handleShowInfo} variant="outline" fullWidth>信息通知</Button>
          </div>

          <div className="mt-4">
            <Button onClick={handleShowConfirm} variant="primary" fullWidth>
              确认对话框
            </Button>
          </div>
        </Card>

        {/* 使用说明 */}
        <Card>
          <h2 className="font-display font-semibold text-xl text-cyber-cyan mb-4">
            使用说明
          </h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-cyber-yellow mb-2">缓存服务</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>支持内存缓存和 localStorage 持久化</li>
                <li>可以设置 TTL (过期时间) 和标签</li>
                <li>提供 getOrSet 方法实现缓存回源模式</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-cyber-yellow mb-2">分析服务</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>自动追踪页面访问和性能指标</li>
                <li>支持自定义事件追踪</li>
                <li>批量发送数据到服务器</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-cyber-yellow mb-2">通知服务</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>支持多种通知类型（成功、错误、警告、信息）</li>
                <li>可自定义持续时间、操作按钮</li>
                <li>提供确认对话框模式</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
