/**
 * 评论点赞 API
 */

import { NextRequest, NextResponse } from 'next/server';

// 模拟存储点赞状态
let commentLikes: Map<string, { count: number; users: string[] }> = new Map();

// POST /api/comments/like - 点赞/取消点赞评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, userId } = body;

    if (!commentId || !userId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const likes = commentLikes.get(commentId) || { count: 0, users: [] };
    const userIndex = likes.users.indexOf(userId);

    if (userIndex === -1) {
      // 点赞
      likes.count++;
      likes.users.push(userId);
    } else {
      // 取消点赞
      likes.count--;
      likes.users.splice(userIndex, 1);
    }

    commentLikes.set(commentId, likes);

    return NextResponse.json({
      likes: likes.count,
      isLiked: userIndex === -1,
    });
  } catch (error) {
    console.error('点赞失败:', error);
    return NextResponse.json(
      { error: '点赞失败' },
      { status: 500 }
    );
  }
}
