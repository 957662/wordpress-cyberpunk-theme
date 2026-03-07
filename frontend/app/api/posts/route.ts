import { NextRequest, NextResponse } from 'next/server';

// 后端 API 地址
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/posts
 * 获取文章列表 - 从后端 API 获取
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published';

    // 构建后端 API URL
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/posts`);
    backendUrl.searchParams.set('page', page.toString());
    backendUrl.searchParams.set('page_size', perPage.toString());
    if (category) backendUrl.searchParams.set('category', category);
    if (search) backendUrl.searchParams.set('search', search);
    if (status) backendUrl.searchParams.set('status', status);

    // 调用后端 API
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // 如果后端失败，使用模拟数据作为 fallback
      console.warn('Backend API failed, using mock data');
      return getMockResponse(page, perPage);
    }

    const data = await response.json();

    // 转换后端数据格式为前端期望的格式
    const posts = (data.data || []).map((post: any) => ({
      id: post.id?.toString() || '',
      title: post.title || '',
      excerpt: post.excerpt || post.content?.substring(0, 150) || '',
      slug: post.slug || '',
      date: post.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      category: post.category?.name || '未分类',
      author: post.author?.username || 'CyberPress Team',
      view_count: post.view_count || 0,
      featured_image_url: post.featured_image_url || null,
    }));

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page: data.page || page,
        perPage: data.page_size || perPage,
        total: data.total || 0,
        totalPages: data.total_pages || 0,
      },
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    // 网络错误时使用模拟数据
    return getMockResponse(
      parseInt(searchParams.get('page') || '1'),
      parseInt(searchParams.get('per_page') || '10')
    );
  }
}

/**
 * 模拟数据响应（fallback）
 */
function getMockResponse(page: number, perPage: number) {
  const mockPosts = [
    {
      id: '1',
      title: 'Next.js 14 完全指南',
      excerpt: '深入了解 Next.js 14 的新特性',
      slug: 'nextjs-14-complete-guide',
      date: '2026-03-01',
      category: '前端开发',
      author: 'CyberPress Team',
      view_count: 156,
    },
    {
      id: '2',
      title: '赛博朋克设计系统',
      excerpt: '打造未来感 UI',
      slug: 'cyberpunk-design-system',
      date: '2026-02-28',
      category: 'UI 设计',
      author: 'CyberPress Team',
      view_count: 89,
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
}

/**
 * POST /api/posts
 * 创建新文章 - 调用后端 API
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

    // 获取认证 token（如果有）
    const authHeader = request.headers.get('authorization');
    
    // 调用后端 API
    const response = await fetch(`${BACKEND_URL}/api/v1/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify({
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || body.content.substring(0, 200),
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        status: body.status || 'draft',
        category_id: body.category_id,
        tags: body.tags || [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || '创建文章失败',
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        id: data.id?.toString() || Date.now().toString(),
        ...body,
        slug: data.slug || body.slug,
        date: new Date().toISOString().split('T')[0],
      },
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
