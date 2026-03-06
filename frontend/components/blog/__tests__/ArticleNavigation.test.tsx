/**
 * ArticleNavigation 组件测试
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleNavigation } from '../ArticleNavigation';

describe('ArticleNavigation', () => {
  const mockPreviousArticle = {
    id: '1',
    title: '上一篇测试文章',
    slug: 'previous-post',
    excerpt: '这是上一篇文章的摘要',
    featuredImage: '/images/prev.jpg',
  };

  const mockNextArticle = {
    id: '2',
    title: '下一篇测试文章',
    slug: 'next-post',
    excerpt: '这是下一篇文章的摘要',
    featuredImage: '/images/next.jpg',
  };

  it('应该渲染上一篇和下一篇文章', () => {
    render(
      <ArticleNavigation
        previousArticle={mockPreviousArticle}
        nextArticle={mockNextArticle}
      />
    );

    expect(screen.getByText('上一篇测试文章')).toBeInTheDocument();
    expect(screen.getByText('下一篇测试文章')).toBeInTheDocument();
  });

  it('只应该渲染下一篇，当没有上一篇时', () => {
    render(
      <ArticleNavigation nextArticle={mockNextArticle} />
    );

    expect(screen.getByText('下一篇测试文章')).toBeInTheDocument();
    expect(screen.queryByText('上一篇测试文章')).not.toBeInTheDocument();
  });

  it('只应该渲染上一篇，当没有下一篇时', () => {
    render(
      <ArticleNavigation previousArticle={mockPreviousArticle} />
    );

    expect(screen.getByText('上一篇测试文章')).toBeInTheDocument();
    expect(screen.queryByText('下一篇测试文章')).not.toBeInTheDocument();
  });

  it('应该链接到正确的文章页面', () => {
    render(
      <ArticleNavigation
        previousArticle={mockPreviousArticle}
        nextArticle={mockNextArticle}
      />
    );

    const prevLink = screen.getByText('上一篇测试文章').closest('a');
    const nextLink = screen.getByText('下一篇测试文章').closest('a');

    expect(prevLink).toHaveAttribute('href', '/blog/previous-post');
    expect(nextLink).toHaveAttribute('href', '/blog/next-post');
  });

  it('应该在悬浮时显示摘要', () => {
    render(
      <ArticleNavigation
        previousArticle={mockPreviousArticle}
        nextArticle={mockNextArticle}
      />
    );

    const prevCard = screen.getByText('上一篇').closest('a');
    fireEvent.mouseEnter(prevCard!);

    expect(screen.getByText('这是上一篇文章的摘要')).toBeInTheDocument();
  });

  it('当showThumbnails为false时不应该显示缩略图', () => {
    const { container } = render(
      <ArticleNavigation
        previousArticle={mockPreviousArticle}
        nextArticle={mockNextArticle}
        showThumbnails={false}
      />
    );

    const images = container.querySelectorAll('img');
    expect(images.length).toBe(0);
  });
});
