/**
 * Follow Stats API Route
 * GET /api/social/follow-stats/[userId] - Get follow statistics for a user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const session = await getSession();
    const currentUserId = session?.user?.id;

    // Get follower count
    const followersCount = await db.follow.count({
      where: {
        followingId: userId,
      },
    });

    // Get following count
    const followingCount = await db.follow.count({
      where: {
        followerId: userId,
      },
    });

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      const follow = await db.follow.findFirst({
        where: {
          followerId: currentUserId,
          followingId: userId,
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      followers: followersCount,
      following: followingCount,
      isFollowing,
    });
  } catch (error) {
    console.error('Follow stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
