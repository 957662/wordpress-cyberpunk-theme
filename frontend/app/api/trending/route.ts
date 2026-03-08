import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || 'all'

    // 模拟热门数据 - 在实际项目中应该从数据库或缓存获取
    const trendingPosts = [
      {
        id: '1',
        title: 'Next.js 14 App Router 完全指南',
        excerpt: '深入了解 Next.js 14 的新特性和最佳实践...',
        author: { name: '张三', avatar: '/avatars/zhang.jpg' },
        category: '前端开发',
        views: 15234,
        likes: 456,
        comments: 89,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        trend: 'up',
        trendValue: 25.6,
      },
      {
        id: '2',
        title: 'TypeScript 5.0 新特性详解',
        excerpt: '探索 TypeScript 5.0 带来的强大功能...',
        author: { name: '李四', avatar: '/avatars/li.jpg' },
        category: '编程语言',
        views: 12456,
        likes: 389,
        comments: 67,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        trend: 'up',
        trendValue: 18.3,
      },
      {
        id: '3',
        title: '使用 Tailwind CSS 构建现代 UI',
        excerpt: '学习如何使用 Tailwind CSS 快速构建美观的界面...',
        author: { name: '王五', avatar: '/avatars/wang.jpg' },
        category: 'CSS',
        views: 9876,
        likes: 267,
        comments: 45,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        trend: 'stable',
        trendValue: 5.2,
      },
    ]

    const trendingTags = [
      { name: 'Next.js', count: 234, trend: 'up' },
      { name: 'TypeScript', count: 189, trend: 'up' },
      { name: 'React', count: 167, trend: 'stable' },
      { name: 'TailwindCSS', count: 145, trend: 'up' },
      { name: 'Node.js', count: 132, trend: 'down' },
      { name: 'Vue.js', count: 98, trend: 'stable' },
      { name: 'JavaScript', count: 87, trend: 'up' },
      { name: 'CSS', count: 76, trend: 'stable' },
    ]

    const trendingAuthors = [
      { name: '张三', avatar: '/avatars/zhang.jpg', posts: 45, followers: 1234 },
      { name: '李四', avatar: '/avatars/li.jpg', posts: 38, followers: 987 },
      { name: '王五', avatar: '/avatars/wang.jpg', posts: 32, followers: 765 },
    ]

    let data: any = {}

    if (type === 'all' || type === 'posts') {
      data.posts = trendingPosts.slice(0, limit)
    }

    if (type === 'all' || type === 'tags') {
      data.tags = trendingTags.slice(0, limit)
    }

    if (type === 'all' || type === 'authors') {
      data.authors = trendingAuthors.slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Trending API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trending data',
      },
      { status: 500 }
    )
  }
}
