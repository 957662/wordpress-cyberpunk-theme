/**
 * useClickOutside Hook 测试
 */

import { renderHook, act } from '@testing-library/react';
import { useClickOutside } from '@/lib/hooks/useClickOutside';
import userEvent from '@testing-library/user-event';

describe('useClickOutside Hook', () => {
  it('应该在外部点击时调用回调', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    const container = document.createElement('div');
    container.appendChild(result.current);

    act(() => {
      document.body.appendChild(container);
    });

    const outsideElement = document.createElement('button');
    act(() => {
      document.body.appendChild(outsideElement);
    });

    act(() => {
      userEvent.click(outsideElement);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      document.body.removeChild(container);
      document.body.removeChild(outsideElement);
    });
  });

  it('不应该在内部点击时调用回调', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    const container = document.createElement('div');
    container.appendChild(result.current);

    act(() => {
      document.body.appendChild(container);
    });

    act(() => {
      userEvent.click(result.current);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      document.body.removeChild(container);
    });
  });

  it('应该支持多个 ref', () => {
    const callback = jest.fn();
    const ref1 = { current: document.createElement('div') };
    const ref2 = { current: document.createElement('div') };

    renderHook(() => useClickOutside(callback, [ref1, ref2]));

    const container = document.createElement('div');
    container.appendChild(ref1.current);
    container.appendChild(ref2.current);

    act(() => {
      document.body.appendChild(container);
    });

    const outsideElement = document.createElement('button');
    act(() => {
      document.body.appendChild(outsideElement);
      userEvent.click(outsideElement);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      document.body.removeChild(container);
      document.body.removeChild(outsideElement);
    });
  });

  it('应该在组件卸载时清理事件监听器', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useClickOutside(callback));

    const container = document.createElement('div');
    container.appendChild(result.current);

    act(() => {
      document.body.appendChild(container);
    });

    const outsideElement = document.createElement('button');
    act(() => {
      document.body.appendChild(outsideElement);
    });

    unmount();

    act(() => {
      userEvent.click(outsideElement);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      document.body.removeChild(container);
      document.body.removeChild(outsideElement);
    });
  });

  it('应该处理 ref 为 null 的情况', () => {
    const callback = jest.fn();
    renderHook(() => useClickOutside(callback, [{ current: null }]));

    const outsideElement = document.createElement('button');
    act(() => {
      document.body.appendChild(outsideElement);
      userEvent.click(outsideElement);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      document.body.removeChild(outsideElement);
    });
  });

  it('应该在触摸事件上工作', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    const container = document.createElement('div');
    container.appendChild(result.current);

    act(() => {
      document.body.appendChild(container);
    });

    const outsideElement = document.createElement('button');
    act(() => {
      document.body.appendChild(outsideElement);
      outsideElement.dispatchEvent(new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
      }));
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      document.body.removeChild(container);
      document.body.removeChild(outsideElement);
    });
  });
});
