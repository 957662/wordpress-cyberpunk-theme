/**
 * User Settings API - 用户设置接口
 * 处理用户偏好设置、通知设置等
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// GET /api/user/settings - 获取用户设置
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: '请先登录' },
        { status: 401 }
      );
    }

    // 从数据库获取用户设置
    // const settings = await db.userPreferences.findUnique({
    //   where: { userId: session.user.id },
    // });

    // 模拟设置数据
    const settings = {
      theme: 'dark',
      accentColor: 'cyan',
      fontSize: 'md',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      emailNotifications: true,
      pushNotifications: false,
      notificationTypes: ['comment', 'reply', 'follow', 'like'],
      profileVisible: true,
      showEmail: false,
    };

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: '获取设置失败' },
      { status: 500 }
    );
  }
}

// PUT /api/user/settings - 更新用户设置
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

    // 验证设置值
    const validThemes = ['light', 'dark', 'auto'];
    const validColors = ['cyan', 'purple', 'pink', 'yellow', 'green'];
    const validFontSizes = ['xs', 'sm', 'md', 'lg', 'xl'];

    if (body.theme && !validThemes.includes(body.theme)) {
      return NextResponse.json(
        { error: 'Bad Request', message: '无效的主题设置' },
        { status: 400 }
      );
    }

    if (body.accentColor && !validColors.includes(body.accentColor)) {
      return NextResponse.json(
        { error: 'Bad Request', message: '无效的强调色' },
        { status: 400 }
      );
    }

    if (body.fontSize && !validFontSizes.includes(body.fontSize)) {
      return NextResponse.json(
        { error: 'Bad Request', message: '无效的字体大小' },
        { status: 400 }
      );
    }

    // 更新设置
    // await db.userPreferences.upsert({
    //   where: { userId: session.user.id },
    //   create: { userId: session.user.id, ...body },
    //   update: body,
    // });

    return NextResponse.json({
      success: true,
      message: '设置已保存',
      data: body,
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: '保存设置失败' },
      { status: 500 }
    );
  }
}
