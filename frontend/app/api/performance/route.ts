/**
 * 性能分析 API 路由
 * 接收和存储性能指标
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证数据格式
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid data format',
        },
        { status: 400 }
      );
    }

    // 这里应该将数据存储到数据库或分析服务
    // 例如：Google Analytics, Plausible, 或自定义数据库

    // 记录性能指标
    console.log('Performance metrics received:', {
      url: body.url,
      webVitals: body.webVitals,
      navigationTiming: body.navigationTiming,
      timestamp: body.timestamp,
    });

    // 存储到环境变量配置的分析服务
    const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

    if (analyticsEndpoint) {
      try {
        // 转发到分析服务
        await fetch(analyticsEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...body,
            source: 'cyberpress-platform',
          }),
        }).catch((err) => {
          console.warn('Failed to send to analytics:', err);
        });
      } catch (error) {
        console.warn('Analytics forwarding failed:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Performance metrics received',
    });
  } catch (error) {
    console.error('Failed to process performance metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process metrics',
      },
      { status: 500 }
    );
  }
}

// 获取性能统计（管理员）
export async function GET(request: NextRequest) {
  try {
    // 检查权限
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // 这里应该从数据库获取性能统计
    // 暂时返回示例数据
    return NextResponse.json({
      success: true,
      data: {
        summary: {
          averageLCP: 2500,
          averageFID: 100,
          averageCLS: 0.1,
          averageFCP: 1800,
          averageTTFB: 600,
        },
        trends: [],
        topPages: [],
      },
    });
  } catch (error) {
    console.error('Failed to fetch performance stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
      },
      { status: 500 }
    );
  }
}
