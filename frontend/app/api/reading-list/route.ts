/**
 * 阅读列表 API 路由
 * 处理阅读列表的同步请求
 */

import { NextRequest, NextResponse } from 'next/server';

// 获取阅读列表
export async function GET(request: NextRequest) {
  try {
    // 从请求中获取用户信息（如果有认证系统）
    const userId = request.headers.get('x-user-id');

    // 这里应该从数据库获取用户的阅读列表
    // 暂时返回空数组
    return NextResponse.json({
      success: true,
      list: [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reading list',
      },
      { status: 500 }
    );
  }
}

// 同步阅读列表
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { list } = body;

    // 验证数据
    if (!Array.isArray(list)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid data format',
        },
        { status: 400 }
      );
    }

    // 从请求中获取用户信息（如果有认证系统）
    const userId = request.headers.get('x-user-id');

    // 这里应该保存到数据库
    // 暂时只返回成功响应
    return NextResponse.json({
      success: true,
      message: 'Reading list synced successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync reading list',
      },
      { status: 500 }
    );
  }
}
