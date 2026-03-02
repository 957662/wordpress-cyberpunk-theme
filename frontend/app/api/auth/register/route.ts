import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // TODO: 实现实际的注册逻辑
    // 1. 验证输入数据
    // 2. 检查邮箱是否已存在
    // 3. 创建用户记录
    // 4. 发送验证邮件
    // 5. 生成 JWT token
    // 6. 返回用户信息和 token

    // 模拟成功响应
    return NextResponse.json({
      user: {
        id: '1',
        name: name,
        email: email,
        role: 'user',
        avatar: '/avatars/default.png',
        createdAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token',
    });
  } catch (error) {
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    );
  }
}
