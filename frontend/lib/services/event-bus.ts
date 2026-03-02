/**
 * Event Bus Service
 * 用于组件间通信的事件总线
 */

type EventHandler = (...args: any[]) => void;

class EventBus {
  private events: Record<string, EventHandler[]> = {};

  /**
   * 订阅事件
   */
  on(event: string, handler: EventHandler): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(handler);

    // 返回取消订阅函数
    return () => {
      this.off(event, handler);
    };
  }

  /**
   * 取消订阅
   */
  off(event: string, handler?: EventHandler): void {
    if (!this.events[event]) {
      return;
    }

    if (handler) {
      this.events[event] = this.events[event].filter((h) => h !== handler);
    } else {
      delete this.events[event];
    }
  }

  /**
   * 触发事件
   */
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach((handler) => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Event bus error for "${event}":`, error);
      }
    });
  }

  /**
   * 订阅一次性事件
   */
  once(event: string, handler: EventHandler): void {
    const onceHandler = (...args: any[]) => {
      handler(...args);
      this.off(event, onceHandler);
    };

    this.on(event, onceHandler);
  }

  /**
   * 清空所有事件
   */
  clear(): void {
    this.events = {};
  }

  /**
   * 获取事件的所有监听器数量
   */
  listenerCount(event: string): number {
    return this.events[event]?.length || 0;
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    return Object.keys(this.events);
  }
}

// 导出单例
export const eventBus = new EventBus();

// 预定义的事件名称
export const Events = {
  // 用户相关
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  USER_UPDATE: 'user:update',

  // 主题相关
  THEME_CHANGE: 'theme:change',

  // 通知相关
  NOTIFICATION_SHOW: 'notification:show',
  NOTIFICATION_HIDE: 'notification:hide',

  // 路由相关
  ROUTE_CHANGE: 'route:change',

  // 数据相关
  DATA_UPDATE: 'data:update',
  DATA_DELETE: 'data:delete',

  // 错误相关
  ERROR: 'error',

  // 自定义
  CUSTOM: 'custom',
};

export default eventBus;
