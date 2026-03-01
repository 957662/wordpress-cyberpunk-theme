/**
 * 注册 API 路由
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 验证 schema
const registerSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string()
    .min(8, '密码至少8个字符')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/[0-9]/, '密码必须包含至少一个数字'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求体
    const validatedData = registerSchema.parse(body);

    // 调用 WordPress 注册 API
    const wordpressApiUrl = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json';

    const response = await fetch(`${wordpressApiUrl}/cyberpress/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: validatedData.username,
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || '注册失败',
          code: errorData.code || 'REGISTRATION_FAILED',
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 返回成功响应
    return NextResponse.json({
      success: true,
      user: data.user,
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
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '服务器错误，请稍后重试',
        code: 'SERVER_ERROR',
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
