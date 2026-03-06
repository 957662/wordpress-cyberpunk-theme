/**
 * WebSocket 服务
 * 处理实时通信，包括通知、消息、在线状态等
 */

type WebSocketMessageHandler = (data: any) => void;
type WebSocketCloseHandler = (event: CloseEvent) => void;
type WebSocketErrorHandler = (error: Event) => void;

interface WebSocketOptions {
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

interface MessagePayload {
  type: string;
  data: any;
  timestamp: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string = '';
  private options: Required<WebSocketOptions>;
  private reconnectAttempts: number = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, Set<WebSocketMessageHandler>> = new Map();
  private closeHandlers: Set<WebSocketCloseHandler> = new Set();
  private errorHandlers: Set<WebSocketErrorHandler> = new Set();
  private isManualClose: boolean = false;

  constructor(options: WebSocketOptions = {}) {
    this.options = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...options,
    };
  }

  /**
   * 连接 WebSocket
   */
  connect(url: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket 已经连接');
      return;
    }

    this.url = url;
    this.isManualClose = false;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket 连接失败:', error);
      this.scheduleReconnect();
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
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 发送消息
   */
  send(type: string, data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket 未连接');
      return;
    }

    const payload: MessagePayload = {
      type,
      data,
      timestamp: Date.now(),
    };

    try {
      this.ws.send(JSON.stringify(payload));
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  }

  /**
   * 订阅消息类型
   */
  on(type: string, handler: WebSocketMessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }

    this.messageHandlers.get(type)!.add(handler);

    // 返回取消订阅函数
    return () => {
      this.off(type, handler);
    };
  }

  /**
   * 取消订阅消息类型
   */
  off(type: string, handler: WebSocketMessageHandler): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(type);
      }
    }
  }

  /**
   * 监听连接关闭事件
   */
  onClose(handler: WebSocketCloseHandler): () => void {
    this.closeHandlers.add(handler);
    return () => this.closeHandlers.delete(handler);
  }

  /**
   * 监听错误事件
   */
  onError(handler: WebSocketErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  /**
   * 获取连接状态
   */
  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  /**
   * 是否已连接
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 处理连接打开
   */
  private handleOpen(): void {
    console.log('WebSocket 已连接');
    this.reconnectAttempts = 0;
    this.startHeartbeat();

    // 触发连接成功消息
    this.emit('connected', { timestamp: Date.now() });
  }

  /**
   * 处理收到消息
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const payload: MessagePayload = JSON.parse(event.data);
      const { type, data } = payload;

      // 触发该类型的所有处理器
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error(`消息处理器执行失败 [${type}]:`, error);
          }
        });
      }

      // 触发通用的消息处理器
      const allHandlers = this.messageHandlers.get('*');
      if (allHandlers) {
        allHandlers.forEach(handler => {
          try {
            handler(payload);
          } catch (error) {
            console.error('通用消息处理器执行失败:', error);
          }
        });
      }
    } catch (error) {
      console.error('解析消息失败:', error);
    }
  }

  /**
   * 处理连接关闭
   */
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket 连接已关闭:', event.code, event.reason);
    this.stopHeartbeat();

    // 触发关闭处理器
    this.closeHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('关闭处理器执行失败:', error);
      }
    });

    // 如果不是手动关闭,尝试重连
    if (!this.isManualClose && this.options.reconnect) {
      this.scheduleReconnect();
    }
  }

  /**
   * 处理错误
   */
  private handleError(event: Event): void {
    console.error('WebSocket 错误:', event);

    // 触发错误处理器
    this.errorHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('错误处理器执行失败:', error);
      }
    });
  }

  /**
   * 触发消息
   */
  private emit(type: string, data: any): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`触发消息失败 [${type}]:`, error);
        }
      });
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error('达到最大重连次数');
      return;
    }

    this.clearReconnectTimer();

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`尝试重连 (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})...`);
      this.connect(this.url);
    }, this.options.reconnectInterval);
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
   * 开始心跳
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send('heartbeat', { timestamp: Date.now() });
      }
    }, this.options.heartbeatInterval);
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
}

// 创建单例实例
export const websocketService = new WebSocketService({
  reconnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
});

// 导出类型和类
export { WebSocketService, type WebSocketOptions, type WebSocketMessageHandler };
