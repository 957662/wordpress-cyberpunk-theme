/**
 * Blog Data Adapters
 * 适配不同的博客数据格式
 */

import type { BlogPost } from '@/types/models/blog';

/**
 * WordPress API 响应格式
 */
export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  slug: string;
  link: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
      slug: string;
      link: string;
    }>;
  };
}

/**
 * 将 WordPress 格式转换为统一的 BlogPost 格式
 */
export function adaptWordPressToBlogPost(wpPost: WordPressPost): BlogPost {
  const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
  const terms = wpPost._embedded?.['wp:term'] || [];
  const categories = terms
    .flat()
    .filter((term) => term.taxonomy === 'category')
    .map((term) => ({
      id: String(term.id),
      name: term.name,
      slug: term.slug,
      description: '',
      postCount: 0,
    }));

  const tags = terms
    .flat()
    .filter((term) => term.taxonomy === 'post_tag')
    .map((term) => ({
      id: String(term.id),
      name: term.name,
      slug: term.slug,
      description: '',
      postCount: 0,
    }));

  const author = wpPost._embedded?.author?.[0];

  return {
    id: String(wpPost.id),
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    content: wpPost.content.rendered,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 200),
    author: {
      id: author?.id ? String(author.id) : '1',
      name: author?.name || 'Admin',
      slug: author?.slug || 'admin',
      avatar: '',
      bio: '',
    },
    category: categories,
    tags: tags,
    coverImage: featuredMedia?.source_url || '',
    publishedAt: wpPost.date,
    createdAt: wpPost.date,
    updatedAt: wpPost.date,
    status: 'published',
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    featured: false,
    seoTitle: wpPost.title.rendered,
    seoDescription: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
    readingTime: Math.ceil(wpPost.content.rendered.split(/\s+/).length / 200),
  };
}

/**
 * 批量转换 WordPress 帖子列表
 */
export function adaptWordPressPosts(wpPosts: WordPressPost[]): BlogPost[] {
  return wpPosts.map(adaptWordPressToBlogPost);
}

/**
 * 从 BlogPost 创建简化的卡片数据
 */
export interface BlogCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  date: string;
  category: string;
  author: string;
  readingTime: number;
}

export function adaptBlogPostToCard(post: BlogPost): BlogCardData {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.coverImage,
    date: post.publishedAt,
    category: post.category[0]?.name || 'Uncategorized',
    author: post.author.name,
    readingTime: post.readingTime,
  };
}

/**
 * 批量转换为卡片数据
 */
export function adaptBlogPostsToCards(posts: BlogPost[]): BlogCardData[] {
  return posts.map(adaptBlogPostToCard);
}
