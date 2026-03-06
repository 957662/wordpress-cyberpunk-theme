/**
 * Server-side Data Fetching Functions
 *
 * These functions are designed to be used in Server Components and Server Actions.
 * They fetch data directly from WordPress API or your backend API.
 */

import { BlogPost, Category, Tag } from '@/types/models/blog';

// ============================================================================
// Configuration
// ============================================================================

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ============================================================================
// Types
// ============================================================================

export interface GetPostsParams {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  search?: string;
  author?: number;
  orderby?: 'date' | 'title' | 'relevance';
  order?: 'asc' | 'desc';
}

export interface PostsResponse {
  posts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface GetPostBySlugParams {
  slug: string;
}

// ============================================================================
// WordPress API Types
// ============================================================================

interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  categories: number[];
  tags: number[];
  _links: any;
}

interface WPMedia {
  id: number;
  source_url: string;
  media_details: {
    sizes?: {
      full?: { source_url: string };
      large?: { source_url: string };
      medium?: { source_url: string };
      thumbnail?: { source_url: string };
    };
  };
}

interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar_urls?: {
    96?: string;
  };
}

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

interface WPTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetch data from WordPress API
 */
async function fetchFromWordPress<T>(
  endpoint: string,
  revalidate: number = 3600
): Promise<T> {
  if (!WORDPRESS_API_URL) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL is not configured');
  }

  const url = `${WORDPRESS_API_URL}/wp/v2${endpoint}`;

  const response = await fetch(url, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch data with pagination headers
 */
async function fetchWithPagination(
  endpoint: string,
  revalidate: number = 3600
): Promise<{ data: any[]; total: number; totalPages: number }> {
  if (!WORDPRESS_API_URL) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL is not configured');
  }

  const url = `${WORDPRESS_API_URL}/wp/v2${endpoint}`;

  const response = await fetch(url, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
  const data = await response.json();

  return { data, total, totalPages };
}

/**
 * Build query string from params
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Calculate reading time
 */
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // Average reading speed: 200 words per minute
  return Math.max(1, minutes);
}

/**
 * Strip HTML tags
 */
function stripHTML(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').trim();
}

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Transform WordPress post to BlogPost
 */
async function transformWPPost(wpPost: WPPost): Promise<BlogPost> {
  let featuredImage: string | undefined;
  let authorData: WPAuthor | undefined;

  // Fetch featured media if available
  if (wpPost.featured_media) {
    try {
      const media = await fetchFromWordPress<WPMedia>(`/media/${wpPost.featured_media}`, 86400);
      featuredImage = media.source_url;
    } catch (error) {
      console.error('Error fetching featured media:', error);
    }
  }

  // Fetch author data
  try {
    authorData = await fetchFromWordPress<WPAuthor>(`/users/${wpPost.author}`, 86400);
  } catch (error) {
    console.error('Error fetching author:', error);
  }

  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    excerpt: stripHTML(wpPost.excerpt.rendered),
    content: wpPost.content.rendered,
    author: {
      id: wpPost.author,
      name: authorData?.name || 'Unknown Author',
      avatar: authorData?.avatar_urls?.['96'],
    },
    category: wpPost.categories.length > 0 ? {
      id: wpPost.categories[0],
      name: 'Category',
      slug: 'category',
    } : undefined,
    tags: wpPost.tags.map(tagId => ({
      id: tagId,
      name: 'Tag',
      slug: 'tag',
    })),
    featuredImage,
    publishedAt: wpPost.date,
    updatedAt: wpPost.modified,
    status: wpPost.status === 'publish' ? 'published' : wpPost.status as any,
    views: 0,
    likes: 0,
    comments: 0,
    readingTime: calculateReadingTime(wpPost.content.rendered),
  };
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Get posts for server components
 *
 * This function can be used directly in Server Components.
 * It fetches data from WordPress API and returns it in the correct format.
 */
export async function getPosts(params: GetPostsParams = {}): Promise<PostsResponse> {
  const {
    page = 1,
    perPage = 12,
    category,
    tag,
    search,
    orderby = 'date',
    order = 'desc',
  } = params;

  // Build query parameters
  const queryParams: Record<string, any> = {
    page,
    per_page: perPage,
    orderby,
    order,
    status: 'publish',
    _embed: true, // Embed author, media, and term data
  };

  if (category) queryParams.categories = category;
  if (tag) queryParams.tags = tag;
  if (search) queryParams.search = search;

  const queryString = buildQueryString(queryParams);

  // Fetch posts with pagination
  const { data, total, totalPages } = await fetchWithPagination(`/posts${queryString}`);

  // Transform posts
  const posts: BlogPost[] = await Promise.all(
    data.map(async (wpPost: WPPost) => {
      // If _embed is used, extract embedded data
      let featuredImage: string | undefined;
      let authorName = 'Unknown Author';
      let authorAvatar: string | undefined;

      // Extract embedded author
      if (wpPost._embedded?.author?.[0]) {
        const author = wpPost._embedded.author[0];
        authorName = author.name;
        authorAvatar = author.avatar_urls?.['96'];
      }

      // Extract embedded featured media
      if (wpPost._embedded?.['wp:featuredmedia']?.[0]) {
        const media = wpPost._embedded['wp:featuredmedia'][0];
        featuredImage = media.source_url;
      }

      // Extract categories and tags
      const categoryData = wpPost._embedded?.['wp:term']?.[0]?.[0];
      const tagData = wpPost._embedded?.['wp:term']?.[1];

      return {
        id: wpPost.id,
        title: wpPost.title.rendered,
        slug: wpPost.slug,
        excerpt: stripHTML(wpPost.excerpt.rendered),
        content: wpPost.content.rendered,
        author: {
          id: wpPost.author,
          name: authorName,
          avatar: authorAvatar,
        },
        category: categoryData ? {
          id: categoryData.id,
          name: categoryData.name,
          slug: categoryData.slug,
        } : undefined,
        tags: tagData?.map((tag: WPTag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        })) || [],
        featuredImage,
        publishedAt: wpPost.date,
        updatedAt: wpPost.modified,
        status: 'published',
        views: 0,
        likes: 0,
        comments: 0,
        readingTime: calculateReadingTime(wpPost.content.rendered),
      };
    })
  );

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: perPage,
    },
  };
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(params: GetPostBySlugParams): Promise<BlogPost | null> {
  const { slug } = params;

  const queryString = buildQueryString({
    slug,
    status: 'publish',
    _embed: true,
  });

  try {
    const data = await fetchFromWordPress<WPPost[]>(`/posts${queryString}`, 3600);

    if (!data || data.length === 0) {
      return null;
    }

    const wpPost = data[0];

    // Extract embedded data
    let featuredImage: string | undefined;
    let authorName = 'Unknown Author';
    let authorAvatar: string | undefined;

    if (wpPost._embedded?.author?.[0]) {
      const author = wpPost._embedded.author[0];
      authorName = author.name;
      authorAvatar = author.avatar_urls?.['96'];
    }

    if (wpPost._embedded?.['wp:featuredmedia']?.[0]) {
      const media = wpPost._embedded['wp:featuredmedia'][0];
      featuredImage = media.source_url;
    }

    const categoryData = wpPost._embedded?.['wp:term']?.[0]?.[0];
    const tagData = wpPost._embedded?.['wp:term']?.[1];

    return {
      id: wpPost.id,
      title: wpPost.title.rendered,
      slug: wpPost.slug,
      excerpt: stripHTML(wpPost.excerpt.rendered),
      content: wpPost.content.rendered,
      author: {
        id: wpPost.author,
        name: authorName,
        avatar: authorAvatar,
      },
      category: categoryData ? {
        id: categoryData.id,
        name: categoryData.name,
        slug: categoryData.slug,
      } : undefined,
      tags: tagData?.map((tag: WPTag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })) || [],
      featuredImage,
      publishedAt: wpPost.date,
      updatedAt: wpPost.modified,
      status: 'published',
      views: 0,
      likes: 0,
      comments: 0,
      readingTime: calculateReadingTime(wpPost.content.rendered),
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Get categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchFromWordPress<WPCategory[]>('/categories?per_page=100&hide_empty=true', 86400);

    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      count: cat.count,
      parent: 0,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get tags
 */
export async function getTags(): Promise<Tag[]> {
  try {
    const data = await fetchFromWordPress<WPTag[]>('/tags?per_page=100&hide_empty=true', 86400);

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
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const data = await fetchFromWordPress<WPCategory[]>(`/categories?slug=${slug}`, 86400);

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
      parent: 0,
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const data = await fetchFromWordPress<WPTag[]>(`/tags?slug=${slug}`, 86400);

    if (!data || data.length === 0) {
      return null;
    }

    const tag = data[0];
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.count,
    };
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
}

/**
 * Search posts
 */
export async function searchPosts(query: string, params: Omit<GetPostsParams, 'search'> = {}): Promise<PostsResponse> {
  return getPosts({ ...params, search: query });
}
