/**
 * Posts API Routes
 * 文章相关的 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// =====================================================
// GET /api/v1/posts - 获取文章列表
// =====================================================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 查询参数
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const author = searchParams.get('author');
    const status = searchParams.get('status') || 'published';
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'latest';
    const featured = searchParams.get('featured') === 'true';

    // 构建查询
    const where: any = {
      status,
      deletedAt: null,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { some: { slug: tag } };
    }

    if (author) {
      where.author = { username: author };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured) {
      where.isFeatured = true;
    }

    // 排序
    let orderBy: any = {};
    switch (sort) {
      case 'popular':
        orderBy = { viewsCount: 'desc' };
        break;
      case 'most_liked':
        orderBy = { likesCount: 'desc' };
        break;
      case 'most_commented':
        orderBy = { commentsCount: 'desc' };
        break;
      case 'latest':
      default:
        orderBy = { publishedAt: 'desc' };
        break;
    }

    // 分页查询
    const [posts, total] = await Promise.all([
      // 这里应该调用实际的数据库查询
      // prisma.post.findMany({
      //   where,
      //   orderBy,
      //   skip: (page - 1) * limit,
      //   take: limit,
      //   include: {
      //     author: {
      //       select: {
      //         id: true,
      //         username: true,
      //         displayName: true,
      //         avatarUrl: true,
      //       },
      //     },
      //     category: {
      //       select: {
      //         id: true,
      //         name: true,
      //         slug: true,
      //         color: true,
      //       },
      //     },
      //     tags: {
      //       select: {
      //         id: true,
      //         name: true,
      //         slug: true,
      //       },
      //     },
      //   },
      // }),
      // prisma.post.count({ where }),
      Promise.resolve([]),
      Promise.resolve(0),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST /api/v1/posts - 创建文章
// =====================================================
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 验证必需字段
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and content are required',
        },
        { status: 400 }
      );
    }

    // 生成 slug
    const slug = body.slug || generateSlug(body.title);

    // 计算阅读时间
    const readingTime = calculateReadingTime(body.content);

    // 创建文章
    const post = {
      // 这里应该调用实际的数据库创建
      // await prisma.post.create({
      //   data: {
      //     title: body.title,
      //     slug,
      //     content: body.content,
      //     excerpt: body.excerpt,
      //     categoryId: body.categoryId,
      //     authorId: session.user.id,
      //     featuredImageUrl: body.featuredImageUrl,
      //     status: body.status || 'draft',
      //     metaTitle: body.metaTitle,
      //     metaDescription: body.metaDescription,
      //     metaKeywords: body.metaKeywords,
      //     contentType: body.contentType || 'markdown',
      //     readingTime,
      //     isFeatured: body.isFeatured || false,
      //     isPinned: body.isPinned || false,
      //     tags: body.tags ? {
      //       connect: body.tags.map((tagId: string) => ({ id: tagId }))
      //     } : undefined,
      //   },
      //   include: {
      //     author: true,
      //     category: true,
      //     tags: true,
      //   },
      // }),
    };

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create post',
      },
      { status: 500 }
    );
  }
}

// =====================================================
// 工具函数
// =====================================================

// 生成 URL slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 计算阅读时间（分钟）
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
