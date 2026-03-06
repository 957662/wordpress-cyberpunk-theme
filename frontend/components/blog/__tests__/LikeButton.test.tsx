/**
 * LikeButton 组件测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LikeButton } from '../LikeButton';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ThumbsUp: () => <div data-testid="thumbs-up">ThumbsUp</div>,
  Heart: () => <div data-testid="heart">Heart</div>,
  Users: () => <div data-testid="users">Users</div>,
  X: () => <div data-testid="x">X</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, disabled }: any) => (
      <button
        data-testid="motion-button"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    ),
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('LikeButton', () => {
  const defaultProps = {
    postId: '1',
    initialLikes: 42,
    initialLiked: false,
    onLike: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('渲染', () => {
    it('应该渲染点赞按钮', () => {
      render(<LikeButton {...defaultProps} />);
      expect(screen.getByTestId('motion-button')).toBeInTheDocument();
    });

    it('应该显示点赞数量', () => {
      render(<LikeButton {...defaultProps} showCount={true} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('应该根据 initialLiked 显示不同状态', () => {
      const { rerender } = render(<LikeButton {...defaultProps} initialLiked={false} />);
      expect(screen.getByTestId('thumbs-up')).toBeInTheDocument();

      rerender(<LikeButton {...defaultProps} initialLiked={true} />);
      expect(screen.getByTestId('heart')).toBeInTheDocument();
    });

    it('应该在未点赞时显示 ThumbsUp 图标', () => {
      render(<LikeButton {...defaultProps} initialLiked={false} />);
      expect(screen.getByTestId('thumbs-up')).toBeInTheDocument();
    });

    it('应该在已点赞时显示 Heart 图标', () => {
      render(<LikeButton {...defaultProps} initialLiked={true} />);
      expect(screen.getByTestId('heart')).toBeInTheDocument();
    });
  });

  describe('交互', () => {
    it('应该在点击时调用 onLike 回调', async () => {
      render(<LikeButton {...defaultProps} />);

      const button = screen.getByTestId('motion-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(defaultProps.onLike).toHaveBeenCalledWith(true);
      });
    });

    it('应该在点赞时增加计数', async () => {
      render(<LikeButton {...defaultProps} showCount={true} />);

      const button = screen.getByTestId('motion-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });
    });

    it('应该在取消点赞时减少计数', async () => {
      render(<LikeButton {...defaultProps} initialLiked={true} showCount={true} />);

      const button = screen.getByTestId('motion-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('41')).toBeInTheDocument();
      });
    });

    it('应该在点击时切换状态', async () => {
      render(<LikeButton {...defaultProps} />);

      const button = screen.getByTestId('motion-button');

      // 第一次点击 - 点赞
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByTestId('heart')).toBeInTheDocument();
      });

      // 第二次点击 - 取消点赞
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByTestId('thumbs-up')).toBeInTheDocument();
      });
    });

    it('应该在加载时禁用按钮', async () => {
      const mockOnLike = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 1000)));
      render(<LikeButton {...defaultProps} onLike={mockOnLike} />);

      const button = screen.getByTestId('motion-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('样式变体', () => {
    it('应该支持不同尺寸', () => {
      const { rerender } = render(<LikeButton {...defaultProps} size="sm" />);
      const button = screen.getByTestId('motion-button');
      expect(button).toHaveClass('text-sm');

      rerender(<LikeButton {...defaultProps} size="md" />);
      expect(button).toHaveClass('text-md');

      rerender(<LikeButton {...defaultProps} size="lg" />);
      expect(button).toHaveClass('text-lg');
    });

    it('应该支持不同变体', () => {
      const { rerender } = render(<LikeButton {...defaultProps} variant="default" />);
      const button = screen.getByTestId('motion-button');
      expect(button).toHaveClass('bg-cyber-cyan/10');

      rerender(<LikeButton {...defaultProps} variant="outline" />);
      expect(button).toHaveClass('border-cyber-cyan/50');

      rerender(<LikeButton {...defaultProps} variant="ghost" />);
      expect(button).toHaveClass('hover:bg-cyber-cyan/10');
    });
  });

  describe('点赞列表', () => {
    it('应该在点击列表图标时显示点赞用户列表', async () => {
      render(<LikeButton {...defaultProps} showLikeList={true} />);

      const listIcon = screen.getByTestId('users');
      fireEvent.click(listIcon);

      await waitFor(() => {
        expect(screen.getByText(/点赞用户/i)).toBeInTheDocument();
      });
    });

    it('应该显示点赞用户列表', async () => {
      const mockLikedBy = [
        { id: '1', name: 'User 1', avatar: '/avatar1.jpg' },
        { id: '2', name: 'User 2', avatar: '/avatar2.jpg' },
      ];

      render(<LikeButton {...defaultProps} likedBy={mockLikedBy} showLikeList={true} />);

      const listIcon = screen.getByTestId('users');
      fireEvent.click(listIcon);

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
        expect(screen.getByText('User 2')).toBeInTheDocument();
      });
    });
  });

  describe('错误处理', () => {
    it('应该在 onLike 抛出错误时回滚状态', async () => {
      const mockOnError = vi.fn();
      const mockOnLike = vi.fn(() => Promise.reject(new Error('API Error')));

      render(<LikeButton {...defaultProps} onLike={mockOnLike} onError={mockOnError} />);

      const button = screen.getByTestId('motion-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalled();
        expect(screen.getByTestId('thumbs-up')).toBeInTheDocument(); // 状态应该回滚
      });
    });

    it('应该在失败时显示错误消息', async () => {
      const mockOnLike = vi.fn(() => Promise.reject(new Error('API Error')));
      const toast = await import('react-hot-toast');

      render(<LikeButton {...defaultProps} onLike={mockOnLike} />);

      const button = screen.getByTestId('motion-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.default.error).toHaveBeenCalledWith('操作失败，请重试');
      });
    });
  });

  describe('可访问性', () => {
    it('应该有正确的 aria-label', () => {
      render(<LikeButton {...defaultProps} />);
      const button = screen.getByTestId('motion-button');
      expect(button).toHaveAttribute('aria-label', '点赞这篇文章');
    });

    it('应该在已点赞时更新 aria-label', () => {
      render(<LikeButton {...defaultProps} initialLiked={true} />);
      const button = screen.getByTestId('motion-button');
      expect(button).toHaveAttribute('aria-label', '取消点赞');
    });

    it('应该在禁用时设置 aria-disabled', () => {
      render(<LikeButton {...defaultProps} disabled={true} />);
      const button = screen.getByTestId('motion-button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('边界情况', () => {
    it('应该处理零点赞', () => {
      render(<LikeButton {...defaultProps} initialLikes={0} showCount={true} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('应该处理大数字', () => {
      render(<LikeButton {...defaultProps} initialLikes={999999} showCount={true} />);
      expect(screen.getByText('999.9K')).toBeInTheDocument();
    });

    it('应该处理快速点击', async () => {
      render(<LikeButton {...defaultProps} />);

      const button = screen.getByTestId('motion-button');

      // 快速点击多次
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      await waitFor(() => {
        // 应该只触发一次 API 调用
        expect(defaultProps.onLike).toHaveBeenCalledTimes(1);
      });
    });
  });
});
