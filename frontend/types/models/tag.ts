/**
 * Tag Model Types
 *
 * Tag related type definitions
 */

/**
 * Tag model
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  post_count?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Tag input
 */
export interface TagCreateInput {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
}

/**
 * Tag update input
 */
export interface TagUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
}
