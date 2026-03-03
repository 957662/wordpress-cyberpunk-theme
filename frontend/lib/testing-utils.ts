/**
 * CyberPress Platform - 测试工具库
 * ============================================================================
 * 功能: 单元测试、集成测试辅助工具
 * 版本: 1.0.0
 * 日期: 2026-03-03
 * ============================================================================
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { NextRouter } from 'next/router';

// ============================================================================
// Mock Router
// ============================================================================

export const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: true,
  isReady: true,
};

// ============================================================================
// Mock Auth Service
// ============================================================================

export const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'author' as const,
  status: 'active' as const,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

export const mockAuthService = {
  getCurrentUser: jest.fn(() => mockUser),
  getAccessToken: jest.fn(() => 'mock-access-token'),
  getRefreshToken: jest.fn(() => 'mock-refresh-token'),
  isAuthenticated: jest.fn(() => true),
  hasRole: jest.fn(() => true),
  hasPermission: jest.fn(() => true),
  login: jest.fn(),
  logout: jest.fn(),
  initialize: jest.fn(),
  destroy: jest.fn(),
  updateCurrentUser: jest.fn(),
  getAuthHeaders: jest.fn(() => ({ Authorization: 'Bearer mock-token' })),
};

// ============================================================================
// Custom Render Function
// ============================================================================

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// ============================================================================
// Test Data Generators
// ============================================================================

export function generateMockUser(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    username: 'testuser_' + Math.random().toString(36).substr(2, 5),
    email: `test${Math.random().toString(36).substr(2, 5)}@example.com`,
    fullName: 'Test User',
    role: 'author',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

export function generateMockPost(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: 'Test Post',
    slug: 'test-post-' + Math.random().toString(36).substr(2, 5),
    excerpt: 'Test excerpt',
    content: 'Test content',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ============================================================================
// Async Test Helpers
// ============================================================================

export async function wait(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForCondition(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Condition not met within ${timeout}ms`);
    }
    await wait(interval);
  }
}

// ============================================================================
// Setup Helpers
// ============================================================================

export function setupTestEnvironment() {
  // Mock localStorage
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });
}

export function teardownTestEnvironment() {
  jest.clearAllMocks();
}

export default {
  mockRouter,
  mockUser,
  mockAuthService,
  generateMockUser,
  generateMockPost,
  renderWithProviders,
  wait,
  waitForCondition,
  setupTestEnvironment,
  teardownTestEnvironment,
};
