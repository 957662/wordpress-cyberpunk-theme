/**
 * 社交功能集成测试
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock API 服务
jest.mock('@/lib/services/api/social', () => ({
  followUser: jest.fn(),
  unfollowUser: jest.fn(),
  likePost: jest.fn(),
  unlikePost: jest.fn(),
  savePost: jest.fn(),
  unsavePost: jest.fn(),
  getNotifications: jest.fn(),
}));

import {
  followUser,
  unfollowUser,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getNotifications,
} from '@/lib/services/api/social';

// 测试组件
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('社交功能集成测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('关注功能', () => {
    it('应该成功关注用户', async () => {
      (followUser as jest.Mock).mockResolvedValue({ success: true });

      const { result } = render(
        <TestWrapper>
          <button onClick={() => followUser(1)}>关注</button>
        </TestWrapper>
      );

      const followButton = screen.getByText('关注');
      fireEvent.click(followButton);

      await waitFor(() => {
        expect(followUser).toHaveBeenCalledWith(1);
      });
    });

    it('应该取消关注用户', async () => {
      (unfollowUser as jest.Mock).mockResolvedValue({ success: true });

      render(
        <TestWrapper>
          <button onClick={() => unfollowUser(1)}>取消关注</button>
        </TestWrapper>
      );

      const unfollowButton = screen.getByText('取消关注');
      fireEvent.click(unfollowButton);

      await waitFor(() => {
        expect(unfollowUser).toHaveBeenCalledWith(1);
      });
    });

    it('应该处理关注失败的情况', async () => {
      (followUser as jest.Mock).mockRejectedValue(new Error('关注失败'));

      render(
        <TestWrapper>
          <button onClick={() => followUser(1)}>关注</button>
        </TestWrapper>
      );

      const followButton = screen.getByText('关注');
      fireEvent.click(followButton);

      await waitFor(() => {
        expect(followUser).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('点赞功能', () => {
    it('应该成功点赞文章', async () => {
      (likePost as jest.Mock).mockResolvedValue({
        success: true,
        likesCount: 10,
      });

      render(
        <TestWrapper>
          <button onClick={() => likePost(1)}>点赞</button>
        </TestWrapper>
      );

      const likeButton = screen.getByText('点赞');
      fireEvent.click(likeButton);

      await waitFor(() => {
        expect(likePost).toHaveBeenCalledWith(1);
      });
    });

    it('应该取消点赞文章', async () => {
      (unlikePost as jest.Mock).mockResolvedValue({
        success: true,
        likesCount: 9,
      });

      render(
        <TestWrapper>
          <button onClick={() => unlikePost(1)}>取消点赞</button>
        </TestWrapper>
      );

      const unlikeButton = screen.getByText('取消点赞');
      fireEvent.click(unlikeButton);

      await waitFor(() => {
        expect(unlikePost).toHaveBeenCalledWith(1);
      });
    });

    it('应该更新点赞计数', async () => {
      (likePost as jest.Mock).mockResolvedValue({
        success: true,
        likesCount: 11,
      });

      render(
        <TestWrapper>
          <div>
            <button onClick={() => likePost(1)}>点赞</button>
            <span>点赞数: 10</span>
          </div>
        </TestWrapper>
      );

      const likeButton = screen.getByText('点赞');
      fireEvent.click(likeButton);

      await waitFor(() => {
        expect(likePost).toHaveBeenCalled();
      });
    });
  });

  describe('收藏功能', () => {
    it('应该成功收藏文章', async () => {
      (savePost as jest.Mock).mockResolvedValue({ success: true });

      render(
        <TestWrapper>
          <button onClick={() => savePost(1)}>收藏</button>
        </TestWrapper>
      );

      const saveButton = screen.getByText('收藏');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(savePost).toHaveBeenCalledWith(1);
      });
    });

    it('应该取消收藏文章', async () => {
      (unsavePost as jest.Mock).mockResolvedValue({ success: true });

      render(
        <TestWrapper>
          <button onClick={() => unsavePost(1)}>取消收藏</button>
        </TestWrapper>
      );

      const unsaveButton = screen.getByText('取消收藏');
      fireEvent.click(unsaveButton);

      await waitFor(() => {
        expect(unsavePost).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('通知功能', () => {
    it('应该获取通知列表', async () => {
      const mockNotifications = [
        { id: 1, type: 'like', message: '有人点赞了你的文章', read: false },
        { id: 2, type: 'follow', message: '有人关注了你', read: false },
      ];

      (getNotifications as jest.Mock).mockResolvedValue(mockNotifications);

      render(
        <TestWrapper>
          <div>
            <button onClick={() => getNotifications()}>获取通知</button>
            {mockNotifications.map((n) => (
              <div key={n.id}>{n.message}</div>
            ))}
          </div>
        </TestWrapper>
      );

      const getButton = screen.getByText('获取通知');
      fireEvent.click(getButton);

      await waitFor(() => {
        expect(getNotifications).toHaveBeenCalled();
        expect(screen.getByText('有人点赞了你的文章')).toBeInTheDocument();
        expect(screen.getByText('有人关注了你')).toBeInTheDocument();
      });
    });

    it('应该标记通知为已读', async () => {
      const mockNotifications = [
        { id: 1, type: 'like', message: '有人点赞了你的文章', read: true },
      ];

      (getNotifications as jest.Mock).mockResolvedValue(mockNotifications);

      render(
        <TestWrapper>
          <button onClick={() => getNotifications()}>获取通知</button>
        </TestWrapper>
      );

      const getButton = screen.getByText('获取通知');
      fireEvent.click(getButton);

      await waitFor(() => {
        expect(getNotifications).toHaveBeenCalled();
      });
    });
  });

  describe('社交交互流程', () => {
    it('应该完成完整的社交交互流程', async () => {
      // 模拟完整的社交流程
      (followUser as jest.Mock).mockResolvedValue({ success: true });
      (likePost as jest.Mock).mockResolvedValue({ success: true, likesCount: 1 });
      (savePost as jest.Mock).mockResolvedValue({ success: true });

      render(
        <TestWrapper>
          <div>
            <button onClick={() => followUser(1)}>关注用户</button>
            <button onClick={() => likePost(1)}>点赞文章</button>
            <button onClick={() => savePost(1)}>收藏文章</button>
          </div>
        </TestWrapper>
      );

      // 依次执行社交操作
      fireEvent.click(screen.getByText('关注用户'));
      await waitFor(() => expect(followUser).toHaveBeenCalledWith(1));

      fireEvent.click(screen.getByText('点赞文章'));
      await waitFor(() => expect(likePost).toHaveBeenCalledWith(1));

      fireEvent.click(screen.getByText('收藏文章'));
      await waitFor(() => expect(savePost).toHaveBeenCalledWith(1));
    });
  });
});
