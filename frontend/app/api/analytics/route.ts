/**
 * Analytics API Route
 * 接收和分析应用分析数据
 */

import { NextRequest, NextResponse } from 'next/server';

export interface AnalyticsPayload {
  events: AnalyticsEvent[];
  pageViews: PageView[];
  sessionId: string;
  userId?: string;
  timestamp: number;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  duration?: number;
  timestamp: number;
}

// 存储分析数据（生产环境应使用数据库）
const analyticsStore = new Map<string, AnalyticsPayload[]>();

/**
 * POST /api/analytics
 * 接收分析数据
 */
export async function POST(request: NextRequest) {
  try {
    const payload: AnalyticsPayload = await request.json();

    // 验证必要字段
    if (!payload.sessionId || !payload.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 存储数据
    const sessionData = analyticsStore.get(payload.sessionId) || [];
    sessionData.push(payload);
    analyticsStore.set(payload.sessionId, sessionData);

    // 这里可以添加数据处理逻辑，例如：
    // - 保存到数据库
    // - 实时分析
    // - 触发告警

    return NextResponse.json({ success: true, received: payload.events.length });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics
 * 获取分析数据（仅用于开发）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (sessionId) {
    const data = analyticsStore.get(sessionId) || [];
    return NextResponse.json({ sessionId, data });
  }

  // 返回汇总统计
  const summary = {
    totalSessions: analyticsStore.size,
    totalEvents: Array.from(analyticsStore.values()).flat().length,
    recentActivity: getRecentActivity(),
  };

  return NextResponse.json(summary);
}

/**
 * DELETE /api/analytics
 * 清除分析数据
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (sessionId) {
    analyticsStore.delete(sessionId);
    return NextResponse.json({ success: true, message: 'Session deleted' });
  }

  // 清除所有数据
  analyticsStore.clear();
  return NextResponse.json({ success: true, message: 'All data cleared' });
}

/**
 * 获取最近活动
 */
function getRecentActivity() {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  let recentSessions = 0;
  let recentEvents = 0;

  for (const [sessionId, payloads] of analyticsStore.entries()) {
    const hasRecentActivity = payloads.some(
      p => p.timestamp > oneHourAgo
    );

    if (hasRecentActivity) {
      recentSessions++;
      recentEvents += payloads.filter(
        p => p.timestamp > oneHourAgo
      ).reduce((sum, p) => sum + p.events.length, 0);
    }
  }

  return {
    recentSessions,
    recentEvents,
    timeframe: 'last hour',
  };
}

// 配置路由
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
