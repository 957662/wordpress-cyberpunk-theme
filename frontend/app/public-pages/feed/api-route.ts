/**
 * RSS Feed 路由
 * 生成 RSS 订阅源
 */

import { wpClient } from '@/lib/wordpress/client';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour

function generateRSSFeed(posts: any[]) {
  const baseUrl = siteConfig.url;

  const items = posts
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      const content = post.content.rendered;
      const excerpt = post.excerpt.rendered;

      return `
    <item>
      <title><![CDATA[${post.title.rendered}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><![CDATA[${siteConfig.name}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}

export async function GET() {
  try {
    const { data: posts } = await wpClient.getPosts({ perPage: 20, _embed: true });
    const feed = generateRSSFeed(posts);

    return new Response(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('RSS Feed generation error:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}
