/**
 * Structured Data Utilities - 结构化数据工具
 * 生成 JSON-LD 格式的结构化数据，用于 SEO
 */

export interface StructuredDataBase {
  '@context': string;
  '@type': string;
}

export interface WebSite extends StructuredDataBase {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface WebPage extends StructuredDataBase {
  '@type': 'WebPage';
  name: string;
  description?: string;
  url: string;
  lastReviewed?: string;
  reviewedBy?: {
    '@type': 'Organization';
    name: string;
  };
}

export interface Article extends StructuredDataBase {
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author: Person | Organization;
  publisher: Organization;
  description?: string;
  url: string;
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface Person extends StructuredDataBase {
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  worksFor?: Organization;
}

export interface Organization extends StructuredDataBase {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export interface BreadcrumbList extends StructuredDataBase {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * 生成网站结构化数据
 */
export function generateWebSiteSchema(
  name: string,
  url: string,
  description?: string
): WebSite {
  const schema: WebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
  };

  if (description) {
    schema.description = description;
  }

  schema.potentialAction = {
    '@type': 'SearchAction',
    target: `${url}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  };

  return schema;
}

/**
 * 生成网页结构化数据
 */
export function generateWebPageSchema(
  name: string,
  url: string,
  description?: string,
  lastReviewed?: string
): WebPage {
  const schema: WebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
  };

  if (description) {
    schema.description = description;
  }

  if (lastReviewed) {
    schema.lastReviewed = lastReviewed;
  }

  return schema;
}

/**
 * 生成文章结构化数据
 */
export function generateArticleSchema(
  headline: string,
  url: string,
  datePublished: string,
  authorName: string,
  authorUrl?: string,
  publisherName: string,
  publisherLogo?: string,
  imageUrl?: string | string[],
  description?: string,
  dateModified?: string
): Article {
  const schema: Article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    url,
    datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      ...(publisherLogo && { logo: publisherLogo }),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  if (imageUrl) {
    schema.image = imageUrl;
  }

  if (description) {
    schema.description = description;
  }

  if (dateModified) {
    schema.dateModified = dateModified;
  }

  return schema;
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * 生成组织结构化数据
 */
export function generateOrganizationSchema(
  name: string,
  url?: string,
  logo?: string,
  socialLinks?: string[]
): Organization {
  const schema: Organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
  };

  if (url) {
    schema.url = url;
  }

  if (logo) {
    schema.logo = logo;
  }

  if (socialLinks && socialLinks.length > 0) {
    schema.sameAs = socialLinks;
  }

  return schema;
}

/**
 * 生成人员结构化数据
 */
export function generatePersonSchema(
  name: string,
  url?: string,
  image?: string,
  jobTitle?: string,
  worksFor?: string
): Person {
  const schema: Person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
  };

  if (url) {
    schema.url = url;
  }

  if (image) {
    schema.image = image;
  }

  if (jobTitle) {
    schema.jobTitle = jobTitle;
  }

  if (worksFor) {
    schema.worksFor = {
      '@type': 'Organization',
      name: worksFor,
    };
  }

  return schema;
}

/**
 * 在页面中注入结构化数据
 */
export function injectStructuredData(schema: any): void {
  if (typeof document === 'undefined') return;

  // 移除已存在的相同类型的结构化数据
  const existingScript = document.querySelector(
    `script[type="application/ld+json"][data-schema-type="${schema['@type']}"]`
  );

  if (existingScript) {
    existingScript.remove();
  }

  // 创建新的 script 标签
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-schema-type', schema['@type']);
  script.textContent = JSON.stringify(schema);

  document.head.appendChild(script);
}

/**
 * 生成所有页面的通用结构化数据
 */
export function generateCommonSchemas(baseUrl: string, siteName: string) {
  return {
    website: generateWebSiteSchema(siteName, baseUrl),
    organization: generateOrganizationSchema(siteName, baseUrl),
  };
}
