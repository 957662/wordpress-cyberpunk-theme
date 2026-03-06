/**
 * Common Model Types
 *
 * Shared types used across the application.
 */

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data?: T[];
  posts?: T[];
  pagination?: PaginationMeta;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Entity with timestamps
 */
export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

/**
 * Entity with ID
 */
export interface Identifiable {
  id: string | number;
}

/**
 * Entity with slug
 */
export interface Sluggable {
  slug: string;
}

/**
 * Image metadata
 */
export interface ImageMeta {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
}

/**
 * Author reference
 */
export interface AuthorRef {
  id: string | number;
  name: string;
  slug: string;
  avatar?: string;
}

/**
 * Category/Tag reference
 */
export interface TaxonomyRef {
  id: string | number;
  name: string;
  slug: string;
  color?: string;
}
