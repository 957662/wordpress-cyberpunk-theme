/**
 * RSS Feed 生成器
 * 生成 RSS/Atom 订阅源
 */

export interface RSSFeedItem {
  title: string;
  description: string;
  content?: string;
  link: string;
  guid: string;
  pubDate: string;
  author?: string;
  categories?: string[];
  enclosure?: {
    url: string;
    type: string;
    length: number;
  };
}

export interface RSSFeedConfig {
  title: string;
  description: string;
  link: string;
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  category?: string;
  ttl?: number;
}

/**
 * RSS Feed 生成器类
 */
class RSSGenerator {
  private config: RSSFeedConfig;

  constructor(config: RSSFeedConfig) {
    this.config = config;
  }

  /**
   * 生成 RSS Feed
   */
  generate(items: RSSFeedItem[]): string {
    const now = new Date().toUTCString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${this.escapeXml(this.config.title)}</title>
    <description>${this.escapeXml(this.config.description)}</description>
    <link>${this.escapeXml(this.config.link)}</link>
    <atom:link href="${this.escapeXml(this.config.link)}/feed" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${now}</lastBuildDate>
    ${this.config.language ? `<language>${this.escapeXml(this.config.language)}</language>` : ''}
    ${this.config.copyright ? `<copyright>${this.escapeXml(this.config.copyright)}</copyright>` : ''}
    ${this.config.managingEditor ? `<managingEditor>${this.escapeXml(this.config.managingEditor)}</managingEditor>` : ''}
    ${this.config.webMaster ? `<webMaster>${this.escapeXml(this.config.webMaster)}</webMaster>` : ''}
    ${this.config.category ? `<category>${this.escapeXml(this.config.category)}</category>` : ''}
    ${this.config.ttl ? `<ttl>${this.config.ttl}</ttl>` : ''}
    ${items.map((item) => this.generateItem(item)).join('\n    ')}
  </channel>
</rss>`;
  }

  /**
   * 生成 RSS Item
   */
  private generateItem(item: RSSFeedItem): string {
    return `<item>
      <title>${this.escapeXml(item.title)}</title>
      <description>${this.escapeXml(item.description)}</description>
      ${item.content ? `<content:encoded><![CDATA[${item.content}]]></content:encoded>` : ''}
      <link>${this.escapeXml(item.link)}</link>
      <guid isPermaLink="false">${this.escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${item.author ? `<author>${this.escapeXml(item.author)}</author>` : ''}
      ${item.categories ? item.categories.map((cat) => `<category>${this.escapeXml(cat)}</category>`).join('\n      ') : ''}
      ${item.enclosure ? `<enclosure url="${this.escapeXml(item.enclosure.url)}" type="${this.escapeXml(item.enclosure.type)}" length="${item.enclosure.length}"/>` : ''}
    </item>`;
  }

  /**
   * 生成 Atom Feed
   */
  generateAtom(items: RSSFeedItem[]): string {
    const now = new Date().toISOString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${this.escapeXml(this.config.title)}</title>
  <subtitle>${this.escapeXml(this.config.description)}</subtitle>
  <link href="${this.escapeXml(this.config.link)}" rel="alternate"/>
  <link href="${this.escapeXml(this.config.link)}/feed/atom" rel="self"/>
  <updated>${now}</updated>
  ${this.config.language ? `<language>${this.escapeXml(this.config.language)}</language>` : ''}
  ${this.config.rights ? `<rights>${this.escapeXml(this.config.rights)}</rights>` : ''}
  ${items.map((item) => this.generateAtomItem(item)).join('\n  ')}
</feed>`;
  }

  /**
   * 生成 Atom Item
   */
  private generateAtomItem(item: RSSFeedItem): string {
    return `<entry>
    <title>${this.escapeXml(item.title)}</title>
    <link href="${this.escapeXml(item.link)}"/>
    <id>${this.escapeXml(item.guid)}</id>
    <updated>${item.pubDate}</updated>
    <published>${item.pubDate}</published>
    ${item.author ? `<author><name>${this.escapeXml(item.author)}</name></author>` : ''}
    ${item.content ? `<content type="html"><![CDATA[${item.content}]]></content>` : `<summary>${this.escapeXml(item.description)}</summary>`}
    ${item.categories ? item.categories.map((cat) => `<category term="${this.escapeXml(cat)}"/>`).join('\n    ') : ''}
  </entry>`;
  }

  /**
   * 生成 JSON Feed
   */
  generateJson(items: RSSFeedItem[]): string {
    const feed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: this.config.title,
      description: this.config.description,
      home_page_url: this.config.link,
      feed_url: `${this.config.link}/feed/json`,
      icon: `${this.config.link}/favicon.ico`,
      items: items.map((item) => ({
        id: item.guid,
        url: item.link,
        title: item.title,
        content_html: item.content || item.description,
        summary: item.description,
        date_published: item.pubDate,
        author: item.author ? { name: item.author } : undefined,
        tags: item.categories,
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
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * 从 WordPress 文章数据创建 RSS Item
   */
  static createItemFromPost(post: any, baseUrl: string): RSSFeedItem {
    return {
      title: post.title.rendered,
      description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      content: post.content?.rendered,
      link: `${baseUrl}/blog/${post.slug}`,
      guid: post.id.toString(),
      pubDate: new Date(post.date).toUTCString(),
      author: post.yoast_head_json?.author || post.author?.name,
      categories: post.categories?.map((c: any) => c.name),
      enclosure: post.featured_media
        ? {
            url: post.featured_media,
            type: 'image/jpeg',
            length: 0,
          }
        : undefined,
    };
  }

  /**
   * 从 WordPress 评论数据创建 RSS Item
   */
  static createItemFromComment(comment: any, baseUrl: string): RSSFeedItem {
    return {
      title: `评论 by ${comment.author_name}`,
      description: comment.content?.rendered || comment.content,
      link: `${baseUrl}/blog/${comment.post_slug}#comment-${comment.id}`,
      guid: `comment-${comment.id}`,
      pubDate: new Date(comment.date).toUTCString(),
      author: comment.author_name,
    };
  }
}

/**
 * 创建 RSS Feed
 */
export async function createRSSFeed(
  posts: any[],
  config: RSSFeedConfig
): Promise<string> {
  const generator = new RSSGenerator(config);
  const items = posts.map((post) =>
    RSSGenerator.createItemFromPost(post, config.link)
  );
  return generator.generate(items);
}

/**
 * 创建 Atom Feed
 */
export async function createAtomFeed(
  posts: any[],
  config: RSSFeedConfig
): Promise<string> {
  const generator = new RSSGenerator(config);
  const items = posts.map((post) =>
    RSSGenerator.createItemFromPost(post, config.link)
  );
  return generator.generateAtom(items);
}

/**
 * 创建 JSON Feed
 */
export async function createJsonFeed(
  posts: any[],
  config: RSSFeedConfig
): Promise<string> {
  const generator = new RSSGenerator(config);
  const items = posts.map((post) =>
    RSSGenerator.createItemFromPost(post, config.link)
  );
  return generator.generateJson(items);
}
