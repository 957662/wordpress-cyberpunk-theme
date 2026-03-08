/**
 * Realtime Service
 * 实时通信服务 - 处理所有实时功能
 * 包括：通知、评论、点赞、关注等
 */

import { WebSocketClient, WebSocketMessage } from '@/lib/websocket/websocket-client';

export interface NotificationData {
  id: string;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  postId?: string;
  postTitle?: string;
  createdAt: string;
  read: boolean;
}

export interface CommentData {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface LikeData {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface FollowData {
  id: string;
  followerId: string;
  followerName: string;
  followerAvatar?: string;
  followingId: string;
  createdAt: string;
}

class RealtimeService {
  private wsClient: WebSocketClient | null = null;
  private notificationHandlers: Set<(notification: NotificationData) => void> = new Set();
  private commentHandlers: Set<(comment: CommentData) => void> = new Set();
  private likeHandlers: Set<(like: LikeData) => void> = new Set();
  private followHandlers: Set<(follow: FollowData) => void> = new Set();

  /**
   * 初始化实时服务
   */
  async initialize(wsUrl?: string): Promise<void> {
    if (this.wsClient) {
      return;
    }

    const url = wsUrl || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/realtime';

    this.wsClient = new WebSocketClient({
      url,
      debug: process.env.NODE_ENV === 'development',
    });

    // 订阅各种消息类型
    this.wsClient.subscribe('notification', this.handleNotification.bind(this));
    this.wsClient.subscribe('comment', this.handleComment.bind(this));
    this.wsClient.subscribe('like', this.handleLike.bind(this));
    this.wsClient.subscribe('follow', this.handleFollow.bind(this));

    // 连接 WebSocket
    await this.wsClient.connect();
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.wsClient) {
      this.wsClient.disconnect();
      this.wsClient = null;
    }
  }

  /**
   * 订阅通知
   */
  onNotification(handler: (notification: NotificationData) => void): () => void {
    this.notificationHandlers.add(handler);
    return () => {
      this.notificationHandlers.delete(handler);
    };
  }

  /**
   * 订阅评论
   */
  onComment(handler: (comment: CommentData) => void): () => void {
    this.commentHandlers.add(handler);
    return () => {
      this.commentHandlers.delete(handler);
    };
  }

  /**
   * 订阅点赞
   */
  onLike(handler: (like: LikeData) => void): () => void {
    this.likeHandlers.add(handler);
    return () => {
      this.likeHandlers.delete(handler);
    };
  }

  /**
   * 订阅关注
   */
  onFollow(handler: (follow: FollowData) => void): () => void {
    this.followHandlers.add(handler);
    return () => {
      this.followHandlers.delete(handler);
    };
  }

  /**
   * 发送评论
   */
  sendComment(postId: string, content: string): void {
    if (!this.wsClient) {
      throw new Error('WebSocket client not initialized');
    }
    this.wsClient.send('comment', { postId, content });
  }

  /**
   * 发送点赞
   */
  sendLike(postId: string): void {
    if (!this.wsClient) {
      throw new Error('WebSocket client not initialized');
    }
    this.wsClient.send('like', { postId });
  }

  /**
   * 发送关注
   */
  sendFollow(userId: string): void {
    if (!this.wsClient) {
      throw new Error('WebSocket client not initialized');
    }
    this.wsClient.send('follow', { userId });
  }

  /**
   * 标记通知为已读
   */
  markNotificationAsRead(notificationId: string): void {
    if (!this.wsClient) {
      throw new Error('WebSocket client not initialized');
    }
    this.wsClient.send('notification', { action: 'mark_read', notificationId });
  }

  /**
   * 获取连接状态
   */
  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    return this.wsClient?.getStatus() || 'disconnected';
  }

  /**
   * 处理通知消息
   */
  private handleNotification(message: WebSocketMessage): void {
    const notification = message.data as NotificationData;
    this.notificationHandlers.forEach((handler) => {
      try {
        handler(notification);
      } catch (error) {
        console.error('Error in notification handler:', error);
      }
    });
  }

  /**
   * 处理评论消息
   */
  private handleComment(message: WebSocketMessage): void {
    const comment = message.data as CommentData;
    this.commentHandlers.forEach((handler) => {
      try {
        handler(comment);
      } catch (error) {
        console.error('Error in comment handler:', error);
      }
    });
  }

  /**
   * 处理点赞消息
   */
  private handleLike(message: WebSocketMessage): void {
    const like = message.data as LikeData;
    this.likeHandlers.forEach((handler) => {
      try {
        handler(like);
      } catch (error) {
        console.error('Error in like handler:', error);
      }
    });
  }

  /**
   * 处理关注消息
   */
  private handleFollow(message: WebSocketMessage): void {
    const follow = message.data as FollowData;
    this.followHandlers.forEach((handler) => {
      try {
        handler(follow);
      } catch (error) {
        console.error('Error in follow handler:', error);
      }
    });
  }
}

// 创建单例
const realtimeService = new RealtimeService();

export default realtimeService;

// 导出类型
export type { NotificationData, CommentData, LikeData, FollowData };
