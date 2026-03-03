/**
 * Social Like API Route
 * POST /api/social/like - Like or unlike an item
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { item_id, item_type, action } = body;

    if (!item_id || !item_type || !action || !['like', 'unlike'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    if (!['post', 'comment'].includes(item_type)) {
      return NextResponse.json(
        { error: 'Invalid item type' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    if (action === 'like') {
      // Check if already liked
      const existingLike = await db.like.findFirst({
        where: {
          userId,
          targetType: item_type,
          targetId: item_id,
        },
      });

      if (existingLike) {
        const likeCount = await db.like.count({
          where: {
            targetType: item_type,
            targetId: item_id,
          },
        });

        return NextResponse.json({
          success: true,
          liked: true,
          likesCount: likeCount,
        });
      }

      // Create like
      await db.like.create({
        data: {
          userId,
          targetType: item_type,
          targetId: item_id,
        },
      });

      // Create notification for the post/comment author
      let targetUserId: string | null = null;

      if (item_type === 'post') {
        const post = await db.post.findUnique({
          where: { id: item_id },
          select: { authorId: true },
        });
        targetUserId = post?.authorId || null;
      } else if (item_type === 'comment') {
        const comment = await db.comment.findUnique({
          where: { id: item_id },
          select: { authorId: true },
        });
        targetUserId = comment?.authorId || null;
      }

      if (targetUserId && targetUserId !== userId) {
        await db.notification.create({
          data: {
            userId: targetUserId,
            type: 'like',
            title: '新点赞',
            message: `${session.user.name || '有人'} ${item_type === 'post' ? '赞了你的文章' : '赞了你的评论'}`,
            actorId: userId,
            targetType: item_type,
            targetId: item_id,
          },
        });
      }
    } else {
      // Remove like
      await db.like.deleteMany({
        where: {
          userId,
          targetType: item_type,
          targetId: item_id,
        },
      });
    }

    // Get updated like count
    const likeCount = await db.like.count({
      where: {
        targetType: item_type,
        targetId: item_id,
      },
    });

    return NextResponse.json({
      success: true,
      liked: action === 'like',
      likesCount: likeCount,
    });
  } catch (error) {
    console.error('Like API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
