/**
 * 通知 API 路由
 * CyberPress Platform
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json({ error: '用户ID是必需的' }, { status: 400 });
    }

    // 模拟数据
    const mockNotifications = [
      {
        id: '1',
        userId,
        type: 'like',
        title: '文章收到新点赞',
        message: '张三 赞了你的文章',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId,
        type: 'comment',
        title: '文章收到新评论',
        message: '李四 评论了你的文章',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];

    let notifications = mockNotifications;
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }

    return NextResponse.json({
      notifications: notifications.slice(0, limit),
      total: notifications.length,
      unread: mockNotifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    return NextResponse.json({ error: '获取通知失败' }, { status: 500 });
  }
}
