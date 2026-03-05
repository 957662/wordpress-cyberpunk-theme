import { describe, it, expect } from 'vitest';

describe('Basic tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings', () => {
    const str = 'CyberPress';
    expect(str.toLowerCase()).toBe('cyberpress');
    expect(str.length).toBe(10);
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr.length).toBe(5);
    expect(arr.filter(x => x > 3)).toEqual([4, 5]);
  });

  it('should handle objects', () => {
    const obj = { name: 'CyberPress', version: '1.0.0' };
    expect(obj.name).toBe('CyberPress');
    expect(obj.version).toBe('1.0.0');
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
});
