/**
 * WebSocket Service - WebSocket 实时通信服务
 * 支持自动重连、心跳检测、消息队列
 */

export type WSMessageType = 'message' | 'notification' | 'update' | 'error' | 'system';
export type WSConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WSMessage {
  type: WSMessageType;
  data: any;
  timestamp: number;
  id?: string;
}

export interface WSConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string;
  enableMessageQueue?: boolean;
  debug?: boolean;
}

export interface WSMessageHandler {
  (message: WSMessage): void;
}

export interface WSStateHandler {
  (state: WSConnectionState, event?: Event): void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: Required<WSConfig>;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private messageQueue: WSMessage[] = [];
  private messageHandlers: Map<WSMessageType, Set<WSMessageHandler>> = new Map();
  private stateHandlers: Set<WSStateHandler> = new Set();
  private currentState: WSConnectionState = 'disconnected';
  private manualClose = false;

  constructor(config: WSConfig) {
    this.config = {
      url: config.url,
      protocols: config.protocols || [],
      reconnectInterval: config.reconnectInterval || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      heartbeatInterval: config.heartbeatInterval || 30000,
      heartbeatMessage: config.heartbeatMessage || JSON.stringify({ type: 'ping' }),
      enableMessageQueue: config.enableMessageQueue ?? true,
      debug: config.debug ?? false,
    };
  }

  /**
   * 连接 WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.manualClose = false;
        this.setState('connecting');

        this.ws = new WebSocket(this.config.url, this.config.protocols);

        this.ws.onopen = (event) => {
          this.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.setState('connected');
          this.startHeartbeat();
          this.flushMessageQueue();
          resolve();
        };

        this.ws.onclose = (event) => {
          this.log('WebSocket disconnected', event);
          this.stopHeartbeat();
          this.setState('disconnected', event);

          if (!this.manualClose) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (event) => {
          this.log('WebSocket error', event);
          this.setState('error', event);
          reject(event);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      } catch (error) {
        this.log('Connection error', error);
        this.setState('error');
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.manualClose = true;
    this.stopHeartbeat();
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.setState('disconnected');
  }

  /**
   * 发送消息
   */
  send(type: WSMessageType, data: any, id?: string): boolean {
    if (!this.isConnected()) {
      if (this.config.enableMessageQueue) {
        this.queueMessage({ type, data, timestamp: Date.now(), id });
        return false;
      }
      return false;
    }

    try {
      const message: WSMessage = {
        type,
        data,
        timestamp: Date.now(),
        id,
      };

      this.ws?.send(JSON.stringify(message));
      this.log('Message sent:', message);
      return true;
    } catch (error) {
      this.log('Send error:', error);
      return false;
    }
  }

  /**
   * 订阅消息类型
   */
  subscribe(type: WSMessageType, handler: WSMessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }

    this.messageHandlers.get(type)!.add(handler);

    // 返回取消订阅函数
    return () => {
      this.messageHandlers.get(type)?.delete(handler);
    };
  }

  /**
   * 订阅所有消息
   */
  subscribeAll(handler: WSMessageHandler): () => void {
    return this.subscribe('*', handler);
  }

  /**
   * 订阅连接状态变化
   */
  onStateChange(handler: WSStateHandler): () => void {
    this.stateHandlers.add(handler);

    // 返回取消订阅函数
    return () => {
      this.stateHandlers.delete(handler);
    };
  }

  /**
   * 获取当前连接状态
   */
  getState(): WSConnectionState {
    return this.currentState;
  }

  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this.currentState === 'connected' && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 获取消息队列中的消息数量
   */
  getQueueSize(): number {
    return this.messageQueue.length;
  }

  /**
   * 清空消息队列
   */
  clearQueue(): void {
    this.messageQueue = [];
  }

  // ============= Private Methods =============

  private setState(state: WSConnectionState, event?: Event): void {
    if (this.currentState !== state) {
      this.currentState = state;
      this.log('State changed:', state);

      this.stateHandlers.forEach(handler => {
        try {
          handler(state, event);
        } catch (error) {
          this.log('State handler error:', error);
        }
      });
    }
  }

  private handleMessage(data: string): void {
    try {
      const message: WSMessage = JSON.parse(data);
      this.log('Message received:', message);

      // 触发特定类型的处理器
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(message);
          } catch (error) {
            this.log('Message handler error:', error);
          }
        });
      }

      // 触发所有消息的处理器
      const allHandlers = this.messageHandlers.get('*');
      if (allHandlers) {
        allHandlers.forEach(handler => {
          try {
            handler(message);
          } catch (error) {
            this.log('All messages handler error:', error);
          }
        });
      }
    } catch (error) {
      this.log('Parse message error:', error);
    }
  }

  private queueMessage(message: WSMessage): void {
    this.messageQueue.push(message);
    this.log('Message queued:', message);
  }

  private flushMessageQueue(): void {
    if (this.messageQueue.length === 0) {
      return;
    }

    this.log('Flushing message queue:', this.messageQueue.length);

    const messages = [...this.messageQueue];
    this.messageQueue = [];

    messages.forEach(message => {
      this.send(message.type, message.data, message.id);
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.log('Max reconnect attempts reached');
      return;
    }

    this.clearReconnectTimer();

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);

      this.connect().catch(() => {
        // Connection failed, will retry
      });
    }, this.config.reconnectInterval);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        try {
          this.ws?.send(this.config.heartbeatMessage);
        } catch (error) {
          this.log('Heartbeat error:', error);
        }
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocketService]', ...args);
    }
  }
}

// ============= Export Factory =============

const wsInstances = new Map<string, WebSocketService>();

export function createWebSocketService(id: string, config: WSConfig): WebSocketService {
  if (wsInstances.has(id)) {
    wsInstances.get(id)!.disconnect();
  }

  const service = new WebSocketService(config);
  wsInstances.set(id, service);

  return service;
}

export function getWebSocketService(id: string): WebSocketService | undefined {
  return wsInstances.get(id);
}

export function destroyWebSocketService(id: string): void {
  const service = wsInstances.get(id);
  if (service) {
    service.disconnect();
    wsInstances.delete(id);
  }
}

export default WebSocketService;
