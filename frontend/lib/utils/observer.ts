/**
 * 观察者模式实现
 * 用于组件间通信和状态管理
 */

type Listener<T> = (data: T) => void;

export class Observable<T> {
  private listeners: Set<Listener<T>> = new Set();

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);

    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify(data: T): void {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }

  clear(): void {
    this.listeners.clear();
  }

  get listenerCount(): number {
    return this.listeners.size;
  }
}

/**
 * 事件总线
 */
interface Events {
  [key: string]: unknown;
}

class EventBus<E extends Events = Events> {
  private observables: Map<keyof E, Observable<unknown>> = new Map();

  on<K extends keyof E>(event: K, listener: (data: E[K]) => void): () => void {
    if (!this.observables.has(event)) {
      this.observables.set(event, new Observable<E[K]>());
    }

    const observable = this.observables.get(event) as Observable<E[K]>;
    return observable.subscribe(listener);
  }

  emit<K extends keyof E>(event: K, data: E[K]): void {
    if (this.observables.has(event)) {
      const observable = this.observables.get(event) as Observable<E[K]>;
      observable.notify(data);
    }
  }

  off<K extends keyof E>(event: K): void {
    this.observables.delete(event);
  }

  clear(): void {
    this.observables.clear();
  }
}

// 全局事件总线
export const eventBus = new EventBus();

/**
 * 应用事件类型定义
 */
export interface AppEvents {
  // 用户事件
  'user:login': { userId: string; email: string };
  'user:logout': void;
  'user:update': { userId: string; changes: Record<string, unknown> };

  // 路由事件
  'route:change': { from: string; to: string };
  'route:error': { path: string; error: Error };

  // 数据事件
  'data:fetch': { key: string };
  'data:success': { key: string; data: unknown };
  'data:error': { key: string; error: Error };

  // UI 事件
  'ui:notification': { type: 'success' | 'error' | 'warning' | 'info'; message: string };
  'ui:modal:open': { id: string; data?: unknown };
  'ui:modal:close': { id: string };

  // 主题事件
  'theme:change': { theme: 'light' | 'dark' };
}

// 类型化的事件总线
export const appEvents = new EventBus<AppEvents>();
