import { NextRequest, NextResponse } from 'next/server';

interface ViewsData {
  date: string;
  views: number;
}

interface ActivityItem {
  id: string;
  type: 'post' | 'comment' | 'user';
  title: string;
  date: string;
  author: string;
}

interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  totalComments: number;
  publishedPosts: number;
  draftPosts: number;
  recentActivity: ActivityItem[];
  viewsOverTime: ViewsData[];
}

// 生成模拟数据
function generateDashboardStats(range: string): DashboardStats {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const now = new Date();

  // 生成浏览量数据
  const viewsOverTime: ViewsData[] = Array.from({ length: days }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - i));
    return {
      date: date.toISOString(),
      views: Math.floor(Math.random() * 1000) + 100,
    };
  });

  // 总浏览量
  const totalViews = viewsOverTime.reduce((sum, item) => sum + item.views, 0);

  // 生成最近活动
  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'post',
      title: '发布了新文章《深入理解 React 18 的并发特性》',
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      author: 'Admin',
    },
    {
      id: '2',
      type: 'comment',
      title: '评论了文章《TypeScript 高级类型指南》',
      date: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      author: 'User123',
    },
    {
      id: '3',
      type: 'user',
      title: '新用户注册：developer@example.com',
      date: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      author: 'System',
    },
    {
      id: '4',
      type: 'post',
      title: '更新了文章《Next.js 14 最佳实践》',
      date: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      author: 'Editor',
    },
    {
      id: '5',
      type: 'comment',
      title: '评论了文章《Docker 容器化实践》',
      date: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      author: 'CoderX',
    },
  ];

  return {
    totalPosts: 156,
    totalUsers: 1243,
    totalViews,
    totalComments: 892,
    publishedPosts: 142,
    draftPosts: 14,
    recentActivity,
    viewsOverTime,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '30d';

    // 验证授权
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 在实际应用中，这里应该：
    // 1. 验证 JWT token
    // 2. 检查用户权限
    // 3. 从数据库查询真实数据
    // 4. 可能使用缓存提高性能

    // 生成并返回统计数据
    const stats = generateDashboardStats(range);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
