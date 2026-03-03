/**
 * Search API Route
 * 搜索API路由
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/search
 * 执行搜索
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Search query is required',
        },
        { status: 400 }
      );
    }

    // 这里应该调用 searchService，暂时返回模拟数据
    const mockResults = [
      {
        type: 'post',
        id: 1,
        title: `Search result for: ${query}`,
        excerpt: 'This is a sample search result.',
        url: '/blog/sample-post',
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockResults,
      meta: {
        query,
        count: mockResults.length,
      },
    });
  } catch (error: any) {
    console.error('Search API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Search failed',
      },
      { status: 500 }
    );
  }
}
