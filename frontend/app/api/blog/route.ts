/**
 * Blog API Route
 * 博客 API 路由
 * 提供 Next.js 服务端渲染支持
 */

import { NextRequest, NextResponse } from 'next/server';
import { wordpressDataService } from '@/services/blog/wordpress-data-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/blog
 * 获取文章列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 解析查询参数
    const page = parseInt(searchParams.get('page') || '1', 10);
    const per_page = parseInt(searchParams.get('per_page') || '10', 10);
    const categories = searchParams.get('categories')
      ? searchParams.get('categories')!.split(',').map(Number)
      : undefined;
    const tags = searchParams.get('tags')
      ? searchParams.get('tags')!.split(',').map(Number)
      : undefined;
    const search = searchParams.get('search') || undefined;
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';
    const orderby = searchParams.get('orderby') || 'date';
    const sticky = searchParams.get('sticky') === 'true';

    // 获取数据
    const data = await wordpressDataService.getPosts({
      page,
      per_page,
      categories,
      tags,
      search,
      order,
      orderby,
      sticky,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in blog API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog
 * 创建文章（如果需要）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: 实现文章创建逻辑
    // 这里需要根据你的后端 API 实现

    return NextResponse.json({
      success: false,
      error: 'Not implemented',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
