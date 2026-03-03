/**
 * Bookmark Folders API Route
 * 处理收藏夹的增删改查
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// 模拟数据库
const foldersDb = new Map<string, any>();

// 初始化一些示例数据
if (!foldersDb.has('default')) {
  foldersDb.set('default', {
    id: 'default',
    name: '未分类',
    icon: '📁',
    color: '#6366f1',
    userId: 'current_user_id',
    _count: { bookmarks: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// GET /api/bookmarks/folders - 获取收藏夹列表
export async function GET(request: NextRequest) {
  try {
    const folders = Array.from(foldersDb.values());

    return NextResponse.json({
      success: true,
      folders,
      total: folders.length,
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/bookmarks/folders - 创建收藏夹
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon, color } = body;

    // 验证必填字段
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid name', message: 'Folder name is required and cannot be empty' },
        { status: 400 }
      );
    }

    // 检查名称是否重复
    const existing = Array.from(foldersDb.values()).find(
      (f) => f.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        { error: 'Duplicate folder', message: 'A folder with this name already exists' },
        { status: 409 }
      );
    }

    // 创建新收藏夹
    const folder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      icon: icon || '📁',
      color: color || '#6366f1',
      userId: 'current_user_id',
      _count: { bookmarks: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    foldersDb.set(folder.id, folder);

    // 重新验证相关页面
    revalidatePath('/bookmarks');

    return NextResponse.json({
      success: true,
      data: folder,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Failed to create folder', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH /api/bookmarks/folders - 更新收藏夹
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { folderId, name, icon, color } = body;

    if (!folderId) {
      return NextResponse.json(
        { error: 'Missing folderId', message: 'folderId is required' },
        { status: 400 }
      );
    }

    const folder = foldersDb.get(folderId);
    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found', message: 'The specified folder does not exist' },
        { status: 404 }
      );
    }

    // 检查名称是否重复（排除自己）
    if (name && name.trim() !== folder.name) {
      const existing = Array.from(foldersDb.values()).find(
        (f) => f.id !== folderId && f.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) {
        return NextResponse.json(
          { error: 'Duplicate folder', message: 'A folder with this name already exists' },
          { status: 409 }
        );
      }
    }

    // 更新字段
    const updated = {
      ...folder,
      name: name?.trim() || folder.name,
      icon: icon || folder.icon,
      color: color || folder.color,
      updatedAt: new Date().toISOString(),
    };

    foldersDb.set(folderId, updated);

    // 重新验证相关页面
    revalidatePath('/bookmarks');

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json(
      { error: 'Failed to update folder', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks/folders - 删除收藏夹
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('id');

    if (!folderId) {
      return NextResponse.json(
        { error: 'Missing folderId', message: 'folderId is required' },
        { status: 400 }
      );
    }

    // 不允许删除默认收藏夹
    if (folderId === 'default') {
      return NextResponse.json(
        { error: 'Cannot delete default folder', message: 'The default folder cannot be deleted' },
        { status: 400 }
      );
    }

    const folder = foldersDb.get(folderId);
    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found', message: 'The specified folder does not exist' },
        { status: 404 }
      );
    }

    foldersDb.delete(folderId);

    // 重新验证相关页面
    revalidatePath('/bookmarks');

    return NextResponse.json({
      success: true,
      message: 'Folder deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json(
      { error: 'Failed to delete folder', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
