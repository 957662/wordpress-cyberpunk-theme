/**
 * WordPress 服务端客户端
 * 用于 SSR 和 API Routes
 */

import { WordPressIntegration, WordPressConfig } from './wordpress-integration';

let serverClient: WordPressIntegration | null = null;

/**
 * 获取服务端 WordPress 客户端实例
 */
export function getServerWordPressClient(): WordPressIntegration {
  if (!serverClient) {
    const baseUrl = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;

    if (!baseUrl) {
      throw new Error('WordPress API URL is not configured. Please set WORDPRESS_API_URL or NEXT_PUBLIC_WORDPRESS_URL environment variable.');
    }

    const config: WordPressConfig = {
      baseUrl,
      username: process.env.WORDPRESS_USERNAME || process.env.NEXT_PUBLIC_WORDPRESS_USERNAME,
      password: process.env.WORDPRESS_PASSWORD || process.env.NEXT_PUBLIC_WORDPRESS_PASSWORD,
      timeout: parseInt(process.env.WORDPRESS_TIMEOUT || process.env.NEXT_PUBLIC_WORDPRESS_TIMEOUT || '10000'),
    };

    serverClient = new WordPressIntegration(config);
  }

  return serverClient;
}

/**
 * 服务端获取文章列表
 */
export async function getServerPosts(params: {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  orderby?: string;
  order?: string;
  sticky?: boolean;
} = {}) {
  const client = getServerWordPressClient();
  return client.getPosts(params);
}

/**
 * 服务端获取单篇文章
 */
export async function getServerPost(id: number | string) {
  const client = getServerWordPressClient();
  return client.getPost(id);
}

/**
 * 服务端根据 slug 获取文章
 */
export async function getServerPostBySlug(slug: string) {
  const client = getServerWordPressClient();
  return client.getPostBySlug(slug);
}

/**
 * 服务端获取分类列表
 */
export async function getServerCategories() {
  const client = getServerWordPressClient();
  return client.getCategories();
}

/**
 * 服务端获取标签列表
 */
export async function getServerTags() {
  const client = getServerWordPressClient();
  return client.getTags();
}

/**
 * 服务端搜索文章
 */
export async function getServerSearch(query: string, page = 1, perPage = 10) {
  const client = getServerWordPressClient();
  return client.searchPosts(query, page, perPage);
}

/**
 * 生成静态参数（用于 generateStaticParams）
 */
export async function generatePostStaticParams() {
  try {
    const posts = await getServerPosts({ per_page: 100 });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating post static params:', error);
    return [];
  }
}

/**
 * 生成分类静态参数
 */
export async function generateCategoryStaticParams() {
  try {
    const categories = await getServerCategories();
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating category static params:', error);
    return [];
  }
}

/**
 * 生成标签静态参数
 */
export async function generateTagStaticParams() {
  try {
    const tags = await getServerTags();
    return tags.map((tag) => ({
      slug: tag.slug,
    }));
  } catch (error) {
    console.error('Error generating tag static params:', error);
    return [];
  }
}
