/**
 * Blog Components Tests
 * 博客组件测试套件
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 测试工具函数
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

// Mock data
const mockPosts = [
  {
    id: '1',
    title: 'Test Post 1',
    slug: 'test-post-1',
    excerpt: 'This is a test post excerpt',
    content: '<p>Test content</p>',
    author: { id: '1', name: 'Test Author' },
    category: { id: '1', name: 'Technology', slug: 'technology' },
    tags: [],
    publishedAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    status: 'published' as const,
    readingTime: 5,
  },
  {
    id: '2',
    title: 'Test Post 2',
    slug: 'test-post-2',
    excerpt: 'Another test post excerpt',
    content: '<p>More test content</p>',
    author: { id: '2', name: 'Another Author' },
    category: { id: '2', name: 'Development', slug: 'development' },
    tags: [],
    publishedAt: '2026-03-02T00:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z',
    status: 'published' as const,
    readingTime: 3,
  },
];

describe('BlogCard', () => {
  beforeEach(() => {
    vi.mock('@/lib/wordpress', () => ({
      wordpressClient: {
        getPost: vi.fn(),
      },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders blog card with post data', async () => {
    const { BlogCard } = await import('../blog/BlogCard');

    renderWithQueryClient(
      <BlogCard post={mockPosts[0]} />
    );

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders cover image when provided', async () => {
    const { BlogCard } = await import('../blog/BlogCard');

    const postWithImage = {
      ...mockPosts[0],
      coverImage: '/images/test.jpg',
    };

    renderWithQueryClient(
      <BlogCard post={postWithImage} />
    );

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/test.jpg');
  });

  it('displays reading time', async () => {
    const { BlogCard } = await import('../blog/BlogCard');

    renderWithQueryClient(
      <BlogCard post={mockPosts[0]} />
    );

    expect(screen.getByText(/5 min read/i)).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const { BlogCard } = await import('../blog/BlogCard');
    const handleClick = vi.fn();

    renderWithQueryClient(
      <BlogCard post={mockPosts[0]} onClick={handleClick} />
    );

    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('BlogList', () => {
  it('renders list of posts', async () => {
    const { BlogList } = await import('../blog/BlogList');

    renderWithQueryClient(
      <BlogList
        posts={mockPosts}
        totalPages={1}
        totalItems={2}
      />
    );

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('shows loading skeleton', async () => {
    const { BlogList } = await import('../blog/BlogList');

    renderWithQueryClient(
      <BlogList
        posts={[]}
        loading={true}
        pageSize={2}
      />
    );

    // Check for skeleton loaders
    const skeletons = screen.getAllByTestId('blog-card-skeleton');
    expect(skeletons).toHaveLength(2);
  });

  it('shows empty state when no posts', async () => {
    const { BlogList } = await import('../blog/BlogList');

    renderWithQueryClient(
      <BlogList
        posts={[]}
        loading={false}
      />
    );

    expect(screen.getByText(/no posts/i)).toBeInTheDocument();
  });

  it('renders pagination when multiple pages', async () => {
    const { BlogList } = await import('../blog/BlogList');

    renderWithQueryClient(
      <BlogList
        posts={mockPosts}
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />
    );

    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
  });
});

describe('BlogGrid', () => {
  it('renders grid of posts', async () => {
    const { BlogGrid } = await import('../blog/BlogGrid');

    renderWithQueryClient(
      <BlogGrid
        posts={mockPosts}
        columns={2}
      />
    );

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('applies correct grid classes for different column counts', async () => {
    const { BlogGrid } = await import('../blog/BlogGrid');
    const { container } = renderWithQueryClient(
      <BlogGrid posts={mockPosts} columns={3} />
    );

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3');
  });
});

describe('BlogSearch', () => {
  it('renders search input', async () => {
    const { BlogSearch } = await import('../blog/BlogSearch');

    renderWithQueryClient(
      <BlogSearch />
    );

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('calls search on input change', async () => {
    const { BlogSearch } = await import('../blog/BlogSearch');
    const onSearch = vi.fn();

    renderWithQueryClient(
      <BlogSearch onSearch={onSearch} />
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test search' } });

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('test search');
    });
  });

  it('debounces search input', async () => {
    const { BlogSearch } = await import('../blog/BlogSearch');
    const onSearch = vi.fn();

    renderWithQueryClient(
      <BlogSearch onSearch={onSearch} debounce={300} />
    );

    const input = screen.getByPlaceholderText(/search/i);

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: 'testing' } });
    fireEvent.change(input, { target: { value: 'testing search' } });

    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledTimes(1);
      },
      { timeout: 500 }
    );
  });
});

describe('Pagination', () => {
  it('renders correct page numbers', async () => {
    const { Pagination } = await import('../ui/pagination');

    renderWithQueryClient(
      <Pagination
        currentPage={2}
        totalPages={5}
        totalItems={50}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onPageChange when page is clicked', async () => {
    const { Pagination } = await import('../ui/pagination');
    const onPageChange = vi.fn();

    renderWithQueryClient(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables prev button on first page', async () => {
    const { Pagination } = await import('../ui/pagination');

    renderWithQueryClient(
      <Pagination
        currentPage={1}
        totalPages={5}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', async () => {
    const { Pagination } = await import('../ui/pagination');

    renderWithQueryClient(
      <Pagination
        currentPage={5}
        totalPages={5}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });
});

describe('ArticleCard', () => {
  it('renders article with all metadata', async () => {
    const { ArticleCard } = await import('../blog/ArticleCard');

    renderWithQueryClient(
      <ArticleCard post={mockPosts[0]} />
    );

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText(/5 min read/i)).toBeInTheDocument();
  });

  it('shows like and bookmark buttons', async () => {
    const { ArticleCard } = await import('../blog/ArticleCard');

    renderWithQueryClient(
      <ArticleCard post={mockPosts[0]} />
    );

    expect(screen.getByRole('button', { name: /like/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
  });
});

describe('ReadingProgress', () => {
  it('renders progress bar', async () => {
    const { ReadingProgress } = await import('../blog/ReadingProgress');

    const { container } = renderWithQueryClient(
      <ReadingProgress progress={50} />
    );

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('updates progress when prop changes', async () => {
    const { ReadingProgress } = await import('../blog/ReadingProgress');
    const { container, rerender } = renderWithQueryClient(
      <ReadingProgress progress={25} />
    );

    let progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '25%' });

    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <ReadingProgress progress={75} />
      </QueryClientProvider>
    );

    progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '75%' });
  });
});

describe('CommentSystem', () => {
  it('renders comment list', async () => {
    const { CommentSystem } = await import('../blog/CommentSystem');

    const mockComments = [
      {
        id: '1',
        author: 'Commenter 1',
        content: 'First comment',
        createdAt: '2026-03-01T00:00:00Z',
      },
      {
        id: '2',
        author: 'Commenter 2',
        content: 'Second comment',
        createdAt: '2026-03-02T00:00:00Z',
      },
    ];

    renderWithQueryClient(
      <CommentSystem
        postId="1"
        comments={mockComments}
      />
    );

    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Second comment')).toBeInTheDocument();
  });

  it('submits new comment', async () => {
    const { CommentSystem } = await import('../blog/CommentSystem');
    const onSubmit = vi.fn();

    renderWithQueryClient(
      <CommentSystem
        postId="1"
        comments={[]}
        onSubmit={onSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(textarea, { target: { value: 'New comment' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        postId: '1',
        content: 'New comment',
      });
    });
  });
});
