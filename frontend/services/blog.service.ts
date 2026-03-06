/**
 * 博客服务层
 * 提供博客相关的业务逻辑
 */

import { Post, Category, Tag, Author, Comment, PostFilters } from '@/types/blog';

class BlogService {
  /**
   * 格式化文章列表数据
   */
  formatPostsList(posts: Post[]) {
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags,
      author: post.author,
      meta: post.meta,
      publishedAt: post.publishedAt || post.createdAt,
    }));
  }

  /**
   * 获取相关文章
   */
  getRelatedPosts(currentPost: Post, allPosts: Post[], limit: number = 4): Post[] {
    const relatedPosts: Post[] = [];
    const categoryPosts = allPosts.filter(p => 
      p.id !== currentPost.id && 
      p.category?.id === currentPost.category?.id
    );
    const tagPosts = allPosts.filter(p =>
      p.id !== currentPost.id &&
      p.tags.some(t => currentPost.tags.some(ct => ct.id === t.id))
    );

    // 优先添加同分类文章
    relatedPosts.push(...categoryPosts.slice(0, limit));

    // 如果不够，添加有相同标签的文章
    if (relatedPosts.length < limit) {
      const remaining = limit - relatedPosts.length;
      const tagPostsToAdd = tagPosts
        .filter(p => !relatedPosts.some(rp => rp.id === p.id))
        .slice(0, remaining);
      relatedPosts.push(...tagPostsToAdd);
    }

    return relatedPosts.slice(0, limit);
  }

  /**
   * 搜索文章
   */
  searchPosts(posts: Post[], query: string): Post[] {
    const lowerQuery = query.toLowerCase();
    return posts.filter(post => {
      return (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(lowerQuery)) ||
        post.category?.name.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * 过滤文章
   */
  filterPosts(posts: Post[], filters: PostFilters): Post[] {
    let filtered = [...posts];

    // 按分类过滤
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(post =>
        filters.category!.includes(post.category?.id || '')
      );
    }

    // 按标签过滤
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => filters.tags!.includes(tag.id))
      );
    }

    // 按作者过滤
    if (filters.author && filters.author.length > 0) {
      filtered = filtered.filter(post =>
        filters.author!.includes(post.author.id)
      );
    }

    // 按状态过滤
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(post =>
        filters.status!.includes(post.status)
      );
    }

    // 只显示特色文章
    if (filters.featured) {
      filtered = filtered.filter(post => post.meta.featured);
    }

    // 只显示置顶文章
    if (filters.sticky) {
      filtered = filtered.filter(post => post.meta.sticky);
    }

    // 搜索关键词
    if (filters.search) {
      filtered = this.searchPosts(filtered, filters.search);
    }

    // 排序
    const sortField = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.publishedAt || a.createdAt).getTime() -
                       new Date(b.publishedAt || b.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'views':
          comparison = a.meta.views - b.meta.views;
          break;
        case 'likes':
          comparison = a.meta.likes - b.meta.likes;
          break;
        case 'comments':
          comparison = a.meta.comments - b.meta.comments;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }

  /**
   * 获取热门文章
   */
  getTrendingPosts(posts: Post[], limit: number = 5): Post[] {
    return [...posts]
      .sort((a, b) => {
        const scoreA = a.meta.views + a.meta.likes * 2 + a.meta.comments * 3;
        const scoreB = b.meta.views + b.meta.likes * 2 + b.meta.comments * 3;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * 获取最新文章
   */
  getLatestPosts(posts: Post[], limit: number = 5): Post[] {
    return [...posts]
      .sort((a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
      )
      .slice(0, limit);
  }

  /**
   * 获取特色文章
   */
  getFeaturedPosts(posts: Post[], limit: number = 3): Post[] {
    return posts
      .filter(post => post.meta.featured || post.meta.sticky)
      .slice(0, limit);
  }

  /**
   * 构建面包屑导航
   */
  buildBreadcrumb(post: Post) {
    const breadcrumb = [
      { name: '首页', href: '/' },
      { name: '博客', href: '/blog' },
    ];

    if (post.category) {
      breadcrumb.push({
        name: post.category.name,
        href: `/blog/category/${post.category.slug}`,
      });
    }

    breadcrumb.push({
      name: post.title,
      href: `/blog/${post.slug}`,
    });

    return breadcrumb;
  }

  /**
   * 获取文章摘要
   */
  getExcerpt(content: string, maxLength: number = 200): string {
    const text = content.replace(/<[^>]*>/g, '');
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * 计算文章热度分数
   */
  calculateHotScore(post: Post): number {
    const now = new Date().getTime();
    const publishedAt = new Date(post.publishedAt || post.createdAt).getTime();
    const daysSincePublish = (now - publishedAt) / (1000 * 60 * 60 * 24);

    const viewScore = post.meta.views * 1;
    const likeScore = post.meta.likes * 2;
    const commentScore = post.meta.comments * 3;
    const recencyScore = Math.max(0, 100 - daysSincePublish * 2);

    return viewScore + likeScore + commentScore + recencyScore;
  }

  /**
   * 按热度排序
   */
  sortByHotness(posts: Post[]): Post[] {
    return [...posts].sort((a, b) =>
      this.calculateHotScore(b) - this.calculateHotScore(a)
    );
  }
}

export const blogService = new BlogService();
export default BlogService;
