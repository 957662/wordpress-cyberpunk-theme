/**
 * Followers List API Route
 * GET /api/social/followers/[userId] - Get list of followers for a user
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get followers
    const followers = await db.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            bio: true,
            _count: {
              select: {
                followers: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Get total count
    const total = await db.follow.count({
      where: {
        followingId: userId,
      },
    });

    // Get current session to check follow status
    // This would require session handling
    const currentUserId = null; // TODO: Get from session

    const users = followers.map((f) => ({
      id: f.follower.id,
      username: f.follower.username,
      displayName: f.follower.displayName || f.follower.username,
      avatar: f.follower.avatar,
      bio: f.follower.bio,
      followersCount: f.follower._count.followers,
      isFollowing: false, // TODO: Check if current user follows
    }));

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      hasMore: skip + users.length < total,
    });
  } catch (error) {
    console.error('Followers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
