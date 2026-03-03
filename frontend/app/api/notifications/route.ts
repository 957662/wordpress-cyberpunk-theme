/**
 * Notifications API Route
 * 处理通知的获取、标记已读、删除等
 */

import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库
const notificationsDb = new Map<string, any>();

// 生成示例通知数据
function generateMockNotifications(count: number = 20) {
  const types = ['follow', 'like', 'comment', 'mention', 'reply', 'bookmark', 'system'];
  const notifications = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const id = `notification_${Date.now()}_${i}`;

    let title = '';
    let message = '';
    let data = {};

    switch (type) {
      case 'follow':
        title = '新粉丝';
        message = 'user_xxx 开始关注你了';
        data = {
          actorId: `user_${i}`,
          actorName: `user_${i}`,
          actorAvatar: `/avatars/user_${i}.png`,
        };
        break;
      case 'like':
        title = '收到点赞';
        message = 'user_xxx 赞了你的文章';
        data = {
          actorId: `user_${i}`,
          actorName: `user_${i}`,
          targetId: `post_${i}`,
          targetType: 'post',
          targetTitle: '示例文章标题',
        };
        break;
      case 'comment':
        title = '新评论';
        message = 'user_xxx 评论了你的文章';
        data = {
          actorId: `user_${i}`,
          actorName: `user_${i}`,
          targetId: `post_${i}`,
          targetType: 'post',
          comment: '这是一条示例评论内容',
        };
        break;
      case 'mention':
        title = '被提及';
        message = 'user_xxx 在评论中提到了你';
        data = {
          actorId: `user_${i}`,
          actorName: `user_${i}`,
          targetId: `comment_${i}`,
          targetType: 'comment',
          comment: '这是提及你的评论',
        };
        break;
      case 'reply':
        title = '收到回复';
        message = 'user_xxx 回复了你的评论';
        data = {
          actorId: `user_${i}`,
          actorName: `user_${i}`,
          targetId: `comment_${i}`,
          targetType: 'comment',
          comment: '这是回复内容',
        };
        break;
      case 'bookmark':
        title = '文章被收藏';
        message = 'user_xxx 收藏了你的文章';
        data = {
          actorId: `user_${i}`,
          actorName: `user_${i}`,
          targetId: `post_${i}`,
          targetType: 'post',
          targetTitle: '示例文章标题',
        };
        break;
      case 'system':
        title = '系统通知';
        message = '这是一条系统通知消息';
        data = {};
        break;
    }

    notifications.push({
      id,
      userId: 'current_user_id',
      type,
      title,
      message,
      data,
      read: Math.random() > 0.5, // 随机已读状态
      createdAt: new Date(Date.now() - i * 60000).toISOString(),
      updatedAt: new Date(Date.now() - i * 60000).toISOString(),
    });
  }

  return notifications;
}

// GET /api/notifications - 获取通知列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const type = searchParams.get('type');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // 生成模拟数据（如果数据库为空）
    if (notificationsDb.size === 0) {
      const mockData = generateMockNotifications(50);
      mockData.forEach(n => notificationsDb.set(n.id, n));
    }

    let notifications = Array.from(notificationsDb.values());

    // 过滤
    if (type) {
      notifications = notifications.filter((n) => n.type === type);
    }
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }

    // 排序（最新的在前）
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 统计
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedNotifications = notifications.slice(start, end);

    return NextResponse.json({
      items: paginatedNotifications,
      total,
      unread,
      page,
      pageSize,
      hasMore: end < total,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - 批量操作
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, notificationIds } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action', message: 'action is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'mark-read':
        // 批量标记已读
        if (Array.isArray(notificationIds)) {
          notificationIds.forEach((id: string) => {
            const notification = notificationsDb.get(id);
            if (notification) {
              notification.read = true;
              notification.updatedAt = new Date().toISOString();
              notificationsDb.set(id, notification);
            }
          });
        }
        return NextResponse.json({ success: true, message: 'Notifications marked as read' });

      case 'mark-all-read':
        // 全部标记已读
        Array.from(notificationsDb.values()).forEach((notification) => {
          notification.read = true;
          notification.updatedAt = new Date().toISOString();
          notificationsDb.set(notification.id, notification);
        });
        return NextResponse.json({ success: true, message: 'All notifications marked as read' });

      case 'delete-multiple':
        // 批量删除
        if (Array.isArray(notificationIds)) {
          notificationIds.forEach((id: string) => {
            notificationsDb.delete(id);
          });
        }
        return NextResponse.json({ success: true, message: 'Notifications deleted' });

      default:
        return NextResponse.json(
          { error: 'Invalid action', message: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing notification action:', error);
    return NextResponse.json(
      { error: 'Failed to process action', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - 更新通知
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, action } = body;

    if (!notificationId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'notificationId and action are required' },
        { status: 400 }
      );
    }

    const notification = notificationsDb.get(notificationId);
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found', message: 'The specified notification does not exist' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'read':
        notification.read = true;
        break;
      case 'unread':
        notification.read = false;
        break;
      case 'mute':
        notification.muted = true;
        break;
      case 'unmute':
        notification.muted = false;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action', message: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    notification.updatedAt = new Date().toISOString();
    notificationsDb.set(notificationId, notification);

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - 删除通知
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'clear-all':
        // 清空所有通知
        notificationsDb.clear();
        return NextResponse.json({ success: true, message: 'All notifications cleared' });

      case 'clear-read':
        // 删除已读通知
        Array.from(notificationsDb.entries()).forEach(([id, notification]) => {
          if (notification.read) {
            notificationsDb.delete(id);
          }
        });
        return NextResponse.json({ success: true, message: 'Read notifications cleared' });

      default:
        // 删除单个通知
        const notificationId = searchParams.get('id');
        if (!notificationId) {
          return NextResponse.json(
            { error: 'Missing notification id', message: 'Either id or action must be provided' },
            { status: 400 }
          );
        }
        notificationsDb.delete(notificationId);
        return NextResponse.json({ success: true, message: 'Notification deleted' });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
