import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: 实现实际的登录逻辑
    // 1. 验证邮箱和密码
    // 2. 从数据库获取用户信息
    // 3. 生成 JWT token
    // 4. 返回用户信息和 token

    // 模拟成功响应
    return NextResponse.json({
      user: {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin',
        avatar: '/avatars/default.png',
        createdAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token',
    });
  } catch (error) {
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}
