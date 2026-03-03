/**
 * WebSocket Service - Enhanced Version
 * 处理实时通信、推送通知和在线状态
 *
 * @version 2.0.0
 * @author CyberPress Team
 */

import { eventBus } from './eventBus';

// =====================================================
// 类型定义
// =====================================================

export enum WebSocketMessageType {
  // 连接相关
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',
  ERROR = 'error',

  // 实时更新
  COMMENT_NEW = 'comment.new',
  COMMENT_UPDATE = 'comment.update',
  COMMENT_DELETE = 'comment.delete',

  // 通知
  NOTIFICATION = 'notification',
  NOTIFICATION_READ = 'notification.read',

  // 在线状态
  USER_ONLINE = 'user.online',
  USER_OFFLINE = 'user.offline',
  USER_TYPING = 'user.typing',

  // 内容更新
  POST_PUBLISHED = 'post.published',
  POST_UPDATED = 'post.updated',
  POST_DELETED = 'post.deleted',

  // 自定义消息
  CUSTOM = 'custom',
}

export interface WebSocketMessage {
  type: WebSocketMessageType | string;
  data: unknown;
  timestamp: number;
  id?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  debug?: boolean;
  token?: string;
}

export type WebSocketEventHandler = (data: unknown) => void;

// =====================================================
// WebSocket Service 类
// =====================================================

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private eventHandlers = new Map<string, Set<WebSocketEventHandler>>();
  private isManualClose = false;
  private isConnecting = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url,
      protocols: config.protocols || [],
      reconnectInterval: config.reconnectInterval || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      heartbeatInterval: config.heartbeatInterval || 30000,
      debug: config.debug || false,
      token: config.token || '',
    };

    this.log('WebSocket Service initialized');
  }

  // =====================================================
  // 连接管理
  // =====================================================

  /**
   * 建立 WebSocket 连接
   */
  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log('Already connected');
      return;
    }

    if (this.isConnecting) {
      this.log('Connection already in progress');
      return;
    }

    this.isConnecting = true;
    this.isManualClose = false;

    try {
      const url = this.buildWebSocketUrl();
      this.log(`Connecting to ${url}`);

      this.ws = new WebSocket(url, this.config.protocols);

      this.setupEventHandlers();
    } catch (error) {
      this.log('Connection error:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  /**
   * 断开 WebSocket 连接
   */
  public disconnect(): void {
    this.isManualClose = true;
    this.clearTimers();

    if (this.ws) {
      this.log('Disconnecting...');
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }

    this.isConnecting = false;
  }

  /**
   * 重新连接
   */
  private reconnect(): void {
    if (this.isManualClose) {
      this.log('Manual close, not reconnecting');
      return;
    }

    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.log('Max reconnect attempts reached');
      this.emit(WebSocketMessageType.ERROR, {
        message: 'Max reconnect attempts reached',
      });
      return;
    }

    this.reconnectAttempts++;
    this.log(
      `Reconnecting... Attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`
    );

    this.clearTimers();
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  /**
   * 处理重连
   */
  private handleReconnect(): void {
    this.log('Handling reconnect');
    this.reconnect();
  }

  // =====================================================
  // 消息处理
  // =====================================================

  /**
   * 发送消息
   */
  public send(type: string, data: unknown): boolean {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
      id: this.generateMessageId(),
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.log('Message sent:', message);
        return true;
      } catch (error) {
        this.log('Send error:', error);
        this.queueMessage(message);
        return false;
      }
    } else {
      this.log('WebSocket not connected, queuing message');
      this.queueMessage(message);
      return false;
    }
  }

  /**
   * 队列消息（连接后发送）
   */
  private queueMessage(message: WebSocketMessage): void {
    this.messageQueue.push(message);
    if (this.messageQueue.length > 100) {
      this.messageQueue.shift(); // 限制队列大小
    }
  }

  /**
   * 发送队列中的消息
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        try {
          this.ws.send(JSON.stringify(message));
          this.log('Queued message sent:', message);
        } catch (error) {
          this.log('Failed to send queued message:', error);
          // 重新放回队列
          this.messageQueue.unshift(message);
          break;
        }
      }
    }
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.log('Message received:', message);

      // 触发事件
      this.emit(message.type, message.data);

      // 发布到事件总线
      eventBus.publish(`ws:${message.type}`, message.data);
    } catch (error) {
      this.log('Message parse error:', error);
    }
  }

  // =====================================================
  // 事件处理
  // =====================================================

  /**
   * 设置 WebSocket 事件处理器
   */
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.log('Connected');

      this.emit(WebSocketMessageType.CONNECT, { timestamp: Date.now() });

      // 发送认证消息
      if (this.config.token) {
        this.send('auth', { token: this.config.token });
      }

      // 发送队列中的消息
      this.flushMessageQueue();

      // 启动心跳
      this.startHeartbeat();
    };

    this.ws.onclose = (event) => {
      this.log(`Disconnected: ${event.code} - ${event.reason}`);
      this.isConnecting = false;
      this.clearTimers();

      this.emit(WebSocketMessageType.DISCONNECT, {
        code: event.code,
        reason: event.reason,
      });

      if (!this.isManualClose) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      this.log('WebSocket error:', error);
      this.isConnecting = false;
      this.emit(WebSocketMessageType.ERROR, { error });
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event);
    };
  }

  /**
   * 订阅消息类型
   */
  public on(type: string, handler: WebSocketEventHandler): () => void {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, new Set());
    }
    this.eventHandlers.get(type)!.add(handler);

    // 返回取消订阅函数
    return () => {
      this.off(type, handler);
    };
  }

  /**
   * 取消订阅
   */
  public off(type: string, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(type);
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(type: string, data: unknown): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          this.log('Handler error:', error);
        }
      });
    }
  }

  // =====================================================
  // 心跳机制
  // =====================================================

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.clearTimers();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * 清理定时器
   */
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // =====================================================
  // 工具方法
  // =====================================================

  /**
   * 构建 WebSocket URL
   */
  private buildWebSocketUrl(): string {
    let url = this.config.url;

    // 添加认证令牌
    if (this.config.token) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}token=${encodeURIComponent(this.config.token)}`;
    }

    return url;
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
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[WebSocketService]', ...args);
    }
  }

  // =====================================================
  // 状态查询
  // =====================================================

  /**
   * 获取连接状态
   */
  public get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 获取连接状态
   */
  public get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  /**
   * 获取队列中的消息数量
   */
  public get queuedMessageCount(): number {
    return this.messageQueue.length;
  }
}

// =====================================================
// 单例实例
// =====================================================

let wsInstance: WebSocketService | null = null;

/**
 * 获取 WebSocket 服务实例
 */
export const getWebSocketService = (config?: WebSocketConfig): WebSocketService => {
  if (!wsInstance && config) {
    wsInstance = new WebSocketService(config);
  }
  return wsInstance!;
};

/**
 * 重置 WebSocket 服务实例
 */
export const resetWebSocketService = (): void => {
  if (wsInstance) {
    wsInstance.disconnect();
    wsInstance = null;
  }
};

// =====================================================
// 导出
// =====================================================

export default WebSocketService;
