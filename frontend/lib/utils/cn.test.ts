/**
 * cn utility tests
 */

import { cn } from './cn';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
  });

  it('should handle Tailwind class conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle conditional classes', () => {
    expect(cn('base-class', true && 'conditional-class', false && 'hidden-class')).toBe(
      'base-class conditional-class'
    );
  });

  it('should handle undefined and null values', () => {
    expect(cn('base-class', undefined, null, 'another-class')).toBe('base-class another-class');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should merge complex class combinations', () => {
    expect(
      cn(
        'px-4 py-2 bg-white text-black',
        'px-6',
        'hover:bg-gray-100',
        false && 'hidden',
        undefined
      )
    ).toBe('py-2 bg-white text-black px-6 hover:bg-gray-100');
  });
});
