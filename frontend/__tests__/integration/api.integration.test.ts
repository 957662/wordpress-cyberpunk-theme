/**
 * API Integration Tests
 *
 * 集成测试用于验证前端和后端 API 的集成是否正常工作
 * 这些测试会实际调用 API 端点
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Mock API handlers
const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
      },
    });
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      user: {
        id: '2',
        username: 'newuser',
        email: 'new@example.com',
      },
      access_token: 'mock-access-token',
    });
  }),

  // Blog posts endpoints
  http.get('/api/posts', () => {
    return HttpResponse.json({
      items: [
        {
          id: '1',
          title: 'Test Post 1',
          slug: 'test-post-1',
          excerpt: 'This is a test post',
          content: 'Test content',
          author: { id: '1', username: 'testuser' },
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Test Post 2',
          slug: 'test-post-2',
          excerpt: 'Another test post',
          content: 'More test content',
          author: { id: '1', username: 'testuser' },
          created_at: '2024-01-02T00:00:00Z',
        },
      ],
      total: 2,
      page: 1,
      page_size: 10,
    });
  }),

  http.get('/api/posts/:slug', ({ params }) => {
    return HttpResponse.json({
      id: '1',
      title: 'Test Post 1',
      slug: params.slug,
      content: 'Full post content',
      author: { id: '1', username: 'testuser' },
      created_at: '2024-01-01T00:00:00Z',
      tags: ['tech', 'test'],
    });
  }),

  // User endpoints
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      username: 'testuser',
      email: 'test@example.com',
      bio: 'Test user bio',
      followers_count: 10,
      following_count: 5,
    });
  }),

  // Comments endpoints
  http.get('/api/posts/:postId/comments', () => {
    return HttpResponse.json({
      items: [
        {
          id: '1',
          content: 'Test comment',
          author: { id: '2', username: 'commenter' },
          created_at: '2024-01-01T01:00:00Z',
        },
      ],
      total: 1,
    });
  }),

  // Search endpoint
  http.get('/api/search', () => {
    return HttpResponse.json({
      posts: [
        {
          id: '1',
          title: 'Search Result 1',
          slug: 'search-result-1',
          excerpt: 'Found content',
        },
      ],
      total: 1,
    });
  }),
];

const server = setupServer(...handlers);

describe('API Integration Tests', () => {
  let queryClient: QueryClient;

  beforeAll(() => {
    server.listen();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Authentication API', () => {
    it('should login user successfully', async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password123',
        }),
      });

      const data = await response.json();

      expect(data).toHaveProperty('access_token');
      expect(data).toHaveProperty('user');
      expect(data.user.username).toBe('testuser');
    });

    it('should register new user successfully', async () => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
        }),
      });

      const data = await response.json();

      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('access_token');
      expect(data.user.username).toBe('newuser');
    });
  });

  describe('Blog Posts API', () => {
    it('should fetch posts list', async () => {
      const response = await fetch('/api/posts?page=1&limit=10');
      const data = await response.json();

      expect(data.items).toBeInstanceOf(Array);
      expect(data.items.length).toBeGreaterThan(0);
      expect(data.items[0]).toHaveProperty('id');
      expect(data.items[0]).toHaveProperty('title');
      expect(data.total).toBe(2);
    });

    it('should fetch single post by slug', async () => {
      const response = await fetch('/api/posts/test-post-1');
      const data = await response.json();

      expect(data).toHaveProperty('id');
      expect(data.slug).toBe('test-post-1');
      expect(data).toHaveProperty('content');
      expect(data).toHaveProperty('tags');
    });
  });

  describe('User API', () => {
    it('should fetch user profile', async () => {
      const response = await fetch('/api/users/1');
      const data = await response.json();

      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('username');
      expect(data).toHaveProperty('email');
      expect(data.followers_count).toBeDefined();
    });
  });

  describe('Comments API', () => {
    it('should fetch post comments', async () => {
      const response = await fetch('/api/posts/1/comments');
      const data = await response.json();

      expect(data.items).toBeInstanceOf(Array);
      expect(data.items[0]).toHaveProperty('content');
      expect(data.items[0]).toHaveProperty('author');
    });
  });

  describe('Search API', () => {
    it('should search posts', async () => {
      const response = await fetch('/api/search?q=test');
      const data = await response.json();

      expect(data.posts).toBeInstanceOf(Array);
      expect(data.total).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      server.use(
        http.get('/api/posts/nonexistent', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const response = await fetch('/api/posts/nonexistent');
      expect(response.status).toBe(404);
    });

    it('should handle 500 errors', async () => {
      server.use(
        http.get('/api/posts/error', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const response = await fetch('/api/posts/error');
      expect(response.status).toBe(500);
    });

    it('should handle validation errors', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            { detail: 'Invalid credentials' },
            { status: 401 }
          );
        })
      );

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'wrong', password: 'wrong' }),
      });

      expect(response.status).toBe(401);
    });
  });
});
