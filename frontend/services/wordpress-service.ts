/**
 * WordPress Service Layer
 *
 * 封装所有 WordPress 相关的业务逻辑
 * 提供统一的接口和错误处理
 */

import {
  getWordPressClient,
  Post,
  Category,
  Tag,
  Comment,
  User,
  Media,
  PostsParams,
  TaxonomyParams,
} from '@/lib/wordpress/wordpress-api';
import {
  adaptPost,
  adaptPosts,
  adaptPostWithRelated,
  adaptPostsWithRelated,
  adaptCategory,
  adaptCategories,
  adaptTag,
  adaptTags,
  adaptComment,
  adaptComments,
  adaptAuthor,
  adaptAuthors,
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogComment,
  BlogAuthor,
  extractTaxonomyIds,
} from '@/lib/wordpress/data-adapter';

// ============================================================================
// Post Services
// ============================================================================

export class PostService {
  /**
   * 获取文章列表
   */
  static async getPosts(params: PostsParams = {}): Promise<BlogPost[]> {
    try {
      const client = getWordPressClient();
      const wpPosts = await client.getPosts(params);
      return adaptPosts(wpPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw new Error('获取文章列表失败');
    }
  }

  /**
   * 获取文章详情（包含相关数据）
   */
  static async getPostDetail(id: number): Promise<BlogPost> {
    try {
      const client = getWordPressClient();

      // 并行获取文章、分类、标签、用户数据
      const [post, categories, tags, users] = await Promise.all([
        client.getPost(id),
        client.getCategories({ per_page: 100 }),
        client.getTags({ per_page: 100 }),
        client.getUsers(),
      ]);

      return adaptPostWithRelated(post, categories, tags, users);
    } catch (error) {
      console.error('Failed to fetch post detail:', error);
      throw new Error('获取文章详情失败');
    }
  }

  /**
   * 根据 slug 获取文章
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const client = getWordPressClient();
      const posts = await client.getPostBySlug(slug);

      if (!posts || posts.length === 0) {
        return null;
      }

      return this.getPostDetail(posts[0].id);
    } catch (error) {
      console.error('Failed to fetch post by slug:', error);
      throw new Error('获取文章失败');
    }
  }

  /**
   * 获取精选文章
   */
  static async getFeaturedPosts(limit = 5): Promise<BlogPost[]> {
    return this.getPosts({ sticky: true, per_page: limit });
  }

  /**
   * 获取最新文章
   */
  static async getLatestPosts(limit = 10): Promise<BlogPost[]> {
    return this.getPosts({
      per_page: limit,
      orderby: 'date',
      order: 'desc',
    });
  }

  /**
   * 根据分类获取文章
   */
  static async getPostsByCategory(
    categoryId: number,
    params: PostsParams = {}
  ): Promise<BlogPost[]> {
    return this.getPosts({ ...params, categories: [categoryId] });
  }

  /**
   * 根据标签获取文章
   */
  static async getPostsByTag(
    tagId: number,
    params: PostsParams = {}
  ): Promise<BlogPost[]> {
    return this.getPosts({ ...params, tags: [tagId] });
  }

  /**
   * 搜索文章
   */
  static async searchPosts(query: string, limit = 10): Promise<BlogPost[]> {
    if (query.length < 2) {
      return [];
    }
    return this.getPosts({ search: query, per_page: limit });
  }

  /**
   * 获取相关文章
   */
  static async getRelatedPosts(
    postId: number,
    categoryIds: number[],
    limit = 4
  ): Promise<BlogPost[]> {
    return this.getPosts({
      exclude: [postId],
      categories: categoryIds,
      per_page: limit,
      orderby: 'rand',
    });
  }
}

// ============================================================================
// Category Services
// ============================================================================

export class CategoryService {
  /**
   * 获取所有分类
   */
  static async getCategories(params: TaxonomyParams = {}): Promise<BlogCategory[]> {
    try {
      const client = getWordPressClient();
      const wpCategories = await client.getCategories(params);
      return adaptCategories(wpCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw new Error('获取分类失败');
    }
  }

  /**
   * 获取分类详情
   */
  static async getCategory(id: number): Promise<BlogCategory> {
    try {
      const client = getWordPressClient();
      const wpCategory = await client.getCategory(id);
      return adaptCategory(wpCategory);
    } catch (error) {
      console.error('Failed to fetch category:', error);
      throw new Error('获取分类详情失败');
    }
  }

  /**
   * 获取带文章数量的分类
   */
  static async getCategoriesWithCount(): Promise<BlogCategory[]> {
    return this.getCategories({
      hide_empty: true,
      orderby: 'count',
      order: 'desc',
    });
  }
}

// ============================================================================
// Tag Services
// ============================================================================

export class TagService {
  /**
   * 获取所有标签
   */
  static async getTags(params: TaxonomyParams = {}): Promise<BlogTag[]> {
    try {
      const client = getWordPressClient();
      const wpTags = await client.getTags(params);
      return adaptTags(wpTags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      throw new Error('获取标签失败');
    }
  }

  /**
   * 获取标签详情
   */
  static async getTag(id: number): Promise<BlogTag> {
    try {
      const client = getWordPressClient();
      const wpTag = await client.getTag(id);
      return adaptTag(wpTag);
    } catch (error) {
      console.error('Failed to fetch tag:', error);
      throw new Error('获取标签详情失败');
    }
  }

  /**
   * 获取热门标签
   */
  static async getPopularTags(limit = 20): Promise<BlogTag[]> {
    return this.getTags({
      hide_empty: true,
      per_page: limit,
      orderby: 'count',
      order: 'desc',
    });
  }
}

// ============================================================================
// Comment Services
// ============================================================================

export class CommentService {
  /**
   * 获取评论列表
   */
  static async getComments(postId?: number): Promise<BlogComment[]> {
    try {
      const client = getWordPressClient();
      const wpComments = await client.getComments(postId);
      return adaptComments(wpComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw new Error('获取评论失败');
    }
  }

  /**
   * 创建评论
   */
  static async createComment(comment: Partial<Comment>): Promise<BlogComment> {
    try {
      const client = getWordPressClient();
      const wpComment = await client.createComment(comment);
      return adaptComment(wpComment);
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw new Error('创建评论失败');
    }
  }
}

// ============================================================================
// User Services
// ============================================================================

export class UserService {
  /**
   * 获取用户列表
   */
  static async getUsers(): Promise<BlogAuthor[]> {
    try {
      const client = getWordPressClient();
      const wpUsers = await client.getUsers();
      return adaptAuthors(wpUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('获取用户列表失败');
    }
  }

  /**
   * 获取用户详情
   */
  static async getUser(id: number): Promise<BlogAuthor> {
    try {
      const client = getWordPressClient();
      const wpUser = await client.getUser(id);
      return adaptAuthor(wpUser);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('获取用户详情失败');
    }
  }
}

// ============================================================================
// Export All Services
// ============================================================================

export default {
  Post: PostService,
  Category: CategoryService,
  Tag: TagService,
  Comment: CommentService,
  User: UserService,
};
