/**
 * 工具函数测试
 */

import { describe, it, expect } from 'vitest';
import { cn, formatNumber, truncateText, debounce } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
      expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
      expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz');
    });

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });
  });

  describe('formatNumber', () => {
    it('should format small numbers', () => {
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(100)).toBe('100');
    });

    it('should format thousands', () => {
      expect(formatNumber(1000)).toBe('1.0k');
      expect(formatNumber(1500)).toBe('1.5k');
      expect(formatNumber(9999)).toBe('10.0k');
    });

    it('should format millions', () => {
      expect(formatNumber(1000000)).toBe('1.0M');
      expect(formatNumber(1500000)).toBe('1.5M');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('This is a long text', 10)).toBe('This is a ...');
    });

    it('should not truncate short text', () => {
      expect(truncateText('Hi', 10)).toBe('Hi');
      expect(truncateText('Hello', 5)).toBe('Hello');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on new calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      jest.advanceTimersByTime(500);
      debouncedFn();
      jest.advanceTimersByTime(500);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });
});
