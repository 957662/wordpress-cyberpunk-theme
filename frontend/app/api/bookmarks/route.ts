/**
 * Bookmarks API Route
 * 处理收藏的增删改查
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// 模拟数据库（实际项目中应使用真实数据库）
const bookmarksDb = new Map();

// GET /api/bookmarks - 获取收藏列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const folderId = searchParams.get('folderId');
    const targetType = searchParams.get('targetType') as 'post' | 'comment' | null;

    // 模拟数据
    const mockBookmarks = {
      items: [],
      total: 0,
      page,
      pageSize,
      hasMore: false,
    };

    return NextResponse.json(mockBookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/bookmarks - 添加收藏
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetId, targetType, folderId } = body;

    // 验证必填字段
    if (!targetId || !targetType) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'targetId and targetType are required' },
        { status: 400 }
      );
    }

    // 验证 targetType
    if (!['post', 'comment'].includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid targetType', message: 'targetType must be either "post" or "comment"' },
        { status: 400 }
      );
    }

    // 模拟创建收藏
    const bookmark = {
      id: `bookmark_${Date.now()}`,
      userId: 'current_user_id', // 实际应从 session 获取
      targetId,
      targetType,
      folderId,
      createdAt: new Date().toISOString(),
    };

    // 保存到模拟数据库
    bookmarksDb.set(bookmark.id, bookmark);

    // 重新验证相关页面
    revalidatePath('/bookmarks');
    if (targetType === 'post') {
      revalidatePath(`/blog/${targetId}`);
    }

    return NextResponse.json({
      success: true,
      bookmarked: true,
      bookmarksCount: 1,
      data: bookmark,
    });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH /api/bookmarks - 更新收藏
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookmarkId, folderId } = body;

    if (!bookmarkId) {
      return NextResponse.json(
        { error: 'Missing bookmarkId', message: 'bookmarkId is required' },
        { status: 400 }
      );
    }

    // 模拟更新
    const bookmark = bookmarksDb.get(bookmarkId);
    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found', message: 'The specified bookmark does not exist' },
        { status: 404 }
      );
    }

    const updated = { ...bookmark, folderId, updatedAt: new Date().toISOString() };
    bookmarksDb.set(bookmarkId, updated);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to update bookmark', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks/:id - 删除收藏
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get('id') || searchParams.get('targetId');

    if (!bookmarkId) {
      return NextResponse.json(
        { error: 'Missing bookmark identifier', message: 'Either id or targetId must be provided' },
        { status: 400 }
      );
    }

    // 模拟删除
    const existed = bookmarksDb.has(bookmarkId);
    bookmarksDb.delete(bookmarkId);

    // 重新验证相关页面
    revalidatePath('/bookmarks');

    return NextResponse.json({
      success: true,
      bookmarked: false,
      bookmarksCount: 0,
    });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
