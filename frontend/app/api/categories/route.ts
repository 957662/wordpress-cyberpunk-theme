/**
 * Categories API Route
 * 分类API路由
 */

import { NextRequest, NextResponse } from 'next/server';
import { postService } from '@/lib/services/post.service';

/**
 * GET /api/categories
 * 获取分类列表
 */
export async function GET(request: NextRequest) {
  try {
    const categories = await postService.getCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error('Categories API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
