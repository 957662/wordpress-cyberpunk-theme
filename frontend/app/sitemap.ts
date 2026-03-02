import { MetadataRoute } from 'next';

/**
 * CyberPress Sitemap
 *
 * 自动生成网站地图，包含所有公开页面和文章
 */

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
  alternates?: {
    languages?: Record<string, string>;
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev';
  const currentDate = new Date();

  // 静态页面
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // 动态获取文章列表
  let posts: SitemapEntry[] = [];
  try {
    // 这里应该从 WordPress API 获取文章列表
    // 示例代码（需要根据实际 API 调整）：
    /*
    const postsResponse = await fetch(`${process.env.WORDPRESS_API_URL}/posts?per_page=100&_fields=slug,date,modified`, {
      next: { revalidate: 3600 }, // 缓存1小时
    });
    const postsData = await postsResponse.json();

    posts = postsData.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    */
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error);
  }

  // 动态获取分类
  let categories: SitemapEntry[] = [];
  try {
    // 这里应该从 WordPress API 获取分类列表
    /*
    const categoriesResponse = await fetch(`${process.env.WORDPRESS_API_URL}/categories?per_page=100&_fields=slug,count`, {
      next: { revalidate: 3600 },
    });
    const categoriesData = await categoriesResponse.json();

    categories = categoriesData
      .filter((cat: any) => cat.count > 0)
      .map((cat: any) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    */
  } catch (error) {
    console.error('Failed to fetch categories for sitemap:', error);
  }

  // 动态获取标签
  let tags: SitemapEntry[] = [];
  try {
    // 这里应该从 WordPress API 获取标签列表
    /*
    const tagsResponse = await fetch(`${process.env.WORDPRESS_API_URL}/tags?per_page=100&_fields=slug,count`, {
      next: { revalidate: 3600 },
    });
    const tagsData = await tagsResponse.json();

    tags = tagsData
      .filter((tag: any) => tag.count > 0)
      .map((tag: any) => ({
        url: `${baseUrl}/tag/${tag.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }));
    */
  } catch (error) {
    console.error('Failed to fetch tags for sitemap:', error);
  }

  return [...staticPages, ...posts, ...categories, ...tags];
}
