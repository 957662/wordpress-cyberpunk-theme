/**
 * Post API Routes
 * 单个文章的 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// =====================================================
// GET /api/v1/posts/:id - 获取单个文章
// =====================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 查询文章
    const post = {
      // 这里应该调用实际的数据库查询
      // await prisma.post.findUnique({
      //   where: { id },
      //   include: {
      //     author: {
      //       select: {
      //         id: true,
      //         username: true,
      //         displayName: true,
      //         avatarUrl: true,
      //         bio: true,
      //       },
      //     },
      //     category: true,
      //     tags: {
      //       select: {
      //         id: true,
      //         name: true,
      //         slug: true,
      //         color: true,
      //       },
      //     },
      //   },
      // }),
    };

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
        },
        { status: 404 }
      );
    }

    // 增加浏览次数
    // await prisma.post.update({
    //   where: { id },
    //   data: {
    //     viewsCount: {
    //       increment: 1,
    //     },
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch post',
      },
      { status: 500 }
    );
  }
}

// =====================================================
// PATCH /api/v1/posts/:id - 更新文章
// =====================================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();

    // 检查文章是否存在以及权限
    const existingPost = {
      // await prisma.post.findUnique({
      //   where: { id },
      //   select: {
      //     id: true,
      //     authorId: true,
      //   },
      // }),
    };

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
        },
        { status: 404 }
      );
    }

    // 检查权限：只有作者或管理员可以编辑
    const isAuthor = existingPost.authorId === session.user.id;
    const isAdmin = session.user.role === 'admin' || session.user.role === 'super_admin';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
        },
        { status: 403 }
      );
    }

    // 更新数据
    const updateData: any = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      categoryId: body.categoryId,
      featuredImageUrl: body.featuredImageUrl,
      status: body.status,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      metaKeywords: body.metaKeywords,
      contentType: body.contentType,
      isFeatured: body.isFeatured,
      isPinned: body.isPinned,
    };

    // 重新计算阅读时间
    if (body.content) {
      const wordsPerMinute = 200;
      const words = body.content.trim().split(/\s+/).length;
      updateData.readingTime = Math.ceil(words / wordsPerMinute);
    }

    // 如果状态改为已发布，设置发布时间
    if (body.status === 'published') {
      updateData.publishedAt = new Date();
    }

    // 更新文章
    const post = {
      // await prisma.post.update({
      //   where: { id },
      //   data: updateData,
      //   include: {
      //     author: {
      //       select: {
      //         id: true,
      //         username: true,
      //         displayName: true,
      //         avatarUrl: true,
      //       },
      //     },
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
    console.error('Error updating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update post',
      },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE /api/v1/posts/:id - 删除文章
// =====================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // 检查文章是否存在以及权限
    const existingPost = {
      // await prisma.post.findUnique({
      //   where: { id },
      //   select: {
      //     id: true,
      //     authorId: true,
      //   },
      // }),
    };

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
        },
        { status: 404 }
      );
    }

    // 检查权限
    const isAuthor = existingPost.authorId === session.user.id;
    const isAdmin = session.user.role === 'admin' || session.user.role === 'super_admin';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
        },
        { status: 403 }
      );
    }

    // 软删除
    // await prisma.post.update({
    //   where: { id },
    //   data: {
    //     deletedAt: new Date(),
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete post',
      },
      { status: 500 }
    );
  }
}
