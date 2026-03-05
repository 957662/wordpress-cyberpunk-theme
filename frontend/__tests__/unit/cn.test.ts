import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils/cn';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', false && 'hidden', true && 'visible');
    expect(result).toContain('base');
    expect(result).toContain('visible');
    expect(result).not.toContain('hidden');
  });

  it('should merge tailwind classes correctly', () => {
    const result = cn('px-4 py-2', 'px-6');
    expect(result).toContain('px-6');
    expect(result).toContain('py-2');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'end');
    expect(result).toBe('base end');
  });

  it('should handle object notation', () => {
    const result = cn({
      active: true,
      disabled: false,
      visible: true,
    });
    expect(result).toContain('active');
    expect(result).toContain('visible');
    expect(result).not.toContain('disabled');
  });
});
