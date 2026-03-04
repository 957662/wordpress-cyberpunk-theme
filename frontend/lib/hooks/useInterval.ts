'use client';

import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null, immediate = false) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) return;

    const tick = () => {
      savedCallback.current?.();
    };

    if (immediate) {
      tick();
    }

    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay, immediate]);
}

// Hook for managing interval with pause/resume
export function use可控Interval(callback: () => void, delay: number) {
  const [isRunning, setIsRunning] = useState(false);
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      savedCallback.current?.();
    };

    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay, isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  return { isRunning, start, stop, toggle };
}

import { useState, useCallback } from 'react';
