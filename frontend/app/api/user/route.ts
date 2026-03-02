/**
 * User API - 用户相关接口
 * 包含用户信息、设置、活动等
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// GET /api/user - 获取当前用户信息
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: '请先登录' },
        { status: 401 }
      );
    }

    // 从数据库获取用户详细信息
    // const user = await db.user.findUnique({
    //   where: { id: session.user.id },
    //   include: { preferences: true },
    // });

    // 模拟用户数据
    const user = {
      id: session.user.id || '1',
      name: session.user.name || 'User',
      email: session.user.email || 'user@example.com',
      image: session.user.image,
      role: 'author',
      preferences: {
        theme: 'dark',
        language: 'zh-CN',
        emailNotifications: true,
      },
    };

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

// PUT /api/user - 更新用户信息
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: '请先登录' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, bio, website, location } = body;

    // 验证输入
    if (name && name.length < 2) {
      return NextResponse.json(
        { error: 'Bad Request', message: '名称至少需要2个字符' },
        { status: 400 }
      );
    }

    // 更新用户信息
    // const updatedUser = await db.user.update({
    //   where: { id: session.user.id },
    //   data: { name, bio, website, location },
    // });

    return NextResponse.json({
      success: true,
      message: '用户信息更新成功',
      data: body,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: '更新用户信息失败' },
      { status: 500 }
    );
  }
}

// PATCH /api/user - 部分更新用户信息
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: '请先登录' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // 部分更新
    // const updatedUser = await db.user.update({
    //   where: { id: session.user.id },
    //   data: body,
    // });

    return NextResponse.json({
      success: true,
      message: '更新成功',
      data: body,
    });
  } catch (error) {
    console.error('Error patching user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/user - 删除用户账户
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: '请先登录' },
        { status: 401 }
      );
    }

    // 验证密码
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Bad Request', message: '请提供密码以确认删除账户' },
        { status: 400 }
      );
    }

    // 验证密码并删除用户
    // await db.user.delete({
    //   where: { id: session.user.id },
    // });

    return NextResponse.json({
      success: true,
      message: '账户已删除',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: '删除账户失败' },
      { status: 500 }
    );
  }
}
