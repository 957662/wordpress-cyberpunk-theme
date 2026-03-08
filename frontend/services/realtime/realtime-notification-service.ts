/**
 * Realtime Notification Service
 * 实时通知服务 - 使用 WebSocket 推送实时通知
 */

export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actor?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
}

export interface NotificationPreferences {
  follow: boolean;
  like: boolean;
  comment: boolean;
  mention: boolean;
  system: boolean;
  email: boolean;
  push: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

type NotificationCallback = (notification: Notification) => void;
type ConnectionCallback = (connected: boolean) => void;

class RealtimeNotificationService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  private notifications: Notification[] = [];
  private preferences: NotificationPreferences = {
    follow: true,
    like: true,
    comment: true,
    mention: true,
    system: true,
    email: false,
    push: true,
  };

  private listeners: Map<string, Set<NotificationCallback>> = new Map();
  private connectionListeners: Set<ConnectionCallback> = new Set();

  private isConnected: boolean = false;
  private userId: number | null = null;
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  /**
   * Connect to WebSocket server
   */
  connect(userId: number, token: string): void {
    this.userId = userId;
    this.token = token;

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const wsUrl = `${this.getWebSocketURL()}/notifications/ws?user_id=${userId}&token=${token}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }

  private getWebSocketURL(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_URL || window.location.host;
    return `${protocol}//${host}`;
  }

  private handleOpen(): void {
    console.log('WebSocket connected');
    this.isConnected = true;
    this.reconnectAttempts = 0;

    // Send authentication
    if (this.userId && this.token) {
      this.send({
        type: 'auth',
        user_id: this.userId,
        token: this.token,
      });
    }

    // Notify connection listeners
    this.connectionListeners.forEach(callback => callback(true));

    // Request pending notifications
    this.fetchPendingNotifications();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'notification':
          this.handleNotification(data.payload);
          break;
        case 'notifications_batch':
          data.payload.forEach((n: Notification) => this.handleNotification(n));
          break;
        case 'read_receipt':
          this.handleReadReceipt(data.notification_id);
          break;
        case 'ping':
          this.send({ type: 'pong' });
          break;
        case 'preferences_updated':
          this.preferences = data.preferences;
          this.saveToStorage();
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Failed to handle WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason);
    this.isConnected = false;
    this.ws = null;

    // Notify connection listeners
    this.connectionListeners.forEach(callback => callback(false));

    // Attempt to reconnect
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      if (this.userId && this.token) {
        this.connect(this.userId, this.token);
      }
    }, delay);
  }

  private handleNotification(notification: Notification): void {
    // Add to notifications list
    this.notifications.unshift(notification);

    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Save to storage
    this.saveToStorage();

    // Check preferences
    if (this.shouldShowNotification(notification)) {
      // Show browser notification
      this.showBrowserNotification(notification);

      // Trigger type-specific listeners
      const typeListeners = this.listeners.get(notification.type);
      if (typeListeners) {
        typeListeners.forEach(callback => callback(notification));
      }

      // Trigger global listeners
      const allListeners = this.listeners.get('*');
      if (allListeners) {
        allListeners.forEach(callback => callback(notification));
      }
    }
  }

  private handleReadReceipt(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
    }
  }

  private shouldShowNotification(notification: Notification): boolean {
    const preference = this.preferences[notification.type];
    return preference !== false;
  }

  private async showBrowserNotification(notification: Notification): Promise<void> {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: notification.id,
          data: notification,
        });

        browserNotification.onclick = () => {
          window.focus();
          if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
          }
          browserNotification.close();
        };

        // Auto-close after 5 seconds
        setTimeout(() => browserNotification.close(), 5000);
      } catch (error) {
        console.error('Failed to show browser notification:', error);
      }
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showBrowserNotification(notification);
      }
    }
  }

  private send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Fetch pending notifications from server
   */
  private async fetchPendingNotifications(): Promise<void> {
    try {
      const response = await fetch('/api/notifications/pending');
      if (response.ok) {
        const data = await response.json();
        data.notifications.forEach((n: Notification) => this.handleNotification(n));
      }
    } catch (error) {
      console.error('Failed to fetch pending notifications:', error);
    }
  }

  /**
   * Subscribe to notifications
   */
  on(type: string | '*', callback: NotificationCallback): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionListeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  /**
   * Get notification stats
   */
  getStats(): NotificationStats {
    const unread = this.notifications.filter(n => !n.read).length;
    const byType: Record<string, number> = {};

    this.notifications.forEach(n => {
      byType[n.type] = (byType[n.type] || 0) + 1;
    });

    return {
      total: this.notifications.length,
      unread,
      byType,
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveToStorage();

      // Send read receipt via WebSocket
      this.send({
        type: 'read',
        notification_id: notificationId,
      });
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();

    // Send bulk read receipt
    this.send({
      type: 'read_all',
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveToStorage();
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = [];
    this.saveToStorage();
  }

  /**
   * Update preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    this.saveToStorage();

    // Send updated preferences to server
    this.send({
      type: 'update_preferences',
      preferences: this.preferences,
    });
  }

  /**
   * Get preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  /**
   * Check if connected
   */
  connected(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
  }

  /**
   * Load from local storage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        this.notifications = JSON.parse(saved);
      }

      const savedPreferences = localStorage.getItem('notification_preferences');
      if (savedPreferences) {
        this.preferences = JSON.parse(savedPreferences);
      }
    } catch (error) {
      console.error('Failed to load notifications from storage:', error);
    }
  }

  /**
   * Save to local storage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
      localStorage.setItem('notification_preferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
    }
  }
}

// Create singleton instance
const notificationService = new RealtimeNotificationService();

export default notificationService;
export function getNotificationService(): RealtimeNotificationService {
  return notificationService;
}
