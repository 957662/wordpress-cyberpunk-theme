/**
 * Post API Route
 * 文章 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取单个文章
 * GET /api/posts/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // TODO: 从数据库获取文章
    const post = {
      id: postId,
      title: '',
      content: '',
      // ... 其他字段
    };

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

/**
 * 更新文章
 * PUT /api/posts/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json();

    // TODO: 验证权限
    // TODO: 更新数据库

    const updatedPost = {
      id: postId,
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

/**
 * 删除文章
 * DELETE /api/posts/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // TODO: 验证权限
    // TODO: 软删除（设置状态为 trash）

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
