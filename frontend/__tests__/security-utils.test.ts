/**
 * 安全工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeHTML,
  escapeHtml,
  isValidUrl,
  isValidEmail,
  isValidPhone,
  validatePasswordStrength,
  generateSecureRandom,
  detectSQLInjection,
  detectXSS,
  sanitizeUserInput,
  sanitizeFileName,
} from '@/lib/security-utils';

describe('Security Utils', () => {
  describe('sanitizeHTML', () => {
    it('should sanitize HTML tags', () => {
      expect(sanitizeHTML('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert("xss")&lt;/script&gt;'
      );
      expect(sanitizeHTML('<div>Hello</div>')).toBe('&lt;div&gt;Hello&lt;/div&gt;');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<div>"test"</div>')).toBe('&lt;div&gt;&quot;test&quot;&lt;/div&gt;');
      expect(escapeHtml("It's")).toBe('It&#039;s');
      expect(escapeHtml('a & b')).toBe('a &amp; b');
    });
  });

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate Chinese phone numbers', () => {
      expect(isValidPhone('13812345678')).toBe(true);
      expect(isValidPhone('15912345678')).toBe(true);
      expect(isValidPhone('12345678901')).toBe(false);
      expect(isValidPhone('138123456')).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate weak passwords', () => {
      const result = validatePasswordStrength('abc');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('weak');
    });

    it('should validate medium passwords', () => {
      const result = validatePasswordStrength('Abc12345');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('medium');
    });

    it('should validate strong passwords', () => {
      const result = validatePasswordStrength('Abc12345!');
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('strong');
    });
  });

  describe('generateSecureRandom', () => {
    it('should generate random string of correct length', () => {
      const str = generateSecureRandom(16);
      expect(str).toHaveLength(16);
    });

    it('should generate different strings', () => {
      const str1 = generateSecureRandom(32);
      const str2 = generateSecureRandom(32);
      expect(str1).not.toBe(str2);
    });
  });

  describe('detectSQLInjection', () => {
    it('should detect SQL injection attempts', () => {
      expect(detectSQLInjection("SELECT * FROM users")).toBe(true);
      expect(detectSQLInjection("'; DROP TABLE users; --")).toBe(true);
      expect(detectSQLInjection("admin' OR '1'='1")).toBe(true);
      expect(detectSQLInjection("normal text")).toBe(false);
    });
  });

  describe('detectXSS', () => {
    it('should detect XSS attempts', () => {
      expect(detectXSS('<script>alert("xss")</script>')).toBe(true);
      expect(detectXSS('<img src=x onerror=alert(1)>')).toBe(true);
      expect(detectXSS('javascript:alert(1)')).toBe(true);
      expect(detectXSS('normal text')).toBe(false);
    });
  });

  describe('sanitizeUserInput', () => {
    it('should sanitize user input', () => {
      expect(sanitizeUserInput('normal text')).toBe('normal text');
      expect(sanitizeUserInput('  text  ')).toBe('text');
    });

    it('should throw on malicious input', () => {
      expect(() => sanitizeUserInput('<script>alert("xss")</script>')).toThrow();
      expect(() => sanitizeUserInput("SELECT * FROM users")).toThrow();
    });
  });

  describe('sanitizeFileName', () => {
    it('should sanitize file names', () => {
      expect(sanitizeFileName('normal-file.txt')).toBe('normal-file.txt');
      expect(sanitizeFileName('file with spaces.txt')).toBe('file_with_spaces.txt');
      expect(sanitizeFileName('file<>?.txt')).toBe('file__.txt');
    });

    it('should handle empty file names', () => {
      expect(sanitizeFileName('')).toBe('unnamed_file');
    });
  });
});
