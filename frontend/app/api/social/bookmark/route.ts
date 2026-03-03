/**
 * Social Bookmark API Route
 * POST /api/social/bookmark - Bookmark or unbookmark an item
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
    const { item_id, item_type, action, folder_id } = body;

    if (!item_id || !item_type || !action || !['bookmark', 'unbookmark'].includes(action)) {
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

    // Get or create default folder
    let folderId = folder_id;

    if (!folderId && action === 'bookmark') {
      let defaultFolder = await db.bookmarkFolder.findFirst({
        where: {
          userId,
          isDefault: true,
        },
      });

      if (!defaultFolder) {
        defaultFolder = await db.bookmarkFolder.create({
          data: {
            userId,
            name: '默认收藏夹',
            isDefault: true,
          },
        });
      }

      folderId = defaultFolder.id;
    }

    if (action === 'bookmark') {
      // Check if already bookmarked
      const existingBookmark = await db.bookmark.findFirst({
        where: {
          userId,
          targetType: item_type,
          targetId: item_id,
        },
      });

      if (existingBookmark) {
        return NextResponse.json({
          success: true,
          bookmarked: true,
        });
      }

      // Create bookmark
      await db.bookmark.create({
        data: {
          userId,
          targetType: item_type,
          targetId: item_id,
          folderId: folderId!,
        },
      });
    } else {
      // Remove bookmark
      await db.bookmark.deleteMany({
        where: {
          userId,
          targetType: item_type,
          targetId: item_id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      bookmarked: action === 'bookmark',
    });
  } catch (error) {
    console.error('Bookmark API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
