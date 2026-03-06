import { useState, useEffect, useCallback, useRef } from 'react';
import { eventBus, type EventHandler } from '@/lib/event-bus';

/**
 * 事件总线 Hook
 */
export function useEventBus() {
  const unsubscribeFnsRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    // 清理所有订阅
    return () => {
      unsubscribeFnsRef.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeFnsRef.current = [];
    };
  }, []);

  const on = useCallback(<T = any>(event: string, handler: EventHandler<T>) => {
    const unsubscribe = eventBus.on(event, handler);
    unsubscribeFnsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  const once = useCallback(<T = any>(event: string, handler: EventHandler<T>) => {
    const unsubscribe = eventBus.once(event, handler);
    unsubscribeFnsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  const emit = useCallback(<T = any>(event: string, payload?: T) => {
    eventBus.emit(event, payload);
  }, []);

  const off = useCallback(<T = any>(event: string, handler?: EventHandler<T>) => {
    eventBus.off(event, handler);
  }, []);

  const waitFor = useCallback(<T = any>(event: string, timeout?: number): Promise<T> => {
    return eventBus.waitFor<T>(event, timeout);
  }, []);

  return {
    on,
    once,
    emit,
    off,
    waitFor,
    clear: () => eventBus.clear(),
    listenerCount: (event: string) => eventBus.listenerCount(event),
    eventNames: () => eventBus.eventNames(),
  };
}

/**
 * 事件监听器 Hook
 */
export function useEventListener<T = any>(
  event: string,
  handler: EventHandler<T>,
  deps: React.DependencyList = []
) {
  const { on } = useEventBus();

  useEffect(() => {
    const unsubscribe = on(event, handler);
    return unsubscribe;
  }, [event, on, ...deps]);
}

/**
 * 事件等待 Hook
 */
export function useEventWaiter<T = any>(event: string, timeout?: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const { waitFor } = useEventBus();

  const wait = useCallback(async () => {
    setIsWaiting(true);
    setError(null);

    try {
      const result = await waitFor<T>(event, timeout);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsWaiting(false);
    }
  }, [event, timeout, waitFor]);

  return { data, error, isWaiting, wait };
}

/**
 * 事件状态 Hook
 */
export function useEventState<T = any>(
  event: string,
  initialValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initialValue);
  const { emit, on } = useEventBus();

  // 监听事件更新状态
  useEffect(() => {
    const unsubscribe = on<T>(event, setState);
    return unsubscribe;
  }, [event, on]);

  // 发送事件
  const emitState = useCallback(
    (value: T) => {
      setState(value);
      emit(event, value);
    },
    [event, emit]
  );

  return [state, emitState];
}
