/**
 * Search Suggestions API Route
 * 搜索建议API路由
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/services/search.service';

/**
 * GET /api/search/suggestions
 * 获取搜索建议
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim() || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // 获取建议
    const suggestions = await searchService.getSearchSuggestions(query);

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error: any) {
    console.error('Search suggestions API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch suggestions',
      },
      { status: 500 }
    );
  }
}
