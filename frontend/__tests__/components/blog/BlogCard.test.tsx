import { render, screen } from '@testing-library/react';
import { BlogCard } from '@/components/blog/BlogCard';

describe('BlogCard', () => {
  const mockPost = {
    id: '1',
    title: '测试文章标题',
    excerpt: '这是一篇测试文章的摘要内容',
    content: '文章内容',
    author: {
      name: '测试作者',
      avatar: 'https://example.com/avatar.jpg',
    },
    category: '测试分类',
    tags: ['标签1', '标签2', '标签3'],
    coverImage: 'https://example.com/cover.jpg',
    createdAt: '2024-03-01T00:00:00Z',
    readingTime: 5,
    views: 1000,
    likes: 50,
    comments: 10,
  };

  it('应该渲染文章卡片', () => {
    render(<BlogCard post={mockPost} />);
    
    expect(screen.getByText('测试文章标题')).toBeInTheDocument();
    expect(screen.getByText(/这是一篇测试文章的摘要内容/)).toBeInTheDocument();
  });

  it('应该显示文章元数据', () => {
    render(<BlogCard post={mockPost} showStats={true} />);
    
    expect(screen.getByText('测试作者')).toBeInTheDocument();
    expect(screen.getByText('测试分类')).toBeInTheDocument();
    expect(screen.getByText(/标签1/)).toBeInTheDocument();
  });

  it('应该显示统计数据', () => {
    render(<BlogCard post={mockPost} showStats={true} variant="default" />);
    
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('应该处理没有封面图的文章', () => {
    const postWithoutCover = { ...mockPost, coverImage: undefined };
    render(<BlogCard post={postWithoutCover} />);
    
    const image = screen.queryByRole('img');
    expect(image).not.toBeInTheDocument();
  });

  it('应该有正确的链接', () => {
    render(<BlogCard post={mockPost} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/1');
  });

  it('compact variant 应该显示简化信息', () => {
    const { container } = render(<BlogCard post={mockPost} variant="compact" />);
    
    expect(container.querySelector('.text-lg')).toBeInTheDocument();
    expect(container.querySelector('.text-xl')).not.toBeInTheDocument();
  });
});
