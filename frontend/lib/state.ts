'use client';

/**
 * 状态管理库
 * 提供简单、强大的状态管理功能
 */

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from 'react';

// 类型定义
export type StateListener<T> = (state: T, prevState: T) => void;
export type StateSelector<T, R> = (state: T) => R;
export type PartialState<T> = Partial<T> | ((state: T) => Partial<T>);

// 状态存储
export class Store<T extends Record<string, any>> {
  private state: T;
  private listeners: Set<StateListener<T>> = new Set();
  private middleware: Array<(state: T, prevState: T) => T> = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  /**
   * 获取当前状态
   */
  getState(): T {
    return this.state;
  }

  /**
   * 更新状态
   */
  setState(partialState: PartialState<T>): void {
    const prevState = { ...this.state };
    const newState =
      typeof partialState === 'function'
        ? { ...this.state, ...(partialState as (state: T) => Partial<T>)(this.state) }
        : { ...this.state, ...partialState };

    // 应用中间件
    let finalState = newState;
    for (const middleware of this.middleware) {
      finalState = middleware(finalState, prevState) as T;
    }

    this.state = finalState;

    // 通知监听器
    this.listeners.forEach((listener) => {
      listener(this.state, prevState);
    });
  }

  /**
   * 订阅状态变化
   */
  subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 添加中间件
   */
  use(middleware: (state: T, prevState: T) => T): void {
    this.middleware.push(middleware);
  }

  /**
   * 重置状态
   */
  reset(initialState?: T): void {
    const prevState = this.state;
    this.state = initialState || ({} as T);

    this.listeners.forEach((listener) => {
      listener(this.state, prevState);
    });
  }
}

/**
 * Hook: 创建状态存储
 */
export function createStore<T extends Record<string, any>>(initialState: T): Store<T> {
  return new Store(initialState);
}

/**
 * Hook: 使用状态存储
 */
export function useStore<T extends Record<string, any>>(
  store: Store<T>
): [T, (partialState: PartialState<T>) => void] {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });

    return unsubscribe;
  }, [store]);

  return [store.getState(), store.setState.bind(store)];
}

/**
 * Hook: 使用状态选择器
 */
export function useStoreSelector<T extends Record<string, any>, R>(
  store: Store<T>,
  selector: StateSelector<T, R>
): R {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const selectorRef = useRef(selector);
  const selectedStateRef = useRef(selector(store.getState()));

  useLayoutEffect(() => {
    selectorRef.current = selector;
  });

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      const newSelectedState = selectorRef.current(state);

      if (newSelectedState !== selectedStateRef.current) {
        selectedStateRef.current = newSelectedState;
        forceUpdate();
      }
    });

    return unsubscribe;
  }, [store]);

  return selectedStateRef.current;
}

/**
 * Hook: 创建全局状态
 */
export function useGlobalState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const storeRef = useRef<Store<{ value: T }>>();

  if (!storeRef.current) {
    // 尝试从 sessionStorage 恢复
    const savedState = typeof window !== 'undefined'
      ? sessionStorage.getItem(key)
      : null;

    const initialState = savedState
      ? { value: JSON.parse(savedState) as T }
      : { value: initialValue };

    storeRef.current = new Store(initialState);

    // 添加持久化中间件
    storeRef.current.use((state) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(state.value));
      }
      return state;
    });
  }

  const [state, setState] = useStore(storeRef.current);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState({
        value: typeof value === 'function' ? (value as (prev: T) => T)(state.value) : value,
      });
    },
    [setState, state.value]
  );

  return [state.value, setValue];
}

/**
 * Hook: 创建本地状态（带 localStorage 持久化）
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const storeRef = useRef<Store<{ value: T }>>();

  if (!storeRef.current) {
    // 尝试从 localStorage 恢复
    const savedState = typeof window !== 'undefined'
      ? localStorage.getItem(key)
      : null;

    const initialState = savedState
      ? { value: JSON.parse(savedState) as T }
      : { value: initialValue };

    storeRef.current = new Store(initialState);

    // 添加持久化中间件
    storeRef.current.use((state) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(state.value));
      }
      return state;
    });
  }

  const [state, setState] = useStore(storeRef.current);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState({
        value: typeof value === 'function' ? (value as (prev: T) => T)(state.value) : value,
      });
    },
    [setState, state.value]
  );

  return [state.value, setValue];
}

/**
 * Hook: 异步状态管理
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsyncState<T>(
  key: string,
  asyncFunction: () => Promise<T>,
  initialData?: T
): AsyncState<T> & { refetch: () => Promise<void> } {
  const storeRef = useRef<Store<AsyncState<T>>>();

  if (!storeRef.current) {
    storeRef.current = new Store<AsyncState<T>>({
      data: initialData || null,
      loading: false,
      error: null,
    });
  }

  const [state, setState] = useStore(storeRef.current);

  const execute = useCallback(async () => {
    setState({ loading: true, error: null, data: state.data });

    try {
      const data = await asyncFunction();
      setState({ loading: false, error: null, data });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        data: null,
      });
    }
  }, [asyncFunction, setState, state.data]);

  useEffect(() => {
    execute();
  }, [key]);

  return {
    ...state,
    refetch: execute,
  };
}

/**
 * Hook: 表单状态管理
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
}

export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) {
  const storeRef = useRef<Store<FormState<T>>>();

  if (!storeRef.current) {
    storeRef.current = new Store<FormState<T>>({
      values: initialValues,
      errors: {},
      touched: {},
    });
  }

  const [state, setState] = useStore(storeRef.current);

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      const newValues = { ...state.values, [field]: value };
      const newTouched = { ...state.touched, [field]: true };
      const newErrors = validate ? validate(newValues) : {};

      setState({
        values: newValues,
        touched: newTouched,
        errors: newErrors,
      });
    },
    [setState, state.values, state.touched, validate]
  );

  const setError = useCallback(
    <K extends keyof T>(field: K, error: string) => {
      setState({
        ...state,
        errors: { ...state.errors, [field]: error },
      });
    },
    [setState, state]
  );

  const setTouched = useCallback(
    <K extends keyof T>(field: K) => {
      setState({
        ...state,
        touched: { ...state.touched, [field]: true },
      });
    },
    [setState, state]
  );

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
    });
  }, [setState, initialValues]);

  const validateForm = useCallback(() => {
    const errors = validate ? validate(state.values) : {};
    setState({ ...state, errors });
    return Object.keys(errors).length === 0;
  }, [setState, state, validate]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    setValue,
    setError,
    setTouched,
    reset,
    validateForm,
    isValid: Object.keys(state.errors).length === 0,
  };
}

/**
 * Hook: 历史记录（撤销/重做）
 */
export function useHistory<T>(initialState: T, maxSize: number = 50) {
  const storeRef = useRef<Store<{ present: T; past: T[]; future: T[] }>>();

  if (!storeRef.current) {
    storeRef.current = new Store({
      present: initialState,
      past: [],
      future: [],
    });
  }

  const [state, setState] = useStore(storeRef.current);

  const setPresent = useCallback(
    (newPresent: T) => {
      setState({
        present: newPresent,
        past: [...state.past.slice(-maxSize), state.present],
        future: [],
      });
    },
    [setState, state.past, state.present, maxSize]
  );

  const undo = useCallback(() => {
    if (state.past.length === 0) return;

    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);

    setState({
      present: previous,
      past: newPast,
      future: [state.present, ...state.future],
    });
  }, [setState, state]);

  const redo = useCallback(() => {
    if (state.future.length === 0) return;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    setState({
      present: next,
      past: [...state.past, state.present],
      future: newFuture,
    });
  }, [setState, state]);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return {
    present: state.present,
    setPresent,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

export default createStore;
