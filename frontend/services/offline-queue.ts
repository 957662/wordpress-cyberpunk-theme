/**
 * 离线队列服务
 * 在网络离线时缓存请求，恢复后自动发送
 */

import { apiClient } from './api-client';

export interface QueuedRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  config?: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

export interface OfflineQueueConfig {
  storageKey: string;
  maxQueueSize: number;
  retryInterval: number;
  maxRetries: number;
  enableIndexedDB: boolean;
}

class OfflineQueue {
  private config: OfflineQueueConfig;
  private queue: QueuedRequest[] = [];
  private isOnline: boolean = true;
  private retryTimer: NodeJS.Timeout | null = null;
  private indexedDB: IDBDatabase | null = null;

  constructor(config: Partial<OfflineQueueConfig> = {}) {
    this.config = {
      storageKey: config.storageKey || 'offline_queue',
      maxQueueSize: config.maxQueueSize || 100,
      retryInterval: config.retryInterval || 5000,
      maxRetries: config.maxRetries || 3,
      enableIndexedDB: config.enableIndexedDB ?? true,
    };

    this.init();
  }

  /**
   * 初始化
   */
  private async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    // 初始化 IndexedDB
    if (this.config.enableIndexedDB) {
      await this.initIndexedDB();
    }

    // 从本地存储加载队列
    await this.loadQueue();

    // 监听网络状态
    this.setupNetworkListeners();

    // 检查在线状态
    this.isOnline = navigator.onLine;

    // 如果在线且队列不为空，开始处理
    if (this.isOnline && this.queue.length > 0) {
      this.processQueue();
    }
  }

  /**
   * 初始化 IndexedDB
   */
  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('OfflineQueueDB', 1);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.indexedDB = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('queue')) {
          db.createObjectStore('queue', { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * 设置网络监听器
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('[OfflineQueue] Network online');
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('[OfflineQueue] Network offline');
    });
  }

  /**
   * 添加请求到队列
   */
  async add(
    method: QueuedRequest['method'],
    url: string,
    data?: any,
    config?: any
  ): Promise<void> {
    const request: QueuedRequest = {
      id: this.generateId(),
      method,
      url,
      data,
      config,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: this.config.maxRetries,
    };

    // 检查队列大小
    if (this.queue.length >= this.config.maxQueueSize) {
      // 移除最旧的请求
      this.queue.shift();
    }

    this.queue.push(request);
    await this.saveQueue();

    // 如果在线，尝试立即处理
    if (this.isOnline) {
      this.processQueue();
    }
  }

  /**
   * 处理队列
   */
  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    // 清除重试定时器
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }

    // 处理队列中的请求
    const requestsToProcess = [...this.queue];

    for (const request of requestsToProcess) {
      try {
        await this.processRequest(request);
        // 成功后从队列中移除
        this.removeFromQueue(request.id);
      } catch (error) {
        console.error('[OfflineQueue] Failed to process request:', error);

        // 增加重试次数
        request.retries++;

        if (request.retries >= request.maxRetries) {
          // 达到最大重试次数，移除请求
          console.warn('[OfflineQueue] Max retries reached, removing request:', request.id);
          this.removeFromQueue(request.id);
        } else {
          // 更新队列
          await this.saveQueue();
        }
      }
    }

    // 如果队列还有请求，设置重试定时器
    if (this.queue.length > 0) {
      this.retryTimer = setTimeout(() => {
        this.processQueue();
      }, this.config.retryInterval);
    }
  }

  /**
   * 处理单个请求
   */
  private async processRequest(request: QueuedRequest): Promise<any> {
    switch (request.method) {
      case 'GET':
        return apiClient.get(request.url, request.config);
      case 'POST':
        return apiClient.post(request.url, request.data, request.config);
      case 'PUT':
        return apiClient.put(request.url, request.data, request.config);
      case 'PATCH':
        return apiClient.patch(request.url, request.data, request.config);
      case 'DELETE':
        return apiClient.delete(request.url, request.config);
      default:
        throw new Error(`Unknown method: ${request.method}`);
    }
  }

  /**
   * 从队列中移除请求
   */
  private async removeFromQueue(id: string): Promise<void> {
    this.queue = this.queue.filter((r) => r.id !== id);
    await this.saveQueue();
  }

  /**
   * 加载队列
   */
  private async loadQueue(): Promise<void> {
    if (this.config.enableIndexedDB && this.indexedDB) {
      await this.loadFromIndexedDB();
    } else {
      this.loadFromLocalStorage();
    }
  }

  /**
   * 从 IndexedDB 加载
   */
  private async loadFromIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB!.transaction(['queue'], 'readonly');
      const store = transaction.objectStore('queue');
      const request = store.getAll();

      request.onsuccess = () => {
        this.queue = request.result || [];
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * 从本地存储加载
   */
  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(this.config.storageKey);
    if (stored) {
      try {
        this.queue = JSON.parse(stored);
      } catch (error) {
        console.error('[OfflineQueue] Failed to load queue:', error);
        this.queue = [];
      }
    }
  }

  /**
   * 保存队列
   */
  private async saveQueue(): Promise<void> {
    if (this.config.enableIndexedDB && this.indexedDB) {
      await this.saveToIndexedDB();
    } else {
      this.saveToLocalStorage();
    }
  }

  /**
   * 保存到 IndexedDB
   */
  private async saveToIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB!.transaction(['queue'], 'readwrite');
      const store = transaction.objectStore('queue');

      // 清空存储
      store.clear();

      // 添加所有请求
      this.queue.forEach((request) => {
        store.put(request);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * 保存到本地存储
   */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.error('[OfflineQueue] Failed to save queue:', error);
    }
  }

  /**
   * 清空队列
   */
  async clear(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
  }

  /**
   * 获取队列大小
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * 获取队列
   */
  getQueue(): QueuedRequest[] {
    return [...this.queue];
  }

  /**
   * 是否在线
   */
  isNetworkOnline(): boolean {
    return this.isOnline;
  }

  /**
   * 生成ID
   */
  private generateId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 销毁
   */
  destroy(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    if (this.indexedDB) {
      this.indexedDB.close();
    }
  }
}

// 创建全局实例
export const offlineQueue = new OfflineQueue();

// Hook
export function useOfflineQueue() {
  const add = React.useCallback(
    async (method: QueuedRequest['method'], url: string, data?: any, config?: any) => {
      await offlineQueue.add(method, url, data, config);
    },
    []
  );

  const clear = React.useCallback(async () => {
    await offlineQueue.clear();
  }, []);

  return {
    add,
    clear,
    getQueueSize: () => offlineQueue.getQueueSize(),
    getQueue: () => offlineQueue.getQueue(),
    isOnline: () => offlineQueue.isNetworkOnline(),
  };
}

export default OfflineQueue;
