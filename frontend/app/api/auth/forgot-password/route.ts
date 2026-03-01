/**
 * 忘记密码 API 路由
 * POST /api/auth/forgot-password
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 验证 schema
const forgotPasswordSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求体
    const validatedData = forgotPasswordSchema.parse(body);

    // 调用 WordPress API
    const wordpressApiUrl = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json';

    const response = await fetch(`${wordpressApiUrl}/cyberpress/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validatedData.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || '请求失败',
        },
        { status: response.status }
      );
    }

    // 返回成功响应（无论邮箱是否存在都返回成功，防止邮箱枚举）
    return NextResponse.json({
      success: true,
      message: '如果该邮箱已注册，您将收到密码重置链接',
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
    console.error('Forgot password error:', error);
    return NextResponse.json(
      {
        success: true, // 仍返回成功，防止邮箱枚举
        message: '如果该邮箱已注册，您将收到密码重置链接',
      },
      { status: 200 }
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
