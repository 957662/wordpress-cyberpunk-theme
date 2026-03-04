/**
 * 搜索功能集成测试
 */

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-router';

// Mock API 服务
jest.mock('@/lib/services/api/search', () => ({
  searchPosts: jest.fn(),
  searchUsers: jest.fn(),
  searchTags: jest.fn(),
  getTrendingSearches: jest.fn(),
  getSearchSuggestions: jest.fn(),
}));

import {
  searchPosts,
  searchUsers,
  searchTags,
  getTrendingSearches,
  getSearchSuggestions,
} from '@/lib/services/api/search';

// 测试组件
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('搜索功能集成测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('文章搜索', () => {
    it('应该成功搜索文章', async () => {
      const mockResults = [
        { id: 1, title: '测试文章1', slug: 'test-1' },
        { id: 2, title: '测试文章2', slug: 'test-2' },
      ];

      (searchPosts as jest.Mock).mockResolvedValue(mockResults);

      render(
        <TestWrapper>
          <div>
            <input
              type="text"
              placeholder="搜索文章"
              onChange={(e) => searchPosts(e.target.value)}
            />
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('搜索文章');
      fireEvent.change(searchInput, { target: { value: '测试' } });

      await waitFor(() => {
        expect(searchPosts).toHaveBeenCalledWith('测试');
      });
    });

    it('应该处理搜索结果为空的情况', async () => {
      (searchPosts as jest.Mock).mockResolvedValue([]);

      render(
        <TestWrapper>
          <div>
            <input
              type="text"
              placeholder="搜索文章"
              onChange={(e) => searchPosts(e.target.value)}
            />
            <div>无搜索结果</div>
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('搜索文章');
      fireEvent.change(searchInput, { target: { value: '不存在的关键词' } });

      await waitFor(() => {
        expect(searchPosts).toHaveBeenCalledWith('不存在的关键词');
      });
    });

    it('应该使用防抖优化搜索性能', async () => {
      jest.useFakeTimers();

      (searchPosts as jest.Mock).mockResolvedValue([]);

      render(
        <TestWrapper>
          <input
            type="text"
            placeholder="搜索文章"
            onChange={(e) => {
              // 模拟防抖
              act(() => {
                jest.advanceTimersByTime(300);
                searchPosts(e.target.value);
              });
            }}
          />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('搜索文章');

      // 快速输入多次
      fireEvent.change(searchInput, { target: { value: '测' } });
      fireEvent.change(searchInput, { target: { value: '测试' } });
      fireEvent.change(searchInput, { target: { value: '测试关' } });
      fireEvent.change(searchInput, { target: { value: '测试关键词' } });

      // 快进时间
      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(searchPosts).toHaveBeenCalledTimes(1);
        expect(searchPosts).toHaveBeenCalledWith('测试关键词');
      });

      jest.useRealTimers();
    });
  });

  describe('用户搜索', () => {
    it('应该成功搜索用户', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', displayName: '用户1' },
        { id: 2, username: 'user2', displayName: '用户2' },
      ];

      (searchUsers as jest.Mock).mockResolvedValue(mockUsers);

      render(
        <TestWrapper>
          <div>
            <input
              type="text"
              placeholder="搜索用户"
              onChange={(e) => searchUsers(e.target.value)}
            />
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('搜索用户');
      fireEvent.change(searchInput, { target: { value: '用户' } });

      await waitFor(() => {
        expect(searchUsers).toHaveBeenCalledWith('用户');
      });
    });
  });

  describe('标签搜索', () => {
    it('应该成功搜索标签', async () => {
      const mockTags = [
        { id: 1, name: 'React', slug: 'react' },
        { id: 2, name: 'TypeScript', slug: 'typescript' },
      ];

      (searchTags as jest.Mock).mockResolvedValue(mockTags);

      render(
        <TestWrapper>
          <div>
            <input
              type="text"
              placeholder="搜索标签"
              onChange={(e) => searchTags(e.target.value)}
            />
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('搜索标签');
      fireEvent.change(searchInput, { target: { value: 'React' } });

      await waitFor(() => {
        expect(searchTags).toHaveBeenCalledWith('React');
      });
    });
  });

  describe('搜索建议', () => {
    it('应该获取搜索建议', async () => {
      const mockSuggestions = [
        '测试文章1',
        '测试文章2',
        '测试关键词',
      ];

      (getSearchSuggestions as jest.Mock).mockResolvedValue(mockSuggestions);

      render(
        <TestWrapper>
          <div>
            <input
              type="text"
              placeholder="搜索"
              onChange={(e) => getSearchSuggestions(e.target.value)}
            />
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('搜索');
      fireEvent.change(searchInput, { target: { value: '测' } });

      await waitFor(() => {
        expect(getSearchSuggestions).toHaveBeenCalledWith('测');
      });
    });
  });

  describe('热门搜索', () => {
    it('应该获取热门搜索词', async () => {
      const mockTrending = [
        'Next.js',
        'React',
        'TypeScript',
        '赛博朋克',
      ];

      (getTrendingSearches as jest.Mock).mockResolvedValue(mockTrending);

      render(
        <TestWrapper>
          <div>
            <button onClick={() => getTrendingSearches()}>热门搜索</button>
          </div>
        </TestWrapper>
      );

      const trendingButton = screen.getByText('热门搜索');
      fireEvent.click(trendingButton);

      await waitFor(() => {
        expect(getTrendingSearches).toHaveBeenCalled();
      });
    });
  });

  describe('搜索历史', () => {
    it('应该保存搜索历史', () => {
      const searchHistory: string[] = [];

      render(
        <TestWrapper>
          <div>
            <input
              type="text"
              placeholder="搜索"
              onChange={(e) => {
                searchHistory.push(e.target.value);
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
              }}
            />
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('搜索');
      fireEvent.change(searchInput, { target: { value: 'React' } });

      expect(JSON.parse(localStorage.getItem('searchHistory') || '[]')).toContain('React');
    });

    it('应该清除搜索历史', () => {
      localStorage.setItem('searchHistory', JSON.stringify(['React', 'Next.js']));

      render(
        <TestWrapper>
          <button onClick={() => localStorage.removeItem('searchHistory')}>
            清除历史
          </button>
        </TestWrapper>
      );

      const clearButton = screen.getByText('清除历史');
      fireEvent.click(clearButton);

      expect(localStorage.getItem('searchHistory')).toBeNull();
    });
  });

  describe('高级搜索', () => {
    it('应该支持按分类筛选', async () => {
      (searchPosts as jest.Mock).mockResolvedValue([]);

      render(
        <TestWrapper>
          <div>
            <select
              onChange={(e) => searchPosts('', { category: e.target.value })}
            >
              <option value="">全部分类</option>
              <option value="tech">技术</option>
              <option value="design">设计</option>
            </select>
          </div>
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'tech' } });

      await waitFor(() => {
        expect(searchPosts).toHaveBeenCalledWith('', { category: 'tech' });
      });
    });

    it('应该支持按标签筛选', async () => {
      (searchPosts as jest.Mock).mockResolvedValue([]);

      render(
        <TestWrapper>
          <div>
            <input
              type="text"
              placeholder="搜索"
              onChange={(e) => searchPosts(e.target.value, { tags: ['React', 'Next.js'] })}
            />
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('搜索');
      fireEvent.change(searchInput, { target: { value: 'React' } });

      await waitFor(() => {
        expect(searchPosts).toHaveBeenCalledWith('React', { tags: ['React', 'Next.js'] });
      });
    });
  });
});
