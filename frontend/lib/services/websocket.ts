/**
 * WebSocket 实时通信服务
 * 支持自动重连、心跳检测、消息队列
 */

type WebSocketMessage = {
  type: string;
  data: any;
  timestamp: number;
  id?: string;
};

type WebSocketEventHandler = (data: any) => void;

interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string;
  enableMessageQueue?: boolean;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  lastHeartbeat: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private state: WebSocketState;
  private handlers: Map<string, Set<WebSocketEventHandler>>;
  private messageQueue: WebSocketMessage[] = [];
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageBuffer: string[] = [];

  constructor(config: WebSocketConfig) {
    this.config = {
      protocols: '',
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      heartbeatMessage: JSON.stringify({ type: 'ping' }),
      enableMessageQueue: true,
      ...config,
    };

    this.state = {
      isConnected: false,
      isConnecting: false,
      reconnectAttempts: 0,
      lastHeartbeat: Date.now(),
    };

    this.handlers = new Map();
  }

  /**
   * 连接 WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.state.isConnected || this.state.isConnecting) {
        resolve();
        return;
      }

      this.state.isConnecting = true;

      try {
        this.ws = new WebSocket(this.config.url, this.config.protocols);

        this.ws.onopen = () => {
          this.state.isConnected = true;
          this.state.isConnecting = false;
          this.state.reconnectAttempts = 0;

          // 发送队列中的消息
          if (this.config.enableMessageQueue && this.messageQueue.length > 0) {
            this.messageQueue.forEach(msg => this.send(msg.type, msg.data));
            this.messageQueue = [];
          }

          // 启动心跳
          this.startHeartbeat();

          // 触发连接事件
          this.emit('connected', { timestamp: Date.now() });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);

            // 处理心跳响应
            if (message.type === 'pong') {
              this.state.lastHeartbeat = Date.now();
              return;
            }

            // 触发对应的事件处理器
            this.emit(message.type, message.data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', { error });
        };

        this.ws.onclose = () => {
          this.state.isConnected = false;
          this.state.isConnecting = false;

          this.stopHeartbeat();
          this.emit('disconnected', { timestamp: Date.now() });

          // 自动重连
          if (this.state.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.reconnect();
          }
        };
      } catch (error) {
        this.state.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.state.isConnected = false;
    this.state.isConnecting = false;
  }

  /**
   * 发送消息
   */
  send(type: string, data: any): boolean {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
      id: this.generateMessageId(),
    };

    if (!this.state.isConnected) {
      if (this.config.enableMessageQueue) {
        this.messageQueue.push(message);
        return true;
      }
      return false;
    }

    try {
      this.ws?.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      return false;
    }
  }

  /**
   * 发送二进制数据
   */
  sendBinary(data: ArrayBuffer | Blob): boolean {
    if (!this.state.isConnected) {
      return false;
    }

    try {
      this.ws?.send(data);
      return true;
    } catch (error) {
      console.error('Failed to send binary data:', error);
      return false;
    }
  }

  /**
   * 订阅事件
   */
  on(type: string, handler: WebSocketEventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }

    this.handlers.get(type)!.add(handler);

    // 返回取消订阅函数
    return () => {
      this.off(type, handler);
    };
  }

  /**
   * 取消订阅事件
   */
  off(type: string, handler: WebSocketEventHandler): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);

      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(type: string, data: any): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${type} handler:`, error);
        }
      });
    }
  }

  /**
   * 自动重连
   */
  private reconnect(): void {
    this.state.reconnectAttempts++;

    this.emit('reconnecting', {
      attempt: this.state.reconnectAttempts,
      maxAttempts: this.config.maxReconnectAttempts,
    });

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(() => {
        // 连接失败，会自动触发下一次重连
      });
    }, this.config.reconnectInterval);
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.state.isConnected) {
        try {
          this.ws?.send(this.config.heartbeatMessage);

          // 检查心跳超时
          const now = Date.now();
          if (now - this.state.lastHeartbeat > this.config.heartbeatInterval * 2) {
            console.warn('Heartbeat timeout, reconnecting...');
            this.disconnect();
            this.reconnect();
          }
        } catch (error) {
          console.error('Heartbeat error:', error);
        }
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
   * 生成消息 ID
   */
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取连接状态
   */
  getState(): WebSocketState {
    return { ...this.state };
  }

  /**
   * 获取队列中的消息数量
   */
  getQueuedMessageCount(): number {
    return this.messageQueue.length;
  }

  /**
   * 清空消息队列
   */
  clearQueue(): void {
    this.messageQueue = [];
  }
}

/**
 * 创建 WebSocket 连接
 */
export function createWebSocket(config: WebSocketConfig): WebSocketService {
  return new WebSocketService(config);
}

/**
 * React Hook 集成
 */
import { useEffect, useState, useCallback, useRef } from 'react';

export function useWebSocket(config: WebSocketConfig) {
  const wsRef = useRef<WebSocketService | null>(null);
  const [state, setState] = useState({
    isConnected: false,
    isConnecting: false,
  });

  useEffect(() => {
    const ws = new WebSocketService(config);
    wsRef.current = ws;

    // 监听状态变化
    const unsubscribeConnected = ws.on('connected', () => {
      setState(prev => ({ ...prev, isConnected: true, isConnecting: false }));
    });

    const unsubscribeDisconnected = ws.on('disconnected', () => {
      setState(prev => ({ ...prev, isConnected: false }));
    });

    // 连接
    ws.connect().catch(console.error);

    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
      ws.disconnect();
    };
  }, [config.url]);

  const send = useCallback((type: string, data: any) => {
    return wsRef.current?.send(type, data);
  }, []);

  const on = useCallback((type: string, handler: WebSocketEventHandler) => {
    return wsRef.current?.on(type, handler);
  }, []);

  return {
    state,
    send,
    on,
    ws: wsRef.current,
  };
}

/**
 * 导出类型
 */
export type { WebSocketMessage, WebSocketConfig, WebSocketState, WebSocketEventHandler };
export { WebSocketService };
