/**
 * SEO Helper Functions
 * SEO 辅助函数
 */

import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
  canonical?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

/**
 * 生成页面元数据
 */
export function generateMetadata(props: SEOProps): Metadata {
  const {
    title = 'CyberPress - 赛博朋克博客平台',
    description = '一个融合赛博朋克美学与现代技术的博客平台，探索前沿技术、设计趋势与创意灵感。',
    image = '/og-image.png',
    keywords,
    canonical,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
  } = props;

  const siteName = 'CyberPress';
  const twitterHandle = '@cyberpress';

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    authors: authors || ['CyberPress Team'],

    OpenGraph: {
      type,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName,
      publishedTime,
      modifiedTime,
      authors,
      section,
      tags,
    },

    Twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: twitterHandle,
      site: twitterHandle,
    },

    ...(canonical && {
      alternates: {
        canonical,
      },
    }),

    // Additional meta tags
    other: {
      'article:published_time': publishedTime || '',
      'article:modified_time': modifiedTime || '',
      'article:section': section || '',
      'article:tag': tags?.join(', ') || '',
    },
  };
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateStructuredData(type: 'WebSite' | 'Article' | 'BlogPosting', data: any) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  const schemas: Record<string, any> = {
    WebSite: {
      '@type': 'WebSite',
      name: 'CyberPress',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      description: '赛博朋克风格博客平台',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: process.env.NEXT_PUBLIC_SITE_URL + '/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    Article: {
      '@type': 'Article',
      headline: data.title,
      image: data.image,
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime,
      author: {
        '@type': 'Person',
        name: data.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'CyberPress',
        logo: {
          '@type': 'ImageObject',
          url: '/logo.png',
        },
      },
      description: data.description,
    },
    BlogPosting: {
      '@type': 'BlogPosting',
      headline: data.title,
      image: data.image,
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime,
      author: {
        '@type': 'Person',
        name: data.author,
      },
      articleBody: data.content,
    },
  };

  return {
    __html: JSON.stringify({
      ...baseData,
      ...schemas[type],
    }),
  };
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return {
    __html: JSON.stringify(schema),
  };
}

/**
 * 格式化 URL (移除特殊字符)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 生成文章阅读时间
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 截取文本摘要
 */
export function createExcerpt(content: string, maxLength = 160): string {
  const text = content.replace(/<[^>]*>/g, ''); // 移除 HTML 标签
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
