/**
 * 本地存储服务
 * 提供 localStorage 和 sessionStorage 的封装
 */

interface StorageOptions {
  /**
   * 序列化函数
   */
  serialize?: (value: any) => string;

  /**
   * 反序列化函数
   */
  deserialize?: (value: string) => any;

  /**
   * 过期时间(秒)
   */
  expires?: number;
}

class StorageService {
  private prefix: string = 'cyberpress_';

  constructor(prefix?: string) {
    if (prefix) {
      this.prefix = prefix;
    }
  }

  /**
   * 生成带前缀的键
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 序列化值
   */
  private serialize(value: any, options?: StorageOptions): string {
    if (options?.serialize) {
      return options.serialize(value);
    }

    const data = {
      value,
      expires: options?.expires ? Date.now() + options.expires * 1000 : null,
    };

    return JSON.stringify(data);
  }

  /**
   * 反序列化值
   */
  private deserialize(item: string, options?: StorageOptions): any {
    if (options?.deserialize) {
      return options.deserialize(item);
    }

    try {
      const data = JSON.parse(item);

      // 检查是否过期
      if (data.expires && data.expires < Date.now()) {
        return null;
      }

      return data.value;
    } catch {
      return item;
    }
  }

  /**
   * 设置 localStorage
   */
  setLocal(key: string, value: any, options?: StorageOptions): boolean {
    try {
      const item = this.serialize(value, options);
      localStorage.setItem(this.getKey(key), item);
      return true;
    } catch (error) {
      console.error('Error setting localStorage:', error);
      return false;
    }
  }

  /**
   * 获取 localStorage
   */
  getLocal<T>(key: string, options?: StorageOptions): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;

      const value = this.deserialize(item, options);
      return value === null ? null : (value as T);
    } catch (error) {
      console.error('Error getting localStorage:', error);
      return null;
    }
  }

  /**
   * 删除 localStorage
   */
  removeLocal(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Error removing localStorage:', error);
      return false;
    }
  }

  /**
   * 清空所有 localStorage
   */
  clearLocal(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * 设置 sessionStorage
   */
  setSession(key: string, value: any, options?: StorageOptions): boolean {
    try {
      const item = this.serialize(value, options);
      sessionStorage.setItem(this.getKey(key), item);
      return true;
    } catch (error) {
      console.error('Error setting sessionStorage:', error);
      return false;
    }
  }

  /**
   * 获取 sessionStorage
   */
  getSession<T>(key: string, options?: StorageOptions): T | null {
    try {
      const item = sessionStorage.getItem(this.getKey(key));
      if (!item) return null;

      const value = this.deserialize(item, options);
      return value === null ? null : (value as T);
    } catch (error) {
      console.error('Error getting sessionStorage:', error);
      return null;
    }
  }

  /**
   * 删除 sessionStorage
   */
  removeSession(key: string): boolean {
    try {
      sessionStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Error removing sessionStorage:', error);
      return false;
    }
  }

  /**
   * 清空所有 sessionStorage
   */
  clearSession(): boolean {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }

  /**
   * 获取所有 localStorage 键
   */
  getLocalKeys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch {
      return [];
    }
  }

  /**
   * 获取所有 sessionStorage 键
   */
  getSessionKeys(): string[] {
    try {
      const keys = Object.keys(sessionStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch {
      return [];
    }
  }

  /**
   * 获取存储大小(字节)
   */
  getStorageSize(): { local: number; session: number } {
    let localSize = 0;
    let sessionSize = 0;

    try {
      // 计算 localStorage 大小
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localSize += localStorage[key].length + key.length;
        }
      });

      // 计算 sessionStorage 大小
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionSize += sessionStorage[key].length + key.length;
        }
      });
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }

    return { local: localSize, session: sessionSize };
  }
}

// 创建默认实例
const storage = new StorageService();

// 导出类和实例
export { StorageService };
export default storage;

// 便捷方法
export const local = {
  set: (key: string, value: any, options?: StorageOptions) =>
    storage.setLocal(key, value, options),
  get: <T>(key: string, options?: StorageOptions) =>
    storage.getLocal<T>(key, options),
  remove: (key: string) => storage.removeLocal(key),
  clear: () => storage.clearLocal(),
  keys: () => storage.getLocalKeys(),
};

export const session = {
  set: (key: string, value: any, options?: StorageOptions) =>
    storage.setSession(key, value, options),
  get: <T>(key: string, options?: StorageOptions) =>
    storage.getSession<T>(key, options),
  remove: (key: string) => storage.removeSession(key),
  clear: () => storage.clearSession(),
  keys: () => storage.getSessionKeys(),
};
