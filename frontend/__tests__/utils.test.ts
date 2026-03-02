/**
 * 工具函数测试
 */

import {
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatNumber,
  truncateText,
  slugify,
} from '@/lib/utils';

describe('Format Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-03-03T12:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toContain('2026');
      expect(formatted).toContain('03');
    });

    it('should handle date string input', () => {
      const formatted = formatDate('2026-03-03');
      expect(formatted).toBeDefined();
    });

    it('should handle invalid date', () => {
      const formatted = formatDate('invalid-date');
      expect(formatted).toBe('invalid-date');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format recent time as "X hours ago"', () => {
      const date = new Date();
      date.setHours(date.getHours() - 2);
      const formatted = formatRelativeTime(date);
      expect(formatted).toMatch(/小时前/);
    });

    it('should format time in days', () => {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const formatted = formatRelativeTime(date);
      expect(formatted).toMatch(/天前/);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal precision', () => {
      const size = formatFileSize(1536);
      expect(size).toMatch(/1\.5 KB/);
    });
  });

  describe('formatNumber', () => {
    it('should add thousand separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1,000');
    });
  });
});

describe('Text Utils', () => {
  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      const truncated = truncateText(text, 20);
      expect(truncated.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(truncated).toContain('...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      const truncated = truncateText(text, 20);
      expect(truncated).toBe('Short');
    });

    it('should use custom suffix', () => {
      const text = 'This is a long text';
      const truncated = truncateText(text, 10, '…');
      expect(truncated).toContain('…');
      expect(truncated).not.toContain('...');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('should handle Chinese characters', () => {
      const slug = slugify('你好世界');
      expect(slug).toBeDefined();
      expect(slug).not.toContain(' ');
    });

    it('should handle multiple hyphens', () => {
      expect(slugify('Hello -- World')).toBe('hello-world');
    });

    it('should trim leading/trailing hyphens', () => {
      expect(slugify('--Hello--')).toBe('hello');
    });
  });
});

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });
  });

  describe('isValidURL', () => {
    it('should validate correct URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://example.com')).toBe(true);
      expect(isValidURL('https://example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('example')).toBe(false);
    });
  });
});
