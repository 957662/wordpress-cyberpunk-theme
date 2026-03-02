import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/posts
 * 获取文章列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // 实际应用中应该从 WordPress API 获取数据
    // const response = await wpClient.getPosts({
    //   page,
    // per_page: perPage,
    //   category: category ? parseInt(category) : undefined,
    //   search: search || undefined,
    // });

    // 模拟数据
    const mockPosts = [
      {
        id: '1',
        title: 'Next.js 14 完全指南',
        excerpt: '深入了解 Next.js 14 的新特性',
        slug: 'nextjs-14-complete-guide',
        date: '2026-03-01',
        category: '前端开发',
      },
      {
        id: '2',
        title: '赛博朋克设计系统',
        excerpt: '打造未来感 UI',
        slug: 'cyberpunk-design-system',
        date: '2026-02-28',
        category: 'UI 设计',
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockPosts,
      pagination: {
        page,
        perPage,
        total: mockPosts.length,
        totalPages: Math.ceil(mockPosts.length / perPage),
      },
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取文章列表失败',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * 创建新文章
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求数据
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: '标题和内容不能为空',
        },
        { status: 400 }
      );
    }

    // 实际应用中应该调用 WordPress API
    // const response = await wpClient.createPost(body);

    // 模拟创建文章
    const newPost = {
      id: Date.now().toString(),
      ...body,
      slug: encodeURIComponent(body.title.toLowerCase().replace(/\s+/g, '-')),
      date: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      data: newPost,
    });
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建文章失败',
      },
      { status: 500 }
    );
  }
}
