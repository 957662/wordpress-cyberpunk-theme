/**
 * RSS Feed API Route
 * 提供多种格式的订阅源
 */

import { NextRequest } from 'next/server';
import { generateFeedHandler, createRSSItemFromPost } from '@/lib/rss/generator';
import { getWordPress } from '@/lib/wordpress/api';
import { siteConfig } from '@/lib/config/site';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 获取最新文章
    const wp = getWordPress();
    const posts = await wp.getPosts({
      per_page: 20,
      status: 'publish',
    });

    // 转换为 RSS 项
    const items = posts.data.map((post: any) =>
      createRSSItemFromPost({
        id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        excerpt: post.excerpt?.rendered || '',
        content: post.content?.rendered || '',
        date: post.date,
        author: post._embedded?.author?.[0]?.name,
        categories: post._embedded?.['wp:term']?.[0]?.map((cat: any) => cat.name),
        tags: post._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name),
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      })
    );

    // 生成订阅源配置
    const feedConfig = {
      title: siteConfig.name,
      description: siteConfig.description,
      link: siteConfig.url,
      language: 'zh-CN',
      copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
      managingEditor: siteConfig.links.email,
      webMaster: siteConfig.links.email,
      category: ['Technology', 'Web Development', 'Design'],
      ttl: 60,
    };

    // 生成订阅源
    return generateFeedHandler(req as any, feedConfig, items);
  } catch (error) {
    console.error('Feed generation error:', error);
    return new Response('Failed to generate feed', { status: 500 });
  }
}

// 支持 HEAD 请求
export async function HEAD(req: NextRequest) {
  const response = await GET(req);
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}
