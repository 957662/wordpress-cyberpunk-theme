import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    const period = searchParams.get('period') || '7d'

    // 模拟数据 - 在实际项目中应该从数据库获取
    const stats = {
      overview: {
        totalViews: 125680,
        totalVisitors: 45230,
        totalPosts: 156,
        totalComments: 892,
        growth: {
          views: 12.5,
          visitors: 8.3,
          posts: 5.2,
          comments: 15.8,
        },
      },
      popular: {
        posts: [
          { id: '1', title: '如何使用 Next.js 14 构建高性能应用', views: 12580, likes: 342 },
          { id: '2', title: 'TypeScript 最佳实践指南', views: 9820, likes: 256 },
          { id: '3', title: 'React Server Components 深度解析', views: 8650, likes: 198 },
        ],
        categories: [
          { name: '前端开发', count: 45 },
          { name: '后端技术', count: 32 },
          { name: 'DevOps', count: 18 },
        ],
      },
      analytics: {
        dailyViews: [120, 132, 101, 134, 90, 230, 210],
        dailyVisitors: [45, 52, 38, 64, 42, 85, 78],
        dailyComments: [5, 8, 3, 12, 6, 15, 11],
      },
    }

    const data = stats[type as keyof typeof stats] || stats.overview

    return NextResponse.json({
      success: true,
      data,
      period,
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
      },
      { status: 500 }
    )
  }
}
