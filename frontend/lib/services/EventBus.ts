/**
 * 事件总线 - 用于组件间通信
 */

type EventCallback = (...args: any[]) => void;

export class EventBus {
  private events: Map<string, Set<EventCallback>>;

  constructor() {
    this.events = new Map();
  }

  /**
   * Subscribe to an event
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    }
  }

  /**
   * Emit an event
   */
  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Subscribe to an event once
   */
  once(event: string, callback: EventCallback): () => void {
    const wrappedCallback = (...args: any[]) => {
      callback(...args);
      this.off(event, wrappedCallback);
    };
    return this.on(event, wrappedCallback);
  }

  /**
   * Clear all event listeners or specific event listeners
   */
  clear(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

// Singleton instance
export const eventBus = new EventBus();

export default eventBus;
