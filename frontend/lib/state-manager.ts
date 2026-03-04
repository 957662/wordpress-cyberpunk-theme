/**
 * 状态管理器
 * 提供全局状态管理和响应式更新
 */

import { eventBus } from './event-bus';

type StateListener<T> = (newValue: T, oldValue: T) => void;
type StateSelector<T, R> = (state: T) => R;

class StateManager<T extends Record<string, any> = any> {
  private state: T;
  private listeners: Map<keyof T, Set<StateListener<any>>> = new Map();
  private globalListeners: Set<StateListener<T>> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  /**
   * 获取整个状态
   */
  getState(): T {
    return this.state;
  }

  /**
   * 获取指定键的值
   */
  get<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }

  /**
   * 设置整个状态
   */
  setState(newState: Partial<T>): void {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };

    // 触发全局监听器
    this.globalListeners.forEach((listener) => {
      try {
        listener(this.state, oldState);
      } catch (error) {
        console.error('Error in global state listener:', error);
      }
    });

    // 触发特定键的监听器
    Object.keys(newState).forEach((key) => {
      const listeners = this.listeners.get(key as keyof T);
      if (listeners) {
        listeners.forEach((listener) => {
          try {
            listener(this.state[key as keyof T], oldState[key as keyof T]);
          } catch (error) {
            console.error(`Error in state listener for "${key}":`, error);
          }
        });
      }

      // 触发事件
      eventBus.emit(`state:${key}`, {
        newValue: this.state[key as keyof T],
        oldValue: oldState[key as keyof T],
      });
    });

    // 触发全局状态更新事件
    eventBus.emit('state:update', {
      newState: this.state,
      oldState,
    });
  }

  /**
   * 更新指定键的值
   */
  set<K extends keyof T>(key: K, value: T[K]): void {
    this.setState({ [key]: value } as Partial<T>);
  }

  /**
   * 批量更新状态
   */
  batch(updater: (state: T) => Partial<T>): void {
    const updates = updater({ ...this.state });
    this.setState(updates);
  }

  /**
   * 监听整个状态
   */
  subscribe(listener: StateListener<T>): () => void {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  /**
   * 监听指定键
   */
  subscribeTo<K extends keyof T>(key: K, listener: StateListener<T[K]>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    this.listeners.get(key)!.add(listener);
    return () => {
      this.listeners.get(key)?.delete(listener);
    };
  }

  /**
   * 选择并监听状态的派生值
   */
  select<R>(selector: StateSelector<T, R>): R {
    return selector(this.state);
  }

  /**
   * 重置状态
   */
  reset(initialState?: T): void {
    const oldState = { ...this.state };
    this.state = initialState || ({} as T);

    // 触发所有监听器
    this.globalListeners.forEach((listener) => {
      try {
        listener(this.state, oldState);
      } catch (error) {
        console.error('Error in global state listener:', error);
      }
    });

    eventBus.emit('state:reset', { newState: this.state, oldState });
  }

  /**
   * 获取状态快照
   */
  snapshot(): T {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * 从快照恢复状态
   */
  restore(snapshot: T): void {
    this.setState(snapshot);
  }
}

/**
 * 创建全局状态管理器
 */
export function createGlobalState<T extends Record<string, any>>(initialState: T) {
  const manager = new StateManager(initialState);

  return {
    getState: () => manager.getState(),
    get: <K extends keyof T>(key: K) => manager.get(key),
    set: <K extends keyof T>(key: K, value: T[K]) => manager.set(key, value),
    setState: (updates: Partial<T>) => manager.setState(updates),
    batch: (updater: (state: T) => Partial<T>) => manager.batch(updater),
    subscribe: (listener: StateListener<T>) => manager.subscribe(listener),
    subscribeTo: <K extends keyof T>(key: K, listener: StateListener<T[K]>) =>
      manager.subscribeTo(key, listener),
    select: <R>(selector: StateSelector<T, R>) => manager.select(selector),
    reset: (initialState?: T) => manager.reset(initialState),
    snapshot: () => manager.snapshot(),
    restore: (snapshot: T) => manager.restore(snapshot),
  };
}

/**
 * Hook: 使用全局状态
 */
export function useGlobalState<T extends Record<string, any>>(
  manager: ReturnType<typeof createGlobalState<T>>
): [T, (updates: Partial<T>) => void] {
  const [state, setState] = useState(() => manager.getState());

  useEffect(() => {
    const unsubscribe = manager.subscribe((newState) => {
      setState({ ...newState });
    });

    return unsubscribe;
  }, [manager]);

  return [state, manager.setState];
}

/**
 * Hook: 使用状态中的特定键
 */
export function useStateKey<T extends Record<string, any>, K extends keyof T>(
  manager: ReturnType<typeof createGlobalState<T>>,
  key: K
): [T[K], (value: T[K]) => void] {
  const [value, setValue] = useState(() => manager.get(key));

  useEffect(() => {
    const unsubscribe = manager.subscribeTo(key, setValue);
    return unsubscribe;
  }, [manager, key]);

  return [value, (newValue: T[K]) => manager.set(key, newValue)];
}

import { useState, useEffect } from 'react';
