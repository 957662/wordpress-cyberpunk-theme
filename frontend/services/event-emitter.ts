/**
 * 事件发射器
 * 提供跨组件通信的能力
 */

export type EventCallback<T = any> = (data: T) => void;
export type EventPriority = 'high' | 'normal' | 'low';

interface EventListener<T = any> {
  callback: EventCallback<T>;
  once: boolean;
  priority: EventPriority;
}

interface EventBusConfig {
  maxListeners?: number;
  enableLogging?: boolean;
}

class EventEmitter {
  private events: Map<string, EventListener[]> = new Map();
  private config: Required<EventBusConfig>;

  constructor(config: EventBusConfig = {}) {
    this.config = {
      maxListeners: config.maxListeners || 100,
      enableLogging: config.enableLogging || false,
    };
  }

  /**
   * 订阅事件
   */
  on<T = any>(
    event: string,
    callback: EventCallback<T>,
    options: { once?: boolean; priority?: EventPriority } = {}
    ): () => void {
    const listener: EventListener<T> = {
      callback,
      once: options.once || false,
      priority: options.priority || 'normal',
    };

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const listeners = this.events.get(event)!;

    // 检查监听器数量
    if (listeners.length >= this.config.maxListeners) {
      console.warn(
        `Event "${event}" has reached max listeners (${this.config.maxListeners})`
      );
    }

    // 按优先级插入
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    let insertIndex = listeners.length;
    for (let i = 0; i < listeners.length; i++) {
      if (priorityOrder[listener.priority] < priorityOrder[listeners[i].priority]) {
        insertIndex = i;
        break;
      }
    }
    listeners.splice(insertIndex, 0, listener);

    if (this.config.enableLogging) {
      console.log(`[EventEmitter] Subscribed to "${event}"`, {
        listeners: listeners.length,
        priority: listener.priority,
      });
    }

    // 返回取消订阅函数
    return () => this.off(event, callback);
  }

  /**
   * 订阅事件（只执行一次）
   */
  once<T = any>(
    event: string,
    callback: EventCallback<T>,
    priority?: EventPriority
  ): () => void {
    return this.on(event, callback, { once: true, priority });
  }

  /**
   * 取消订阅
   */
  off<T = any>(event: string, callback?: EventCallback<T>): void {
    if (!callback) {
      // 移除所有监听器
      this.events.delete(event);
      return;
    }

    const listeners = this.events.get(event);
    if (!listeners) return;

    const index = listeners.findIndex((l) => l.callback === callback);
    if (index !== -1) {
      listeners.splice(index, 1);

      if (this.config.enableLogging) {
        console.log(`[EventEmitter] Unsubscribed from "${event}"`, {
          listeners: listeners.length,
        });
      }
    }

    // 如果没有监听器了，删除事件
    if (listeners.length === 0) {
      this.events.delete(event);
    }
  }

  /**
   * 发射事件
   */
  emit<T = any>(event: string, data?: T): void {
    const listeners = this.events.get(event);
    if (!listeners || listeners.length === 0) {
      if (this.config.enableLogging) {
        console.log(`[EventEmitter] No listeners for "${event}"`);
      }
      return;
    }

    if (this.config.enableLogging) {
      console.log(`[EventEmitter] Emitting "${event}"`, data);
    }

    // 复制监听器数组，避免在回调中修改原数组
    const listenersToCall = [...listeners];

    listenersToCall.forEach((listener, index) => {
      try {
        listener.callback(data);
      } catch (error) {
        console.error(
          `[EventEmitter] Error in listener for "${event}" at index ${index}:`,
          error
        );
      }

      // 移除 once 监听器
      if (listener.once) {
        const originalIndex = listeners.indexOf(listener);
        if (originalIndex !== -1) {
          listeners.splice(originalIndex, 1);
        }
      }
    });

    // 如果没有监听器了，删除事件
    if (listeners.length === 0) {
      this.events.delete(event);
    }
  }

  /**
   * 异步发射事件
   */
  async emitAsync<T = any>(event: string, data?: T): Promise<void> {
    const listeners = this.events.get(event);
    if (!listeners || listeners.length === 0) return;

    const listenersToCall = [...listeners];

    for (const listener of listenersToCall) {
      try {
        await Promise.resolve(listener.callback(data));
      } catch (error) {
        console.error(`[EventEmitter] Error in async listener for "${event}":`, error);
      }

      if (listener.once) {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    }

    if (listeners.length === 0) {
      this.events.delete(event);
    }
  }

  /**
   * 等待事件
   */
  waitFor<T = any>(
    event: string,
    timeout?: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = timeout
        ? setTimeout(() => {
            unsubscribe();
            reject(new Error(`Timeout waiting for event "${event}"`));
          }, timeout)
        : null;

      const unsubscribe = this.once<T>((data) => {
        if (timer) clearTimeout(timer);
        resolve(data);
      });
    });
  }

  /**
   * 获取事件监听器数量
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.length || 0;
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }

  /**
   * 清除所有事件
   */
  clear(): void {
    this.events.clear();
    if (this.config.enableLogging) {
      console.log('[EventEmitter] Cleared all events');
    }
  }

  /**
   * 获取事件统计信息
   */
  getStats(): {
    totalEvents: number;
    totalListeners: number;
    eventsByCount: Array<{ event: string; count: number }>;
  } {
    const eventsByCount = Array.from(this.events.entries()).map(
      ([event, listeners]) => ({
        event,
        count: listeners.length,
      })
    );

    return {
      totalEvents: this.events.size,
      totalListeners: Array.from(this.events.values()).reduce(
        (sum, listeners) => sum + listeners.length,
        0
      ),
      eventsByCount: eventsByCount.sort((a, b) => b.count - a.count),
    };
  }
}

// 全局事件发射器
export const eventBus = new EventEmitter({
  maxListeners: 100,
  enableLogging: process.env.NODE_ENV === 'development',
});

/**
 * Hook: 使用事件
 */
export function useEvent<T = any>(
  event: string,
  callback: EventCallback<T>,
  deps: React.DependencyList = []
) {
  React.useEffect(() => {
    const unsubscribe = eventBus.on(event, callback);
    return unsubscribe;
  }, deps);
}

/**
 * Hook: 等待事件
 */
export function useEventWait<T = any>(
  event: string,
  condition: (data: T) => boolean = () => true
): T | null {
  const [data, setData] = React.useState<T | null>(null);

  React.useEffect(() => {
    const unsubscribe = eventBus.on<T>((payload) => {
      if (condition(payload)) {
        setData(payload);
      }
    });

    return unsubscribe;
  }, [event, condition]);

  return data;
}

/**
 * Hook: 事件发射器
 */
export function useEmitter() {
  return {
    emit: eventBus.emit.bind(eventBus),
    emitAsync: eventBus.emitAsync.bind(eventBus),
    on: eventBus.on.bind(eventBus),
    once: eventBus.once.bind(eventBus),
    off: eventBus.off.bind(eventBus),
    waitFor: eventBus.waitFor.bind(eventBus),
    listenerCount: eventBus.listenerCount.bind(eventBus),
  };
}

/**
 * 类型安全的事件发射器
 */
export class TypedEventEmitter<TEvents extends Record<string, any>> {
  private emitter = new EventEmitter();

  on<K extends keyof TEvents>(
    event: K,
    callback: EventCallback<TEvents[K]>
  ): () => void {
    return this.emitter.on(event as string, callback);
  }

  once<K extends keyof TEvents>(
    event: K,
    callback: EventCallback<TEvents[K]>
  ): () => void {
    return this.emitter.once(event as string, callback);
  }

  off<K extends keyof TEvents>(
    event: K,
    callback?: EventCallback<TEvents[K]>
  ): void {
    this.emitter.off(event as string, callback);
  }

  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void {
    this.emitter.emit(event as string, data);
  }

  async emitAsync<K extends keyof TEvents>(
    event: K,
    data: TEvents[K]
  ): Promise<void> {
    return this.emitter.emitAsync(event as string, data);
  }

  waitFor<K extends keyof TEvents>(
    event: K,
    timeout?: number
  ): Promise<TEvents[K]> {
    return this.emitter.waitFor(event as string, timeout);
  }
}

// 导出
export default EventEmitter;
