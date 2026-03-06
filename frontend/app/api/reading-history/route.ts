/**
 * 阅读历史 API 路由
 *
 * 处理阅读历史的服务器端操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/reading-history
 * 获取用户的阅读历史
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const filter = searchParams.get('filter') || 'all'; // all, in-progress, completed

    // TODO: 从数据库获取阅读历史
    // 这里使用模拟数据
    const mockHistory = [
      {
        id: '1',
        articleId: 'article-1',
        title: '如何使用 React Hooks 构建现代化应用',
        slug: 'react-hooks-guide',
        progress: 100,
        readingTime: 600,
        lastReadAt: new Date().toISOString(),
        isCompleted: true,
        coverImage: '/images/article-1.jpg',
      },
      {
        id: '2',
        articleId: 'article-2',
        title: 'TypeScript 最佳实践指南',
        slug: 'typescript-best-practices',
        progress: 65,
        readingTime: 390,
        lastReadAt: new Date(Date.now() - 86400000).toISOString(),
        isCompleted: false,
        coverImage: '/images/article-2.jpg',
      },
      {
        id: '3',
        articleId: 'article-3',
        title: 'Next.js 14 完全入门教程',
        slug: 'nextjs-14-tutorial',
        progress: 30,
        readingTime: 180,
        lastReadAt: new Date(Date.now() - 172800000).toISOString(),
        isCompleted: false,
        coverImage: '/images/article-3.jpg',
      },
    ];

    // 应用过滤器
    let filteredHistory = mockHistory;
    if (filter === 'in-progress') {
      filteredHistory = mockHistory.filter(item => !item.isCompleted);
    } else if (filter === 'completed') {
      filteredHistory = mockHistory.filter(item => item.isCompleted);
    }

    // 应用分页
    const paginatedHistory = filteredHistory.slice(offset, offset + limit);

    return NextResponse.json({
      items: paginatedHistory,
      total: filteredHistory.length,
      hasMore: offset + limit < filteredHistory.length,
    });
  } catch (error) {
    console.error('获取阅读历史失败:', error);
    return NextResponse.json(
      { error: '获取阅读历史失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reading-history
 * 添加到阅读历史
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

    const { articleId, title, slug, progress, readingTime, isCompleted, coverImage } = body;

    if (!articleId || !title || !slug) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // TODO: 保存到数据库
    // const historyItem = await db.readingHistory.upsert({
    //   where: {
    //     userId_articleId: {
    //       userId,
    //       articleId,
    //     },
    //   },
    //   update: {
    //     title,
    //     slug,
    //     progress,
    //     readingTime,
    //     isCompleted,
    //     coverImage,
    //     lastReadAt: new Date(),
    //   },
    //   create: {
    //     userId,
    //     articleId,
    //     title,
    //     slug,
    //     progress,
    //     readingTime,
    //     isCompleted,
    //     coverImage,
    //     lastReadAt: new Date(),
    //   },
    // });

    const historyItem = {
      id: `${userId}_${articleId}`,
      articleId,
      title,
      slug,
      progress,
      readingTime,
      lastReadAt: new Date().toISOString(),
      isCompleted,
      coverImage,
    };

    return NextResponse.json({
      success: true,
      data: historyItem,
    });
  } catch (error) {
    console.error('添加阅读历史失败:', error);
    return NextResponse.json(
      { error: '添加阅读历史失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reading-history
 * 删除阅读历史
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '缺少历史记录ID' },
        { status: 400 }
      );
    }

    // TODO: 从数据库删除
    // await db.readingHistory.delete({
    //   where: {
    //     id,
    //     userId,
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除阅读历史失败:', error);
    return NextResponse.json(
      { error: '删除阅读历史失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reading-history/clear
 * 清空阅读历史
 */
export async function CLEAR(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // TODO: 清空用户的所有历史记录
    // await db.readingHistory.deleteMany({
    //   where: {
    //     userId,
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: '清空成功',
    });
  } catch (error) {
    console.error('清空阅读历史失败:', error);
    return NextResponse.json(
      { error: '清空阅读历史失败' },
      { status: 500 }
    );
  }
}
