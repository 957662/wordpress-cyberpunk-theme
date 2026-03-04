/**
 * 性能工具函数测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PerformanceCollector } from '@/lib/performance/performance-monitor';

describe('Performance Monitor', () => {
  let collector: PerformanceCollector;

  beforeEach(() => {
    collector = new PerformanceCollector();
  });

  afterEach(() => {
    collector.stopCollecting();
  });

  describe('recordMetric', () => {
    it('应该正确记录指标', () => {
      collector.recordMetric('renderTime', 150);

      const metrics = collector.getMetrics();
      expect(metrics.renderTime).toBe(150);
    });

    it('应该覆盖同名指标', () => {
      collector.recordMetric('renderTime', 100);
      collector.recordMetric('renderTime', 200);

      const metrics = collector.getMetrics();
      expect(metrics.renderTime).toBe(200);
    });
  });

  describe('measure', () => {
    it('应该测量同步函数执行时间', () => {
      const fn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };

      const result = collector.measure('calcTime', fn);

      expect(result).toBe(499500);
      expect(collector.getMetrics().calcTime).toBeGreaterThan(0);
    });

    it('应该处理函数抛出错误的情况', () => {
      const fn = () => {
        throw new Error('Test error');
      };

      expect(() => collector.measure('errorTime', fn)).toThrow();
      expect(collector.getMetrics().errorTime).toBeGreaterThan(0);
    });
  });

  describe('measureAsync', () => {
    it('应该测量异步函数执行时间', async () => {
      const asyncFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'done';
      };

      const result = await collector.measureAsync('asyncTime', asyncFn);

      expect(result).toBe('done');
      expect(collector.getMetrics().asyncTime).toBeGreaterThanOrEqual(10);
    });
  });

  describe('checkPerformanceThresholds', () => {
    it('应该检测性能良好的情况', () => {
      collector.recordMetric('LCP', 2000);
      collector.recordMetric('FID', 50);
      collector.recordMetric('CLS', 0.05);

      const check = collector.checkPerformanceThresholds();

      expect(check.passed).toBe(true);
      expect(check.issues).toHaveLength(0);
    });

    it('应该检测LCP超过阈值', () => {
      collector.recordMetric('LCP', 3000);

      const check = collector.checkPerformanceThresholds();

      expect(check.passed).toBe(false);
      expect(check.issues.some(issue => issue.includes('LCP'))).toBe(true);
    });

    it('应该检测FID超过阈值', () => {
      collector.recordMetric('FID', 150);

      const check = collector.checkPerformanceThresholds();

      expect(check.passed).toBe(false);
      expect(check.issues.some(issue => issue.includes('FID'))).toBe(true);
    });

    it('应该检测CLS超过阈值', () => {
      collector.recordMetric('CLS', 0.15);

      const check = collector.checkPerformanceThresholds();

      expect(check.passed).toBe(false);
      expect(check.issues.some(issue => issue.includes('CLS'))).toBe(true);
    });

    it('应该检测多个问题', () => {
      collector.recordMetric('LCP', 4000);
      collector.recordMetric('FID', 200);
      collector.recordMetric('CLS', 0.2);

      const check = collector.checkPerformanceThresholds();

      expect(check.passed).toBe(false);
      expect(check.issues.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('generateReport', () => {
    it('应该生成JSON格式的报告', () => {
      collector.recordMetric('LCP', 2000);
      collector.recordMetric('FID', 80);
      collector.recordMetric('CLS', 0.08);

      const report = collector.generateReport();

      expect(typeof report).toBe('string');
      expect(() => JSON.parse(report)).not.toThrow();
    });

    it('报告应包含所有指标', () => {
      collector.recordMetric('testMetric', 123);

      const report = collector.generateReport();
      const parsedReport = JSON.parse(report);

      expect(parsedReport.metrics).toBeDefined();
    });
  });

  describe('sendToAnalytics', () => {
    it('应该发送数据到分析端点', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
      });
      global.fetch = mockFetch;

      collector.recordMetric('testMetric', 100);

      await collector.sendToAnalytics('https://analytics.example.com/api/metrics');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://analytics.example.com/api/metrics',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('应该处理发送失败的情况', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      collector.recordMetric('testMetric', 100);

      // 应该不抛出错误
      await expect(
        collector.sendToAnalytics('https://analytics.example.com/api/metrics')
      ).resolves.not.toThrow();
    });
  });
});
