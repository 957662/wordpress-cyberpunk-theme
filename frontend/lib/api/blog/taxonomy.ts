/**
 * Blog Taxonomy API
 * 博客分类和标签 API 客户端
 */

import type { BlogCategory, BlogTag } from '@/types/blog';

/**
 * 获取所有分类
 */
export async function getCategories(): Promise<BlogCategory[]> {
  const response = await fetch('/api/blog/categories');

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

/**
 * 根据 slug 获取分类
 */
export async function getCategory(slug: string): Promise<BlogCategory> {
  const response = await fetch(`/api/blog/categories/${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }

  return response.json();
}

/**
 * 获取分类下的文章
 */
export async function getCategoryPosts(
  slug: string,
  page: number = 1,
  perPage: number = 10
): Promise<{
  posts: any[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('per_page', String(perPage));

  const response = await fetch(
    `/api/blog/categories/${slug}/posts?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch category posts');
  }

  return response.json();
}

/**
 * 获取所有标签
 */
export async function getTags(): Promise<BlogTag[]> {
  const response = await fetch('/api/blog/tags');

  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }

  return response.json();
}

/**
 * 获取热门标签
 */
export async function getPopularTags(limit: number = 20): Promise<BlogTag[]> {
  const response = await fetch(
    `/api/blog/tags/popular?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch popular tags');
  }

  return response.json();
}

/**
 * 根据 slug 获取标签
 */
export async function getTag(slug: string): Promise<BlogTag> {
  const response = await fetch(`/api/blog/tags/${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch tag');
  }

  return response.json();
}

/**
 * 获取标签下的文章
 */
export async function getTagPosts(
  slug: string,
  page: number = 1,
  perPage: number = 10
): Promise<{
  posts: any[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('per_page', String(perPage));

  const response = await fetch(
    `/api/blog/tags/${slug}/posts?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tag posts');
  }

  return response.json();
}
