/**
 * 阅读进度追踪组件测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReadingProgressBar } from './ReadingProgressBar';
import { ReadingTimeEstimator, useReadingTime } from './ReadingTimeEstimator';
import { ReadingStatsCard } from './ReadingStatsCard';
import { ReadingHistory } from './ReadingHistory';
import { ReadingProgressService } from './ReadingProgressService';

describe('ReadingProgressBar', () => {
  beforeEach(() => {
    // 模拟 window.scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('应该渲染进度条', () => {
    render(<ReadingProgressBar />);
    const progressBar = document.querySelector('[style*="background-color"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('应该显示百分比文字', () => {
    render(<ReadingProgressBar showPercentage />);
    // 需要滚动才能触发显示
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('应该调用 onProgressChange 回调', async () => {
    const handleChange = vi.fn();
    render(<ReadingProgressBar onProgressChange={handleChange} />);

    // 模拟滚动事件
    fireEvent.scroll(window, { target: { scrollY: 100 } });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });
});

describe('ReadingTimeEstimator', () => {
  it('应该计算中文文本的阅读时间', () => {
    const content = '这是一篇测试文章，包含了一些中文内容。'.repeat(10);
    render(<ReadingTimeEstimator content={content} />);

    expect(screen.getByText(/阅读时间/)).toBeInTheDocument();
    expect(screen.getByText(/字/)).toBeInTheDocument();
  });

  it('应该计算英文文本的阅读时间', () => {
    const content = 'This is a test article with some English content.'.repeat(10);
    render(<ReadingTimeEstimator content={content} />);

    expect(screen.getByText(/阅读时间/)).toBeInTheDocument();
  });

  it('应该处理混合文本', () => {
    const content = '混合文本Mixed text with 中文和English。'.repeat(10);
    render(<ReadingTimeEstimator content={content} />);

    expect(screen.getByText(/阅读时间/)).toBeInTheDocument();
  });

  it('应该支持自定义阅读速度', () => {
    const content = '测试内容'.repeat(100);
    render(<ReadingTimeEstimator content={content} wordsPerMinute={300} />);

    expect(screen.getByText(/阅读时间/)).toBeInTheDocument();
  });

  it('应该支持隐藏图标', () => {
    const content = '测试内容'.repeat(100);
    const { container } = render(
      <ReadingTimeEstimator content={content} showIcon={false} />
    );

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBe(0);
  });
});

describe('useReadingTime hook', () => {
  it('应该返回正确的字数', () => {
    const { result } = renderHook(() => useReadingTime('测试内容'.repeat(100)));
    expect(result.current.wordCount).toBe(400);
  });

  it('应该返回正确的阅读时间', () => {
    const { result } = renderHook(() => useReadingTime('测试内容'.repeat(100), 200));
    expect(result.current.readingTime).toBe(2);
  });

  it('应该格式化时间显示', () => {
    const { result } = renderHook(() => useReadingTime('测试内容'.repeat(100)));
    expect(result.current.formatTime(1)).toBe('1 分钟');
    expect(result.current.formatTime(60)).toBe('1 小时');
    expect(result.current.formatTime(90)).toBe('1 小时 30 分钟');
  });
});

describe('ReadingStatsCard', () => {
  const mockStats = {
    totalArticles: 156,
    totalReadingTime: 2450,
    weeklyArticles: 12,
    readingStreak: 7,
    completionRate: 85,
    achievements: 23,
  };

  it('应该渲染默认样式的卡片', () => {
    render(<ReadingStatsCard stats={mockStats} />);
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('41h 10m')).toBeInTheDocument();
  });

  it('应该渲染紧凑样式', () => {
    const { container } = render(
      <ReadingStatsCard stats={mockStats} variant="compact" />
    );
    expect(container.querySelector('.text-sm')).toBeInTheDocument();
  });

  it('应该渲染详细样式', () => {
    render(<ReadingStatsCard stats={mockStats} variant="detailed" />);
    expect(screen.getByText('阅读统计')).toBeInTheDocument();
    expect(screen.getByText('连续 7 天')).toBeInTheDocument();
  });

  it('应该响应点击事件', () => {
    const handleClick = vi.fn();
    render(
      <ReadingStatsCard stats={mockStats} onClick={handleClick} />
    );

    const card = screen.getByRole('presentation');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalled();
  });
});

describe('ReadingHistory', () => {
  const mockHistoryItems = [
    {
      id: '1',
      articleId: '123',
      title: '如何使用 React Hooks',
      slug: 'react-hooks-guide',
      progress: 75,
      readingTime: 300,
      lastReadAt: '2024-03-06T10:30:00Z',
      isCompleted: false,
    },
    {
      id: '2',
      articleId: '456',
      title: 'TypeScript 入门教程',
      slug: 'typescript-basics',
      progress: 100,
      readingTime: 600,
      lastReadAt: '2024-03-05T15:20:00Z',
      isCompleted: true,
    },
  ];

  it('应该渲染历史记录列表', () => {
    render(<ReadingHistory historyItems={mockHistoryItems} />);
    expect(screen.getByText('如何使用 React Hooks')).toBeInTheDocument();
    expect(screen.getByText('TypeScript 入门教程')).toBeInTheDocument();
  });

  it('应该支持搜索过滤', () => {
    render(<ReadingHistory historyItems={mockHistoryItems} />);

    const searchInput = screen.getByPlaceholderText('搜索文章...');
    fireEvent.change(searchInput, { target: { value: 'React' } });

    expect(screen.getByText('如何使用 React Hooks')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript 入门教程')).not.toBeInTheDocument();
  });

  it('应该支持状态过滤', () => {
    render(<ReadingHistory historyItems={mockHistoryItems} />);

    const inProgressButton = screen.getByText('阅读中');
    fireEvent.click(inProgressButton);

    expect(screen.getByText('如何使用 React Hooks')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript 入门教程')).not.toBeInTheDocument();
  });

  it('应该调用删除回调', () => {
    const handleDelete = vi.fn();
    render(
      <ReadingHistory
        historyItems={mockHistoryItems}
        onDelete={handleDelete}
      />
    );

    const deleteButtons = screen.getAllByLabelText('删除记录');
    fireEvent.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  it('应该调用清空回调', () => {
    const handleClear = vi.fn();
    render(
      <ReadingHistory
        historyItems={mockHistoryItems}
        onClear={handleClear}
      />
    );

    const clearButton = screen.getByLabelText('清空历史');
    fireEvent.click(clearButton);

    expect(handleClear).toHaveBeenCalled();
  });
});

describe('ReadingProgressService', () => {
  let service: ReadingProgressService;

  beforeEach(() => {
    service = ReadingProgressService.getInstance();
    service.clearAllProgress();
  });

  afterEach(() => {
    service.destroy();
  });

  it('应该更新阅读进度', () => {
    service.updateProgress('article-1', 50, 120, 500);
    const progress = service.getProgress('article-1');

    expect(progress).toBeDefined();
    expect(progress?.progress).toBe(50);
    expect(progress?.readingTime).toBe(120);
  });

  it('应该标记文章为已完成', () => {
    service.updateProgress('article-1', 100, 300, 1000);
    const progress = service.getProgress('article-1');

    expect(progress?.isCompleted).toBe(true);
  });

  it('应该删除阅读进度', () => {
    service.updateProgress('article-1', 50, 120, 500);
    service.deleteProgress('article-1');

    const progress = service.getProgress('article-1');
    expect(progress).toBeUndefined();
  });

  it('应该添加到阅读历史', () => {
    service.addToHistory({
      articleId: 'article-1',
      title: '测试文章',
      slug: 'test-article',
      progress: 50,
      readingTime: 300,
      lastReadAt: new Date().toISOString(),
      isCompleted: false,
    });

    const history = service.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].title).toBe('测试文章');
  });

  it('应该从历史中删除', () => {
    service.addToHistory({
      articleId: 'article-1',
      title: '测试文章',
      slug: 'test-article',
      progress: 50,
      readingTime: 300,
      lastReadAt: new Date().toISOString(),
      isCompleted: false,
    });

    const history = service.getHistory();
    service.deleteFromHistory(history[0].id);

    const updatedHistory = service.getHistory();
    expect(updatedHistory).toHaveLength(0);
  });

  it('应该计算连续阅读天数', () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const dayBefore = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);

    service.updateProgress('article-1', 100, 300, 1000);
    service.updateProgress('article-2', 100, 300, 1000);
    service.updateProgress('article-3', 100, 300, 1000);

    // 模拟不同日期的阅读记录
    const stats = service.getStats();
    expect(stats.readingStreak).toBeGreaterThan(0);
  });

  it('应该导出和导入数据', () => {
    service.updateProgress('article-1', 50, 120, 500);
    service.addToHistory({
      articleId: 'article-1',
      title: '测试文章',
      slug: 'test-article',
      progress: 50,
      readingTime: 300,
      lastReadAt: new Date().toISOString(),
      isCompleted: false,
    });

    const exportedData = service.exportData();
    service.clearAllProgress();

    const success = service.importData(exportedData);
    expect(success).toBe(true);

    const progress = service.getProgress('article-1');
    expect(progress).toBeDefined();
  });
});
