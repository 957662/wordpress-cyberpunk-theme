/**
 * CyberPress Platform - 测试工具库
 * ============================================================================
 * 功能: 提供常用的测试辅助函数和模拟工具
 * 版本: 1.0.0
 * 日期: 2026-03-03
 * ============================================================================
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';

// ============================================================================
// 类型定义
// ============================================================================

interface TestProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  theme?: 'light' | 'dark' | 'system';
  router?: Partial<NextRouter>;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  theme?: 'light' | 'dark' | 'system';
  router?: Partial<NextRouter>;
}

// ============================================================================
// 测试提供者包装器
// ============================================================================

/**
 * 创建测试用的 QueryClient
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
      error: () => {}, // 静默错误，避免测试输出混乱
    },
  });
}

/**
 * 测试提供者组合
 */
export function TestProviders({
  children,
  queryClient,
  theme = 'light',
  router,
}: TestProvidersProps) {
  const client = queryClient || createTestQueryClient();

  // 模拟路由
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    ...router,
  };

  // 使用 jest.mock 来模拟 useRouter
  jest.mock('next/router', () => ({
    useRouter: () => mockRouter,
  }));

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// ============================================================================
// 自定义渲染函数
// ============================================================================

/**
 * 自定义渲染函数（包含所有提供者）
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient,
    theme = 'light',
    router,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestProviders queryClient={queryClient} theme={theme} router={router}>
      {children}
    </TestProviders>
  );

  return {
    ...render(ui, { wrapper, ...renderOptions }),
  };
}

/**
 * 渲染带主题的组件
 */
export function renderWithTheme(
  ui: ReactElement,
  theme: 'light' | 'dark' | 'system' = 'light'
) {
  return renderWithProviders(ui, { theme });
}

// ============================================================================
// 模拟数据生成器
// ============================================================================

/**
 * 生成随机用户
 */
export function generateMockUser(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    username: 'testuser',
    email: 'test@example.com',
    fullName: 'Test User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
    role: 'subscriber',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * 生成随机文章
 */
export function generateMockPost(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: 'Test Post Title',
    slug: 'test-post-title',
    excerpt: 'This is a test post excerpt.',
    content: 'This is the full content of the test post.',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    authorId: Math.random().toString(36).substr(2, 9),
    categoryId: Math.random().toString(36).substr(2, 9),
    status: 'published',
    postType: 'post',
    commentStatus: 'open',
    featured: false,
    sticky: false,
    viewCount: 0,
    likeCount: 0,
    metaTitle: 'Test Post Meta Title',
    metaDescription: 'Test post meta description',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * 生成随机评论
 */
export function generateMockComment(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    postId: Math.random().toString(36).substr(2, 9),
    authorId: Math.random().toString(36).substr(2, 9),
    authorName: 'Test Commenter',
    authorEmail: 'commenter@example.com',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=commenter',
    content: 'This is a test comment.',
    parentId: null,
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likeCount: 0,
    isLiked: false,
    replies: [],
    ...overrides,
  };
}

/**
 * 生成随机分类
 */
export function generateMockCategory(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Test Category',
    slug: 'test-category',
    description: 'A test category description.',
    icon: '📁',
    displayOrder: 0,
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * 生成随机标签
 */
export function generateMockTag(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: 'test-tag',
    slug: 'test-tag',
    description: 'A test tag.',
    color: '#00f0ff',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * 生成随机分页响应
 */
export function generateMockPaginatedResponse<T>(items: T[], total?: number) {
  return {
    data: items,
    total: total || items.length,
    page: 1,
    perPage: 10,
    totalPages: Math.ceil((total || items.length) / 10),
    hasNext: false,
    hasPrev: false,
  };
}

// ============================================================================
// API 模拟工具
// ============================================================================

/**
 * 模拟成功响应
 */
export function mockSuccessResponse<T>(data: T, status = 200) {
  return {
    ok: true,
    status,
    statusText: 'OK',
    json: async () => data,
  } as Response;
}

/**
 * 模拟错误响应
 */
export function mockErrorResponse(message: string, status = 400) {
  return {
    ok: false,
    status,
    statusText: 'Error',
    json: async () => ({ message, status }),
  } as Response;
}

/**
 * 模拟 fetch API
 */
export function mockFetch(implementation: (url: string, options?: RequestInit) => Promise<Response>) {
  global.fetch = jest.fn(implementation);
}

// ============================================================================
// 异步测试工具
// ============================================================================

/**
 * 等待所有异步操作完成
 */
export async function waitForAsync() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * 等待指定时间
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 等待元素出现在 DOM 中
 */
export async function waitForElement(
  callback: () => HTMLElement | null,
  timeout = 1000
): Promise<HTMLElement> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = callback();
    if (element) {
      return element;
    }
    await delay(50);
  }

  throw new Error(`Element not found within ${timeout}ms`);
}

// ============================================================================
// 事件模拟工具
// ============================================================================

/**
 * 模拟输入事件
 */
export function simulateInput(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string
) {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * 模拟点击事件
 */
export function simulateClick(element: HTMLElement) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

/**
 * 模拟表单提交
 */
export function simulateSubmit(form: HTMLFormElement) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

/**
 * 模拟键盘事件
 */
export function simulateKeyboard(
  element: HTMLElement,
  key: string,
  code?: string
) {
  const event = new KeyboardEvent('keydown', {
    key,
    code: code || key,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}

// ============================================================================
// 断言工具
// ============================================================================

/**
 * 检查元素是否可见
 */
export function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

/**
 * 检查元素是否被禁用
 */
export function isDisabled(element: HTMLInputElement | HTMLButtonElement): boolean {
  return element.disabled || element.getAttribute('aria-disabled') === 'true';
}

/**
 * 获取元素的文本内容（包括子元素）
 */
export function getTextContent(element: HTMLElement): string {
  return element.textContent || '';
}

// ============================================================================
// 导出
// ============================================================================

export * from '@testing-library/react';
export { renderWithProviders as render };
