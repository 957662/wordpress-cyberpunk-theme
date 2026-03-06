/**
 * cn 工具函数测试
 */

import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn Utility Function', () => {
  it('应该合并多个类名', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('应该处理条件类名', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz');
  });

  it('应该处理 undefined 和 null', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    expect(cn('foo', null, 'bar')).toBe('foo bar');
  });

  it('应该处理数组', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('应该处理对象', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    expect(cn('class', { foo: true, bar: false })).toBe('class foo');
  });

  it('应该正确处理 Tailwind 冲突类名', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('应该处理复杂的混合输入', () => {
    const result = cn(
      'base-class',
      { condition: true, 'remove-class': false },
      ['array-class-1', 'array-class-2'],
      undefined,
      null,
      'string-class'
    );

    expect(result).toBe('base-class condition array-class-1 array-class-2 string-class');
  });

  it('应该处理数字', () => {
    expect(cn('class', 123)).toBe('class 123');
  });

  it('应该处理空字符串', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar');
  });

  it('应该返回空字符串当没有参数时', () => {
    expect(cn()).toBe('');
  });

  it('应该处理嵌套对象', () => {
    expect(cn({
      'class-1': true,
      'class-2': false,
      'class-3': 'truthy',
    })).toBe('class-1 class-3');
  });

  it('应该处理函数返回值', () => {
    const getClass = () => 'dynamic-class';
    expect(cn('static', getClass())).toBe('static dynamic-class');
  });

  it('应该正确处理 Tailwind 的合并规则', () => {
    // padding: 后面的覆盖前面的
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6');

    // margin: 后面的覆盖前面的
    expect(cn('mx-4 my-2', 'mx-6')).toBe('my-2 mx-6');

    // colors: 后面的覆盖前面的
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-gray-100', 'bg-white')).toBe('bg-white');

    // sizing: 后面的覆盖前面的
    expect(cn('w-full', 'w-1/2')).toBe('w-1/2');
    expect(cn('h-screen', 'h-full')).toBe('h-full');
  });

  it('应该保持 Tailwind 的修饰符类', () => {
    expect(cn('hover:bg-blue-500', 'focus:ring-2')).toBe('hover:bg-blue-500 focus:ring-2');
    expect(cn('dark:text-white', 'md:text-lg')).toBe('dark:text-white md:text-lg');
  });

  it('应该处理响应式类名', () => {
    expect(cn('text-sm md:text-base lg:text-lg')).toBe('text-sm md:text-base lg:text-lg');
    expect(cn('text-sm', 'md:text-base')).toBe('text-sm md:text-base');
  });

  it('应该处理大量类名而不崩溃', () => {
    const classes = Array.from({ length: 100 }, (_, i) => `class-${i}`);
    const result = cn(...classes);

    expect(result).toBe(classes.join(' '));
  });
});
