/**
 * 文章处理工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  extractTextFromHTML,
  countWords,
  calculateReadingTime,
  formatReadingTime,
  extractTableOfContents,
  extractImages,
  extractExcerpt,
  generateSlug,
  truncateText,
  formatNumber,
} from '../article';

describe('文章处理工具函数', () => {
  describe('extractTextFromHTML', () => {
    it('应该从 HTML 中提取纯文本', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      expect(extractTextFromHTML(html)).toBe('Hello World');
    });

    it('应该移除脚本标签', () => {
      const html = '<p>Hello</p><script>alert("test")</script>';
      expect(extractTextFromHTML(html)).toBe('Hello');
    });

    it('应该移除样式标签', () => {
      const html = '<p>Hello</p><style>body { color: red; }</style>';
      expect(extractTextFromHTML(html)).toBe('Hello');
    });

    it('应该处理空 HTML', () => {
      expect(extractTextFromHTML('')).toBe('');
      expect(extractTextFromHTML('<div></div>')).toBe('');
    });
  });

  describe('countWords', () => {
    it('应该正确计算中文文章字数', () => {
      const content = '这是一篇测试文章，包含多个汉字。';
      expect(countWords(content)).toBe(18);
    });

    it('应该正确计算英文文章字数', () => {
      const content = 'This is a test article with multiple words.';
      expect(countWords(content)).toBe(8);
    });

    it('应该正确计算混合文章字数', () => {
      const content = '这是一篇 mixed article with 中英文。';
      expect(countWords(content)).toBe(14);
    });

    it('应该处理空字符串', () => {
      expect(countWords('')).toBe(0);
    });

    it('应该忽略多个连续空格', () => {
      const content = 'Hello    World    Test';
      expect(countWords(content)).toBe(3);
    });
  });

  describe('calculateReadingTime', () => {
    it('应该计算纯文本的阅读时间', () => {
      const content = 'A'.repeat(400); // 400个字符
      expect(calculateReadingTime(content)).toBe(2); // 2分钟
    });

    it('应该考虑图片对阅读时间的影响', () => {
      const content = 'A'.repeat(400);
      expect(calculateReadingTime(content, 200, 5)).toBe(2.25); // 额外增加 12 秒*5/60
    });

    it('应该支持自定义阅读速度', () => {
      const content = 'A'.repeat(400);
      expect(calculateReadingTime(content, 100)).toBe(4); // 4分钟
    });

    it('应该处理空内容', () => {
      expect(calculateReadingTime('')).toBe(0);
    });

    it('应该最小返回 1 分钟', () => {
      const content = 'Short';
      expect(Math.round(calculateReadingTime(content))).toBe(1);
    });
  });

  describe('formatReadingTime', () => {
    it('应该格式化分钟', () => {
      expect(formatReadingTime(5)).toBe('5 分钟');
      expect(formatReadingTime(1)).toBe('1 分钟');
    });

    it('应该格式化小时', () => {
      expect(formatReadingTime(60)).toBe('1 小时');
      expect(formatReadingTime(120)).toBe('2 小时');
    });

    it('应该格式化小时和分钟', () => {
      expect(formatReadingTime(90)).toBe('1 小时 30 分钟');
      expect(formatReadingTime(150)).toBe('2 小时 30 分钟');
    });

    it('应该支持英文格式', () => {
      expect(formatReadingTime(5, 'en')).toBe('5 min');
      expect(formatReadingTime(60, 'en')).toBe('1 hour');
      expect(formatReadingTime(90, 'en')).toBe('1h 30min');
    });
  });

  describe('extractTableOfContents', () => {
    it('应该提取标题生成目录', () => {
      const content = `
        <h1>Title 1</h1>
        <h2>Subtitle 1</h2>
        <h3>Section 1</h3>
        <h2>Subtitle 2</h2>
      `;

      const toc = extractTableOfContents(content);
      expect(toc).toHaveLength(4);
      expect(toc[0].text).toBe('Title 1');
      expect(toc[0].level).toBe(1);
      expect(toc[1].text).toBe('Subtitle 1');
      expect(toc[1].level).toBe(2);
    });

    it('应该生成标题 ID', () => {
      const content = '<h2>Test Title</h2>';
      const toc = extractTableOfContents(content);
      expect(toc[0].id).toBe('test-title');
    });

    it('应该支持过滤标题级别', () => {
      const content = `
        <h1>Title 1</h1>
        <h2>Subtitle 1</h2>
        <h3>Section 1</h3>
        <h4>Detail 1</h4>
      `;

      const toc = extractTableOfContents(content, 2, 3);
      expect(toc).toHaveLength(2);
      expect(toc[0].level).toBe(2);
      expect(toc[1].level).toBe(3);
    });

    it('应该处理没有标题的内容', () => {
      const content = '<p>Just some text</p>';
      const toc = extractTableOfContents(content);
      expect(toc).toHaveLength(0);
    });
  });

  describe('extractImages', () => {
    it('应该提取所有图片 URL', () => {
      const content = `
        <img src="/image1.jpg" />
        <img src="/image2.png" />
        <img src="https://example.com/image3.jpg" />
      `;

      const images = extractImages(content);
      expect(images).toHaveLength(3);
      expect(images).toContain('/image1.jpg');
      expect(images).toContain('/image2.png');
      expect(images).toContain('https://example.com/image3.jpg');
    });

    it('应该处理没有图片的内容', () => {
      const content = '<p>No images here</p>';
      const images = extractImages(content);
      expect(images).toHaveLength(0);
    });

    it('应该处理空内容', () => {
      const images = extractImages('');
      expect(images).toHaveLength(0);
    });
  });

  describe('extractExcerpt', () => {
    it('应该提取摘要', () => {
      const content = 'This is a long article content that needs to be truncated.';
      const excerpt = extractExcerpt(content, 20);
      expect(excerpt).toBe('This is a long art...');
    });

    it('应该在单词边界处截断', () => {
      const content = 'This is a test article with many words';
      const excerpt = extractExcerpt(content, 15);
      expect(excerpt).toBe('This is a...');
    });

    it('应该处理短内容', () => {
      const content = 'Short';
      const excerpt = extractExcerpt(content, 20);
      expect(excerpt).toBe('Short');
    });

    it('应该移除 HTML 标签', () => {
      const content = '<p>This is <strong>content</strong></p>';
      const excerpt = extractExcerpt(content, 20);
      expect(excerpt).toBe('This is content...');
    });
  });

  describe('generateSlug', () => {
    it('应该生成 slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('Test Article Title')).toBe('test-article-title');
    });

    it('应该移除特殊字符', () => {
      expect(generateSlug('Hello @World!')).toBe('hello-world');
      expect(generateSlug('Test & Article')).toBe('test-article');
    });

    it('应该处理中英文混合', () => {
      expect(generateSlug('测试Test文章Article')).toBe('test-article');
    });

    it('应该处理多个连续空格', () => {
      expect(generateSlug('Hello    World')).toBe('hello-world');
    });

    it('应该处理空字符串', () => {
      expect(generateSlug('')).toBe('');
    });
  });

  describe('truncateText', () => {
    it('应该截断文本', () => {
      const text = 'This is a long text that needs truncating';
      expect(truncateText(text, 20)).toBe('This is a long text...');
    });

    it('应该支持自定义后缀', () => {
      const text = 'This is a long text';
      expect(truncateText(text, 10, '***')).toBe('This is***');
    });

    it('应该处理短文本', () => {
      const text = 'Short';
      expect(truncateText(text, 20)).toBe('Short');
    });

    it('应该在中文正确截断', () => {
      const text = '这是一篇很长的文章需要被截断';
      expect(truncateText(text, 10)).toBe('这是一篇很长的文...');
    });
  });

  describe('formatNumber', () => {
    it('应该格式化小数字', () => {
      expect(formatNumber(123)).toBe('123');
      expect(formatNumber(999)).toBe('999');
    });

    it('应该格式化千位', () => {
      expect(formatNumber(1234)).toBe('1.2K');
      expect(formatNumber(9999)).toBe('9.9K');
    });

    it('应该格式化万位', () => {
      expect(formatNumber(12345)).toBe('12.3K');
      expect(formatNumber(99999)).toBe('99.9K');
    });

    it('应该格式化百万位', () => {
      expect(formatNumber(1234567)).toBe('1.2M');
      expect(formatNumber(9999999)).toBe('9.9M');
    });

    it('应该格式化十亿位', () => {
      expect(formatNumber(1234567890)).toBe('1.2B');
      expect(formatNumber(9999999999)).toBe('9.9B');
    });

    it('应该处理零', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('应该处理负数', () => {
      expect(formatNumber(-1234)).toBe('-1.2K');
    });
  });

  describe('边界情况', () => {
    it('应该处理 null 输入', () => {
      expect(countWords(null as any)).toBe(0);
      expect(calculateReadingTime(null as any)).toBe(0);
    });

    it('应该处理 undefined 输入', () => {
      expect(countWords(undefined as any)).toBe(0);
      expect(calculateReadingTime(undefined as any)).toBe(0);
    });

    it('应该处理只有空格的内容', () => {
      expect(countWords('   ')).toBe(0);
      expect(extractTextFromHTML('   ')).toBe('');
    });
  });
});
