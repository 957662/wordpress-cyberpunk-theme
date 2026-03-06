/**
 * Search Service 测试
 */

import { searchService } from './search.service';

// Mock httpClient
jest.mock('./http-client', () => ({
  httpClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('SearchService', () => {
  beforeEach(() => {
    // 清除搜索历史
    searchService.clearSearchHistory();
  });

  describe('search', () => {
    it('应该执行搜索并返回结果', async () => {
      const mockResults = [
        {
          id: '1',
          type: 'post',
          title: '测试文章',
          slug: 'test-post',
        },
      ];

      const mockResponse = {
        data: {
          results: mockResults,
          total: 1,
          page: 1,
          limit: 10,
        },
      };

      (require('./http-client').httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await searchService.search({
        query: '测试',
      });

      expect(result.results).toEqual(mockResults);
      expect(result.total).toBe(1);
    });

    it('应该保存搜索历史', async () => {
      const mockResponse = {
        data: {
          results: [],
          total: 0,
          page: 1,
          limit: 10,
        },
      };

      (require('./http-client').httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await searchService.search({ query: '测试搜索' });

      const history = searchService.getSearchHistory();
      expect(history).toContainEqual({
        text: '测试搜索',
        type: 'history',
      });
    });
  });

  describe('getSuggestions', () => {
    it('应该返回搜索建议', async () => {
      const mockSuggestions = [
        { text: 'React教程', type: 'suggestion' },
        { text: 'React Hooks', type: 'suggestion' },
      ];

      const mockResponse = {
        data: mockSuggestions,
      };

      (require('./http-client').httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const suggestions = await searchService.getSuggestions('React');

      expect(suggestions).toEqual(mockSuggestions);
    });
  });

  describe('search history', () => {
    it('应该保存搜索历史', async () => {
      const mockResponse = {
        data: {
          results: [],
          total: 0,
          page: 1,
          limit: 10,
        },
      };

      (require('./http-client').httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await searchService.search({ query: '第一次搜索' });
      await searchService.search({ query: '第二次搜索' });

      const history = searchService.getSearchHistory();
      expect(history.length).toBe(2);
      expect(history[0].text).toBe('第二次搜索'); // 最新的在前
    });

    it('应该限制历史记录数量', async () => {
      const mockResponse = {
        data: {
          results: [],
          total: 0,
          page: 1,
          limit: 10,
        },
      };

      (require('./http-client').httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      // 超过最大限制 (MAX_HISTORY_ITEMS = 10)
      for (let i = 0; i < 15; i++) {
        await searchService.search({ query: `搜索 ${i}` });
      }

      const history = searchService.getSearchHistory();
      expect(history.length).toBeLessThanOrEqual(10);
    });

    it('应该清空搜索历史', async () => {
      const mockResponse = {
        data: {
          results: [],
          total: 0,
          page: 1,
          limit: 10,
        },
      };

      (require('./http-client').httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await searchService.search({ query: '测试' });

      searchService.clearSearchHistory();

      const history = searchService.getSearchHistory();
      expect(history.length).toBe(0);
    });
  });

  describe('highlightKeywords', () => {
    it('应该高亮搜索关键词', () => {
      const text = '这是一个测试文本';
      const query = '测试';

      const highlighted = searchService.highlightKeywords(text, query);

      expect(highlighted).toContain('<mark class="highlight">测试</mark>');
    });

    it('应该高亮多个关键词', () => {
      const text = 'React和Vue都是前端框架';
      const query = 'React Vue';

      const highlighted = searchService.highlightKeywords(text, query);

      expect(highlighted).toContain('<mark class="highlight">React</mark>');
      expect(highlighted).toContain('<mark class="highlight">Vue</mark>');
    });
  });

  describe('calculateRelevanceScore', () => {
    it('应该计算相关性分数', () => {
      const result = {
        id: '1',
        type: 'post' as const,
        title: 'React Hooks 教程',
        slug: 'react-hooks',
        excerpt: '学习React Hooks的使用方法',
      };

      const score = searchService.calculateRelevanceScore(result, 'React');

      expect(score).toBeGreaterThan(0);
      expect(score).toBeGreaterThan(
        searchService.calculateRelevanceScore(result, 'Python')
      );
    });

    it('标题匹配应该获得更高分数', () => {
      const result = {
        id: '1',
        type: 'post' as const,
        title: 'React 教程',
        slug: 'react',
        excerpt: '这是一个关于React的文章',
      };

      const titleScore = searchService.calculateRelevanceScore(result, 'React');

      const excerptOnlyResult = {
        ...result,
        title: '其他标题',
      };

      const excerptScore = searchService.calculateRelevanceScore(
        excerptOnlyResult,
        'React'
      );

      expect(titleScore).toBeGreaterThan(excerptScore);
    });
  });
});
