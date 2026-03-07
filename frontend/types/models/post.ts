/**
 * Post Model Types
 *
 * Blog post related type definitions
 */

import { AuthorRef } from './common';

/**
 * Full blog post model
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  featured?: boolean;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;

  // Author
  author: AuthorRef;

  // Category
  category?: {
    id: string;
    name: string;
    slug: string;
  };

  // Tags
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  // Metadata
  reading_time?: number;
  view_count?: number;
  like_count?: number;
  comment_count?: number;

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

/**
 * Simplified post for list views
 */
export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  featured?: boolean;
  published_at?: string;
  reading_time?: number;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  author: AuthorRef;
  category?: string;
  tags?: string[];
}

/**
 * Input for creating a post
 */
export interface PostCreateInput {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  category_id?: string;
  tag_ids?: string[];
  featured?: boolean;
  status?: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

/**
 * Input for updating a post
 */
export interface PostUpdateInput {
  title?: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  category_id?: string;
  tag_ids?: string[];
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}
