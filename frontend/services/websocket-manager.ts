/**
 * WebSocket 管理器
 * 提供完整的 WebSocket 连接管理、自动重连、心跳检测和消息队列
 */

import { EventEmitter } from 'events';

export type WebSocketMessageType = 'message' | 'notification' | 'activity' | 'typing' | 'presence';
export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  timestamp: number;
  id?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
  enableMessageQueue?: boolean;
  debug?: boolean;
}

export interface WebSocketEventListener {
  (data: any): void;
}

class WebSocketManager extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private heartbeatTimeoutTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private status: WebSocketStatus = 'disconnected';
  private messageQueue: WebSocketMessage[] = [];
  private isManualClose = false;

  constructor(config: WebSocketConfig) {
    super();
    this.config = {
      url: config.url,
      protocols: config.protocols || [],
      reconnectInterval: config.reconnectInterval || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || Infinity,
      heartbeatInterval: config.heartbeatInterval || 30000,
      heartbeatTimeout: config.heartbeatTimeout || 5000,
      enableMessageQueue: config.enableMessageQueue ?? true,
      debug: config.debug || false,
    };
  }

  /**
   * 连接 WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.debug('Already connected');
      return;
    }

    this.setStatus('connecting');
    this.isManualClose = false;

    try {
      this.ws = new WebSocket(this.config.url, this.config.protocols);
      this.setupEventHandlers();
    } catch (error) {
      this.debug('Connection error:', error);
      this.setStatus('error');
      this.handleReconnect();
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.isManualClose = true;
    this.stopHeartbeat();
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }

    this.setStatus('disconnected');
  }

  /**
   * 发送消息
   */
  send(type: WebSocketMessageType, data: any, id?: string): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
      id: id || this.generateMessageId(),
    };

    if (this.status === 'connected' && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      this.debug('Sent:', message);
    } else if (this.config.enableMessageQueue) {
      this.messageQueue.push(message);
      this.debug('Queued:', message);
    }
  }

  /**
   * 添加消息监听器
   */
  onMessage(type: WebSocketMessageType, listener: WebSocketEventListener): void {
    this.on(`message:${type}`, listener);
  }

  /**
   * 移除消息监听器
   */
  offMessage(type: WebSocketMessageType, listener: WebSocketEventListener): void {
    this.off(`message:${type}`, listener);
  }

  /**
   * 获取连接状态
   */
  getStatus(): WebSocketStatus {
    return this.status;
  }

  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this.status === 'connected' && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.debug('Connected');
      this.setStatus('connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.flushMessageQueue();
      this.emit('open');
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.debug('Received:', message);
        this.emit(`message:${message.type}`, message.data);
        this.emit('message', message);
      } catch (error) {
        this.debug('Parse error:', error);
      }
    };

    this.ws.onerror = (error) => {
      this.debug('Error:', error);
      this.setStatus('error');
      this.emit('error', error);
    };

    this.ws.onclose = (event) => {
      this.debug('Closed:', event.code, event.reason);
      this.stopHeartbeat();

      if (!this.isManualClose) {
        this.setStatus('disconnected');
        this.handleReconnect();
      }

      this.emit('close', event);
    };
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('heartbeat', { timestamp: Date.now() });

        // 设置心跳超时
        this.heartbeatTimeoutTimer = setTimeout(() => {
          this.debug('Heartbeat timeout');
          this.ws?.close();
        }, this.config.heartbeatTimeout);
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
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  /**
   * 处理重连
   */
  private handleReconnect(): void {
    if (this.isManualClose) return;
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.debug('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.clearReconnectTimer();
    this.reconnectAttempts++;

    const delay = this.config.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1);
    this.debug(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
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
   * 发送队列中的消息
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        this.ws?.send(JSON.stringify(message));
      }
    }
  }

  /**
   * 设置状态
   */
  private setStatus(status: WebSocketStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.emit('statusChange', status);
    }
  }

  /**
   * 生成消息 ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 调试日志
   */
  private debug(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocketManager]', ...args);
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.disconnect();
    this.removeAllListeners();
  }
}

// 创建全局 WebSocket 管理器实例
let globalWsManager: WebSocketManager | null = null;

export function createWebSocketManager(config: WebSocketConfig): WebSocketManager {
  const manager = new WebSocketManager(config);
  return manager;
}

export function getGlobalWebSocketManager(config?: WebSocketConfig): WebSocketManager {
  if (!globalWsManager && config) {
    globalWsManager = createWebSocketManager(config);
  }
  return globalWsManager!;
}

export default WebSocketManager;
