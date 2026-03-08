import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/analytics/realtime
 * 获取实时统计数据
 */
export async function GET(request: NextRequest) {
  try {
    // 模拟实时数据
    // 在实际应用中，这里应该从数据库或缓存服务获取实时数据
    const realtimeData = {
      onlineUsers: Math.floor(Math.random() * 50) + 10,
      pageViews: Math.floor(Math.random() * 100) + 50,
      activeConnections: Math.floor(Math.random() * 20) + 5,
      serverLoad: Math.random() * 30 + 10,
      lastUpdate: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: realtimeData,
    });
  } catch (error) {
    console.error('获取实时统计失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取实时统计失败',
      },
      { status: 500 }
    );
  }
}
