/**
 * RSS 订阅生成器
 * 为博客生成 RSS/Atom 订阅源
 */

export interface RSSFeedConfig {
  title: string;
  description: string;
  link: string;
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  category?: string[];
  ttl?: number;
}

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  content?: string;
  pubDate: Date;
  guid?: string;
  author?: string;
  category?: string[];
  enclosure?: {
    url: string;
    length: number;
    type: string;
  };
}

/**
 * 生成 RSS 2.0 订阅源
 */
export function generateRSS(config: RSSFeedConfig, items: RSSItem[]): string {
  const {
    title,
    description,
    link,
    language = 'zh-CN',
    copyright,
    managingEditor,
    webMaster,
    category: categories,
    ttl = 60,
  } = config;

  const itemsXml = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      ${item.content ? `<content:encoded><![CDATA[${item.content}]]></content:encoded>` : ''}
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <guid${item.guid && item.guid !== item.link ? ` isPermaLink="false"` : ''}>${escapeXml(item.guid || item.link)}</guid>
      ${item.author ? `<author>${escapeXml(item.author)}</author>` : ''}
      ${item.category && item.category.length > 0 ? item.category.map(cat => `<category>${escapeXml(cat)}</category>`).join('') : ''}
      ${item.enclosure ? `<enclosure url="${escapeXml(item.enclosure.url)}" length="${item.enclosure.length}" type="${escapeXml(item.enclosure.type)}" />` : ''}
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(link)}</link>
    <atom:link href="${escapeXml(link)}/rss" rel="self" type="application/rss+xml" />
    <language>${escapeXml(language)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${copyright ? `<copyright>${escapeXml(copyright)}</copyright>` : ''}
    ${managingEditor ? `<managingEditor>${escapeXml(managingEditor)}</managingEditor>` : ''}
    ${webMaster ? `<webMaster>${escapeXml(webMaster)}</webMaster>` : ''}
    ${categories && categories.length > 0 ? categories.map(cat => `<category>${escapeXml(cat)}</category>`).join('') : ''}
    <ttl>${ttl}</ttl>
    ${itemsXml}
  </channel>
</rss>`;
}

/**
 * 生成 Atom 1.0 订阅源
 */
export function generateAtom(config: RSSFeedConfig, items: RSSItem[]): string {
  const {
    title,
    description,
    link,
    language = 'zh-CN',
  } = config;

  const itemsXml = items
    .map(
      (item, index) => `
  <entry>
    <title>${escapeXml(item.title)}</title>
    <link href="${escapeXml(item.link)}" />
    <id>${escapeXml(item.guid || item.link)}</id>
    <updated>${item.pubDate.toISOString()}</updated>
    <published>${item.pubDate.toISOString()}</published>
    <summary type="html">${escapeXml(item.description)}</summary>
    ${item.content ? `<content type="html"><![CDATA[${item.content}]]></content>` : ''}
    ${item.author ? `<author><name>${escapeXml(item.author)}</name></author>` : ''}
    ${item.category && item.category.length > 0 ? item.category.map(cat => `<category term="${escapeXml(cat)}" />`).join('') : ''}
  </entry>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${escapeXml(language)}">
  <title>${escapeXml(title)}</title>
  <subtitle>${escapeXml(description)}</subtitle>
  <link href="${escapeXml(link)}" rel="alternate" />
  <link href="${escapeXml(link)}/atom" rel="self" type="application/atom+xml" />
  <updated>${items.length > 0 ? items[0].pubDate.toISOString() : new Date().toISOString()}</updated>
  <id>${escapeXml(link)}</id>
  ${itemsXml}
</feed>`;
}

/**
 * 生成 JSON Feed
 */
export function generateJSONFeed(config: RSSFeedConfig, items: RSSItem[]): string {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: config.title,
    description: config.description,
    home_page_url: config.link,
    feed_url: `${config.link}/feed.json`,
    language: config.language,
    items: items.map((item) => ({
      id: item.guid || item.link,
      url: item.link,
      title: item.title,
      content_html: item.content || item.description,
      summary: item.description,
      date_published: item.pubDate.toISOString(),
      authors: item.author ? [{ name: item.author }] : undefined,
      tags: item.category,
      attachments: item.enclosure
        ? [
            {
              url: item.enclosure.url,
              mime_type: item.enclosure.type,
              size_in_bytes: item.enclosure.length,
            },
          ]
        : undefined,
    })),
  };

  return JSON.stringify(feed, null, 2);
}

/**
 * 转义 XML 特殊字符
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 从博客文章数据生成 RSS 项
 */
export function createRSSItemFromPost(post: {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string | Date;
  author?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: string;
}): RSSItem {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const link = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    link,
    description: post.excerpt,
    content: post.content,
    pubDate: typeof post.date === 'string' ? new Date(post.date) : post.date,
    guid: post.id.toString(),
    author: post.author,
    category: [...(post.categories || []), ...(post.tags || [])],
    enclosure: post.featuredImage
      ? {
          url: post.featuredImage,
          length: 0, // 需要实际获取文件大小
          type: 'image/jpeg',
        }
      : undefined,
  };
}

/**
 * Next.js API Route 处理函数
 */
export async function generateFeedHandler(
  req: Request,
  config: RSSFeedConfig,
  items: RSSItem[]
): Promise<Response> {
  const url = new URL(req.url);
  const format = url.searchParams.get('format') || 'rss';

  let feed: string;
  let contentType: string;

  switch (format) {
    case 'atom':
      feed = generateAtom(config, items);
      contentType = 'application/atom+xml';
      break;
    case 'json':
      feed = generateJSONFeed(config, items);
      contentType = 'application/feed+json';
      break;
    case 'rss':
    default:
      feed = generateRSS(config, items);
      contentType = 'application/rss+xml';
      break;
  }

  return new Response(feed, {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

/**
 * 在页面中添加 RSS 自动发现链接
 */
export function generateRSSDiscoveryLinks(
  baseUrl: string,
  feedTypes: string[] = ['rss', 'atom', 'json']
): string {
  return feedTypes
    .map(
      (type) => `
  <link rel="alternate" type="${getFeedMimeType(type)}" href="${baseUrl}/feed?format=${type}" title="${type.toUpperCase()} Feed" />`
    )
    .join('');
}

function getFeedMimeType(format: string): string {
  switch (format) {
    case 'atom':
      return 'application/atom+xml';
    case 'json':
      return 'application/feed+json';
    case 'rss':
    default:
      return 'application/rss+xml';
  }
}
