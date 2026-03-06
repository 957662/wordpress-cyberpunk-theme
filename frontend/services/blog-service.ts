/**
 * Blog Service
 *
 * Service layer for blog-related business logic.
 * Handles data fetching, transformation, and caching.
 */

import { wordpressClient } from '@/lib/wordpress/wordpress-client';
import { wordpressAdapter } from '@/lib/adapters/wordpress-adapter';
import type {
  Post,
  Category,
  Tag,
  Author,
  PaginationParams,
  PaginatedResponse,
} from '@/types/models';

/**
 * Blog Service Class
 */
export class BlogService {
  /**
   * Get paginated posts with optional filters
   */
  async getPosts(params: PaginationParams = {}): Promise<PaginatedResponse<Post>> {
    try {
      const { page = 1, perPage = 10, category, tag, author, search } = params;

      const response = await wordpressClient.getPosts({
        page,
        per_page: perPage,
        categories: category,
        tags: tag,
        author: author,
        search,
        _embed: true,
      });

      const posts = response.data.map((item: any) => wordpressAdapter.adaptPost(item));

      return {
        posts,
        pagination: {
          currentPage: page,
          totalPages: response.headers['x-wp-totalpages']
            ? parseInt(response.headers['x-wp-totalpages'])
            : 1,
          totalItems: response.headers['x-wp-total']
            ? parseInt(response.headers['x-wp-total'])
            : posts.length,
          pageSize: perPage,
        },
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts. Please try again later.');
    }
  }

  /**
   * Get a single post by slug
   */
  async getPost(slug: string): Promise<Post> {
    try {
      const response = await wordpressClient.getPostBySlug(slug, {
        _embed: true,
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('Post not found');
      }

      return wordpressAdapter.adaptPost(response.data[0]);
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch post. Please try again later.');
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await wordpressClient.getCategories();

      return response.data.map((item: any) => wordpressAdapter.adaptCategory(item));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories. Please try again later.');
    }
  }

  /**
   * Get a single category by slug
   */
  async getCategory(slug: string): Promise<Category> {
    try {
      const response = await wordpressClient.getCategoryBySlug(slug);

      if (!response.data || response.data.length === 0) {
        throw new Error('Category not found');
      }

      return wordpressAdapter.adaptCategory(response.data[0]);
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Failed to fetch category. Please try again later.');
    }
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    try {
      const response = await wordpressClient.getTags();

      return response.data.map((item: any) => wordpressAdapter.adaptTag(item));
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags. Please try again later.');
    }
  }

  /**
   * Get a single tag by slug
   */
  async getTag(slug: string): Promise<Tag> {
    try {
      const response = await wordpressClient.getTagBySlug(slug);

      if (!response.data || response.data.length === 0) {
        throw new Error('Tag not found');
      }

      return wordpressAdapter.adaptTag(response.data[0]);
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw new Error('Failed to fetch tag. Please try again later.');
    }
  }

  /**
   * Get all authors
   */
  async getAuthors(): Promise<Author[]> {
    try {
      const response = await wordpressClient.getUsers();

      return response.data.map((item: any) => wordpressAdapter.adaptAuthor(item));
    } catch (error) {
      console.error('Error fetching authors:', error);
      throw new Error('Failed to fetch authors. Please try again later.');
    }
  }

  /**
   * Get a single author by ID
   */
  async getAuthor(id: string): Promise<Author> {
    try {
      const response = await wordpressClient.getUser(id);

      return wordpressAdapter.adaptAuthor(response.data);
    } catch (error) {
      console.error('Error fetching author:', error);
      throw new Error('Failed to fetch author. Please try again later.');
    }
  }

  /**
   * Search posts
   */
  async searchPosts(query: string, page = 1, perPage = 10): Promise<PaginatedResponse<Post>> {
    return this.getPosts({
      search: query,
      page,
      perPage,
    });
  }

  /**
   * Get related posts based on categories/tags
   */
  async getRelatedPosts(postId: string, limit = 4): Promise<Post[]> {
    try {
      // First get the post to extract categories and tags
      const post = await this.getPost(postId);

      // Get posts from the same categories
      const categoryIds = post.categories?.map((cat) => cat.id).join(',');

      const response = await wordpressClient.getPosts({
        per_page: limit,
        categories: categoryIds,
        exclude: postId,
        _embed: true,
      });

      return response.data.map((item: any) => wordpressAdapter.adaptPost(item));
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  }

  /**
   * Get featured/sticky posts
   */
  async getFeaturedPosts(limit = 5): Promise<Post[]> {
    try {
      const response = await wordpressClient.getPosts({
        per_page: limit,
        sticky: true,
        _embed: true,
      });

      return response.data.map((item: any) => wordpressAdapter.adaptPost(item));
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit = 5): Promise<Post[]> {
    return this.getPosts({
      page: 1,
      perPage: limit,
    }).then((response) => response.posts);
  }
}

// Export singleton instance
export const blogService = new BlogService();

export default blogService;
