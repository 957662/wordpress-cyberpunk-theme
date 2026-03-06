/**
 * Enhanced Event Bus
 * Type-safe event emitter with support for wildcard and async events
 */

type EventHandler<T = any> = (data: T) => void | Promise<void>

interface EventBusConfig {
  maxListeners?: number
  wildcard?: boolean
}

class EventBus {
  private listeners: Map<string, Set<EventHandler>>
  private wildcardListeners: Set<EventHandler>
  private config: Required<EventBusConfig>

  constructor(config: EventBusConfig = {}) {
    this.listeners = new Map()
    this.wildcardListeners = new Set()
    this.config = {
      maxListeners: config.maxListeners || 100,
      wildcard: config.wildcard ?? true,
    }
  }

  /**
   * Subscribe to an event
   */
  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    const eventListeners = this.listeners.get(event)!

    if (eventListeners.size >= this.config.maxListeners) {
      console.warn(`EventBus: Max listeners (${this.config.maxListeners}) reached for event "${event}"`)
    }

    eventListeners.add(handler)

    // Return unsubscribe function
    return () => this.off(event, handler)
  }

  /**
   * Subscribe to all events (wildcard)
   */
  onAny(handler: EventHandler): () => void {
    this.wildcardListeners.add(handler)
    return () => this.offAny(handler)
  }

  /**
   * Subscribe to an event once
   */
  once<T = any>(event: string, handler: EventHandler<T>): () => void {
    const onceHandler: EventHandler<T> = (data) => {
      handler(data)
      this.off(event, onceHandler)
    }

    return this.on(event, onceHandler)
  }

  /**
   * Unsubscribe from an event
   */
  off<T = any>(event: string, handler: EventHandler<T>): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(handler)

      if (eventListeners.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * Unsubscribe from all events
   */
  offAny(handler: EventHandler): void {
    this.wildcardListeners.delete(handler)
  }

  /**
   * Emit an event
   */
  async emit<T = any>(event: string, data?: T): Promise<void> {
    // Trigger event-specific listeners
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const handlers = Array.from(eventListeners)

      for (const handler of handlers) {
        try {
          await handler(data)
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error)
        }
      }
    }

    // Trigger wildcard listeners
    if (this.config.wildcard) {
      const handlers = Array.from(this.wildcardListeners)

      for (const handler of handlers) {
        try {
          await handler({ event, data })
        } catch (error) {
          console.error(`Error in wildcard event handler for "${event}":`, error)
        }
      }
    }
  }

  /**
   * Remove all listeners for an event or all events
   */
  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
      this.wildcardListeners.clear()
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    return this.listeners.get(event)?.size || 0
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    return Array.from(this.listeners.keys())
  }
}

// Create global event bus instance
export const eventBus = new EventBus({
  maxListeners: 100,
  wildcard: true,
})

// Common event names
export const Events = {
  // Auth events
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  USER_REGISTER: 'user:register',
  AUTH_ERROR: 'auth:error',

  // Blog events
  POST_LIKE: 'post:like',
  POST_BOOKMARK: 'post:bookmark',
  POST_SHARE: 'post:share',
  POST_COMMENT: 'post:comment',

  // UI events
  THEME_CHANGE: 'theme:change',
  SIDEBAR_TOGGLE: 'sidebar:toggle',
  MODAL_OPEN: 'modal:open',
  MODAL_CLOSE: 'modal:close',

  // Notification events
  NOTIFICATION_SHOW: 'notification:show',
  NOTIFICATION_DISMISS: 'notification:dismiss',

  // Navigation events
  ROUTE_CHANGE: 'route:change',
  PAGE_VIEW: 'page:view',

  // Data events
  DATA_UPDATE: 'data:update',
  DATA_DELETE: 'data:delete',
  DATA_ERROR: 'data:error',

  // Error events
  ERROR: 'error',
  ERROR_WARNING: 'error:warning',
  ERROR_INFO: 'error:info',
}

// Hook for React components
export function useEventBus() {
  return {
    on: eventBus.on.bind(eventBus),
    once: eventBus.once.bind(eventBus),
    off: eventBus.off.bind(eventBus),
    emit: eventBus.emit.bind(eventBus),
    clear: eventBus.clear.bind(eventBus),
  }
}

// Typed event hooks
export function useEvent<T = any>(event: string, handler: EventHandler<T>, deps: any[] = []) {
  useEffect(() => {
    const unsubscribe = eventBus.on(event, handler)
    return unsubscribe
  }, deps)
}

export function useEventOnce<T = any>(event: string, handler: EventHandler<T>, deps: any[] = []) {
  useEffect(() => {
    const unsubscribe = eventBus.once(event, handler)
    return unsubscribe
  }, deps)
}

export default eventBus
