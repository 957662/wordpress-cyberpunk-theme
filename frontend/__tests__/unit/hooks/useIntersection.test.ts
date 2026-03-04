/**
 * useIntersection Hook 测试
 */

import { renderHook } from '@testing-library/react';
import { useIntersection } from '@/lib/hooks/useIntersection';

describe('useIntersection Hook', () => {
  let mockIntersectionObserver: any;

  beforeEach(() => {
    mockIntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('应该创建 IntersectionObserver 实例', () => {
    const { result } = renderHook(() => useIntersection());
    const [ref] = result.current;

    const element = document.createElement('div');
    ref.current = element;

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('应该检测元素是否在视口中', () => {
    const { result } = renderHook(() => useIntersection());
    const [ref, isIntersecting] = result.current;

    const element = document.createElement('div');
    ref.current = element;

    const mockCallback = jest.fn();
    const observerInstance = mockIntersectionObserver.mock.instances[0];

    act(() => {
      mockCallback.mock.calls[0]?.[0]?.([{
        isIntersecting: true,
        target: element,
      }]);
    });

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('应该使用自定义阈值', () => {
    const threshold = 0.5;
    renderHook(() => useIntersection({ threshold }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold }
    );
  });

  it('应该使用自定义根元素', () => {
    const root = document.createElement('div');
    renderHook(() => useIntersection({ root }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { root }
    );
  });

  it('应该在组件卸载时断开观察者', () => {
    const { result, unmount } = renderHook(() => useIntersection());
    const [ref] = result.current;

    const element = document.createElement('div');
    ref.current = element;

    const observerInstance = mockIntersectionObserver.mock.instances[0];

    unmount();

    expect(observerInstance.disconnect).toHaveBeenCalled();
  });

  it('应该处理 ref 变化', () => {
    const { result, rerender } = renderHook(() => useIntersection());
    const [ref] = result.current;

    const element1 = document.createElement('div');
    ref.current = element1;

    const observerInstance = mockIntersectionObserver.mock.instances[0];
    expect(observerInstance.observe).toHaveBeenCalledWith(element1);

    const element2 = document.createElement('div');
    ref.current = element2;

    expect(observerInstance.unobserve).toHaveBeenCalledWith(element1);
    expect(observerInstance.observe).toHaveBeenCalledWith(element2);
  });

  it('应该支持触发一次', () => {
    const { result } = renderHook(() => useIntersection({ triggerOnce: true }));
    const [ref] = result.current;

    const element = document.createElement('div');
    ref.current = element;

    const observerInstance = mockIntersectionObserver.mock.instances[0];

    // 第一次相交后应该停止观察
    const mockCallback = mockIntersectionObserver.mock.calls[0][0];

    act(() => {
      mockCallback([{ isIntersecting: true, target: element }]);
    });

    expect(observerInstance.unobserve).toHaveBeenCalledWith(element);
  });
});
