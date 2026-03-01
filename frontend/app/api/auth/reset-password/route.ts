/**
 * 重置密码 API 路由
 * POST /api/auth/reset-password
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 验证 schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, '重置令牌不能为空'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string()
    .min(8, '密码至少8个字符')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/[0-9]/, '密码必须包含至少一个数字'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求体
    const validatedData = resetPasswordSchema.parse(body);

    // 调用 WordPress API
    const wordpressApiUrl = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json';

    const response = await fetch(`${wordpressApiUrl}/cyberpress/v1/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: validatedData.token,
        email: validatedData.email,
        password: validatedData.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || '密码重置失败',
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '密码重置成功，请使用新密码登录',
      ...data,
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
    console.error('Reset password error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '服务器错误，请稍后重试',
      },
      { status: 500 }
    );
  }
}

// OPTIONS 处理（CORS 预检）
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
