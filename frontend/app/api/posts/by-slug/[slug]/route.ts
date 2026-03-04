import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // 模拟数据 - 实际应该从数据库获取
    const mockPost = {
      id: 1,
      title: `文章: ${slug}`,
      excerpt: '这是一篇关于技术和设计的精彩文章...',
      slug,
      content: `
# 文章标题

这是一篇关于技术和设计的精彩文章，涵盖了前沿的技术趋势和设计理念。

## 简介

在这个快速发展的数字时代，保持学习和更新知识变得越来越重要。

## 主要内容

- 技术趋势分析
- 设计理念探讨
- 实践经验分享

## 结论

持续学习和实践是提升技能的关键。
      `,
      date: new Date().toISOString(),
      readTime: 8,
      category: {
        name: '技术',
        slug: 'tech',
        color: '#00f0ff',
      },
      author: {
        name: 'CyberPress Team',
        avatar: null,
      },
      featuredImage: null,
      tags: ['React', 'Next.js', 'TypeScript'],
    };

    return NextResponse.json(mockPost);
  } catch (error) {
    console.error('Post detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();

    // 模拟更新文章 - 实际应该更新数据库
    const updatedPost = {
      id: 1,
      slug,
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || '',
      category: body.category,
      tags: body.tags || [],
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // 模拟删除文章 - 实际应该从数据库删除
    return NextResponse.json({ message: 'Post deleted successfully', slug });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
