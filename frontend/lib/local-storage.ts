/**
 * Local Storage Utilities
 * Safe localStorage wrapper with type safety and error handling
 */

export type StorageType = 'localStorage' | 'sessionStorage'

interface StorageOptions {
  prefix?: string
  serialize?: boolean
  expire?: number // TTL in milliseconds
}

interface StoredItem<T> {
  value: T
  timestamp: number
  expire?: number
}

class StorageManager {
  private prefix: string
  private storage: Storage

  constructor(type: StorageType = 'localStorage', prefix: string = 'cyberpress') {
    this.prefix = prefix
    this.storage = type === 'localStorage' ? window.localStorage : window.sessionStorage
  }

  private getKey(key: string): string {
    return `${this.prefix}_${key}`
  }

  private isExpired(item: StoredItem<any>): boolean {
    if (!item.expire) return false
    return Date.now() > item.timestamp + item.expire
  }

  private serialize<T>(value: T, serialize: boolean): string {
    if (serialize) {
      return JSON.stringify(value)
    }
    return value as unknown as string
  }

  private deserialize<T>(value: string, serialize: boolean): T {
    if (serialize) {
      try {
        return JSON.parse(value) as T
      } catch {
        return value as unknown as T
      }
    }
    return value as unknown as T
  }

  set<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    try {
      const { prefix = this.prefix, serialize = true, expire } = options
      const fullKey = prefix ? `${prefix}_${key}` : this.getKey(key)

      const item: StoredItem<T> = {
        value,
        timestamp: Date.now(),
        expire,
      }

      this.storage.setItem(fullKey, this.serialize(item, serialize))
      return true
    } catch (error) {
      console.error('Error storing item:', error)
      return false
    }
  }

  get<T>(key: string, options: StorageOptions = {}): T | null {
    try {
      const { prefix = this.prefix, serialize = true } = options
      const fullKey = prefix ? `${prefix}_${key}` : this.getKey(key)
      const item = this.storage.getItem(fullKey)

      if (!item) return null

      const stored = this.deserialize<StoredItem<T>>(item, serialize)

      // Check expiration
      if (this.isExpired(stored)) {
        this.remove(key, { prefix })
        return null
      }

      return stored.value
    } catch (error) {
      console.error('Error retrieving item:', error)
      return null
    }
  }

  remove(key: string, options: StorageOptions = {}): boolean {
    try {
      const { prefix = this.prefix } = options
      const fullKey = prefix ? `${prefix}_${key}` : this.getKey(key)
      this.storage.removeItem(fullKey)
      return true
    } catch (error) {
      console.error('Error removing item:', error)
      return false
    }
  }

  clear(prefix?: string): boolean {
    try {
      if (!prefix) {
        this.storage.clear()
        return true
      }

      const items = this.keys(prefix)
      items.forEach(key => this.storage.removeItem(key))
      return true
    } catch (error) {
      console.error('Error clearing storage:', error)
      return false
    }
  }

  keys(prefix?: string): string[] {
    try {
      const allKeys = Object.keys(this.storage)
      if (!prefix) return allKeys

      return allKeys.filter(key => key.startsWith(prefix))
    } catch (error) {
      console.error('Error getting keys:', error)
      return []
    }
  }

  has(key: string, options: StorageOptions = {}): boolean {
    try {
      const { prefix = this.prefix } = options
      const fullKey = prefix ? `${prefix}_${key}` : this.getKey(key)
      return this.storage.getItem(fullKey) !== null
    } catch {
      return false
    }
  }

  size(): number {
    try {
      return this.storage.length
    } catch {
      return 0
    }
  }

  getSize(): number {
    try {
      let total = 0
      for (let key in this.storage) {
        if (this.storage.hasOwnProperty(key)) {
          total += this.storage[key].length + key.length
        }
      }
      return total
    } catch {
      return 0
    }
  }
}

// Create singleton instances
export const localStorage = new StorageManager('localStorage')
export const sessionStorage = new StorageManager('sessionStorage')

// Utility functions
export function setItem<T>(key: string, value: T, options?: StorageOptions): boolean {
  return localStorage.set(key, value, options)
}

export function getItem<T>(key: string, defaultValue?: T, options?: StorageOptions): T | null {
  const value = localStorage.get<T>(key, options)
  return value ?? defaultValue ?? null
}

export function removeItem(key: string, options?: StorageOptions): boolean {
  return localStorage.remove(key, options)
}

export function clearStorage(prefix?: string): boolean {
  return localStorage.clear(prefix)
}

export function hasItem(key: string, options?: StorageOptions): boolean {
  return localStorage.has(key, options)
}

export function getAllKeys(prefix?: string): string[] {
  return localStorage.keys(prefix)
}

export function getStorageSize(): number {
  return localStorage.getSize()
}

// Hook for React components
export function useStorage<T>(
  key: string,
  initialValue: T,
  options?: StorageOptions
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const storedValue = getItem<T>(key, initialValue, options)

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue ?? initialValue) : value
      setItem(key, valueToStore, options)
      // Trigger re-render by dispatching storage event
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(valueToStore) }))
    } catch (error) {
      console.error('Error setting value:', error)
    }
  }

  const removeValue = () => {
    removeItem(key, options)
    window.dispatchEvent(new StorageEvent('storage', { key }))
  }

  return [storedValue ?? initialValue, setValue, removeValue]
}
