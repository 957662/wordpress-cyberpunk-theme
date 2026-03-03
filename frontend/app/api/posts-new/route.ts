/**
 * Posts API Route
 * 文章API路由
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/posts
 * 获取文章列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 解析查询参数
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('per_page') || '10', 10);
    const search = searchParams.get('search') || undefined;
    const categoriesStr = searchParams.get('categories');
    const tagsStr = searchParams.get('tags');
    const author = searchParams.get('author') ? parseInt(searchParams.get('author')!, 10) : undefined;
    const orderby = (searchParams.get('orderby') as any) || 'date';
    const order = (searchParams.get('order') as any) || 'desc';

    // 解析分类和标签
    const categories = categoriesStr ? categoriesStr.split(',').map(Number) : undefined;
    const tags = tagsStr ? tagsStr.split(',').map(Number) : undefined;

    // 这里应该调用 postService，暂时返回模拟数据
    const mockPosts = [
      {
        id: 1,
        title: { rendered: 'Sample Post 1' },
        excerpt: { rendered: 'This is a sample post.' },
        slug: 'sample-post-1',
        date: new Date().toISOString(),
      },
    ];

    // 返回响应
    return NextResponse.json({
      success: true,
      data: mockPosts,
      meta: {
        page,
        per_page: perPage,
        total: 1,
        total_pages: 1,
      },
    });
  } catch (error: any) {
    console.error('Posts API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch posts',
      },
      { status: 500 }
    );
  }
}
