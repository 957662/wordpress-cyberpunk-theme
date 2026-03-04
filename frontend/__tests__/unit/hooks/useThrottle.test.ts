/**
 * useThrottle Hook 测试
 */

import { renderHook, act } from '@testing-library/react';
import { useThrottle } from '@/lib/hooks/useThrottle';

describe('useThrottle Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('应该节流函数调用', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    // 第一次调用应该立即执行
    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    // 在节流期间的调用应该被忽略
    act(() => {
      result.current();
      result.current();
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    // 快进时间到节流期结束
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // 现在应该可以再次调用
    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('应该使用正确的延迟时间', () => {
    const callback = jest.fn();
    const delay = 1000;
    const { result } = renderHook(() => useThrottle(callback, delay));

    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(delay - 1);
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('应该在组件卸载时清理', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current();
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // 卸载后不应该再调用
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('应该处理没有延迟的情况', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 0));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    // 没有延迟时，每次调用都应该执行
    expect(callback).toHaveBeenCalledTimes(3);
  });
});
