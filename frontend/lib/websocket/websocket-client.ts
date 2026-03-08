/**
 * WebSocket Client
 * 赛博朋克风格博客平台的 WebSocket 客户端
 * 支持自动重连、心跳检测、消息队列
 */

export type WebSocketMessageType = 'notification' | 'comment' | 'like' | 'follow' | 'system' | 'chat';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  timestamp: number;
  id: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  enableQueue?: boolean;
  debug?: boolean;
}

type WebSocketMessageHandler = (message: WebSocketMessage) => void;
type WebSocketStatusHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private messageHandlers: Map<WebSocketMessageType, Set<WebSocketMessageHandler>> = new Map();
  private statusHandlers: Set<WebSocketStatusHandler> = new Set();
  private isManualClose = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url,
      reconnectInterval: config.reconnectInterval || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      heartbeatInterval: config.heartbeatInterval || 30000,
      enableQueue: config.enableQueue ?? true,
      debug: config.debug || false,
    };
  }

  /**
   * 连接 WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isManualClose = false;
        this.notifyStatus('connecting');

        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          this.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.notifyStatus('connected');

          // 发送队列中的消息
          if (this.config.enableQueue) {
            this.flushQueue();
          }

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.log('Received message:', message);
            this.handleMessage(message);
          } catch (error) {
            this.log('Error parsing message:', error);
          }
        };

        this.ws.onclose = (event) => {
          this.log('WebSocket closed:', event.code, event.reason);
          this.stopHeartbeat();
          this.notifyStatus('disconnected');

          if (!this.isManualClose) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          this.log('WebSocket error:', error);
          this.notifyStatus('error');
          reject(error);
        };
      } catch (error) {
        this.log('Error connecting to WebSocket:', error);
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

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 发送消息
   */
  send(type: WebSocketMessageType, data: any): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
      id: this.generateMessageId(),
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.log('Sent message:', message);
      } catch (error) {
        this.log('Error sending message:', error);
        if (this.config.enableQueue) {
          this.queueMessage(message);
        }
      }
    } else {
      this.log('WebSocket is not connected, queuing message');
      if (this.config.enableQueue) {
        this.queueMessage(message);
      }
    }
  }

  /**
   * 订阅消息类型
   */
  subscribe(type: WebSocketMessageType, handler: WebSocketMessageHandler): () => void {
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
   * 订阅连接状态
   */
  onStatusChange(handler: WebSocketStatusHandler): () => void {
    this.statusHandlers.add(handler);

    // 返回取消订阅函数
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  /**
   * 获取连接状态
   */
  getStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.ws) return 'disconnected';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          this.log('Error in message handler:', error);
        }
      });
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

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    this.log(`Scheduling reconnect attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch((error) => {
        this.log('Reconnect failed:', error);
      });
    }, this.config.reconnectInterval);
  }

  /**
   * 开始心跳检测
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimeout = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send('system', { action: 'heartbeat' });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * 停止心跳检测
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimeout) {
      clearInterval(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  /**
   * 将消息加入队列
   */
  private queueMessage(message: WebSocketMessage): void {
    this.messageQueue.push(message);

    // 限制队列大小
    if (this.messageQueue.length > 100) {
      this.messageQueue.shift();
    }
  }

  /**
   * 发送队列中的所有消息
   */
  private flushQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        try {
          this.ws.send(JSON.stringify(message));
          this.log('Sent queued message:', message);
        } catch (error) {
          this.log('Error sending queued message:', error);
          this.queueMessage(message);
          break;
        }
      }
    }
  }

  /**
   * 通知状态变化
   */
  private notifyStatus(status: 'connecting' | 'connected' | 'disconnected' | 'error'): void {
    this.statusHandlers.forEach((handler) => {
      try {
        handler(status);
      } catch (error) {
        this.log('Error in status handler:', error);
      }
    });
  }

  /**
   * 生成消息 ID
   */
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 日志输出
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocketClient]', ...args);
    }
  }
}

// 创建默认实例
let defaultClient: WebSocketClient | null = null;

export function createWebSocketClient(config: WebSocketConfig): WebSocketClient {
  return new WebSocketClient(config);
}

export function getDefaultWebSocketClient(): WebSocketClient | null {
  return defaultClient;
}

export function initDefaultWebSocketClient(config: WebSocketConfig): WebSocketClient {
  if (!defaultClient) {
    defaultClient = new WebSocketClient(config);
  }
  return defaultClient;
}

export default WebSocketClient;
