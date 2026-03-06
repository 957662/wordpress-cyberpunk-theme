/**
 * 博客 API 路由
 * Next.js API Routes for Blog
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBlogList } from '@/lib/api/blog-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/blog
 * 获取博客列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      perPage: parseInt(searchParams.get('perPage') || '10'),
      category: searchParams.get('category')
        ? parseInt(searchParams.get('category')!)
        : undefined,
      tag: searchParams.get('tag')
        ? parseInt(searchParams.get('tag')!)
        : undefined,
      search: searchParams.get('search') || undefined,
      author: searchParams.get('author')
        ? parseInt(searchParams.get('author')!)
        : undefined,
      orderBy: (searchParams.get('orderBy') as 'date' | 'title' | 'relevance') || 'date',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    };

    const result = await getBlogList(params);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in blog API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
