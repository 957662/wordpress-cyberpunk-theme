/**
 * Posts Data Service Tests
 * Unit tests for posts data fetching functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPosts, getPostBySlug, searchPosts, getLatestPosts } from '../posts';

// Mock global fetch
global.fetch = vi.fn();

describe('Posts Data Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getPosts', () => {
    it('should fetch posts with default parameters', async () => {
      const mockPosts = [
        {
          id: 1,
          title: { rendered: 'Test Post 1' },
          slug: 'test-post-1',
          content: { rendered: 'Test content' },
          excerpt: { rendered: 'Test excerpt' },
          date: '2024-01-01T00:00:00',
          modified: '2024-01-01T00:00:00',
          author: 1,
          featured_media: 0,
          comment_status: 'open',
          ping_status: 'open',
          sticky: false,
          template: '',
          format: 'standard',
          categories: [1],
          tags: [],
          _embedded: {
            author: [{ id: 1, name: 'Test Author', avatar_urls: {} }],
            'wp:featuredmedia': [],
            'wp:term': [[{ id: 1, name: 'Test Category', slug: 'test-category' }]],
          },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
        headers: {
          get: (name: string) => {
            const headers: Record<string, string> = {
              'x-wp-total': '1',
              'x-wp-totalpages': '1',
            };
            return headers[name] || null;
          },
        },
      });

      const result = await getPosts();

      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].title).toBe('Test Post 1');
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(getPosts()).rejects.toThrow('Network error');
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(getPosts()).rejects.toThrow('Failed to fetch posts');
    });
  });

  describe('getPostBySlug', () => {
    it('should fetch a single post by slug', async () => {
      const mockPost = {
        id: 1,
        title: { rendered: 'Test Post' },
        slug: 'test-post',
        content: { rendered: 'Test content' },
        excerpt: { rendered: 'Test excerpt' },
        date: '2024-01-01T00:00:00',
        modified: '2024-01-01T00:00:00',
        author: 1,
        featured_media: 0,
        comment_status: 'open',
        ping_status: 'open',
        sticky: false,
        template: '',
        format: 'standard',
        categories: [1],
        tags: [],
        _embedded: {
          author: [{ id: 1, name: 'Test Author', avatar_urls: {} }],
          'wp:featuredmedia': [],
          'wp:term': [[{ id: 1, name: 'Test Category', slug: 'test-category' }]],
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPost],
      });

      const result = await getPostBySlug('test-post');

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Test Post');
      expect(result?.slug).toBe('test-post');
    });

    it('should return null for non-existent posts', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getPostBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('searchPosts', () => {
    it('should search posts with query', async () => {
      const mockPosts = [
        {
          id: 1,
          title: { rendered: 'Search Result' },
          slug: 'search-result',
          content: { rendered: 'Content' },
          excerpt: { rendered: 'Excerpt' },
          date: '2024-01-01T00:00:00',
          modified: '2024-01-01T00:00:00',
          author: 1,
          featured_media: 0,
          comment_status: 'open',
          ping_status: 'open',
          sticky: false,
          template: '',
          format: 'standard',
          categories: [1],
          tags: [],
          _embedded: {
            author: [{ id: 1, name: 'Author', avatar_urls: {} }],
            'wp:featuredmedia': [],
            'wp:term': [[]],
          },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
        headers: {
          get: (name: string) => {
            const headers: Record<string, string> = {
              'x-wp-total': '1',
              'x-wp-totalpages': '1',
            };
            return headers[name] || null;
          },
        },
      });

      const result = await searchPosts('search query');

      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].title).toBe('Search Result');
    });
  });

  describe('getLatestPosts', () => {
    it('should fetch latest posts', async () => {
      const mockPosts = [
        {
          id: 1,
          title: { rendered: 'Latest Post' },
          slug: 'latest-post',
          content: { rendered: 'Content' },
          excerpt: { rendered: 'Excerpt' },
          date: '2024-01-01T00:00:00',
          modified: '2024-01-01T00:00:00',
          author: 1,
          featured_media: 0,
          comment_status: 'open',
          ping_status: 'open',
          sticky: false,
          template: '',
          format: 'standard',
          categories: [1],
          tags: [],
          _embedded: {
            author: [{ id: 1, name: 'Author', avatar_urls: {} }],
            'wp:featuredmedia': [],
            'wp:term': [[]],
          },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
        headers: {
          get: (name: string) => {
            const headers: Record<string, string> = {
              'x-wp-total': '1',
              'x-wp-totalpages': '1',
            };
            return headers[name] || null;
          },
        },
      });

      const result = await getLatestPosts(5);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Latest Post');
    });

    it('should return empty array on error', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Error'));

      const result = await getLatestPosts();

      expect(result).toEqual([]);
    });
  });
});
