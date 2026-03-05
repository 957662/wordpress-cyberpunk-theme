import { describe, it, expect } from 'vitest';
import { isEmail, isPhoneCN, isUrl } from '@/lib/utils/validation';

describe('validation utilities', () => {
  describe('isEmail', () => {
    it('should return true for valid emails', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isEmail('invalid')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('@domain.com')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(isEmail('')).toBe(false);
    });
  });

  describe('isPhoneCN', () => {
    it('should return true for valid Chinese phone numbers', () => {
      expect(isPhoneCN('13812345678')).toBe(true);
      expect(isPhoneCN('19987654321')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isPhoneCN('1234567890')).toBe(false);
      expect(isPhoneCN('abcdefghij')).toBe(false);
      expect(isPhoneCN('')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://test.org/path')).toBe(true);
      expect(isUrl('ftp://files.server.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isUrl('not a url')).toBe(false);
      expect(isUrl('')).toBe(false);
    });
  });
});
