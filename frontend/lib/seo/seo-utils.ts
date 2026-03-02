/**
 * SEO 工具函数
 * 提供搜索引擎优化相关的工具和辅助函数
 */

/**
 * 生成页面元数据
 */
export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: string;
  alternateLanguages?: Array<{ lang: string; url: string }>;
}

/**
 * 生成完整的页面 SEO 元数据
 */
export function generatePageMeta(meta: PageMeta) {
  const {
    title,
    description,
    image,
    keywords,
    author,
    publishDate,
    modifiedDate,
    type = 'website',
    locale = 'zh-CN',
    alternateLanguages,
  } = meta;

  const siteName = 'CyberPress';
  const fullTitle = type === 'website' ? title : `${title} | ${siteName}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev';
  const defaultImage = `${siteUrl}/images/og-default.png`;
  const ogImage = image ? `${siteUrl}${image}` : defaultImage;

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),
    authors: author ? [author] : [],
    creator: author,
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      locale: locale.replace('-', '_'),
      url: siteUrl,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName,
      ...(type === 'article' && {
        publishedTime: publishDate,
        modifiedTime: modifiedDate,
        authors: author ? [author] : [],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: siteUrl,
      languages: alternateLanguages?.reduce(
        (acc, { lang, url }) => ({
          ...acc,
          [lang]: url,
        }),
        {}
      ),
    },
  };
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateStructuredData(type: 'Article' | 'BlogPosting' | 'WebPage' | 'BreadcrumbList', data: any) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev';

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Article':
    case 'BlogPosting':
      return {
        ...baseSchema,
        headline: data.title,
        description: data.description,
        image: data.image ? `${siteUrl}${data.image}` : `${siteUrl}/images/og-default.png`,
        datePublished: data.publishDate,
        dateModified: data.modifiedDate || data.publishDate,
        author: {
          '@type': 'Person',
          name: data.author || 'CyberPress Team',
          url: data.authorUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'CyberPress',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/images/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteUrl}/blog/${data.slug}`,
        },
        ...data,
      };

    case 'WebPage':
      return {
        ...baseSchema,
        name: data.title,
        description: data.description,
        url: `${siteUrl}${data.path}`,
        inLanguage: data.locale || 'zh-CN',
        isPartOf: {
          '@type': 'WebSite',
          url: siteUrl,
          name: 'CyberPress',
        },
        ...data,
      };

    case 'BreadcrumbList':
      return {
        ...baseSchema,
        itemListElement: data.breadcrumbs.map((item: { name: string; url: string }, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${siteUrl}${item.url}`,
        })),
      };

    default:
      return baseSchema;
  }
}

/**
 * 生成面包屑导航数据
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbs(items: BreadcrumbItem[]) {
  return generateStructuredData('BreadcrumbList', { breadcrumbs: items });
}

/**
 * 优化 URL slug
 */
export function optimizeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '') // 保留中文、字母、数字、连字符
    .replace(/[\s\u4e00-\u9fa5]+/g, '-') // 将空格和中文转为连字符
    .replace(/-+/g, '-') // 合并多个连字符
    .replace(/^-+|-+$/g, ''); // 移除首尾连字符
}

/**
 * 生成文章 URL
 */
export function generateArticleUrl(title: string, publishDate?: Date): string {
  const slug = optimizeSlug(title);

  if (publishDate) {
    const year = publishDate.getFullYear();
    const month = String(publishDate.getMonth() + 1).padStart(2, '0');
    return `/blog/${year}/${month}/${slug}`;
  }

  return `/blog/${slug}`;
}

/**
 * 生成文章关键词
 */
export function generateKeywords(content: string, title: string, maxKeywords: number = 10): string[] {
  const allText = `${title} ${content}`.toLowerCase();

  // 移除 HTML 标签
  const cleanText = allText.replace(/<[^>]*>/g, '');

  // 中文和英文分词
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]{2,}/g) || [];
  const englishWords = cleanText.match(/[a-z]{3,}/g) || [];

  // 常见停用词
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    '的', '了', '是', '在', '和', '有', '我', '你', '他', '她', '它', '这', '那'
  ]);

  // 统计词频
  const frequency: Record<string, number> = {};

  [...chineseChars, ...englishWords].forEach(word => {
    if (!stopWords.has(word) && word.length >= 2) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  // 排序并返回前 N 个
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * 生成文章摘要（用于 SEO）
 */
export function generateSeoExcerpt(content: string, maxLength: number = 160): string {
  // 移除 Markdown 和 HTML 标签
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim();

  // 在句子边界截断
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  const truncated = cleanContent.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('！'),
    truncated.lastIndexOf('?'),
    truncated.lastIndexOf('？')
  );

  if (lastSentenceEnd > maxLength * 0.5) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }

  return truncated.substring(0, maxLength - 3) + '...';
}

/**
 * 检查 SEO 优化建议
 */
export interface SeoCheck {
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export function checkSeo({
  title,
  description,
  content,
  keywords,
  images,
}: {
  title: string;
  description: string;
  content: string;
  keywords?: string[];
  images?: Array<{ alt: string; src: string }>;
}): SeoCheck[] {
  const checks: SeoCheck[] = [];

  // 标题长度检查
  if (title.length < 30) {
    checks.push({
      passed: false,
      message: `标题过短 (${title.length}/30-60 字符)`,
      severity: 'warning',
    });
  } else if (title.length > 60) {
    checks.push({
      passed: false,
      message: `标题过长 (${title.length}/30-60 字符)`,
      severity: 'warning',
    });
  } else {
    checks.push({
      passed: true,
      message: `标题长度合适 (${title.length} 字符)`,
      severity: 'info',
    });
  }

  // 描述长度检查
  if (description.length < 120) {
    checks.push({
      passed: false,
      message: `描述过短 (${description.length}/120-160 字符)`,
      severity: 'warning',
    });
  } else if (description.length > 160) {
    checks.push({
      passed: false,
      message: `描述过长 (${description.length}/120-160 字符)`,
      severity: 'warning',
    });
  } else {
    checks.push({
      passed: true,
      message: `描述长度合适 (${description.length} 字符)`,
      severity: 'info',
    });
  }

  // 内容长度检查
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 300) {
    checks.push({
      passed: false,
      message: `文章内容过短 (${wordCount} 词，建议至少 300 词)`,
      severity: 'error',
    });
  } else {
    checks.push({
      passed: true,
      message: `文章长度合适 (${wordCount} 词)`,
      severity: 'info',
    });
  }

  // 关键词检查
  if (keywords && keywords.length > 0) {
    checks.push({
      passed: true,
      message: `已设置 ${keywords.length} 个关键词`,
      severity: 'info',
    });
  } else {
    checks.push({
      passed: false,
      message: '未设置关键词',
      severity: 'warning',
    });
  }

  // 图片 Alt 检查
  if (images && images.length > 0) {
    const imagesWithoutAlt = images.filter(img => !img.alt);
    if (imagesWithoutAlt.length > 0) {
      checks.push({
        passed: false,
        message: `${imagesWithoutAlt.length} 张图片缺少 alt 属性`,
        severity: 'warning',
      });
    } else {
      checks.push({
        passed: true,
        message: '所有图片都有 alt 属性',
        severity: 'info',
      });
    }
  }

  return checks;
}

/**
 * 生成 Canonical URL
 */
export function generateCanonicalUrl(path: string, locale: string = 'zh-CN'): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev';
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  return `${siteUrl}${locale !== 'zh-CN' ? `/${locale}` : ''}${cleanPath ? `/${cleanPath}` : ''}`;
}

/**
 * 生成 Hreflang 标签
 */
export function generateHreflangTags(
  path: string,
  locales: Array<{ code: string; url: string }>
): Array<{ lang: string; url: string }> {
  return [
    { lang: 'x-default', url: locales[0]?.url || '' },
    ...locales.map(locale => ({
      lang: locale.code,
      url: locale.url,
    })),
  ];
}

/**
 * 计算内容可读性分数（Flesch Reading Ease）
 */
export function calculateReadabilityScore(content: string): {
  score: number;
  level: string;
  description: string;
} {
  const sentences = content.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((acc, word) => {
    return acc + countSyllables(word);
  }, 0);

  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease 公式
  const score = 206.835 - avgSentenceLength * 1.015 - avgSyllablesPerWord * 84.6;

  let level = '';
  let description = '';

  if (score >= 90) {
    level = '5年级';
    description = '非常容易阅读';
  } else if (score >= 80) {
    level = '6年级';
    description = '容易阅读';
  } else if (score >= 70) {
    level = '7年级';
    description = '比较容易阅读';
  } else if (score >= 60) {
    level = '8-9年级';
    description = '中等难度';
  } else if (score >= 50) {
    level = '10-12年级';
    description = '比较难阅读';
  } else if (score >= 30) {
    level = '大学';
    description = '难阅读';
  } else {
    level = '研究生';
    description = '非常难阅读';
  }

  return {
    score: Math.round(score),
    level,
    description,
  };
}

/**
 * 计算单词音节数（简化版）
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);

  return syllables ? syllables.length : 1;
}

/**
 * 导出所有工具函数
 */
export default {
  generatePageMeta,
  generateStructuredData,
  generateBreadcrumbs,
  optimizeSlug,
  generateArticleUrl,
  generateKeywords,
  generateSeoExcerpt,
  checkSeo,
  generateCanonicalUrl,
  generateHreflangTags,
  calculateReadabilityScore,
};
