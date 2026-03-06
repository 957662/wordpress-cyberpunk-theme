/**
 * 阅读进度 API 路由
 *
 * 处理阅读进度的服务器端操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/reading-progress
 * 获取用户的阅读进度
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get('articleId');

    // TODO: 从数据库获取阅读进度
    // 这里使用模拟数据
    if (articleId) {
      const progress = {
        articleId,
        progress: 45,
        readingTime: 300,
        lastPosition: 1200,
        lastReadAt: new Date().toISOString(),
        isCompleted: false,
      };
      return NextResponse.json(progress);
    }

    // 获取所有进度
    const allProgress = {
      [userId]: [
        {
          articleId: 'article-1',
          progress: 100,
          readingTime: 600,
          lastPosition: 3000,
          lastReadAt: new Date().toISOString(),
          isCompleted: true,
        },
        {
          articleId: 'article-2',
          progress: 35,
          readingTime: 180,
          lastPosition: 800,
          lastReadAt: new Date(Date.now() - 86400000).toISOString(),
          isCompleted: false,
        },
      ],
    };

    return NextResponse.json(allProgress[userId] || []);
  } catch (error) {
    console.error('获取阅读进度失败:', error);
    return NextResponse.json(
      { error: '获取阅读进度失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reading-progress
 * 更新或创建阅读进度
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    const { articleId, progress, readingTime, lastPosition, isCompleted } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: '缺少文章ID' },
        { status: 400 }
      );
    }

    // TODO: 保存到数据库
    // await db.readingProgress.upsert({
    //   where: {
    //     userId_articleId: {
    //       userId,
    //       articleId,
    //     },
    //   },
    //   update: {
    //     progress,
    //     readingTime,
    //     lastPosition,
    //     isCompleted,
    //     lastReadAt: new Date(),
    //   },
    //   create: {
    //     userId,
    //     articleId,
    //     progress,
    //     readingTime,
    //     lastPosition,
    //     isCompleted,
    //     lastReadAt: new Date(),
    //   },
    // });

    // 如果文章完成，更新用户统计
    if (isCompleted) {
      // TODO: 更新用户成就和统计
    }

    return NextResponse.json({
      success: true,
      data: {
        articleId,
        progress,
        readingTime,
        lastPosition,
        isCompleted,
        lastReadAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('保存阅读进度失败:', error);
    return NextResponse.json(
      { error: '保存阅读进度失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reading-progress
 * 删除阅读进度
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { error: '缺少文章ID' },
        { status: 400 }
      );
    }

    // TODO: 从数据库删除
    // await db.readingProgress.delete({
    //   where: {
    //     userId_articleId: {
    //       userId,
    //       articleId,
    //     },
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除阅读进度失败:', error);
    return NextResponse.json(
      { error: '删除阅读进度失败' },
      { status: 500 }
    );
  }
}
