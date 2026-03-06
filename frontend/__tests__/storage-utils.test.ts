/**
 * 存储工具函数测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { storage, sessionStorage, cookie } from '@/lib/storage-utils';

describe('Storage Utils', () => {
  beforeEach(() => {
    // 清理所有存储
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('storage (localStorage)', () => {
    it('should set and get values', () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('should handle objects', () => {
      const obj = { foo: 'bar', num: 123 };
      storage.set('obj', obj);
      expect(storage.get('obj')).toEqual(obj);
    });

    it('should remove values', () => {
      storage.set('key', 'value');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });

    it('should clear all values', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.clear();
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
    });

    it('should get all keys', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      const keys = storage.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });
  });

  describe('sessionStorage', () => {
    it('should set and get values', () => {
      sessionStorage.set('key', 'value');
      expect(sessionStorage.get('key')).toBe('value');
    });

    it('should handle objects', () => {
      const obj = { foo: 'bar', num: 123 };
      sessionStorage.set('obj', obj);
      expect(sessionStorage.get('obj')).toEqual(obj);
    });

    it('should remove values', () => {
      sessionStorage.set('key', 'value');
      sessionStorage.remove('key');
      expect(sessionStorage.get('key')).toBeNull();
    });

    it('should clear all values', () => {
      sessionStorage.set('key1', 'value1');
      sessionStorage.set('key2', 'value2');
      sessionStorage.clear();
      expect(sessionStorage.get('key1')).toBeNull();
      expect(sessionStorage.get('key2')).toBeNull();
    });
  });

  describe('cookie', () => {
    it('should set and get cookies', () => {
      cookie.set('test', 'value');
      expect(cookie.get('test')).toBe('value');
    });

    it('should handle cookie options', () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      
      cookie.set('test', 'value', { expires: date, path: '/' });
      expect(cookie.get('test')).toBe('value');
    });

    it('should remove cookies', () => {
      cookie.set('test', 'value');
      cookie.remove('test');
      expect(cookie.get('test')).toBeNull();
    });

    it('should get all cookies', () => {
      cookie.set('cookie1', 'value1');
      cookie.set('cookie2', 'value2');
      
      const all = cookie.getAll();
      expect(all.cookie1).toBe('value1');
      expect(all.cookie2).toBe('value2');
    });

    it('should handle encoding', () => {
      cookie.set('test', 'value with spaces');
      expect(cookie.get('test')).toBe('value with spaces');
    });
  });
});
