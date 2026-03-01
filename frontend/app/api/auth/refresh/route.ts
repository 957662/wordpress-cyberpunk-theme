/**
 * 令牌刷新 API 路由
 * POST /api/auth/refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 验证 schema
const refreshSchema = z.object({
  refresh_token: z.string().min(1, '刷新令牌不能为空'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求体
    const validatedData = refreshSchema.parse(body);

    // 调用 WordPress 刷新令牌 API
    const wordpressApiUrl = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json';

    const response = await fetch(`${wordpressApiUrl}/cyberpress/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: validatedData.refresh_token,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || '令牌刷新失败',
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 返回成功响应
    return NextResponse.json({
      success: true,
      token: data.token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    });

  } catch (error: any) {
    // Zod 验证错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0].message,
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // 其他错误
    console.error('Token refresh error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}

// OPTIONS 处理（CORS 预检）
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
