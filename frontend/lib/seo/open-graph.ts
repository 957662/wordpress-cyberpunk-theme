'use client';

/**
 * Open Graph 元数据生成工具
 * 用于生成社交媒体分享的 Open Graph 标签
 */

/**
 * Open Graph 基础类型
 */
export interface OGType {
  website?: string;
  article?: OGAArticle;
  profile?: OGProfile;
  book?: OGBook;
}

/**
 * Open Graph 文章类型
 */
export interface OGAArticle {
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  author?: string;
  section?: string;
  tag?: string[];
}

/**
 * Open Graph 个人资料类型
 */
export interface OGProfile {
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: string;
}

/**
 * Open Graph 书籍类型
 */
export interface OGBook {
  author?: string[];
  isbn?: string;
  releaseDate?: string;
  tag?: string[];
}

/**
 * Open Graph 图片配置
 */
export interface OGImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: string;
}

/**
 * Open Graph 元数据接口
 */
export interface OpenGraphMeta {
  title: string;
  description: string;
  url: string;
  siteName?: string;
  type?: string;
  locale?: string;
  images?: OGImage[];
  video?: string;
  audio?: string;
  determiner?: string;
  article?: OGAArticle;
  profile?: OGProfile;
  book?: OGBook;
}

/**
 * 生成 Open Graph 元标签
 */
export function generateOpenGraphMeta(meta: OpenGraphMeta): string {
  const tags: string[] = [];

  // 基础标签
  tags.push(`<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
  tags.push(`<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  tags.push(`<meta property="og:url" content="${escapeHtml(meta.url)}" />`);

  if (meta.siteName) {
    tags.push(`<meta property="og:site_name" content="${escapeHtml(meta.siteName)}" />`);
  }

  if (meta.type) {
    tags.push(`<meta property="og:type" content="${escapeHtml(meta.type)}" />`);
  }

  if (meta.locale) {
    tags.push(`<meta property="og:locale" content="${escapeHtml(meta.locale)}" />`);
  }

  // 图片标签
  if (meta.images && meta.images.length > 0) {
    meta.images.forEach((image) => {
      tags.push(`<meta property="og:image" content="${escapeHtml(image.url)}" />`);

      if (image.alt) {
        tags.push(`<meta property="og:image:alt" content="${escapeHtml(image.alt)}" />`);
      }

      if (image.width) {
        tags.push(`<meta property="og:image:width" content="${image.width}" />`);
      }

      if (image.height) {
        tags.push(`<meta property="og:image:height" content="${image.height}" />`);
      }

      if (image.type) {
        tags.push(`<meta property="og:image:type" content="${escapeHtml(image.type)}" />`);
      }
    });
  }

  // 视频
  if (meta.video) {
    tags.push(`<meta property="og:video" content="${escapeHtml(meta.video)}" />`);
  }

  // 音频
  if (meta.audio) {
    tags.push(`<meta property="og:audio" content="${escapeHtml(meta.audio)}" />`);
  }

  // 限定词
  if (meta.determiner) {
    tags.push(`<meta property="og:determiner" content="${escapeHtml(meta.determiner)}" />`);
  }

  // 文章特有标签
  if (meta.article && meta.type === 'article') {
    if (meta.article.publishedTime) {
      tags.push(`<meta property="article:published_time" content="${meta.article.publishedTime}" />`);
    }

    if (meta.article.modifiedTime) {
      tags.push(`<meta property="article:modified_time" content="${meta.article.modifiedTime}" />`);
    }

    if (meta.article.expirationTime) {
      tags.push(`<meta property="article:expiration_time" content="${meta.article.expirationTime}" />`);
    }

    if (meta.article.author) {
      tags.push(`<meta property="article:author" content="${escapeHtml(meta.article.author)}" />`);
    }

    if (meta.article.section) {
      tags.push(`<meta property="article:section" content="${escapeHtml(meta.article.section)}" />`);
    }

    if (meta.article.tag && meta.article.tag.length > 0) {
      meta.article.tag.forEach((tag) => {
        tags.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`);
      });
    }
  }

  // 个人资料特有标签
  if (meta.profile && meta.type === 'profile') {
    if (meta.profile.firstName) {
      tags.push(`<meta property="profile:first_name" content="${escapeHtml(meta.profile.firstName)}" />`);
    }

    if (meta.profile.lastName) {
      tags.push(`<meta property="profile:last_name" content="${escapeHtml(meta.profile.lastName)}" />`);
    }

    if (meta.profile.username) {
      tags.push(`<meta property="profile:username" content="${escapeHtml(meta.profile.username)}" />`);
    }

    if (meta.profile.gender) {
      tags.push(`<meta property="profile:gender" content="${escapeHtml(meta.profile.gender)}" />`);
    }
  }

  // 书籍特有标签
  if (meta.book && meta.type === 'book') {
    if (meta.book.author && meta.book.author.length > 0) {
      meta.book.author.forEach((author) => {
        tags.push(`<meta property="book:author" content="${escapeHtml(author)}" />`);
      });
    }

    if (meta.book.isbn) {
      tags.push(`<meta property="book:isbn" content="${escapeHtml(meta.book.isbn)}" />`);
    }

    if (meta.book.releaseDate) {
      tags.push(`<meta property="book:release_date" content="${meta.book.releaseDate}" />`);
    }

    if (meta.book.tag && meta.book.tag.length > 0) {
      meta.book.tag.forEach((tag) => {
        tags.push(`<meta property="book:tag" content="${escapeHtml(tag)}" />`);
      });
    }
  }

  return tags.join('\n');
}

/**
 * 生成 Twitter Card 元标签
 */
export interface TwitterCardMeta {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  siteId?: string;
  creator?: string;
  creatorId?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  player?: string;
  playerWidth?: number;
  playerHeight?: number;
  playerStream?: string;
  playerStreamContentType?: string;
}

export function generateTwitterCardMeta(meta: TwitterCardMeta): string {
  const tags: string[] = [];

  tags.push(`<meta name="twitter:card" content="${meta.card}" />`);

  if (meta.site) {
    tags.push(`<meta name="twitter:site" content="${escapeHtml(meta.site)}" />`);
  }

  if (meta.siteId) {
    tags.push(`<meta name="twitter:site:id" content="${meta.siteId}" />`);
  }

  if (meta.creator) {
    tags.push(`<meta name="twitter:creator" content="${escapeHtml(meta.creator)}" />`);
  }

  if (meta.creatorId) {
    tags.push(`<meta name="twitter:creator:id" content="${meta.creatorId}" />`);
  }

  tags.push(`<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`);
  tags.push(`<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);

  if (meta.image) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`);

    if (meta.imageAlt) {
      tags.push(`<meta name="twitter:image:alt" content="${escapeHtml(meta.imageAlt)}" />`);
    }
  }

  if (meta.player) {
    tags.push(`<meta name="twitter:player" content="${escapeHtml(meta.player)}" />`);

    if (meta.playerWidth) {
      tags.push(`<meta name="twitter:player:width" content="${meta.playerWidth}" />`);
    }

    if (meta.playerHeight) {
      tags.push(`<meta name="twitter:player:height" content="${meta.playerHeight}" />`);
    }

    if (meta.playerStream) {
      tags.push(`<meta name="twitter:player:stream" content="${escapeHtml(meta.playerStream)}" />`);

      if (meta.playerStreamContentType) {
        tags.push(`<meta name="twitter:player:stream:content_type" content="${escapeHtml(meta.playerStreamContentType)}" />`);
      }
    }
  }

  return tags.join('\n');
}

/**
 * HTML 转义
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 为 Next.js 生成完整的元数据对象
 */
export function generateSocialMeta({
  title,
  description,
  url,
  image,
  type = 'website',
  siteName,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
  siteName?: string;
}) {
  const ogMeta = generateOpenGraphMeta({
    title,
    description,
    url,
    type,
    siteName,
    images: image ? [{ url: image, alt: title }] : [],
  });

  const twitterMeta = generateTwitterCardMeta({
    card: image ? 'summary_large_image' : 'summary',
    title,
    description,
    image,
    imageAlt: title,
  });

  return {
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      images: image ? [{ url: image, alt: title }] : [],
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default {
  generateOpenGraphMeta,
  generateTwitterCardMeta,
  generateSocialMeta,
};
