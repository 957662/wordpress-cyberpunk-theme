/**
 * CommentSection 组件测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentSection from '../CommentSection';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Send: () => <div data-testid="send-icon">Send</div>,
  User: () => <div data-testid="user-icon">User</div>,
  MessageSquare: () => <div data-testid="message-icon">Message</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

// Mock components
vi.mock('@/components/ui/CyberButton', () => ({
  default: ({ children, disabled, onClick, type }: any) => (
    <button
      data-testid="cyber-button"
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/CyberCard', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cyber-card">{children}</div>
  ),
}));

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  timeAgo: (date: string) => '2小时前',
}));

describe('CommentSection', () => {
  const defaultProps = {
    postId: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('渲染', () => {
    it('应该渲染评论区域', () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByText(/评论/i)).toBeInTheDocument();
    });

    it('应该显示评论数量', () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByText(/\(\d+\)/)).toBeInTheDocument();
    });

    it('应该渲染评论表单', () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByPlaceholderText(/输入你的昵称/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/写下你的评论/i)).toBeInTheDocument();
    });

    it('应该显示现有评论', () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByText('CyberFan')).toBeInTheDocument();
      expect(screen.getByText(/这款游戏确实经历了/i)).toBeInTheDocument();
    });

    it('应该显示回复', () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByText('GameMaster')).toBeInTheDocument();
      expect(screen.getByText(/同意！次世代版本/i)).toBeInTheDocument();
    });
  });

  describe('交互', () => {
    it('应该在输入时更新表单状态', () => {
      render(<CommentSection {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText(/输入你的昵称/i);
      const commentInput = screen.getByPlaceholderText(/写下你的评论/i);

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(commentInput, { target: { value: 'Test comment' } });

      expect(nameInput).toHaveValue('Test User');
      expect(commentInput).toHaveValue('Test comment');
    });

    it('应该在表单为空时禁用提交按钮', () => {
      render(<CommentSection {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /发表评论/i });
      expect(submitButton).toBeDisabled();
    });

    it('应该在表单填写完整时启用提交按钮', () => {
      render(<CommentSection {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText(/输入你的昵称/i);
      const commentInput = screen.getByPlaceholderText(/写下你的评论/i);

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(commentInput, { target: { value: 'Test comment' } });

      const submitButton = screen.getByRole('button', { name: /发表评论/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('应该在提交时添加新评论', async () => {
      render(<CommentSection {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText(/输入你的昵称/i);
      const commentInput = screen.getByPlaceholderText(/写下你的评论/i);
      const submitButton = screen.getByRole('button', { name: /发表评论/i });

      fireEvent.change(nameInput, { target: { value: 'New User' } });
      fireEvent.change(commentInput, { target: { value: 'New comment' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('New User')).toBeInTheDocument();
        expect(screen.getByText('New comment')).toBeInTheDocument();
      });
    });

    it('应该在提交后清空表单', async () => {
      render(<CommentSection {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText(/输入你的昵称/i) as HTMLInputElement;
      const commentInput = screen.getByPlaceholderText(/写下你的评论/i) as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', { name: /发表评论/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(commentInput, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(commentInput.value).toBe('');
      });
    });

    it('应该在提交时显示加载状态', async () => {
      render(<CommentSection {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText(/输入你的昵称/i);
      const commentInput = screen.getByPlaceholderText(/写下你的评论/i);
      const submitButton = screen.getByRole('button', { name: /发表评论/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(commentInput, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/发送中/i)).toBeInTheDocument();
      });
    });
  });

  describe('可访问性', () => {
    it('应该有正确的表单标签', () => {
      render(<CommentSection {...defaultProps} />);

      expect(screen.getByLabelText(/昵称/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/评论内容/i)).toBeInTheDocument();
    });

    it('应该在提交按钮上有正确的属性', () => {
      render(<CommentSection {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /发表评论/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('边界情况', () => {
    it('应该处理空评论提交', () => {
      render(<CommentSection {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText(/输入你的昵称/i);
      const commentInput = screen.getByPlaceholderText(/写下你的评论/i);
      const form = commentInput.closest('form');

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(commentInput, { target: { value: '   ' } });

      if (form) {
        fireEvent.submit(form);
      }

      // 应该不会添加评论
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });

    it('应该处理空昵称提交', () => {
      render(<CommentSection {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText(/输入你的昵称/i);
      const commentInput = screen.getByPlaceholderText(/写下你的评论/i);
      const form = commentInput.closest('form');

      fireEvent.change(nameInput, { target: { value: '   ' } });
      fireEvent.change(commentInput, { target: { value: 'Test comment' } });

      if (form) {
        fireEvent.submit(form);
      }

      // 应该不会添加评论
      expect(screen.queryByText('Test comment')).not.toBeInTheDocument();
    });
  });

  describe('UI 元素', () => {
    it('应该显示回复按钮', () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getAllByText(/回复/i)).toHaveLength(4); // 3条评论 + 1个回复
    });

    it('应该显示点赞按钮', () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getAllByText(/点赞/i)).toHaveLength(4);
    });

    it('应该在评论数量>=5时显示加载更多按钮', () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByText(/加载更多评论/i)).toBeInTheDocument();
    });
  });
});
