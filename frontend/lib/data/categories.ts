/**
 * Server-side Data Fetching for Categories and Tags
 */

import { Category, Tag } from '@/types/models/blog';

// ============================================================================
// Types
// ============================================================================

export interface CategoryWithPostCount extends Category {
  postCount: number;
}

export interface TagWithPostCount extends Tag {
  postCount: number;
}

// ============================================================================
// WordPress API Types
// ============================================================================

interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links: any;
}

interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  _links: any;
}

// ============================================================================
// Helper Functions
// ============================================================================

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';

async function fetchFromWordPress<T>(endpoint: string): Promise<T> {
  if (!WORDPRESS_API_URL) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL is not configured');
  }

  const url = `${WORDPRESS_API_URL}/wp/v2${endpoint}`;

  const response = await fetch(url, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const data = await fetchFromWordPress<WPCategory[]>('/categories?per_page=100&hide_empty=true');

    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      count: cat.count,
      parent: cat.parent,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get all tags
 */
export async function getAllTags(): Promise<Tag[]> {
  try {
    const data = await fetchFromWordPress<WPTag[]>('/tags?per_page=100&hide_empty=true');

    return data.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.count,
    }));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryWithPostCount | null> {
  try {
    const data = await fetchFromWordPress<WPCategory[]>(`/categories?slug=${slug}`);

    if (!data || data.length === 0) {
      return null;
    }

    const cat = data[0];

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      count: cat.count,
      parent: cat.parent,
      postCount: cat.count,
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string): Promise<TagWithPostCount | null> {
  try {
    const data = await fetchFromWordPress<WPTag[]>(`/tags?slug=${slug}`);

    if (!data || data.length === 0) {
      return null;
    }

    const tag = data[0];

    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.count,
      postCount: tag.count,
    };
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
}

/**
 * Get popular categories (most posts)
 */
export async function getPopularCategories(limit: number = 10): Promise<CategoryWithPostCount[]> {
  try {
    const data = await fetchFromWordPress<WPCategory[]>(
      `/categories?per_page=${limit}&hide_empty=true&orderby=count&order=desc`
    );

    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      count: cat.count,
      parent: cat.parent,
      postCount: cat.count,
    }));
  } catch (error) {
    console.error('Error fetching popular categories:', error);
    return [];
  }
}

/**
 * Get popular tags (most posts)
 */
export async function getPopularTags(limit: number = 20): Promise<TagWithPostCount[]> {
  try {
    const data = await fetchFromWordPress<WPTag[]>(
      `/tags?per_page=${limit}&hide_empty=true&orderby=count&order=desc`
    );

    return data.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.count,
      postCount: tag.count,
    }));
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    return [];
  }
}
