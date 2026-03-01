/**
 * 令牌验证 API 路由
 * GET /api/auth/verify
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取令牌
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        {
          valid: false,
          message: '未提供认证令牌',
        },
        { status: 401 }
      );
    }

    // 调用 WordPress 验证 API
    const wordpressApiUrl = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json';

    const response = await fetch(`${wordpressApiUrl}/cyberpress/v1/auth/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        valid: false,
        message: '令牌无效或已过期',
      });
    }

    const data = await response.json();

    return NextResponse.json({
      valid: true,
      user: data.user,
      expires: data.expires,
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      {
        valid: false,
        message: '验证失败',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
