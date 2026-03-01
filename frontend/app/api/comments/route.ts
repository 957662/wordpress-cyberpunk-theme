/**
 * Comments API Route
 * 评论 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取评论列表
 * GET /api/comments?postId=123&parent=0&page=1&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');
    const parentId = searchParams.get('parent') || '0';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // TODO: 从数据库获取评论
    // 这里是模拟数据
    const comments = {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/**
 * 创建评论
 * POST /api/comments
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, content, authorName, authorEmail, parentId } = body;

    // 验证必填字段
    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    if (authorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // TODO: 保存到数据库
    const comment = {
      id: Date.now(),
      postId,
      content,
      authorName,
      authorEmail,
      parentId: parentId || 0,
      status: 'pending', // 需要审核
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
