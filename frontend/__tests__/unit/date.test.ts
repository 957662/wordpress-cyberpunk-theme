import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime } from '@/lib/utils/date';

describe('date utilities', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-03-06T00:00:00Z');
      const result = formatDate(date);
      expect(result).toBeTruthy();
    });

    it('should handle string input', () => {
      const result = formatDate('2026-03-06');
      expect(result).toBeTruthy();
    });
    
    it('should handle custom format', () => {
      const result = formatDate('2026-03-06', 'yyyy-MM-dd');
      expect(result).toContain('2026');
      expect(result).toContain('03');
      expect(result).toContain('06');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return relative time for recent times', () => {
      const now = new Date();
      const result = formatRelativeTime(now);
      expect(result).toBeTruthy();
    });

    it('should return minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      const result = formatRelativeTime(date);
      expect(result).toContain('分钟');
    });

    it('should return hours ago', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const result = formatRelativeTime(date);
      expect(result).toContain('小时');
    });
    
    it('should return days ago', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      const result = formatRelativeTime(date);
      expect(result).toContain('天');
    });
  });
});
