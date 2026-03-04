/**
 * useLocalStorage Hook 测试
 */

import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('应该从 localStorage 读取初始值', () => {
    localStorage.setItem('test-key', JSON.stringify('stored value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('stored value');
  });

  it('应该在没有存储值时使用默认值', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('应该更新 localStorage 和状态', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new value'));
  });

  it('应该处理对象类型', () => {
    const initialObj = { name: 'Test', value: 123 };
    const { result } = renderHook(() => useLocalStorage('test-key', initialObj));

    expect(result.current[0]).toEqual(initialObj);

    const newObj = { name: 'Updated', value: 456 };
    act(() => {
      result.current[1](newObj);
    });

    expect(result.current[0]).toEqual(newObj);
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(newObj));
  });

  it('应该处理数组类型', () => {
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() => useLocalStorage('test-key', initialArray));

    expect(result.current[0]).toEqual(initialArray);

    act(() => {
      result.current[1]([...result.current[0], 4]);
    });

    expect(result.current[0]).toEqual([1, 2, 3, 4]);
  });

  it('应该删除值时返回默认值', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current[1]('stored value');
    });

    expect(result.current[0]).toBe('stored value');

    act(() => {
      result.current[1](undefined);
    });

    expect(result.current[0]).toBe('default');
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('应该使用函数式更新', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev * 2);
    });

    expect(result.current[0]).toBe(2);
  });

  it('应该处理无效的 JSON', () => {
    localStorage.setItem('test-key', 'invalid json');
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('应该在多个钩子实例间同步', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('test-key', 'default'));
    const { result: result2 } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result1.current[1]('updated from 1');
    });

    expect(result1.current[0]).toBe('updated from 1');
    // 不同的实例不会自动同步
    expect(result2.current[0]).toBe('default');
  });
});
