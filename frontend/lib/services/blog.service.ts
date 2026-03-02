// Blog Service - WordPress API integration

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  publishedAt: string;
  readingTime: number;
  views?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

class BlogService {
  private baseUrl: string;
  private perPage: number = 12;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch all posts with pagination
   */
  async getPosts(page: number = 1, perPage?: number): Promise<BlogPost[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp/v2/posts?page=${page}&per_page=${perPage || this.perPage}&_embed`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts = await response.json();
      return this.transformPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  /**
   * Fetch a single post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp/v2/posts?slug=${slug}&_embed`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts = await response.json();
      
      if (posts.length === 0) {
        return null;
      }

      return this.transformPost(posts[0]);
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  /**
   * Fetch posts by category
   */
  async getPostsByCategory(categoryId: string, page: number = 1): Promise<BlogPost[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp/v2/posts?categories=${categoryId}&page=${page}&per_page=${this.perPage}&_embed`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts = await response.json();
      return this.transformPosts(posts);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      return [];
    }
  }

  /**
   * Fetch posts by tag
   */
  async getPostsByTag(tagId: string, page: number = 1): Promise<BlogPost[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp/v2/posts?tags=${tagId}&page=${page}&per_page=${this.perPage}&_embed`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts = await response.json();
      return this.transformPosts(posts);
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      return [];
    }
  }

  /**
   * Search posts
   */
  async searchPosts(query: string, page: number = 1): Promise<BlogPost[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp/v2/posts?search=${encodeURIComponent(query)}&page=${page}&per_page=${this.perPage}&_embed`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts = await response.json();
      return this.transformPosts(posts);
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }

  /**
   * Fetch all categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseUrl}/wp/v2/categories?per_page=100`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const categories = await response.json();
      return categories.map((cat: any) => ({
        id: cat.id.toString(),
        name: cat.name,
        slug: cat.slug,
        count: cat.count,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Fetch all tags
   */
  async getTags(): Promise<Tag[]> {
    try {
      const response = await fetch(`${this.baseUrl}/wp/v2/tags?per_page=100`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tags = await response.json();
      return tags.map((tag: any) => ({
        id: tag.id.toString(),
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
   * Transform WordPress post data to our format
   */
  private transformPosts(posts: any[]): BlogPost[] {
    return posts.map((post) => this.transformPost(post));
  }

  private transformPost(post: any): BlogPost {
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const author = post._embedded?.author?.[0];
    const categories = post._embedded?.['wp:term']?.[0] || [];
    const tags = post._embedded?.['wp:term']?.[1] || [];

    // Calculate reading time (approx 200 words per minute)
    const wordCount = post.content?.rendered?.split(/\s+/).length || 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      id: post.id.toString(),
      title: post.title?.rendered || '',
      slug: post.slug,
      content: post.content?.rendered || '',
      excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      featuredImage: featuredMedia?.source_url,
      author: {
        id: author?.id?.toString() || '',
        name: author?.name || 'Unknown',
        avatar: author?.avatar_urls?.['96'],
      },
      category: {
        id: categories[0]?.id?.toString() || '',
        name: categories[0]?.name || 'Uncategorized',
        slug: categories[0]?.slug || 'uncategorized',
      },
      tags: tags.map((tag: any) => ({
        id: tag.id.toString(),
        name: tag.name,
        slug: tag.slug,
      })),
      publishedAt: post.date,
      readingTime,
      views: post.views, // If you have a views plugin
    };
  }
}

// Export singleton instance
export const blogService = new BlogService();

export default BlogService;
