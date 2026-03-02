/**
 * 测试工具函数
 * 用于单元测试和集成测试
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * 自定义渲染选项
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
  queryClient?: QueryClient;
  withRouter?: boolean;
  withTheme?: boolean;
}

/**
 * 创建测试用 QueryClient
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // 禁用测试中的错误日志
    },
  });
}

/**
 * 包装组件的提供者
 */
export function AllTheProviders({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient?: QueryClient;
}): ReactElement {
  const testQueryClient = queryClient || createTestQueryClient();

  return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>;
}

/**
 * 自定义渲染函数
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }): ReactElement {
    return <AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * 等待元素出现
 */
export async function waitForElementToBeRemoved(
  callback: () => HTMLElement | null
): Promise<void> {
  const { waitForElementToBeRemoved: waitForRemoved } = require('@testing-library/react');
  return waitForRemoved(callback);
}

/**
 * 模拟延迟
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 模拟 API 响应
 */
export function mockApiResponse<T>(data: T, delay = 0): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
 * 模拟 API 错误
 */
export function mockApiError(message: string, status = 500, delay = 0): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(
      () =>
        reject({
          message,
          status,
        }),
      delay
    );
  });
}

/**
 * 创建模拟路由器
 */
export function createMockRouter(router: {
  pathname?: string;
  query?: Record<string, string>;
  asPath?: string;
  push?: jest.Mock;
  replace?: jest.Mock;
  reload?: jest.Mock;
  back?: jest.Mock;
  prefetch?: jest.Mock;
}) {
  return {
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    ...router,
  };
}

/**
 * 模拟 IntersectionObserver
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });

  window.IntersectionObserver = mockIntersectionObserver as any;

  return mockIntersectionObserver;
}

/**
 * 模拟 ResizeObserver
 */
export function mockResizeObserver() {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });

  window.ResizeObserver = mockResizeObserver as any;

  return mockResizeObserver;
}

/**
 * 模拟 MutationObserver
 */
export function mockMutationObserver() {
  const mockMutationObserver = jest.fn();
  mockMutationObserver.mockReturnValue({
    observe: () => null,
    disconnect: () => null,
    takeRecords: () => [],
  });

  window.MutationObserver = mockMutationObserver as any;

  return mockMutationObserver;
}

/**
 * 模拟 matchMedia
 */
export function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
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

/**
 * 模拟 localStorage
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };
}

/**
 * 模拟 sessionStorage
 */
export function mockSessionStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };
}

/**
 * 创建模拟文件
 */
export function createMockFile(
  name: string,
  content: string,
  type = 'text/plain'
): File {
  return new File([content], name, { type });
}

/**
 * 创建模拟图片文件
 */
export function createMockImageFile(
  name = 'test.jpg',
  size = 1024
): File {
  const buffer = new ArrayBuffer(size);
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  return new File([blob], name, { type: 'image/jpeg' });
}

/**
 * 模拟滚动到元素
 */
export function mockScrollIntoView() {
  Element.prototype.scrollIntoView = jest.fn();
}

/**
 * 模拟 getBoundingClientRect
 */
export function mockGetBoundingClientRect(rect: Partial<DOMRect> = {}) {
  const defaultRect: DOMRect = {
    x: 0,
    y: 0,
    width: 300,
    height: 150,
    top: 0,
    left: 0,
    bottom: 150,
    right: 300,
    toJSON: () => ({}),
    ...rect,
  };

  Element.prototype.getBoundingClientRect = jest.fn(() => defaultRect);
}

/**
 * 模拟用户事件
 */
export function mockUserEvent() {
  const userEvent = require('@testing-library/user-event').default;
  return userEvent.setup();
}

/**
 * 清除所有模拟
 */
export function clearAllMocks() {
  jest.clearAllMocks();
  jest.clearAllTimers();
}

/**
 * 模拟窗口大小
 */
export function mockWindowSize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  window.dispatchEvent(new Event('resize'));
}

/**
 * 模拟网络状态
 */
export function mockNetworkStatus(
  online: boolean,
  rtt?: number,
  downlink?: number
) {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: online,
  });

  const connection = {
    effectiveType: '4g',
    rtt: rtt || 100,
    downlink: downlink || 10,
    saveData: false,
  };

  Object.defineProperty(navigator, 'connection', {
    writable: true,
    value: connection,
  });

  window.dispatchEvent(new Event(online ? 'online' : 'offline'));
}

/**
 * 模拟地理位置
 */
export function mockGeolocation(coords: {
  latitude: number;
  longitude: number;
}) {
  const mockGeolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
      success({
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      })
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  };

  Object.defineProperty(navigator, 'geolocation', {
    writable: true,
    value: mockGeolocation,
  });

  return mockGeolocation;
}

/**
 * 模拟剪贴板 API
 */
export function mockClipboard() {
  const mockClipboard = {
    writeText: jest.fn(),
    readText: jest.fn(),
  };

  Object.assign(navigator, { clipboard: mockClipboard });

  return mockClipboard;
}

/**
 * 创建模拟函数，返回指定值
 */
export function createMockFunction<T>(returnValue: T): () => T {
  return jest.fn(() => returnValue);
}

/**
 * 创建异步模拟函数
 */
export function createAsyncMockFunction<T>(
  returnValue: T,
  delay = 0
): () => Promise<T> {
  return jest.fn(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(returnValue), delay);
      })
  );
}

/**
 * 测试快照辅助函数
 */
export function createSnapshotMatcher(component: React.ReactElement) {
  const { container } = render(component);
  return container;
}

/**
 * 模拟 next/image
 */
export function mockNextImage() {
  jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      return <img {...props} />;
    },
  }));
}

/**
 * 模拟 next/link
 */
export function mockNextLink() {
  jest.mock('next/link', () => ({
    __esModule: true,
    default: ({
      children,
      href,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  }));
}

/**
 * 模拟 next/router
 */
export function mockNextRouter() {
  const mockRouter = {
    pathname: '/',
    asPath: '/',
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  };

  jest.mock('next/router', () => ({
    useRouter: () => mockRouter,
  }));

  return mockRouter;
}

/**
 * 模拟 next/navigation
 */
export function mockNextNavigation() {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockPrefetch = jest.fn();

  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: mockPush,
      replace: mockReplace,
      prefetch: mockPrefetch,
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }));

  return { push: mockPush, replace: mockReplace, prefetch: mockPrefetch };
}
