/**
 * 事件总线服务
 * 提供组件间通信的发布-订阅模式
 */

type EventHandler = (...args: any[]) => void | Promise<void>;

class EventBus {
  private events: Map<string, Set<EventHandler>> = new Map();

  /**
   * 订阅事件
   */
  on(event: string, handler: EventHandler): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const handlers = this.events.get(event)!;
    handlers.add(handler);

    // 返回取消订阅函数
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    };
  }

  /**
   * 订阅事件(只触发一次)
   */
  once(event: string, handler: EventHandler): () => void {
    const onceHandler: EventHandler = (...args) => {
      handler(...args);
      off();
    };

    const off = this.on(event, onceHandler);

    // 允许手动取消订阅
    return off;
  }

  /**
   * 取消订阅
   */
  off(event: string, handler?: EventHandler): void {
    if (!this.events.has(event)) return;

    const handlers = this.events.get(event)!;

    if (handler) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    } else {
      // 删除该事件的所有处理器
      this.events.delete(event);
    }
  }

  /**
   * 发布事件
   */
  async emit(event: string, ...args: any[]): Promise<void> {
    const handlers = this.events.get(event);
    if (!handlers) return;

    const promises: Array<void | Promise<void>> = [];

    handlers.forEach(handler => {
      try {
        const result = handler(...args);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    });

    // 等待所有异步处理器完成
    await Promise.all(promises);
  }

  /**
   * 等待事件触发
   */
  waitFor(event: string, timeout?: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const timer = timeout
        ? setTimeout(() => {
          off();
          reject(new Error(`Event "${event}" timeout after ${timeout}ms`));
        }, timeout)
        : null;

      const off = this.once(event, (...args: any[]) => {
        if (timer) clearTimeout(timer);
        resolve(args);
      });
    });
  }

  /**
   * 清除所有事件
   */
  clear(): void {
    this.events.clear();
  }

  /**
   * 获取事件数量
   */
  getEventCount(event?: string): number {
    if (event) {
      return this.events.get(event)?.size || 0;
    }
    return this.events.size;
  }

  /**
   * 获取所有事件名称
   */
  getEventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

// 创建全局实例
const eventBus = new EventBus();

// 导出类和实例
export { EventBus };
export default eventBus;

// 便捷方法
export const bus = {
  on: (event: string, handler: EventHandler) => eventBus.on(event, handler),
  once: (event: string, handler: EventHandler) => eventBus.once(event, handler),
  off: (event: string, handler?: EventHandler) => eventBus.off(event, handler),
  emit: (event: string, ...args: any[]) => eventBus.emit(event, ...args),
  waitFor: (event: string, timeout?: number) => eventBus.waitFor(event, timeout),
  clear: () => eventBus.clear(),
  count: (event?: string) => eventBus.getEventCount(event),
  events: () => eventBus.getEventNames(),
};

/**
 * React Hook
 */
import { useEffect } from 'react';

export function useEvent(event: string, handler: EventHandler, deps: any[] = []) {
  useEffect(() => {
    const off = eventBus.on(event, handler);
    return off;
  }, deps);
}

export function useEventOnce(event: string, handler: EventHandler, deps: any[] = []) {
  useEffect(() => {
    const off = eventBus.once(event, handler);
    return off;
  }, deps);
}
