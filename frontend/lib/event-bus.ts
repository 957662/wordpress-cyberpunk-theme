/**
 * 事件总线
 * 用于组件间通信和解耦
 */

type EventHandler<T = any> = (payload: T) => void;
type EventListener<T = any> = {
  handler: EventHandler<T>;
  once: boolean;
};

class EventBus {
  private events: Map<string, Set<EventListener>> = new Map();

  /**
   * 订阅事件
   */
  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const listener = { handler, once: false };
    this.events.get(event)!.add(listener);

    // 返回取消订阅函数
    return () => this.off(event, handler);
  }

  /**
   * 订阅一次性事件
   */
  once<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const listener = { handler, once: true };
    this.events.get(event)!.add(listener);

    // 返回取消订阅函数
    return () => this.off(event, handler);
  }

  /**
   * 取消订阅
   */
  off<T = any>(event: string, handler?: EventHandler<T>): void {
    const listeners = this.events.get(event);
    if (!listeners) return;

    if (handler) {
      // 移除特定处理器
      listeners.forEach((listener) => {
        if (listener.handler === handler) {
          listeners.delete(listener);
        }
      });
    } else {
      // 移除所有处理器
      listeners.clear();
    }

    // 如果没有监听器了，删除事件
    if (listeners.size === 0) {
      this.events.delete(event);
    }
  }

  /**
   * 触发事件
   */
  emit<T = any>(event: string, payload?: T): void {
    const listeners = this.events.get(event);
    if (!listeners) return;

    // 复制一份以避免在迭代时修改
    const listenersCopy = Array.from(listeners);

    listenersCopy.forEach((listener) => {
      try {
        listener.handler(payload);
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }

      // 如果是一次性监听器，移除它
      if (listener.once) {
        listeners.delete(listener);
      }
    });

    // 如果没有监听器了，删除事件
    if (listeners.size === 0) {
      this.events.delete(event);
    }
  }

  /**
   * 清除所有事件
   */
  clear(): void {
    this.events.clear();
  }

  /**
   * 获取事件监听器数量
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }

  /**
   * 异步等待事件
   */
  waitFor<T = any>(event: string, timeout?: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = timeout
        ? setTimeout(() => {
            unsubscribe();
            reject(new Error(`Timeout waiting for event "${event}"`));
          }, timeout)
        : null;

      const unsubscribe = this.once(event, (payload) => {
        if (timer) clearTimeout(timer);
        resolve(payload as T);
      });
    });
  }

  /**
   * 管道：将一个事件的输出连接到另一个事件
   */
  pipe(sourceEvent: string, targetEvent: string, transform?: (payload: any) => any): () => void {
    const handler = (payload: any) => {
      const transformed = transform ? transform(payload) : payload;
      this.emit(targetEvent, transformed);
    };

    return this.on(sourceEvent, handler);
  }
}

// 导出单例
export const eventBus = new EventBus();

// 导出便捷函数
export const on = <T = any>(event: string, handler: EventHandler<T>) => eventBus.on(event, handler);
export const once = <T = any>(event: string, handler: EventHandler<T>) =>
  eventBus.once(event, handler);
export const off = <T = any>(event: string, handler?: EventHandler<T>) =>
  eventBus.off(event, handler);
export const emit = <T = any>(event: string, payload?: T) => eventBus.emit(event, payload);
export const waitFor = <T = any>(event: string, timeout?: number) =>
  eventBus.waitFor<T>(event, timeout);

/**
 * 事件总线 Hook
 */
export function useEventBus() {
  return {
    on,
    once,
    off,
    emit,
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
  useEffect(() => {
    const unsubscribe = on(event, handler);
    return unsubscribe;
  }, deps);
}

/**
 * 事件等待 Hook
 */
export function useEventWaiter<T = any>(event: string, timeout?: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const wait = useCallback(async () => {
    setIsWaiting(true);
    setError(null);

    try {
      const result = await waitFor<T>(event, timeout);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsWaiting(false);
    }
  }, [event, timeout]);

  return { data, error, isWaiting, wait };
}

import { useState, useEffect, useCallback } from 'react';
