/**
 * 数据层测试文件
 *
 * 运行测试:
 * npm test lib/data/__tests__/posts.test.ts
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  getPosts,
  getPostBySlug,
  getAllCategories,
  getAllTags,
  adaptWordPressPost,
  isWordPressPost,
} from '../index';

// Mock WordPress API responses
const mockWordPressPost = {
  id: 1,
  date: '2026-03-07T10:00:00',
  slug: 'test-post',
  title: { rendered: 'Test Post' },
  content: { rendered: '<p>This is a test post.</p>' },
  excerpt: { rendered: '<p>This is a test excerpt.</p>' },
  author: 1,
  featured_media: 0,
  categories: [1],
  tags: [1, 2],
  _embedded: {
    author: [
      {
        id: 1,
        name: 'Test Author',
        slug: 'test-author',
        avatar_urls: {
          '96': 'https://example.com/avatar.jpg',
        },
      },
    ],
    'wp:term': [
      [
        {
          id: 1,
          name: 'Test Category',
          slug: 'test-category',
          taxonomy: 'category',
        },
      ],
      [
        {
          id: 1,
          name: 'Test Tag',
          slug: 'test-tag',
          taxonomy: 'post_tag',
        },
        {
          id: 2,
          name: 'Another Tag',
          slug: 'another-tag',
          taxonomy: 'post_tag',
        },
      ],
    ],
  },
};

const mockCategory = {
  id: 1,
  name: 'Test Category',
  slug: 'test-category',
  description: 'A test category',
  count: 10,
  parent: 0,
};

const mockTag = {
  id: 1,
  name: 'Test Tag',
  slug: 'test-tag',
  count: 5,
};

describe('数据适配器测试', () => {
  describe('isWordPressPost', () => {
    it('应该正确识别 WordPress 原始格式', () => {
      expect(isWordPressPost(mockWordPressPost)).toBe(true);
    });

    it('应该拒绝非 WordPress 格式', () => {
      expect(isWordPressPost({ id: 1, title: 'Test' })).toBe(false);
      expect(isWordPressPost(null)).toBe(false);
      expect(isWordPressPost(undefined)).toBe(false);
    });
  });

  describe('adaptWordPressPost', () => {
    it('应该正确转换 WordPress 原始格式为 BlogPost', () => {
      const adapted = adaptWordPressPost(mockWordPressPost);

      expect(adapted).toEqual({
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        excerpt: 'This is a test excerpt.',
        content: '<p>This is a test post.</p>',
        author: {
          id: 1,
          name: 'Test Author',
          avatar: 'https://example.com/avatar.jpg',
        },
        category: {
          id: 1,
          name: 'Test Category',
          slug: 'test-category',
        },
        tags: [
          { id: 1, name: 'Test Tag', slug: 'test-tag' },
          { id: 2, name: 'Another Tag', slug: 'another-tag' },
        ],
        featuredImage: undefined,
        publishedAt: '2026-03-07T10:00:00',
        updatedAt: '2026-03-07T10:00:00',
        status: 'published',
        views: 0,
        likes: 0,
        comments: 0,
        readingTime: 1,
      });
    });

    it('应该正确计算阅读时间', () => {
      const longPost = {
        ...mockWordPressPost,
        content: { rendered: '<p>' + 'word '.repeat(400) + '</p>' },
      };

      const adapted = adaptWordPressPost(longPost);
      expect(adapted.readingTime).toBe(2);
    });

    it('应该处理缺少嵌入式数据的情况', () => {
      const postWithoutEmbedded = {
        ...mockWordPressPost,
        _embedded: undefined,
      };

      const adapted = adaptWordPressPost(postWithoutEmbedded);
      expect(adapted.author.name).toBe('Unknown Author');
      expect(adapted.category).toBeUndefined();
      expect(adapted.tags).toEqual([]);
    });
  });
});

describe('数据获取函数测试', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('应该成功获取文章列表', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [mockWordPressPost],
        headers: {
          get: (name: string) => {
            if (name === 'X-WP-Total') return '1';
            if (name === 'X-WP-TotalPages') return '1';
            return null;
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getPosts({ page: 1, perPage: 10 });

      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].title).toBe('Test Post');
      expect(result.pagination.totalItems).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('应该处理 API 错误', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(getPosts()).rejects.toThrow();
    });
  });

  describe('getPostBySlug', () => {
    it('应该成功获取单篇文章', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [mockWordPressPost],
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const post = await getPostBySlug({ slug: 'test-post' });

      expect(post).not.toBeNull();
      expect(post?.slug).toBe('test-post');
    });

    it('应该处理文章不存在的情况', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const post = await getPostBySlug({ slug: 'non-existent' });

      expect(post).toBeNull();
    });
  });

  describe('getAllCategories', () => {
    it('应该成功获取所有分类', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [mockCategory],
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const categories = await getAllCategories();

      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Test Category');
    });
  });

  describe('getAllTags', () => {
    it('应该成功获取所有标签', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [mockTag],
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const tags = await getAllTags();

      expect(tags).toHaveLength(1);
      expect(tags[0].name).toBe('Test Tag');
    });
  });
});

describe('边界情况测试', () => {
  it('应该处理空文章列表', () => {
    const adapted = adaptWordPressPosts([]);
    expect(adapted).toEqual([]);
  });

  it('应该处理缺少必需字段的文章', () => {
    const incompletePost = {
      id: 1,
      title: { rendered: 'Test' },
      content: { rendered: '' },
      excerpt: { rendered: '' },
      author: 1,
      categories: [],
      tags: [],
      featured_media: 0,
      date: '',
      slug: '',
      status: '',
      modified: '',
      _embedded: undefined,
    };

    const adapted = adaptWordPressPost(incompletePost);
    expect(adapted).toBeDefined();
    expect(adapted.readingTime).toBe(1); // 最小值
  });
});
