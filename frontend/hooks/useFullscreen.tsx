import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseFullscreenOptions {
  /** 退出全屏时的回调 */
  onExit?: () => void;
  /** 进入全屏时的回调 */
  onEnter?: () => void;
  /** 全屏状态变化时的回调 */
  onChange?: (isFullscreen: boolean) => void;
}

export interface UseFullscreenReturn {
  /** 当前是否全屏 */
  isFullscreen: boolean;
  /** 进入全屏 */
  enter: (element?: HTMLElement) => Promise<void>;
  /** 退出全屏 */
  exit: () => Promise<void>;
  /** 切换全屏状态 */
  toggle: (element?: HTMLElement) => Promise<void>;
  /** 是否支持全屏API */
  isEnabled: boolean;
}

/**
 * 全屏 Hook
 *
 * @example
 * ```tsx
 * const { isFullscreen, enter, exit, toggle } = useFullscreen();
 *
 * return (
 *   <div>
 *     <p>Is fullscreen: {isFullscreen}</p>
 *     <button onClick={() => toggle()}>Toggle</button>
 *   </div>
 * );
 * ```
 */
export function useFullscreen(options: UseFullscreenOptions = {}): UseFullscreenReturn {
  const { onExit, onEnter, onChange } = options;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  // 检测是否支持全屏
  const isEnabled = typeof document !== 'undefined' && (
    document.fullscreenEnabled ||
    // @ts-ignore - vendor prefixed
    document.webkitFullscreenEnabled ||
    // @ts-ignore - vendor prefixed
    document.mozFullScreenEnabled ||
    // @ts-ignore - vendor prefixed
    document.msFullscreenEnabled
  );

  // 获取全屏元素
  const getFullscreenElement = useCallback(() => {
    return (
      document.fullscreenElement ||
      // @ts-ignore - vendor prefixed
      document.webkitFullscreenElement ||
      // @ts-ignore - vendor prefixed
      document.mozFullScreenElement ||
      // @ts-ignore - vendor prefixed
      document.msFullscreenElement ||
      null
    );
  }, []);

  // 进入全屏
  const enter = useCallback(async (element?: HTMLElement) => {
    if (!isEnabled) {
      console.warn('Fullscreen API is not enabled');
      return;
    }

    const targetElement = element || document.documentElement;
    elementRef.current = targetElement;

    try {
      if (targetElement.requestFullscreen) {
        await targetElement.requestFullscreen();
      }
      // @ts-ignore - vendor prefixed
      else if (targetElement.webkitRequestFullscreen) {
        // @ts-ignore - vendor prefixed
        await targetElement.webkitRequestFullscreen();
      }
      // @ts-ignore - vendor prefixed
      else if (targetElement.mozRequestFullScreen) {
        // @ts-ignore - vendor prefixed
        await targetElement.mozRequestFullScreen();
      }
      // @ts-ignore - vendor prefixed
      else if (targetElement.msRequestFullscreen) {
        // @ts-ignore - vendor prefixed
        await targetElement.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      throw error;
    }
  }, [isEnabled]);

  // 退出全屏
  const exit = useCallback(async () => {
    if (!isEnabled) {
      console.warn('Fullscreen API is not enabled');
      return;
    }

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      // @ts-ignore - vendor prefixed
      else if (document.webkitExitFullscreen) {
        // @ts-ignore - vendor prefixed
        await document.webkitExitFullscreen();
      }
      // @ts-ignore - vendor prefixed
      else if (document.mozCancelFullScreen) {
        // @ts-ignore - vendor prefixed
        await document.mozCancelFullScreen();
      }
      // @ts-ignore - vendor prefixed
      else if (document.msExitFullscreen) {
        // @ts-ignore - vendor prefixed
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
      throw error;
    }
  }, [isEnabled]);

  // 切换全屏
  const toggle = useCallback(async (element?: HTMLElement) => {
    const fullscreenElement = getFullscreenElement();

    if (fullscreenElement) {
      await exit();
    } else {
      await enter(element);
    }
  }, [getFullscreenElement, enter, exit]);

  // 监听全屏状态变化
  useEffect(() => {
    if (!isEnabled) return;

    const handleChange = () => {
      const fullscreenElement = getFullscreenElement();
      const isNowFullscreen = !!fullscreenElement;

      setIsFullscreen(isNowFullscreen);
      onChange?.(isNowFullscreen);

      if (isNowFullscreen) {
        onEnter?.();
      } else {
        onExit?.();
      }
    };

    // 添加事件监听器（支持各种浏览器前缀）
    document.addEventListener('fullscreenchange', handleChange);
    // @ts-ignore - vendor prefixed
    document.addEventListener('webkitfullscreenchange', handleChange);
    // @ts-ignore - vendor prefixed
    document.addEventListener('mozfullscreenchange', handleChange);
    // @ts-ignore - vendor prefixed
    document.addEventListener('MSFullscreenChange', handleChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      // @ts-ignore - vendor prefixed
      document.removeEventListener('webkitfullscreenchange', handleChange);
      // @ts-ignore - vendor prefixed
      document.removeEventListener('mozfullscreenchange', handleChange);
      // @ts-ignore - vendor prefixed
      document.removeEventListener('MSFullscreenChange', handleChange);
    };
  }, [isEnabled, getFullscreenElement, onChange, onEnter, onExit]);

  return {
    isFullscreen,
    enter,
    exit,
    toggle,
    isEnabled,
  };
}

export default useFullscreen;
