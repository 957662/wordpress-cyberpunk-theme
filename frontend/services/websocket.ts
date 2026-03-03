/**
 * WebSocket Service - WebSocket 实时通信服务
 * 支持自动重连、心跳检测、消息队列
 */

type WebSocketEventType = 'open' | 'close' | 'error' | 'message' | 'reconnect';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  id?: string;
}

interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  debug?: boolean;
}

interface WebSocketEventHandlers {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (data: WebSocketMessage) => void;
  onReconnect?: (attempt: number) => void;
}

type WebSocketEventListener = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private handlers: WebSocketEventHandlers;
  private reconnectAttempts = 0;
  private reconnectTimeoutId: NodeJS.Timeout | null = null;
  private heartbeatTimeoutId: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private isManualClose = false;
  private eventListeners: Map<string, Set<WebSocketEventListener>> = new Map();
  private isConnecting = false;

  constructor(config: WebSocketConfig, handlers: WebSocketEventHandlers = {}) {
    this.config = {
      url: config.url,
      protocols: config.protocols || [],
      reconnectInterval: config.reconnectInterval || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      heartbeatInterval: config.heartbeatInterval || 30000,
      debug: config.debug || false,
    };
    this.handlers = handlers;
  }

  /**
   * 连接 WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      this.log('Already connected or connecting');
      return;
    }

    this.isConnecting = true;
    this.isManualClose = false;

    try {
      this.log(`Connecting to ${this.config.url}`);
      this.ws = new WebSocket(this.config.url, this.config.protocols);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      this.log('Connection error:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.isManualClose = true;
    this.clearReconnectTimeout();
    this.clearHeartbeatTimeout();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnecting = false;
  }

  /**
   * 发送消息
   */
  send(type: string, data: any, id?: string): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
      id: id || this.generateId(),
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      this.log('Sent:', message);
    } else {
      this.log('WebSocket not open, queuing message');
      this.messageQueue.push(message);
    }
  }

  /**
   * 添加事件监听器
   */
  on(eventType: string, listener: WebSocketEventListener): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(listener);
  }

  /**
   * 移除事件监听器
   */
  off(eventType: string, listener: WebSocketEventListener): void {
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
  getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 处理连接打开事件
   */
  private handleOpen(event: Event): void {
    this.isConnecting = false;
    this.log('Connected');

    this.reconnectAttempts = 0;
    this.flushMessageQueue();
    this.startHeartbeat();

    this.handlers.onOpen?.(event);
    this.emit('open', event);
  }

  /**
   * 处理连接关闭事件
   */
  private handleClose(event: CloseEvent): void {
    this.isConnecting = false;
    this.log('Connection closed:', event);

    this.clearHeartbeatTimeout();

    if (!this.isManualClose) {
      this.scheduleReconnect();
    }

    this.handlers.onClose?.(event);
    this.emit('close', event);
  }

  /**
   * 处理错误事件
   */
  private handleError(event: Event): void {
    this.log('WebSocket error:', event);
    this.handlers.onError?.(event);
    this.emit('error', event);
  }

  /**
   * 处理消息事件
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.log('Received:', message);

      // 心跳响应
      if (message.type === 'pong') {
        this.resetHeartbeat();
        return;
      }

      this.handlers.onMessage?.(message);
      this.emit(message.type, message.data);
    } catch (error) {
      this.log('Message parse error:', error);
    }
  }

  /**
   * 发送队列中的消息
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift()!;
      this.ws!.send(JSON.stringify(message));
      this.log('Sent queued message:', message);
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.log(
      `Scheduling reconnect attempt ${this.reconnectAttempts} in ${this.config.reconnectInterval}ms`
    );

    this.reconnectTimeoutId = setTimeout(() => {
      this.log(`Reconnect attempt ${this.reconnectAttempts}`);
      this.handlers.onReconnect?.(this.reconnectAttempts);
      this.emit('reconnect', this.reconnectAttempts);
      this.connect();
    }, this.config.reconnectInterval);
  }

  /**
   * 清除重连超时
   */
  private clearReconnectTimeout(): void {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
  }

  /**
   * 开始心跳
   */
  private startHeartbeat(): void {
    this.resetHeartbeat();
  }

  /**
   * 重置心跳
   */
  private resetHeartbeat(): void {
    this.clearHeartbeatTimeout();

    this.heartbeatTimeoutId = setTimeout(() => {
      if (this.isConnected()) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * 清除心跳超时
   */
  private clearHeartbeatTimeout(): void {
    if (this.heartbeatTimeoutId) {
      clearTimeout(this.heartbeatTimeoutId);
      this.heartbeatTimeoutId = null;
    }
  }

  /**
   * 触发事件
   */
  private emit(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          this.log(`Listener error for event "${eventType}":`, error);
        }
      });
    }
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 日志输出
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocketService]', ...args);
    }
  }

  /**
   * 销毁服务
   */
  destroy(): void {
    this.disconnect();
    this.eventListeners.clear();
    this.messageQueue = [];
  }
}

// ============================================
// Factory Functions
// ============================================

/**
 * 创建 WebSocket 服务实例
 */
export function createWebSocketService(
  config: WebSocketConfig,
  handlers?: WebSocketEventHandlers
): WebSocketService {
  return new WebSocketService(config, handlers);
}

/**
 * 创建带认证的 WebSocket 服务
 */
export function createAuthenticatedWebSocket(
  url: string,
  token: string,
  handlers?: WebSocketEventHandlers
): WebSocketService {
  const wsUrl = url.includes('?')
    ? `${url}&token=${token}`
    : `${url}?token=${token}`;

  return new WebSocketService(
    {
      url: wsUrl,
      debug: process.env.NODE_ENV === 'development',
    },
    handlers
  );
}

// ============================================
// React Hook
// ============================================

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebSocketOptions {
  onMessage?: (data: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onReconnect?: (attempt: number) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  useEffect(() => {
    const ws = new WebSocketService(
      {
        url,
        reconnectInterval: options.reconnectInterval || 3000,
        maxReconnectAttempts: options.maxReconnectAttempts || 10,
        debug: process.env.NODE_ENV === 'development',
      },
      {
        onOpen: () => {
          setIsConnected(true);
          options.onOpen?.();
        },
        onClose: () => {
          setIsConnected(false);
          options.onClose?.();
        },
        onError: options.onError,
        onMessage: options.onMessage,
        onReconnect: (attempt) => {
          setReconnectAttempt(attempt);
          options.onReconnect?.(attempt);
        },
      }
    );

    ws.connect();
    wsRef.current = ws;

    return () => {
      ws.destroy();
      wsRef.current = null;
    };
  }, [url]);

  const send = useCallback((type: string, data: any) => {
    wsRef.current?.send(type, data);
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.disconnect();
  }, []);

  const reconnect = useCallback(() => {
    wsRef.current?.disconnect();
    wsRef.current?.connect();
  }, []);

  return {
    isConnected,
    reconnectAttempt,
    send,
    disconnect,
    reconnect,
    ws: wsRef.current,
  };
}

// ============================================
// Exports
// ============================================

export { WebSocketService };
export type { WebSocketConfig, WebSocketEventHandlers, WebSocketMessage, WebSocketEventListener };
