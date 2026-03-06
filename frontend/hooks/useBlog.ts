/**
 * 博客相关 Hooks
 */

import { useState, useEffect } from 'react';
import { blogService, BlogPost, BlogListParams } from '@/services/api/blog';

export interface UseBlogPostsResult {
  posts: BlogPost[];
  loading: boolean;
  error: Error | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => void;
}

/**
 * 获取博客文章列表
 */
export function useBlogPosts(params?: BlogListParams): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params?.page || 1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getPosts(params);
      setPosts(data.posts);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [JSON.stringify(params)]);

  return { posts, loading, error, total, page, totalPages, refetch: fetchPosts };
}

/**
 * 获取单篇博客文章
 */
export function useBlogPost(postId: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getPost(postId);
        setPost(data);

        // 增加浏览量
        await blogService.incrementViews(postId);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return { post, loading, error };
}

/**
 * 获取精选文章
 */
export function useFeaturedPosts(limit = 5) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getFeaturedPosts(limit);
        setPosts(data);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch featured posts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * 文章点赞 Hook
 */
export function useLikePost(postId: string) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    try {
      setLoading(true);
      if (liked) {
        const data = await blogService.unlikePost(postId);
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      } else {
        const data = await blogService.likePost(postId);
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setLoading(false);
    }
  };

  return { liked, likesCount, loading, toggleLike };
}

/**
 * 文章收藏 Hook
 */
export function useBookmarkPost(postId: string) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleBookmark = async () => {
    try {
      setLoading(true);
      if (bookmarked) {
        const data = await blogService.unbookmarkPost(postId);
        setBookmarked(data.bookmarked);
      } else {
        const data = await blogService.bookmarkPost(postId);
        setBookmarked(data.bookmarked);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  return { bookmarked, loading, toggleBookmark };
}
