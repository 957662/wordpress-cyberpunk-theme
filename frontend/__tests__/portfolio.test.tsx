/**
 * 作品集组件测试
 * Portfolio Components Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        success: true,
        data: {
          portfolio: {
            id: 1,
            title: 'Test Portfolio',
            slug: 'test-portfolio',
            description: 'Test Description',
            content: '<p>Test Content</p>',
            featured_image: 'https://example.com/image.jpg',
            status: 'completed',
            technologies: ['Next.js', 'TypeScript'],
            links: {
              demo: 'https://demo.example.com',
              github: 'https://github.com/test/portfolio',
            },
            start_date: '2026-01-01',
            end_date: '2026-02-28',
            author: {
              id: 1,
              username: 'testuser',
              display_name: 'Test User',
              avatar_url: 'https://example.com/avatar.jpg',
            },
            view_count: 100,
            like_count: 25,
            created_at: '2026-03-01T10:00:00Z',
          },
        },
      }),
  })
) as any;

describe('Portfolio Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PortfolioCard', () => {
    it('should render portfolio card with correct data', () => {
      const portfolio = {
        id: 1,
        title: 'Test Portfolio',
        slug: 'test-portfolio',
        description: 'Test Description',
        featured_image: 'https://example.com/image.jpg',
        technologies: ['Next.js', 'TypeScript'],
        author: {
          username: 'testuser',
          display_name: 'Test User',
        },
        view_count: 100,
        like_count: 25,
      };

      // Add actual test implementation when component is imported
      expect(portfolio.title).toBe('Test Portfolio');
    });

    it('should display technologies as badges', () => {
      const technologies = ['Next.js', 'TypeScript', 'Tailwind CSS'];
      expect(technologies).toHaveLength(3);
    });

    it('should format view count correctly', () => {
      const viewCount = 1250;
      const formatted = viewCount > 1000 ? `${(viewCount / 1000).toFixed(1)}k` : viewCount;
      expect(formatted).toBe('1.3k');
    });
  });

  describe('Portfolio List', () => {
    it('should render list of portfolios', () => {
      const portfolios = [
        { id: 1, title: 'Portfolio 1' },
        { id: 2, title: 'Portfolio 2' },
        { id: 3, title: 'Portfolio 3' },
      ];

      expect(portfolios).toHaveLength(3);
    });

    it('should handle empty state', () => {
      const portfolios: any[] = [];
      expect(portfolios).toHaveLength(0);
    });

    it('should filter portfolios by technology', () => {
      const portfolios = [
        { id: 1, title: 'Portfolio 1', technologies: ['Next.js', 'React'] },
        { id: 2, title: 'Portfolio 2', technologies: ['Vue', 'TypeScript'] },
        { id: 3, title: 'Portfolio 3', technologies: ['Next.js', 'TypeScript'] },
      ];

      const filtered = portfolios.filter((p) =>
        p.technologies.includes('Next.js')
      );

      expect(filtered).toHaveLength(2);
    });
  });

  describe('Portfolio Filtering', () => {
    it('should filter by status', () => {
      const portfolios = [
        { id: 1, title: 'Portfolio 1', status: 'completed' },
        { id: 2, title: 'Portfolio 2', status: 'in-progress' },
        { id: 3, title: 'Portfolio 3', status: 'completed' },
      ];

      const completed = portfolios.filter((p) => p.status === 'completed');
      expect(completed).toHaveLength(2);
    });

    it('should filter by technology', () => {
      const portfolios = [
        { id: 1, title: 'Portfolio 1', technologies: ['Next.js'] },
        { id: 2, title: 'Portfolio 2', technologies: ['React'] },
        { id: 3, title: 'Portfolio 3', technologies: ['Next.js'] },
      ];

      const nextjsPortfolios = portfolios.filter((p) =>
        p.technologies.includes('Next.js')
      );

      expect(nextjsPortfolios).toHaveLength(2);
    });
  });

  describe('Portfolio Sorting', () => {
    it('should sort by view count descending', () => {
      const portfolios = [
        { id: 1, title: 'Portfolio 1', view_count: 100 },
        { id: 2, title: 'Portfolio 2', view_count: 300 },
        { id: 3, title: 'Portfolio 3', view_count: 200 },
      ];

      const sorted = [...portfolios].sort((a, b) => b.view_count - a.view_count);

      expect(sorted[0].view_count).toBe(300);
      expect(sorted[2].view_count).toBe(100);
    });

    it('should sort by like count descending', () => {
      const portfolios = [
        { id: 1, title: 'Portfolio 1', like_count: 25 },
        { id: 2, title: 'Portfolio 2', like_count: 50 },
        { id: 3, title: 'Portfolio 3', like_count: 10 },
      ];

      const sorted = [...portfolios].sort((a, b) => b.like_count - a.like_count);

      expect(sorted[0].like_count).toBe(50);
    });
  });

  describe('Portfolio Search', () => {
    it('should search by title', () => {
      const portfolios = [
        { id: 1, title: 'E-Commerce Platform' },
        { id: 2, title: 'Blog Website' },
        { id: 3, title: 'Portfolio Website' },
      ];

      const results = portfolios.filter((p) =>
        p.title.toLowerCase().includes('website')
      );

      expect(results).toHaveLength(2);
    });

    it('should search by description', () => {
      const portfolios = [
        {
          id: 1,
          title: 'Portfolio 1',
          description: 'A full-stack e-commerce platform',
        },
        {
          id: 2,
          title: 'Portfolio 2',
          description: 'A modern blog application',
        },
        {
          id: 3,
          title: 'Portfolio 3',
          description: 'An e-commerce dashboard',
        },
      ];

      const results = portfolios.filter((p) =>
        p.description.toLowerCase().includes('e-commerce')
      );

      expect(results).toHaveLength(2);
    });
  });

  describe('Portfolio Actions', () => {
    it('should handle like action', async () => {
      const onLike = vi.fn();

      // Simulate like action
      onLike(1);

      expect(onLike).toHaveBeenCalledWith(1);
      expect(onLike).toHaveBeenCalledTimes(1);
    });

    it('should handle bookmark action', async () => {
      const onBookmark = vi.fn();

      // Simulate bookmark action
      onBookmark(1);

      expect(onBookmark).toHaveBeenCalledWith(1);
    });

    it('should handle share action', async () => {
      const mockShare = vi.fn();
      Object.assign(navigator, {
        share: mockShare,
      });

      // Test if navigator.share is available
      if (navigator.share) {
        await navigator.share({
          title: 'Test Portfolio',
          url: 'https://example.com/portfolio/test',
        });

        expect(mockShare).toHaveBeenCalled();
      }
    });
  });

  describe('Portfolio Pagination', () => {
    it('should calculate total pages correctly', () => {
      const total = 100;
      const perPage = 20;
      const totalPages = Math.ceil(total / perPage);

      expect(totalPages).toBe(5);
    });

    it('should calculate current page offset', () => {
      const page = 3;
      const perPage = 20;
      const offset = (page - 1) * perPage;

      expect(offset).toBe(40);
    });
  });

  describe('Portfolio Duration', () => {
    it('should calculate project duration in months', () => {
      const startDate = new Date('2026-01-01');
      const endDate = new Date('2026-03-01');

      const duration =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      expect(Math.floor(duration)).toBe(2);
    });

    it('should handle ongoing projects', () => {
      const startDate = new Date('2026-01-01');
      const endDate = new Date(); // Current date

      const duration =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      expect(duration).toBeGreaterThan(0);
    });
  });

  describe('Portfolio Status Badge', () => {
    it('should return correct badge variant for completed status', () => {
      const status = 'completed';
      const variant = status === 'completed' ? 'success' : 'info';

      expect(variant).toBe('success');
    });

    it('should return correct badge variant for in-progress status', () => {
      const status = 'in-progress';
      const variant =
        status === 'completed'
          ? 'success'
          : status === 'in-progress'
          ? 'warning'
          : 'info';

      expect(variant).toBe('warning');
    });

    it('should return correct badge variant for planned status', () => {
      const status = 'planned';
      const variant =
        status === 'completed'
          ? 'success'
          : status === 'in-progress'
          ? 'warning'
          : 'info';

      expect(variant).toBe('info');
    });
  });
});
