/**
 * WebSocket Service - WebSocket 服务
 *
 * 提供完整的 WebSocket 客户端功能：
 * - 自动重连
 * - 心跳检测
 * - 消息队列
 * - 事件订阅
 * - 类型安全
 */

/**
 * WebSocket 状态
 */
export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

/**
 * WebSocket 配置选项
 */
export interface WebSocketConfig {
  /** WebSocket 服务器 URL */
  url: string;
  /** 协议（可选） */
  protocols?: string | string[];
  /** 是否自动重连 */
  autoReconnect?: boolean;
  /** 重连延迟（毫秒） */
  reconnectDelay?: number;
  /** 最大重连次数 */
  maxReconnectAttempts?: number;
  /** 心跳间隔（毫秒） */
  heartbeatInterval?: number;
  /** 心跳消息内容 */
  heartbeatMessage?: string;
  /** 连接超时（毫秒） */
  connectionTimeout?: number;
  /** 消息队列最大大小 */
  messageQueueSize?: number;
  /** 是否启用调试日志 */
  debug?: boolean;
}

/**
 * WebSocket 消息类型
 */
export interface WebSocketMessage {
  /** 消息类型 */
  type: string;
  /** 消息数据 */
  data: any;
  /** 消息 ID（可选） */
  id?: string;
  /** 时间戳 */
  timestamp: number;
}

/**
 * WebSocket 事件类型
 */
export type WebSocketEventType =
  | 'open'
  | 'close'
  | 'error'
  | 'message'
  | 'reconnecting'
  | 'reconnected'
  | 'heartbeat';

/**
 * WebSocket 事件监听器
 */
export type WebSocketEventListener = (event: WebSocketEvent) => void;

/**
 * WebSocket 事件
 */
export interface WebSocketEvent {
  type: WebSocketEventType;
  data?: any;
  error?: Error;
}

/**
 * WebSocket 订阅器
 */
export type WebSocketMessageHandler = (message: WebSocketMessage) => void;

export interface WebSocketSubscription {
  /** 消息类型 */
  messageType: string;
  /** 处理函数 */
  handler: WebSocketMessageHandler;
}

/**
 * WebSocket Service Class
 */
export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private state: WebSocketState = WebSocketState.CLOSED;
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private subscriptions: Map<string, Set<WebSocketMessageHandler>> = new Map();
  private eventListeners: Map<WebSocketEventType, Set<WebSocketEventListener>> = new Map();
  private isManualClose = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url,
      protocols: config.protocols || [],
      autoReconnect: config.autoReconnect ?? true,
      reconnectDelay: config.reconnectDelay ?? 3000,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 10,
      heartbeatInterval: config.heartbeatInterval ?? 30000,
      heartbeatMessage: config.heartbeatMessage ?? JSON.stringify({ type: 'ping' }),
      connectionTimeout: config.connectionTimeout ?? 10000,
      messageQueueSize: config.messageQueueSize ?? 100,
      debug: config.debug ?? false,
    };
  }

  /**
   * 连接 WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.state === WebSocketState.OPEN || this.state === WebSocketState.CONNECTING) {
        this.debug('Already connected or connecting');
        resolve();
        return;
      }

      this.isManualClose = false;
      this.setState(WebSocketState.CONNECTING);
      this.debug('Connecting to', this.config.url);

      try {
        this.ws = new WebSocket(this.config.url, this.config.protocols);

        // 连接超时
        const timeoutTimer = setTimeout(() => {
          if (this.state === WebSocketState.CONNECTING) {
            this.ws?.close();
            reject(new Error('Connection timeout'));
          }
        }, this.config.connectionTimeout);

        this.ws.onopen = () => {
          clearTimeout(timeoutTimer);
          this.debug('Connected');
          this.setState(WebSocketState.OPEN);
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushMessageQueue();
          this.emit('open');
          resolve();
        };

        this.ws.onclose = (event) => {
          clearTimeout(timeoutTimer);
          this.debug('Disconnected', event.code, event.reason);
          this.setState(WebSocketState.CLOSED);
          this.stopHeartbeat();
          this.emit('close', { code: event.code, reason: event.reason });

          // 自动重连
          if (!this.isManualClose && this.config.autoReconnect) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeoutTimer);
          this.debug('Error', error);
          this.emit('error', { error });
          reject(error);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      } catch (error) {
        this.debug('Connection error', error);
        this.setState(WebSocketState.CLOSED);
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.isManualClose = true;
    this.stopHeartbeat();
    this.clearReconnectTimer();

    if (this.ws) {
      this.debug('Disconnecting');
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
  }

  /**
   * 发送消息
   */
  send(message: WebSocketMessage): void {
    if (this.state === WebSocketState.OPEN && this.ws) {
      try {
        const messageStr = JSON.stringify(message);
        this.ws.send(messageStr);
        this.debug('Sent', message);
      } catch (error) {
        this.debug('Send error', error);
        this.queueMessage(message);
      }
    } else {
      this.debug('Not connected, queueing message');
      this.queueMessage(message);
    }
  }

  /**
   * 发送文本消息
   */
  sendText(text: string): void {
    if (this.state === WebSocketState.OPEN && this.ws) {
      this.ws.send(text);
    }
  }

  /**
   * 订阅消息类型
   */
  subscribe(messageType: string, handler: WebSocketMessageHandler): () => void {
    if (!this.subscriptions.has(messageType)) {
      this.subscriptions.set(messageType, new Set());
    }
    this.subscriptions.get(messageType)!.add(handler);

    this.debug('Subscribed to', messageType);

    // 返回取消订阅函数
    return () => {
      this.unsubscribe(messageType, handler);
    };
  }

  /**
   * 取消订阅
   */
  unsubscribe(messageType: string, handler: WebSocketMessageHandler): void {
    const handlers = this.subscriptions.get(messageType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.subscriptions.delete(messageType);
      }
      this.debug('Unsubscribed from', messageType);
    }
  }

  /**
   * 添加事件监听器
   */
  on(eventType: WebSocketEventType, listener: WebSocketEventListener): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(listener);

    // 返回移除监听器函数
    return () => {
      this.off(eventType, listener);
    };
  }

  /**
   * 移除事件监听器
   */
  off(eventType: WebSocketEventType, listener: WebSocketEventListener): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.eventListeners.delete(eventType);
      }
    }
  }

  /**
   * 获取连接状态
   */
  getState(): WebSocketState {
    return this.state;
  }

  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this.state === WebSocketState.OPEN;
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      this.debug('Received', message);

      // 触发 message 事件
      this.emit('message', message);

      // 调用订阅的处理函数
      const handlers = this.subscriptions.get(message.type);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(message);
          } catch (error) {
            this.debug('Handler error', error);
          }
        });
      }
    } catch (error) {
      this.debug('Parse message error', error);
    }
  }

  /**
   * 将消息加入队列
   */
  private queueMessage(message: WebSocketMessage): void {
    this.messageQueue.push(message);

    // 限制队列大小
    if (this.messageQueue.length > this.config.messageQueueSize) {
      this.messageQueue.shift();
    }
  }

  /**
   * 发送队列中的消息
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.sendText(this.config.heartbeatMessage);
        this.emit('heartbeat');
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.debug('Max reconnect attempts reached');
      return;
    }

    this.clearReconnectTimer();
    this.reconnectAttempts++;

    const delay = this.config.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);

    this.debug(
      `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`
    );

    this.emit('reconnecting', { attempt: this.reconnectAttempts });

    this.reconnectTimer = setTimeout(() => {
      this.debug('Reconnecting...');
      this.connect().then(() => {
        this.debug('Reconnected');
        this.emit('reconnected');
      }).catch((error) => {
        this.debug('Reconnect failed', error);
        this.scheduleReconnect();
      });
    }, delay);
  }

  /**
   * 清除重连定时器
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 设置状态
   */
  private setState(state: WebSocketState): void {
    this.state = state;
  }

  /**
   * 触发事件
   */
  private emit(type: WebSocketEventType, data?: any): void {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      const event: WebSocketEvent = { type, data };
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          this.debug('Listener error', error);
        }
      });
    }
  }

  /**
   * 调试日志
   */
  private debug(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocket]', ...args);
    }
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.disconnect();
    this.subscriptions.clear();
    this.eventListeners.clear();
    this.messageQueue = [];
  }
}

/**
 * 创建 WebSocket 服务实例
 */
export function createWebSocketService(config: WebSocketConfig): WebSocketService {
  return new WebSocketService(config);
}

/**
 * Hook: useWebSocket
 */
export function useWebSocket(config: WebSocketConfig) {
  const [service] = React.useState(() => new WebSocketService(config));
  const [state, setState] = React.useState<WebSocketState>(service.getState());

  React.useEffect(() => {
    const unsubscribe = service.on('open', () => {
      setState(service.getState());
    });

    const unsubscribeClose = service.on('close', () => {
      setState(service.getState());
    });

    service.connect();

    return () => {
      unsubscribe();
      unsubscribeClose();
      service.destroy();
    };
  }, [service]);

  return service;
}

// React import
import React from 'react';

export default WebSocketService;
