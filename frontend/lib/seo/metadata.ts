/**
 * SEO 元数据管理工具
 * 为页面生成优化的 meta 标签
 */

export interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
  author?: string;
  noIndex?: boolean;
  canonical?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_SEO = {
  title: 'CyberPress - 赛博朋克风格博客平台',
  description: '基于 Next.js 和 FastAPI 构建的现代化博客平台，采用赛博朋克设计风格',
  image: '/og-image.svg',
  keywords: ['blog', 'cyberpunk', 'nextjs', 'fastapi', 'typescript'],
  author: 'AI Development Team',
  type: 'website' as const,
};

/**
 * 生成完整的元数据对象
 */
export function generateMetadata(config: Partial<SEOConfig> = {}) {
  const seo = { ...DEFAULT_SEO, ...config };
  const fullTitle = seo.title === DEFAULT_SEO.title
    ? seo.title
    : `${seo.title} | CyberPress`;

  const metadata: Record<string, any> = {
    title: fullTitle,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    authors: seo.author ? [{ name: seo.author }] : undefined,
    openGraph: {
      title: fullTitle,
      description: seo.description,
      url: seo.canonical,
      siteName: 'CyberPress',
      images: seo.image ? [
        {
          url: seo.image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ] : [],
      locale: 'zh_CN',
      type: seo.type || 'website',
      publishedTime: seo.publishedTime,
      modifiedTime: seo.modifiedTime,
      section: seo.section,
      tags: seo.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seo.description,
      images: seo.image ? [seo.image] : [],
      creator: '@cyberpress',
    },
    robots: {
      index: !seo.noIndex,
      follow: !seo.noIndex,
      googleBot: {
        index: !seo.noIndex,
        follow: !seo.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };

  if (seo.canonical) {
    metadata.alternates = {
      canonical: seo.canonical,
    };
  }

  return metadata;
}

/**
 * 文章页面元数据
 */
export function articleMetadata(article: {
  title: string;
  excerpt: string;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
  category?: string;
  tags?: string[];
  slug: string;
}) {
  return generateMetadata({
    title: article.title,
    description: article.excerpt,
    image: article.coverImage,
    author: article.author,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.modifiedAt,
    section: article.category,
    tags: article.tags,
    canonical: `/blog/${article.slug}`,
  });
}

/**
 * 分类页面元数据
 */
export function categoryMetadata(category: {
  name: string;
  slug: string;
  description?: string;
}) {
  return generateMetadata({
    title: `${category.name} 分类`,
    description: category.description || `浏览 ${category.name} 分类下的所有文章`,
    type: 'website',
    canonical: `/blog/category/${category.slug}`,
  });
}

/**
 * 标签页面元数据
 */
export function tagMetadata(tag: {
  name: string;
  slug: string;
}) {
  return generateMetadata({
    title: `标签: ${tag.name}`,
    description: `浏览带有 ${tag.name} 标签的所有文章`,
    type: 'website',
    canonical: `/blog/tag/${tag.slug}`,
  });
}

/**
 * 作者页面元数据
 */
export function authorMetadata(author: {
  name: string;
  slug: string;
  bio?: string;
}) {
  return generateMetadata({
    title: author.name,
    description: author.bio || `查看 ${author.name} 的所有文章`,
    type: 'profile',
    canonical: `/authors/${author.slug}`,
  });
}

/**
 * 结构化数据生成器
 */
export function generateStructuredData(type: string, data: any) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Article':
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          '@type': 'Person',
          name: data.author,
        },
        datePublished: data.publishedAt,
        dateModified: data.modifiedAt,
        publisher: {
          '@type': 'Organization',
          name: 'CyberPress',
          logo: {
            '@type': 'ImageObject',
            url: '/logo-main.svg',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url,
        },
      };

    case 'WebSite':
      return {
        ...baseData,
        name: 'CyberPress',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        description: DEFAULT_SEO.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Organization':
      return {
        ...baseData,
        name: 'CyberPress',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        logo: '/logo-main.svg',
        description: DEFAULT_SEO.description,
        sameAs: [
          'https://github.com/957662/wordpress-cyberpunk-theme',
        ],
      };

    case 'BreadcrumbList':
      return {
        ...baseData,
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };

    default:
      return baseData;
  }
}

/**
 * JSON-LD 结构化数据组件
 */
export function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
