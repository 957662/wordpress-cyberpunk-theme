/**
 * EventBus Service
 * 事件总线服务 - 用于组件间通信
 */

'use client';

// ============================================
// 类型定义
// ============================================

export type EventHandler = (...args: any[]) => void | Promise<void>;

export interface EventBusOptions {
  /** 最大监听器数量 */
  maxListeners?: number;
  /** 是否启用调试日志 */
  debug?: boolean;
}

export interface EventBusConfig {
  maxListeners: number;
  debug: boolean;
  events: Map<string, Set<EventHandler>>;
  onceEvents: Map<string, Set<EventHandler>>;
}

// ============================================
// EventBus 类
// ============================================

class EventBus {
  private config: EventBusConfig;

  constructor(options: EventBusOptions = {}) {
    this.config = {
      maxListeners: options.maxListeners ?? 100,
      debug: options.debug ?? false,
      events: new Map(),
      onceEvents: new Map(),
    };
  }

  /**
   * 订阅事件
   */
  on(event: string, handler: EventHandler): () => void {
    if (!this.config.events.has(event)) {
      this.config.events.set(event, new Set());
    }

    const listeners = this.config.events.get(event)!;

    if (listeners.size >= this.config.maxListeners) {
      console.warn(
        `EventBus: Max listeners (${this.config.maxListeners}) reached for event "${event}"`
      );
    }

    listeners.add(handler);

    if (this.config.debug) {
      console.log(`EventBus: Subscribed to "${event}" (total: ${listeners.size})`);
    }

    // 返回取消订阅函数
    return () => this.off(event, handler);
  }

  /**
   * 订阅一次性事件
   */
  once(event: string, handler: EventHandler): () => void {
    if (!this.config.onceEvents.has(event)) {
      this.config.onceEvents.set(event, new Set());
    }

    const listeners = this.config.onceEvents.get(event)!;
    listeners.add(handler);

    if (this.config.debug) {
      console.log(`EventBus: Subscribed once to "${event}"`);
    }

    // 返回取消订阅函数
    return () => this.off(event, handler, true);
  }

  /**
   * 取消订阅
   */
  off(event?: string, handler?: EventHandler, isOnce = false): void {
    // 如果没有指定事件，清除所有事件
    if (!event) {
      this.config.events.clear();
      this.config.onceEvents.clear();

      if (this.config.debug) {
        console.log('EventBus: Cleared all events');
      }
      return;
    }

    const targetMap = isOnce ? this.config.onceEvents : this.config.events;

    if (!targetMap.has(event)) {
      return;
    }

    const listeners = targetMap.get(event)!;

    // 如果没有指定处理器，清除该事件的所有监听器
    if (!handler) {
      listeners.clear();
      targetMap.delete(event);

      if (this.config.debug) {
        console.log(`EventBus: Unsubscribed all from "${event}"`);
      }
      return;
    }

    listeners.delete(handler);

    if (listeners.size === 0) {
      targetMap.delete(event);
    }

    if (this.config.debug) {
      console.log(`EventBus: Unsubscribed from "${event}"`);
    }
  }

  /**
   * 触发事件
   */
  async emit(event: string, ...args: any[]): Promise<void> {
    if (this.config.debug) {
      console.log(`EventBus: Emitting "${event}"`, args);
    }

    // 触发普通事件
    const listeners = this.config.events.get(event);
    if (listeners) {
      for (const handler of listeners) {
        try {
          await handler(...args);
        } catch (error) {
          console.error(`EventBus: Error in handler for "${event}":`, error);
        }
      }
    }

    // 触发一次性事件
    const onceListeners = this.config.onceEvents.get(event);
    if (onceListeners) {
      for (const handler of onceListeners) {
        try {
          await handler(...args);
        } catch (error) {
          console.error(`EventBus: Error in once handler for "${event}":`, error);
        }
      }

      // 清除一次性事件
      this.config.onceEvents.delete(event);
    }
  }

  /**
   * 获取事件的监听器数量
   */
  listenerCount(event: string): number {
    const regular = this.config.events.get(event)?.size ?? 0;
    const once = this.config.onceEvents.get(event)?.size ?? 0;
    return regular + once;
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    const regular = Array.from(this.config.events.keys());
    const once = Array.from(this.config.onceEvents.keys());
    return Array.from(new Set([...regular, ...once]));
  }

  /**
   * 清除所有事件
   */
  clear(): void {
    this.config.events.clear();
    this.config.onceEvents.clear();

    if (this.config.debug) {
      console.log('EventBus: Cleared all events');
    }
  }

  /**
   * 等待事件触发一次
   */
  waitFor(event: string, timeout?: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let timer: NodeJS.Timeout | undefined;

      const handler = (...args: any[]) => {
        if (timer) {
          clearTimeout(timer);
        }
        resolve(args);
      };

      this.once(event, handler);

      if (timeout) {
        timer = setTimeout(() => {
          this.off(event, handler, true);
          reject(new Error(`EventBus: Timeout waiting for "${event}"`));
        }, timeout);
      }
    });
  }
}

// ============================================
// 单例实例
// ============================================

let eventBusInstance: EventBus | null = null;

export function getEventBus(options?: EventBusOptions): EventBus {
  if (!eventBusInstance) {
    eventBusInstance = new EventBus(options);
  }
  return eventBusInstance;
}

export function createEventBus(options?: EventBusOptions): EventBus {
  return new EventBus(options);
}

// ============================================
// React Hook
// ============================================

import { useEffect, useRef, useCallback } from 'react';

export interface UseEventBusOptions {
  /** 是否只在组件挂载时订阅 */
  subscribeOnMount?: boolean;
  /** 是否在组件卸载时自动取消订阅 */
  cleanupOnUnmount?: boolean;
}

export function useEventBus(
  event: string,
  handler: EventHandler,
  options: UseEventBusOptions = {}
) {
  const { subscribeOnMount = true, cleanupOnUnmount = true } = options;
  const eventBus = getEventBus();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const handlerRef = useRef(handler);

  // 更新 handler 引用
  handlerRef.current = handler;

  // 稳定的订阅函数
  const subscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    unsubscribeRef.current = eventBus.on(event, (...args) => {
      handlerRef.current(...args);
    });
  }, [event, eventBus]);

  // 稳定的取消订阅函数
  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  // 订阅事件
  useEffect(() => {
    if (subscribeOnMount) {
      subscribe();
    }

    return () => {
      if (cleanupOnUnmount) {
        unsubscribe();
      }
    };
  }, [subscribeOnMount, cleanupOnUnmount, subscribe, unsubscribe]);

  // 手动触发事件
  const emit = useCallback(
    (...args: any[]) => {
      eventBus.emit(event, ...args);
    },
    [event, eventBus]
  );

  return {
    subscribe,
    unsubscribe,
    emit,
  };
}

/**
 * 使用示例:
 *
 * // 在组件中使用
 * function MyComponent() {
 *   useEventBus('user:update', (data) => {
 *     console.log('User updated:', data);
 *   });
 *
 *   const emitUpdate = () => {
 *     eventBus.emit('user:update', { name: 'John' });
 *   };
 *
 *   return <button onClick={emitUpdate}>Update User</button>;
 * }
 *
 * // 在任何地方使用
 * import { getEventBus } from '@/lib/services/EventBus';
 *
 * const eventBus = getEventBus();
 * eventBus.on('custom:event', (data) => console.log(data));
 * eventBus.emit('custom:event', { message: 'Hello' });
 */

// ============================================
// 预定义事件类型
// ============================================

export const EventTypes = {
  // 用户相关
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // 通知相关
  NOTIFICATION_SHOW: 'notification:show',
  NOTIFICATION_HIDE: 'notification:hide',
  NOTIFICATION_CLICK: 'notification:click',

  // 路由相关
  ROUTE_CHANGE: 'route:change',
  ROUTE_CHANGE_START: 'route:change:start',
  ROUTE_CHANGE_COMPLETE: 'route:change:complete',

  // 数据相关
  DATA_FETCH: 'data:fetch',
  DATA_FETCH_SUCCESS: 'data:fetch:success',
  DATA_FETCH_ERROR: 'data:fetch:error',
  DATA_UPDATE: 'data:update',
  DATA_DELETE: 'data:delete',

  // 主题相关
  THEME_CHANGE: 'theme:change',
  THEME_TOGGLE: 'theme:toggle',

  // 窗口相关
  WINDOW_RESIZE: 'window:resize',
  WINDOW_SCROLL: 'window:scroll',
  WINDOW_FOCUS: 'window:focus',
  WINDOW_BLUR: 'window:blur',

  // 错误相关
  ERROR_OCCURRED: 'error:occurred',
  ERROR_HANDLED: 'error:handled',

  // 性能相关
  PERFORMANCE_METRIC: 'performance:metric',
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes];
