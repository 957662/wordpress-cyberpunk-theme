/**
 * Post Repository
 *
 * Handles database operations for blog posts
 */

import { BaseRepository } from './base.repository';
import { query } from '../connection/database.connection';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_id: string;
  category_id?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
  view_count: number;
  like_count: number;
  comment_count: number;
  reading_time?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_id: string;
  category_id?: string;
  status?: 'draft' | 'published' | 'archived';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  category_id?: string;
  status?: 'draft' | 'published' | 'archived';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface PostFilters {
  author_id?: string;
  category_id?: string;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  featured?: boolean;
}

/**
 * Post repository class
 */
export class PostRepository extends BaseRepository<Post> {
  constructor() {
    super('posts', 'id');
  }

  /**
   * Find post by slug
   */
  async findBySlug(slug: string): Promise<Post | null> {
    return this.findOne({ slug });
  }

  /**
   * Create a new post
   */
  async createPost(input: CreatePostInput): Promise<Post> {
    const slug = input.slug || this.generateSlug(input.title);
    const reading_time = this.calculateReadingTime(input.content);

    const post: Partial<Post> = {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      featured_image: input.featured_image,
      author_id: input.author_id,
      category_id: input.category_id,
      status: input.status || 'draft',
      meta_title: input.meta_title,
      meta_description: input.meta_description,
      meta_keywords: input.meta_keywords,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      reading_time,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (input.status === 'published') {
      post.published_at = new Date();
    }

    return this.create(post);
  }

  /**
   * Update post
   */
  async updatePost(id: string, input: UpdatePostInput): Promise<Post | null> {
    const updateData: Partial<Post> = {
      ...input,
      updated_at: new Date(),
    };

    if (input.status === 'published' && !input.published_at) {
      updateData.published_at = new Date();
    }

    if (input.content) {
      updateData.reading_time = this.calculateReadingTime(input.content);
    }

    return this.update(id, updateData);
  }

  /**
   * Find published posts with filters
   */
  async findPublished(options: PostFilters & {
    orderBy?: string;
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  } = {}): Promise<Post[]> {
    const { author_id, category_id, status = 'published', search, orderBy = 'published_at', order = 'DESC', limit, offset } = options;

    let queryText = `
      SELECT p.* FROM ${this.tableName} p
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      queryText += ` AND p.status = $${paramIndex++}`;
      params.push(status);
    }

    if (author_id) {
      queryText += ` AND p.author_id = $${paramIndex++}`;
      params.push(author_id);
    }

    if (category_id) {
      queryText += ` AND p.category_id = $${paramIndex++}`;
      params.push(category_id);
    }

    if (search) {
      queryText += ` AND (p.title ILIKE $${paramIndex++} OR p.excerpt ILIKE $${paramIndex++})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    queryText += ` ORDER BY p.${orderBy} ${order}`;

    if (limit) {
      queryText += ` LIMIT $${paramIndex++}`;
      params.push(limit);
    }

    if (offset) {
      queryText += ` OFFSET $${paramIndex++}`;
      params.push(offset);
    }

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Find trending posts (most viewed in last 7 days)
   */
  async findTrending(limit: number = 10): Promise<Post[]> {
    const queryText = `
      SELECT p.* FROM ${this.tableName} p
      WHERE p.status = 'published'
        AND p.published_at >= NOW() - INTERVAL '7 days'
      ORDER BY p.view_count DESC
      LIMIT $1
    `;
    const result = await query(queryText, [limit]);
    return result.rows;
  }

  /**
   * Find featured posts
   */
  async findFeatured(limit: number = 5): Promise<Post[]> {
    const queryText = `
      SELECT p.* FROM ${this.tableName} p
      WHERE p.status = 'published'
        AND p.featured_image IS NOT NULL
      ORDER BY p.published_at DESC
      LIMIT $1
    `;
    const result = await query(queryText, [limit]);
    return result.rows;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    const queryText = `
      UPDATE ${this.tableName}
      SET view_count = view_count + 1
      WHERE id = $1
    `;
    await query(queryText, [id]);
  }

  /**
   * Increment like count
   */
  async incrementLikeCount(id: string): Promise<void> {
    const queryText = `
      UPDATE ${this.tableName}
      SET like_count = like_count + 1
      WHERE id = $1
    `;
    await query(queryText, [id]);
  }

  /**
   * Decrement like count
   */
  async decrementLikeCount(id: string): Promise<void> {
    const queryText = `
      UPDATE ${this.tableName}
      SET like_count = GREATEST(like_count - 1, 0)
      WHERE id = $1
    `;
    await query(queryText, [id]);
  }

  /**
   * Update comment count
   */
  async updateCommentCount(id: string, increment: number = 1): Promise<void> {
    const queryText = `
      UPDATE ${this.tableName}
      SET comment_count = GREATEST(comment_count + $1, 0)
      WHERE id = $2
    `;
    await query(queryText, [increment, id]);
  }

  /**
   * Find related posts by category
   */
  async findRelatedPosts(postId: string, limit: number = 5): Promise<Post[]> {
    const queryText = `
      SELECT p.* FROM ${this.tableName} p
      WHERE p.id != $1
        AND p.category_id = (SELECT category_id FROM ${this.tableName} WHERE id = $1)
        AND p.status = 'published'
      ORDER BY p.published_at DESC
      LIMIT $2
    `;
    const result = await query(queryText, [postId, limit]);
    return result.rows;
  }

  /**
   * Get post statistics
   */
  async getPostStats(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  }> {
    const queryText = `
      SELECT
        COUNT(*) as total_posts,
        COUNT(*) FILTER (WHERE status = 'published') as published_posts,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_posts,
        SUM(view_count) as total_views,
        SUM(like_count) as total_likes,
        SUM(comment_count) as total_comments
      FROM ${this.tableName}
    `;
    const result = await query(queryText);
    const row = result.rows[0];

    return {
      totalPosts: parseInt(row.total_posts),
      publishedPosts: parseInt(row.published_posts),
      draftPosts: parseInt(row.draft_posts),
      totalViews: parseInt(row.total_views) || 0,
      totalLikes: parseInt(row.total_likes) || 0,
      totalComments: parseInt(row.total_comments) || 0,
    };
  }

  /**
   * Search posts
   */
  async searchPosts(
    searchTerm: string,
    limit: number = 20
  ): Promise<Post[]> {
    const queryText = `
      SELECT * FROM ${this.tableName}
      WHERE status = 'published'
        AND (title ILIKE $1 OR excerpt ILIKE $1 OR content ILIKE $1)
      ORDER BY published_at DESC
      LIMIT $2
    `;
    const result = await query(queryText, [`%${searchTerm}%`, limit]);
    return result.rows;
  }

  /**
   * Generate URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Calculate estimated reading time (in minutes)
   */
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}

// Export singleton instance
export const postRepository = new PostRepository();

export default PostRepository;
