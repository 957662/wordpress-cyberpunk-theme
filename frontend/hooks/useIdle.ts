'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface IdleOptions {
  /**
   * 闲置时间阈值（毫秒）
   * @default 300000 (5分钟)
   */
  idleTime?: number;

  /**
   * 是否在页面不可见时检测
   * @default true
   */
  detectWhenPageHidden?: boolean;

  /**
   * 触发事件
   * @default ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
   */
  events?: string[];

  /**
   * 初始状态
   * @default false
   */
  startIdle?: boolean;

  /**
   * 回调函数
   */
  onIdle?: () => void;
  onActive?: () => void;
}

/**
 * useIdle - 用户闲置状态检测 Hook
 *
 * 检测用户是否闲置（无操作）
 *
 * @example
 * ```tsx
 * const isIdle = useIdle({ idleTime: 5000 }); // 5秒无操作即为闲置
 *
 * const { isIdle, lastActive, reset } = useIdle({
 *   idleTime: 30000,
 *   onIdle: () => console.log('用户闲置'),
 *   onActive: () => console.log('用户活跃'),
 * });
 *
 * <button onClick={reset}>重置计时器</button>
 * ```
 */
export function useIdle(options: IdleOptions = {}) {
  const {
    idleTime = 300000, // 5分钟
    detectWhenPageHidden = true,
    events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'],
    startIdle = false,
    onIdle,
    onActive,
  } = options;

  const [isIdle, setIsIdle] = useState(startIdle);
  const [lastActive, setLastActive] = useState(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    const now = Date.now();
    setLastActive(now);

    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
  }, [isIdle, onActive]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle?.();
    }, idleTime);
  }, [idleTime, onIdle]);

  useEffect(() => {
    if (!detectWhenPageHidden && document.hidden) {
      return;
    }

    startTimer();

    const handleEvent = () => {
      resetTimer();
      startTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleEvent);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, [detectWhenPageHidden, events, idleTime, resetTimer, startTimer]);

  // 监听页面可见性变化
  useEffect(() => {
    if (!detectWhenPageHidden) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        resetTimer();
        startTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [detectWhenPageHidden, resetTimer, startTimer]);

  return isIdle;
}

/**
 * useIdleTimeout - 带超时控制的闲置检测 Hook
 *
 * 提供更完整的闲置检测功能
 *
 * @example
 * ```tsx
 * const {
 *   isIdle,
 *   lastActive,
 *   idleTime,
 *   reset,
 *   pause,
 *   resume
 * } = useIdleTimeout({ idleTime: 60000 });
 * ```
 */
export function useIdleTimeout(options: IdleOptions = {}) {
  const {
    idleTime = 300000,
    detectWhenPageHidden = true,
    events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'],
    startIdle = false,
    onIdle,
    onActive,
  } = options;

  const [isIdle, setIsIdle] = useState(startIdle);
  const [lastActive, setLastActive] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    const now = Date.now();
    setLastActive(now);

    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
  }, [isIdle, onActive]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isPaused) {
      timerRef.current = setTimeout(() => {
        setIsIdle(true);
        onIdle?.();
      }, idleTime);
    }
  }, [idleTime, isPaused, onIdle]);

  const pause = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (!detectWhenPageHidden && document.hidden) {
      return;
    }

    startTimer();

    const handleEvent = () => {
      reset();
      startTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleEvent);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, [detectWhenPageHidden, events, reset, startTimer]);

  // 监听页面可见性变化
  useEffect(() => {
    if (!detectWhenPageHidden) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        reset();
        startTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [detectWhenPageHidden, reset, startTimer]);

  return {
    isIdle,
    lastActive,
    idleTime,
    reset,
    pause,
    resume,
    isPaused,
  };
}

/**
 * useIdleTimer - 可视化的闲置计时器 Hook
 *
 * 显示距离闲置的剩余时间
 *
 * @example
 * ```tsx
 * const { remainingTime, percentage, isIdle, reset } = useIdleTimer({
 *   idleTime: 30000,
 * });
 *
 * <div>
 *   <p>剩余时间: {Math.round(remainingTime / 1000)}秒</p>
 *   <div style={{ width: `${percentage}%` }} />
 *   {isIdle && <p>用户闲置</p>}
 *   <button onClick={reset}>重置</button>
 * </div>
 * ```
 */
export function useIdleTimer(options: IdleOptions = {}) {
  const {
    idleTime = 300000,
    detectWhenPageHidden = true,
    events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'],
    startIdle = false,
    onIdle,
    onActive,
  } = options;

  const [isIdle, setIsIdle] = useState(startIdle);
  const [remainingTime, setRemainingTime] = useState(idleTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActiveRef = useRef(Date.now());

  const reset = useCallback(() => {
    const now = Date.now();
    lastActiveRef.current = now;
    setRemainingTime(idleTime);

    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
  }, [idleTime, isIdle, onActive]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      setRemainingTime(0);
      onIdle?.();
    }, idleTime);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActiveRef.current;
      const remaining = Math.max(0, idleTime - elapsed);
      setRemainingTime(remaining);
    }, 100);
  }, [idleTime, onIdle]);

  useEffect(() => {
    if (!detectWhenPageHidden && document.hidden) {
      return;
    }

    startTimer();

    const handleEvent = () => {
      reset();
      startTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleEvent);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, [detectWhenPageHidden, events, reset, startTimer]);

  const percentage = ((idleTime - remainingTime) / idleTime) * 100;

  return {
    isIdle,
    remainingTime,
    percentage: 100 - percentage, // 剩余百分比
    elapsedPercentage: percentage, // 已用百分比
    reset,
  };
}

/**
 * useActivityDetection - 活动检测 Hook
 *
 * 检测用户的各种活动状态
 *
 * @example
 * ```tsx
 * const {
 *   isActive,
 *   isIdle,
 *   lastActive,
 *   activityCount,
 *   reset
 * } = useActivityDetection({ idleTime: 30000 });
 * ```
 */
export function useActivityDetection(options: IdleOptions = {}) {
  const {
    idleTime = 300000,
    detectWhenPageHidden = true,
    events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'],
    startIdle = false,
    onIdle,
    onActive,
  } = options;

  const [isActive, setIsActive] = useState(!startIdle);
  const [isIdle, setIsIdle] = useState(startIdle);
  const [lastActive, setLastActive] = useState(Date.now());
  const [activityCount, setActivityCount] = useState(0);
  const [activityType, setActivityType] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    const now = Date.now();
    setLastActive(now);
    setActivityCount((prev) => prev + 1);

    if (isIdle) {
      setIsIdle(false);
      setIsActive(true);
      onActive?.();
    }
  }, [isIdle, onActive]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      setIsActive(false);
      onIdle?.();
    }, idleTime);
  }, [idleTime, onIdle]);

  useEffect(() => {
    if (!detectWhenPageHidden && document.hidden) {
      return;
    }

    startTimer();

    const handleEvent = (e: Event) => {
      setActivityType(e.type);
      reset();
      startTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleEvent);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, [detectWhenPageHidden, events, reset, startTimer]);

  return {
    isActive,
    isIdle,
    lastActive,
    activityCount,
    activityType,
    reset,
  };
}
