/**
 * useMediaQuery Hook 测试
 */

import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

describe('useMediaQuery Hook', () => {
  let originalMatchMedia: any;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = jest.fn((query) => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('应该检测媒体查询匹配状态', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    expect(result.current).toBe(true);
  });

  it('应该检测不匹配的媒体查询', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(result.current).toBe(false);
  });

  it('应该在媒体查询变化时更新', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    expect(result.current).toBe(true);

    const mediaQueryList = window.matchMedia('(max-width: 768px)');

    act(() => {
      const event = new MediaQueryListEvent('change', { matches: false });
      mediaQueryList onchange?.(event);
    });

    expect(result.current).toBe(false);
  });

  it('应该在组件卸载时清理监听器', () => {
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    const mediaQueryList = window.matchMedia('(max-width: 768px)');

    unmount();

    expect(mediaQueryList.removeEventListener).toHaveBeenCalled();
  });

  it('应该支持自定义初始值', () => {
    const { result } = renderHook(() =>
      useMediaQuery('(max-width: 768px)', { defaultValue: true })
    );

    expect(result.current).toBeDefined();
  });

  it('应该处理不支持的媒体查询 API', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = undefined as any;

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    // 应该回退到默认值
    expect(result.current).toBe(false);

    window.matchMedia = originalMatchMedia;
  });
});
