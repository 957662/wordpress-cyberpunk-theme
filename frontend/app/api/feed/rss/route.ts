/**
 * RSS Feed API 路由
 * 生成 RSS/Atom/JSON 订阅源
 */

import { NextRequest, NextResponse } from 'next/server';
import { WordPressClient } from '@/lib/wordpress/client';
import {
  createRSSFeed,
  createAtomFeed,
  createJsonFeed,
} from '@/lib/rss-generator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'rss'; // rss, atom, json
    const type = searchParams.get('type') || 'posts'; // posts, comments

    const wpClient = new WordPressClient();

    // 根据类型获取数据
    let items: any[];
    let feedConfig: any;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev';

    if (type === 'posts') {
      const posts = await wpClient.getPosts({ perPage: 50 });
      items = posts;

      feedConfig = {
        title: 'CyberPress Platform',
        description: '基于 WordPress + Next.js 的赛博朋克风格博客平台',
        link: baseUrl,
        language: 'zh-CN',
      };
    } else if (type === 'comments') {
      // 暂不支持评论 Feed
      return NextResponse.json(
        {
          error: 'Comments feed not yet implemented',
        },
        { status: 501 }
      );
    } else {
      return NextResponse.json(
        {
          error: 'Invalid feed type',
        },
        { status: 400 }
      );
    }

    // 根据格式生成 Feed
    let feed: string;
    let contentType: string;

    switch (format) {
      case 'rss':
        feed = await createRSSFeed(items, feedConfig);
        contentType = 'application/rss+xml; charset=utf-8';
        break;
      case 'atom':
        feed = await createAtomFeed(items, feedConfig);
        contentType = 'application/atom+xml; charset=utf-8';
        break;
      case 'json':
        feed = await createJsonFeed(items, feedConfig);
        contentType = 'application/feed+json; charset=utf-8';
        break;
      default:
        return NextResponse.json(
          {
            error: 'Invalid feed format',
          },
          { status: 400 }
        );
    }

    return new NextResponse(feed, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // 缓存 1 小时
      },
    });
  } catch (error) {
    console.error('Failed to generate feed:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate feed',
      },
      { status: 500 }
    );
  }
}
