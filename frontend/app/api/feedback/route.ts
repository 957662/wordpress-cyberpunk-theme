/**
 * Feedback API Route
 * 接收用户反馈
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export interface FeedbackData {
  rating?: number;
  category: string;
  message: string;
  email?: string;
  userAgent?: string;
  timestamp: number;
}

// 存储反馈（生产环境应使用数据库）
const feedbackStore: FeedbackData[] = [];

/**
 * POST /api/feedback
 * 提交反馈
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必要字段
    if (!body.message || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 创建反馈对象
    const feedback: FeedbackData = {
      rating: body.rating,
      category: body.category,
      message: body.message,
      email: body.email,
      userAgent: request.headers.get('user-agent') || undefined,
      timestamp: Date.now(),
    };

    // 存储反馈
    feedbackStore.push(feedback);

    // 这里可以添加以下逻辑：
    // 1. 发送邮件通知
    // 2. 保存到数据库
    // 3. 集成到第三方服务（如 Intercom, Zendesk 等）
    // 4. 触发 Slack/Discord 通知

    // 示例：发送通知
    await sendNotification(feedback);

    // 重新验证首页以更新统计
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Feedback received',
      id: feedback.timestamp.toString(),
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback
 * 获取反馈列表（仅用于管理）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '50');

  let filtered = feedbackStore;

  // 按分类筛选
  if (category) {
    filtered = filtered.filter(f => f.category === category);
  }

  // 按时间倒序排序并限制数量
  const sorted = filtered
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);

  // 返回统计信息
  const stats = {
    total: feedbackStore.length,
    byCategory: getFeedbackByCategory(),
    averageRating: getAverageRating(),
  };

  return NextResponse.json({
    feedback: sorted,
    stats,
  });
}

/**
 * 发送通知
 */
async function sendNotification(feedback: FeedbackData) {
  // 在生产环境中，这里可以：
  // - 发送邮件
  // - 发送到 Slack
  // - 发送到 Discord
  // - 调用第三方 API

  console.log('New feedback received:', {
    category: feedback.category,
    rating: feedback.rating,
    message: feedback.message.substring(0, 100) + '...',
  });
}

/**
 * 按分类统计反馈
 */
function getFeedbackByCategory() {
  const stats: Record<string, number> = {};

  feedbackStore.forEach(feedback => {
    stats[feedback.category] = (stats[feedback.category] || 0) + 1;
  });

  return stats;
}

/**
 * 计算平均评分
 */
function getAverageRating() {
  const ratings = feedbackStore
    .filter(f => f.rating !== undefined)
    .map(f => f.rating as number);

  if (ratings.length === 0) return null;

  const sum = ratings.reduce((a, b) => a + b, 0);
  return (sum / ratings.length).toFixed(2);
}

// 配置路由
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
