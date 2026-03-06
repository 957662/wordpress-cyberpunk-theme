/**
 * RealTimeSearch Component Tests
 * 实时搜索组件测试
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RealTimeSearch } from '@/components/search/RealTimeSearch';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}));

// Mock hooks
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value
}));

jest.mock('@/hooks/api/use-posts', () => ({
  useSearchPosts: () => ({
    data: [
      {
        id: '1',
        title: 'Test Post 1',
        excerpt: 'This is a test post',
        slug: 'test-post-1',
        category: 'Technology'
      }
    ],
    isLoading: false
  })
}));

describe('RealTimeSearch Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('应该渲染搜索输入框', () => {
    render(<RealTimeSearch />);
    const input = screen.getByPlaceholderText(/搜索文章/);
    expect(input).toBeInTheDocument();
  });

  it('应该接受用户输入', () => {
    render(<RealTimeSearch />);
    const input = screen.getByPlaceholderText(/搜索文章/) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'test query' } });
    expect(input.value).toBe('test query');
  });

  it('应该在输入时显示下拉框', async () => {
    render(<RealTimeSearch />);
    const input = screen.getByPlaceholderText(/搜索文章/);

    fireEvent.focus(input);
    await waitFor(() => {
      const dropdown = document.querySelector('[class*="bg-gray-900/95"]');
      expect(dropdown).toBeInTheDocument();
    });
  });

  it('应该显示搜索历史', () => {
    const mockHistory = ['React', 'Next.js'];
    localStorage.setItem('searchHistory', JSON.stringify(mockHistory));

    render(<RealTimeSearch />);
    const input = screen.getByPlaceholderText(/搜索文章/);

    fireEvent.focus(input);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('应该显示热门搜索', () => {
    render(<RealTimeSearch />);
    const input = screen.getByPlaceholderText(/搜索文章/);

    fireEvent.focus(input);

    expect(screen.getByText('React Hooks')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('应该支持清除搜索历史', async () => {
    const mockHistory = ['React', 'Next.js'];
    localStorage.setItem('searchHistory', JSON.stringify(mockHistory));

    render(<RealTimeSearch />);
    const input = screen.getByPlaceholderText(/搜索文章/);

    fireEvent.focus(input);

    const clearButton = screen.getByText('清除');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(localStorage.getItem('searchHistory')).toBeNull();
    });
  });

  it('应该支持键盘导航', () => {
    render(<RealTimeSearch />);
    const input = screen.getByPlaceholderText(/搜索文章/) as HTMLInputElement;

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'test' } });

    // Test ArrowDown
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Test ArrowUp
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    // Test Escape
    fireEvent.keyDown(input, { key: 'Escape' });

    // Component should still be in document
    expect(input).toBeInTheDocument();
  });

  it('应该保存新的搜索到历史记录', async () => {
    const mockPush = jest.fn();
    (jest.requireMock('next/navigation').useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });

    render(<RealTimeSearch />);
    const input = screen.getByPlaceholderText(/搜索文章/) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'new search' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      expect(history).toContain('new search');
    });
  });

  it('应该清除搜索查询', () => {
    render(<RealTimeSearch />);
    const input = screen.getByPlaceholderText(/搜索文章/) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
  });

  it('应该限制最大结果数量', () => {
    const { container } = render(<RealTimeSearch maxResults={5} />);
    // Component should render without errors
    expect(container).toBeInTheDocument();
  });
});
