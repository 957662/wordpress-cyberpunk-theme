/**
 * Advanced Cache Manager Tests
 * 高级缓存管理器测试
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AdvancedCacheManager } from '@/lib/cache/advanced-cache-manager';

describe('AdvancedCacheManager', () => {
  let cache: AdvancedCacheManager<string>;

  beforeEach(() => {
    cache = new AdvancedCacheManager<string>({
      maxSize: 5,
      defaultTTL: 1000,
      persistToDisk: false,
    });
  });

  describe('基本操作', () => {
    it('应该能够设置和获取值', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('应该正确检测键是否存在', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
    });

    it('应该能够删除值', () => {
      cache.set('key1', 'value1');
      cache.delete('key1');
      expect(cache.has('key1')).toBe(false);
    });

    it('应该能够清空所有缓存', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.size).toBe(0);
    });
  });

  describe('TTL 过期', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('应该在TTL过期后返回undefined', () => {
      cache.set('key1', 'value1', 1000);
      expect(cache.get('key1')).toBe('value1');

      jest.advanceTimersByTime(1001);
      expect(cache.get('key1')).toBeUndefined();
    });

    it('应该能够清理过期的缓存', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 2000);

      jest.advanceTimersByTime(1001);
      const cleaned = cache.cleanup();
      expect(cleaned).toBe(1);
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(true);
    });
  });

  describe('getOrSet', () => {
    it('应该返回已存在的值', () => {
      cache.set('key1', 'value1');
      const factory = jest.fn(() => 'newValue');
      const result = cache.getOrSet('key1', factory);
      expect(result).toBe('value1');
      expect(factory).not.toHaveBeenCalled();
    });

    it('应该使用工厂函数创建新值', () => {
      const factory = jest.fn(() => 'newValue');
      const result = cache.getOrSet('key1', factory);
      expect(result).toBe('newValue');
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('应该支持异步工厂函数', async () => {
      const factory = jest.fn(async () => 'asyncValue');
      const result = await cache.getOrSet('key1', factory);
      expect(result).toBe('asyncValue');
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });

  describe('批量操作', () => {
    it('应该能够批量获取', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      const result = cache.getMany(['key1', 'key2', 'key4']);
      expect(result.size).toBe(2);
      expect(result.get('key1')).toBe('value1');
      expect(result.get('key2')).toBe('value2');
    });

    it('应该能够批量设置', () => {
      cache.setMany({ key1: 'value1', key2: 'value2' });
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
    });
  });

  describe('模式匹配', () => {
    it('应该能够根据模式获取键', () => {
      cache.set('user:1', 'value1');
      cache.set('user:2', 'value2');
      cache.set('post:1', 'value3');

      const keys = cache.keysByPattern('user:*');
      expect(keys).toHaveLength(2);
      expect(keys).toContain('user:1');
      expect(keys).toContain('user:2');
    });

    it('应该能够根据模式删除键', () => {
      cache.set('user:1', 'value1');
      cache.set('user:2', 'value2');
      cache.set('post:1', 'value3');

      const count = cache.deleteByPattern('user:*');
      expect(count).toBe(2);
      expect(cache.has('user:1')).toBe(false);
      expect(cache.has('post:1')).toBe(true);
    });
  });

  describe('淘汰策略', () => {
    it('LRU策略应该淘汰最少使用的项', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.get('key1'); // 访问key1
      cache.set('key3', 'value3');
      cache.set('key4', 'value4');
      cache.set('key5', 'value4');
      cache.set('key6', 'value4'); // 触发淘汰

      // key1最近被访问过,key2应该被淘汰
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
    });
  });

  describe('统计信息', () => {
    it('应该正确统计命中率', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('key1');
      cache.get('key2');

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(2/3);
    });

    it('应该估算内存使用', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'a'.repeat(100));

      const stats = cache.getStats();
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });
  });

  describe('元数据', () => {
    it('应该能够存储和获取元数据', () => {
      cache.set('key1', 'value1', 1000, { source: 'api', version: 1 });
      const entry = (cache as any).cache.get('key1');
      expect(entry.metadata).toEqual({ source: 'api', version: 1 });
    });

    it('应该追踪命中次数', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('key1');
      cache.get('key1');

      const entry = (cache as any).cache.get('key1');
      expect(entry.hits).toBe(3);
    });
  });

  describe('边界情况', () => {
    it('应该处理undefined和null值', () => {
      cache.set('key1', null as any);
      cache.set('key2', undefined as any);

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeUndefined();
    });

    it('应该处理空字符串键', () => {
      cache.set('', 'value');
      expect(cache.get('')).toBe('value');
    });

    it('应该处理特殊字符键', () => {
      cache.set('key:with:special/chars', 'value');
      expect(cache.get('key:with:special/chars')).toBe('value');
    });
  });

  describe('性能', () => {
    it('应该快速执行大量操作', () => {
      const start = Date.now();

      for (let i = 0; i < 10000; i++) {
        cache.set(`key${i}`, `value${i}`);
      }

      for (let i = 0; i < 10000; i++) {
        cache.get(`key${i}`);
      }

      const end = Date.now();
      expect(end - start).toBeLessThan(1000); // 应该在1秒内完成
    });
  });
});
