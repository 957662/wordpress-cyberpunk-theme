/**
 * SEO 工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  generateMetadata,
  articleMetadata,
  categoryMetadata,
  tagMetadata,
  authorMetadata,
  generateStructuredData,
} from '@/lib/seo/metadata';

describe('SEO Metadata Utils', () => {
  describe('generateMetadata', () => {
    it('应该生成基础元数据', () => {
      const metadata = generateMetadata({
        title: 'Test Page',
        description: 'Test description',
      });

      expect(metadata.title).toContain('Test Page');
      expect(metadata.description).toBe('Test description');
    });

    it('应该包含 OpenGraph 元数据', () => {
      const metadata = generateMetadata({
        title: 'Test',
        description: 'Test',
        image: '/test.jpg',
      });

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.images).toBeDefined();
    });

    it('应该包含 Twitter Card 元数据', () => {
      const metadata = generateMetadata({
        title: 'Test',
        description: 'Test',
      });

      expect(metadata.twitter).toBeDefined();
      expect(metadata.twitter?.card).toBe('summary_large_image');
    });

    it('应该处理 noIndex 选项', () => {
      const metadata = generateMetadata({
        title: 'Test',
        description: 'Test',
        noIndex: true,
      });

      expect(metadata.robots?.index).toBe(false);
    });

    it('应该设置 canonical URL', () => {
      const canonical = 'https://example.com/test';
      const metadata = generateMetadata({
        title: 'Test',
        description: 'Test',
        canonical,
      });

      expect(metadata.alternates?.canonical).toBe(canonical);
    });
  });

  describe('articleMetadata', () => {
    it('应该为文章生成正确的元数据', () => {
      const article = {
        title: 'Test Article',
        excerpt: 'Test excerpt',
        slug: 'test-article',
        author: 'John Doe',
        publishedAt: '2026-03-05T00:00:00Z',
        tags: ['tag1', 'tag2'],
        category: 'Technology',
      };

      const metadata = articleMetadata(article);

      expect(metadata.title).toContain('Test Article');
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.publishedTime).toBe(article.publishedAt);
    });

    it('应该包含文章分类信息', () => {
      const article = {
        title: 'Test',
        excerpt: 'Test',
        slug: 'test',
        category: 'Technology',
        tags: [],
      };

      const metadata = articleMetadata(article);

      expect(metadata.openGraph?.section).toBe('Technology');
    });
  });

  describe('categoryMetadata', () => {
    it('应该为分类页面生成正确的元数据', () => {
      const category = {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech articles',
      };

      const metadata = categoryMetadata(category);

      expect(metadata.title).toContain('Technology');
      expect(metadata.canonical).toBe('/blog/category/technology');
    });
  });

  describe('tagMetadata', () => {
    it('应该为标签页面生成正确的元数据', () => {
      const tag = {
        name: 'JavaScript',
        slug: 'javascript',
      };

      const metadata = tagMetadata(tag);

      expect(metadata.title).toContain('JavaScript');
      expect(metadata.canonical).toBe('/blog/tag/javascript');
    });
  });

  describe('authorMetadata', () => {
    it('应该为作者页面生成正确的元数据', () => {
      const author = {
        name: 'John Doe',
        slug: 'john-doe',
        bio: 'Software developer',
      };

      const metadata = authorMetadata(author);

      expect(metadata.title).toBe('John Doe');
      expect(metadata.openGraph?.type).toBe('profile');
      expect(metadata.description).toContain('Software developer');
    });
  });

  describe('generateStructuredData', () => {
    it('应该生成 Article 结构化数据', () => {
      const article = {
        title: 'Test Article',
        description: 'Test description',
        author: 'John Doe',
        publishedAt: '2026-03-05T00:00:00Z',
        url: 'https://example.com/article',
      };

      const data = generateStructuredData('Article', article);

      expect(data['@type']).toBe('Article');
      expect(data.headline).toBe('Test Article');
      expect(data.author['@type']).toBe('Person');
    });

    it('应该生成 WebSite 结构化数据', () => {
      const data = generateStructuredData('WebSite', {});

      expect(data['@type']).toBe('WebSite');
      expect(data.name).toBe('CyberPress');
    });

    it('应该生成 Organization 结构化数据', () => {
      const data = generateStructuredData('Organization', {});

      expect(data['@type']).toBe('Organization');
      expect(data.name).toBe('CyberPress');
    });

    it('应该生成 BreadcrumbList 结构化数据', () => {
      const items = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Blog', url: 'https://example.com/blog' },
      ];

      const data = generateStructuredData('BreadcrumbList', { items });

      expect(data['@type']).toBe('BreadcrumbList');
      expect(data.itemListElement).toHaveLength(2);
    });
  });
});
