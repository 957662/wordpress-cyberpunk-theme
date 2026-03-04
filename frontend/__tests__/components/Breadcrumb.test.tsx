import { render, screen } from '@testing-library/react';
import { Breadcrumb } from '@/components/common/Breadcrumb';

describe('Breadcrumb', () => {
  it('renders breadcrumb items correctly', () => {
    const items = [
      { label: '首页', href: '/' },
      { label: '博客', href: '/blog' },
      { label: '文章详情', href: '/blog/post-1' },
    ];

    render(<Breadcrumb items={items} />);

    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('博客')).toBeInTheDocument();
    expect(screen.getByText('文章详情')).toBeInTheDocument();
  });

  it('renders non-link items correctly', () => {
    const items = [
      { label: '首页', href: '/' },
      { label: '当前页面' },
    ];

    render(<Breadcrumb items={items} />);

    expect(screen.getByText('当前页面')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const items = [{ label: '首页', href: '/' }];
    const { container } = render(<Breadcrumb items={items} className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('uses custom home href', () => {
    const items = [{ label: '页面', href: '/page' }];
    render(<Breadcrumb items={items} homeHref="/home" />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/home');
  });
});
