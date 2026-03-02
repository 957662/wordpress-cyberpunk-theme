import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // TODO: 实现实际的密码重置逻辑
    // 1. 验证邮箱是否存在
    // 2. 生成密码重置 token
    // 3. 保存 token 到数据库
    // 4. 发送密码重置邮件
    // 5. 返回成功消息

    // 模拟成功响应
    return NextResponse.json({
      message: '密码重置邮件已发送',
    });
  } catch (error) {
    return NextResponse.json(
      { error: '发送失败' },
      { status: 500 }
    );
  }
}
