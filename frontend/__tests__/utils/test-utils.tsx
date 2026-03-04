/**
 * 测试工具函数
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// 创建测试用的 QueryClient
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// 测试包装器组件
interface AllTheProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function AllTheProviders({
  children,
  queryClient = createTestQueryClient(),
}: AllTheProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

// 自定义渲染函数
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClient?: QueryClient;
  }
) {
  const { queryClient, ...renderOptions } = options || {};

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AllTheProviders queryClient={queryClient}>
        {children}
      </AllTheProviders>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock localStorage
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    getAll: () => store,
  };
})();

// Mock IntersectionObserver
export class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    public readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    if (options?.root) this.root = options.root;
    if (options?.rootMargin) this.rootMargin = options.rootMargin;
    if (options?.threshold) this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold];
  }

  disconnect() {
    // Mock implementation
  }

  observe(target: Element) {
    // Mock implementation
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve(target: Element) {
    // Mock implementation
  }
}

// Mock ResizeObserver
export class MockResizeObserver implements ResizeObserver {
  constructor(public readonly callback: ResizeObserverCallback) {}

  disconnect() {
    // Mock implementation
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    // Mock implementation
  }

  unobserve(target: Element) {
    // Mock implementation
  }
}

// Mock MutationObserver
export class MockMutationObserver implements MutationObserver {
  constructor(public readonly callback: MutationCallback) {}

  disconnect() {
    // Mock implementation
  }

  observe(target: Node, options?: MutationObserverInit) {
    // Mock implementation
  }

  takeRecords(): MutationRecord[] {
    return [];
  }
}

// 等待元素出现
export async function waitForElement<T>(
  callback: () => T,
  options?: { timeout?: number; interval?: number }
): Promise<T> {
  const { timeout = 3000, interval = 50 } = options || {};
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = callback();
      if (result != null) {
        return result;
      }
    } catch (error) {
      // 继续等待
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`Element not found within ${timeout}ms`);
}

// 等待加载状态结束
export async function waitForLoadingToFinish(container: HTMLElement) {
  const loaders = container.querySelectorAll('[data-loading="true"]');
  for (const loader of loaders) {
    await waitForElement(() => {
      const isLoading = loader.getAttribute('data-loading');
      return isLoading === 'false' || isLoading === null;
    });
  }
}

// 模拟用户延迟输入
export async function simulateUserType(
  element: HTMLInputElement | HTMLTextAreaElement,
  text: string,
  delay = 50
) {
  for (const char of text) {
    element.value += char;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// 模拟网络延迟
export async function simulateNetworkDelay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 创建 mock 服务器响应
export function createMockResponse<T>(data: T, delay = 0): Promise<Response> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
    }, delay);
  });
}

// 创建 mock 错误响应
export function createMockErrorResponse(
  message: string,
  status = 400
): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

// Mock window.matchMedia
export function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// 清理所有 mocks
export function cleanupMocks() {
  jest.clearAllMocks();
  jest.clearAllTimers();
  mockLocalStorage.clear();
}

// 设置全局测试环境
export function setupTestEnvironment() {
  // Setup IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver as any;

  // Setup ResizeObserver
  global.ResizeObserver = MockResizeObserver as any;

  // Setup MutationObserver
  global.MutationObserver = MockMutationObserver as any;

  // Setup localStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  // Setup scrollTo
  window.scrollTo = jest.fn();
}

// 重置测试环境
export function resetTestEnvironment() {
  cleanupMocks();

  // Reset timers
  jest.useRealTimers();

  // Reset fetch
  global.fetch = undefined as any;
}

// 导出常用的 mock 函数
export const mocks = {
  localStorage: mockLocalStorage,
  IntersectionObserver: MockIntersectionObserver,
  ResizeObserver: MockResizeObserver,
  MutationObserver: MockMutationObserver,
};

// 导出类型
export type TestRenderOptions = typeof renderWithProviders;
