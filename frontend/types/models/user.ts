/**
 * User Model Types
 *
 * User related type definitions
 */

/**
 * User model
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  created_at: string;
  updated_at: string;
}

/**
 * User profile
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  stats?: {
    posts_count?: number;
    followers_count?: number;
    following_count?: number;
  };
}

/**
 * User update input
 */
export interface UserUpdateInput {
  username?: string;
  email?: string;
  bio?: string;
  website?: string;
  avatar?: string;
  location?: string;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}
