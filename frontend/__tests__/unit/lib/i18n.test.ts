/**
 * 国际化工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  getLocaleConfig,
  isSupportedLocale,
  getBrowserLocale,
  formatDate,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
} from '@/lib/i18n/config';

describe('I18n Config Utils', () => {
  describe('getLocaleConfig', () => {
    it('应该返回中文配置', () => {
      const config = getLocaleConfig('zh-CN');

      expect(config.code).toBe('zh-CN');
      expect(config.flag).toBe('🇨🇳');
      expect(config.nativeName).toBe('简体中文');
    });

    it('应该返回英文配置', () => {
      const config = getLocaleConfig('en-US');

      expect(config.code).toBe('en-US');
      expect(config.flag).toBe('🇺🇸');
      expect(config.nativeName).toBe('English');
    });

    it('应该对不支持的locale返回默认配置', () => {
      const config = getLocaleConfig('unsupported');

      expect(config.code).toBe('zh-CN'); // 默认
    });
  });

  describe('isSupportedLocale', () => {
    it('应该识别支持的语言', () => {
      expect(isSupportedLocale('zh-CN')).toBe(true);
      expect(isSupportedLocale('en-US')).toBe(true);
    });

    it('应该拒绝不支持的语言', () => {
      expect(isSupportedLocale('fr-FR')).toBe(false);
      expect(isSupportedLocale('de-DE')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('应该正确格式化中文日期', () => {
      const date = new Date('2026-03-05');
      const formatted = formatDate(date, 'zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      expect(formatted).toContain('2026');
      expect(formatted).toContain('3');
    });

    it('应该正确格式化英文日期', () => {
      const date = new Date('2026-03-05');
      const formatted = formatDate(date, 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      expect(formatted).toContain('2026');
    });
  });

  describe('formatNumber', () => {
    it('应该正确格式化中文数字', () => {
      const formatted = formatNumber(1234567.89, 'zh-CN');

      expect(formatted).toContain('1');
    });

    it('应该正确格式化英文数字', () => {
      const formatted = formatNumber(1234567.89, 'en-US');

      expect(formatted).toContain('1,234,567.89');
    });
  });

  describe('formatCurrency', () => {
    it('应该正确格式化人民币', () => {
      const formatted = formatCurrency(1234.56, 'CNY', 'zh-CN');

      expect(formatted).toContain('¥');
      expect(formatted).toContain('1234.56');
    });

    it('应该正确格式化美元', () => {
      const formatted = formatCurrency(1234.56, 'USD', 'en-US');

      expect(formatted).toContain('$');
    });
  });

  describe('formatRelativeTime', () => {
    it('应该正确格式化相对时间（分钟）', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5分钟前
      const formatted = formatRelativeTime(date, 'zh-CN');

      expect(formatted).toContain('5');
    });

    it('应该正确格式化相对时间（小时）', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2小时前
      const formatted = formatRelativeTime(date, 'en-US');

      expect(formatted).toContain('2');
    });

    it('应该正确格式化相对时间（天）', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3天前
      const formatted = formatRelativeTime(date, 'zh-CN');

      expect(formatted).toContain('3');
    });
  });
});
