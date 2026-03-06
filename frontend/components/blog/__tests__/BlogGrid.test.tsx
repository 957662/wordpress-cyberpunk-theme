/**
 * BlogGrid 组件测试
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BlogGrid } from '../BlogGrid';

// Mock BlogCard
jest.mock('../BlogCard', () => ({
  BlogCard: ({ title, excerpt, onClick }: any) => (
    <div data-testid="blog-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{excerpt}</p>
    </div>
  ),
}));

const mockPosts = [
  {
    id: '1',
    title: 'Test Post 1',
    excerpt: 'Excerpt 1',
    author: 'Author 1',
    date: '2024-01-01',
    image: 'image1.jpg',
  },
  {
    id: '2',
    title: 'Test Post 2',
    excerpt: 'Excerpt 2',
    author: 'Author 2',
    date: '2024-01-02',
    image: 'image2.jpg',
  },
  {
    id: '3',
    title: 'Test Post 3',
    excerpt: 'Excerpt 3',
    author: 'Author 3',
    date: '2024-01-03',
    image: 'image3.jpg',
  },
];

describe('BlogGrid', () => {
  it('renders blog cards correctly', () => {
    render(<BlogGrid posts={mockPosts} />);

    const cards = screen.getAllByTestId('blog-card');
    expect(cards).toHaveLength(3);
  });

  it('renders empty state when no posts', () => {
    const { container } = render(<BlogGrid posts={[]} />);

    expect(screen.getByText('暂无文章')).toBeInTheDocument();
    expect(screen.getByText('还没有发布任何文章，敬请期待！')).toBeInTheDocument();
  });

  it('applies correct grid classes for different column counts', () => {
    const { container: container1 } = render(<BlogGrid posts={mockPosts} columns={1} />);
    expect(container1.querySelector('.grid-cols-1')).toBeInTheDocument();

    const { container: container2 } = render(<BlogGrid posts={mockPosts} columns={2} />);
    expect(container2.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();

    const { container: container3 } = render(<BlogGrid posts={mockPosts} columns={3} />);
    expect(container3.querySelector('.lg\\:grid-cols-3')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BlogGrid posts={mockPosts} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders correct number of cards with many posts', () => {
    const manyPosts = Array.from({ length: 12 }, (_, i) => ({
      id: String(i),
      title: `Post ${i}`,
      excerpt: `Excerpt ${i}`,
      author: `Author ${i}`,
      date: '2024-01-01',
      image: `image${i}.jpg`,
    }));

    render(<BlogGrid posts={manyPosts} columns={3} />);

    const cards = screen.getAllByTestId('blog-card');
    expect(cards).toHaveLength(12);
  });

  it('passes correct props to BlogCard', () => {
    render(<BlogGrid posts={mockPosts} variant="featured" />);

    mockPosts.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.excerpt)).toBeInTheDocument();
    });
  });
});
