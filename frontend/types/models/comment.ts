/**
 * Comment Model Types
 *
 * Comment related type definitions
 */

import { AuthorRef } from './common';

/**
 * Comment model
 */
export interface Comment {
  id: string;
  post_id: string;
  author: AuthorRef;
  content: string;
  parent_id?: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  created_at: string;
  updated_at: string;

  // Nested replies
  replies?: Comment[];

  // Like count
  like_count?: number;

  // User interaction
  is_liked?: boolean;
}

/**
 * Comment input
 */
export interface CommentCreateInput {
  post_id: string;
  content: string;
  parent_id?: string;
}

/**
 * Comment update input
 */
export interface CommentUpdateInput {
  content?: string;
  status?: 'pending' | 'approved' | 'spam' | 'trash';
}
