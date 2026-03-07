/**
 * Category Model Types
 *
 * Category related type definitions
 */

/**
 * Category model
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
  post_count?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Category input
 */
export interface CategoryCreateInput {
  name: string;
  slug?: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
}

/**
 * Category update input
 */
export interface CategoryUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
}
