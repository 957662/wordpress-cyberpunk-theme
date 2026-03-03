/**
 * Following List API Route
 * GET /api/social/following/[userId] - Get list of users that a user is following
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

    // Get following
    const following = await db.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
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
        followerId: userId,
      },
    });

    const users = following.map((f) => ({
      id: f.following.id,
      username: f.following.username,
      displayName: f.following.displayName || f.following.username,
      avatar: f.following.avatar,
      bio: f.following.bio,
      followersCount: f.following._count.followers,
      isFollowing: true, // User is following these users
    }));

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      hasMore: skip + users.length < total,
    });
  } catch (error) {
    console.error('Following API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
