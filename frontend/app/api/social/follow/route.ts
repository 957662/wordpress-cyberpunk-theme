/**
 * Social Follow API Route
 * POST /api/social/follow - Follow or unfollow a user
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
    const { targetUserId, action } = body;

    if (!targetUserId || !action || !['follow', 'unfollow'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Cannot follow yourself
    if (targetUserId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    if (action === 'follow') {
      // Check if already following
      const existingFollow = await db.follow.findFirst({
        where: {
          followerId: userId,
          followingId: targetUserId,
        },
      });

      if (existingFollow) {
        return NextResponse.json(
          {
            error: 'Already following this user',
            isFollowing: true,
          },
          { status: 400 }
        );
      }

      // Create follow relationship
      await db.follow.create({
        data: {
          followerId: userId,
          followingId: targetUserId,
        },
      });

      // Create notification for the target user
      await db.notification.create({
        data: {
          userId: targetUserId,
          type: 'follow',
          title: '新粉丝',
          message: `${session.user.name || '有人'} 关注了你`,
          actorId: userId,
        },
      });
    } else {
      // Remove follow relationship
      await db.follow.deleteMany({
        where: {
          followerId: userId,
          followingId: targetUserId,
        },
      });
    }

    // Get updated follower count
    const followerCount = await db.follow.count({
      where: {
        followingId: targetUserId,
      },
    });

    return NextResponse.json({
      success: true,
      isFollowing: action === 'follow',
      followersCount: followerCount,
    });
  } catch (error) {
    console.error('Follow API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
