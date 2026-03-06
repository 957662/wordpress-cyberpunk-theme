/**
 * Blog Helpers
 * 博客辅助工具函数
 */

import type { BlogPost, BlogCategory, BlogTag } from '@/types/blog';

/**
 * 过滤文章列表
 */
export function filterPosts(
  posts: BlogPost[],
  filters: {
    category?: string;
    tag?: string;
    author?: string;
    search?: string;
    featured?: boolean;
  }
): BlogPost[] {
  return posts.filter(post => {
    if (filters.category && post.category !== filters.category) {
      return false;
    }

    if (filters.tag && !post.tags?.includes(filters.tag)) {
      return false;
    }

    if (filters.author && post.author !== filters.author) {
      return false;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(searchLower);
      const excerptMatch = post.excerpt?.toLowerCase().includes(searchLower);
      if (!titleMatch && !excerptMatch) {
        return false;
      }
    }

    if (filters.featured && !post.featured) {
      return false;
    }

    return true;
  });
}

/**
 * 排序文章列表
 */
export function sortPosts(
  posts: BlogPost[],
  sortBy: 'date' | 'popularity' | 'views' | 'likes' | 'comments',
  order: 'asc' | 'desc' = 'desc'
): BlogPost[] {
  const sorted = [...posts].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison =
          new Date(b.created_at || '').getTime() -
          new Date(a.created_at || '').getTime();
        break;
      case 'popularity':
        comparison =
          (b.viewCount || 0) + (b.likeCount || 0) * 2 + (b.commentCount || 0) * 3 -
          ((a.viewCount || 0) + (a.likeCount || 0) * 2 + (a.commentCount || 0) * 3);
        break;
      case 'views':
        comparison = (b.viewCount || 0) - (a.viewCount || 0);
        break;
      case 'likes':
        comparison = (b.likeCount || 0) - (a.likeCount || 0);
        break;
      case 'comments':
        comparison = (b.commentCount || 0) - (a.commentCount || 0);
        break;
    }

    return order === 'asc' ? -comparison : comparison;
  });

  return sorted;
}

/**
 * 分页文章列表
 */
export function paginatePosts(
  posts: BlogPost[],
  page: number,
  perPage: number
): {
  posts: BlogPost[];
  totalPages: number;
  totalItems: number;
} {
  const totalItems = posts.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    posts: posts.slice(startIndex, endIndex),
    totalPages,
    totalItems,
  };
}

/**
 * 获取相关文章
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 4
): BlogPost[] {
  // 排除当前文章
  const otherPosts = allPosts.filter(post => post.id !== currentPost.id);

  // 计算相似度
  const postsWithScore = otherPosts.map(post => {
    let score = 0;

    // 相同分类
    if (post.category === currentPost.category) {
      score += 10;
    }

    // 相同标签
    const commonTags = post.tags?.filter(tag =>
      currentPost.tags?.includes(tag)
    ).length || 0;
    score += commonTags * 5;

    // 相同作者
    if (post.author === currentPost.author) {
      score += 3;
    }

    return { post, score };
  });

  // 按相似度排序并返回前 N 个
  return postsWithScore
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * 按年份分组文章
 */
export function groupPostsByYear(posts: BlogPost[]): Map<string, BlogPost[]> {
  const grouped = new Map<string, BlogPost[]>();

  posts.forEach(post => {
    const year = new Date(post.created_at || '').getFullYear().toString();
    if (!grouped.has(year)) {
      grouped.set(year, []);
    }
    grouped.get(year)!.push(post);
  });

  return grouped;
}

/**
 * 按月份分组文章
 */
export function groupPostsByMonth(posts: BlogPost[]): Map<string, BlogPost[]> {
  const grouped = new Map<string, BlogPost[]>();

  posts.forEach(post => {
    const date = new Date(post.created_at || '');
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!grouped.has(month)) {
      grouped.set(month, []);
    }
    grouped.get(month)!.push(post);
  });

  return grouped;
}

/**
 * 计算分类文章数
 */
export function calculateCategoryPostsCount(
  posts: BlogPost[]
): Map<string, number> {
  const countMap = new Map<string, number>();

  posts.forEach(post => {
    if (post.category) {
      const count = countMap.get(post.category) || 0;
      countMap.set(post.category, count + 1);
    }
  });

  return countMap;
}

/**
 * 计算标签文章数
 */
export function calculateTagPostsCount(posts: BlogPost[]): Map<string, number> {
  const countMap = new Map<string, number>();

  posts.forEach(post => {
    post.tags?.forEach(tag => {
      const count = countMap.get(tag) || 0;
      countMap.set(tag, count + 1);
    });
  });

  return countMap;
}

/**
 * 获取热门文章
 */
export function getPopularPosts(
  posts: BlogPost[],
  limit: number = 10
): BlogPost[] {
  return sortPosts(posts, 'popularity', 'desc').slice(0, limit);
}

/**
 * 获取精选文章
 */
export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.featured);
}

/**
 * 获取最新文章
 */
export function getLatestPosts(posts: BlogPost[], limit: number = 10): BlogPost[] {
  return sortPosts(posts, 'date', 'desc').slice(0, limit);
}
