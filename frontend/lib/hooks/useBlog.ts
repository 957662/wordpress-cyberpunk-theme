/**
 * CyberPress Platform - 统一博客 Hooks
 * 整合所有博客相关的 React Hooks
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { blogService } from '../services/blog';
import type {
  Post,
  Comment,
  Category,
  Tag,
  Author,
  PostFilters,
  CommentFormData,
  SearchResultItem,
} from '@/types/blog';

/**
 * 使用文章列表
 */
export function usePosts(filters?: PostFilters) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } | undefined>();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await blogService.getPosts(filters);
      setPosts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err as Error);
      console.error('获取文章列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, meta, refetch: fetchPosts };
}

/**
 * 使用单篇文章
 */
export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getPost(slug);
        setPost(data);

        // 记录浏览
        await blogService.recordView(data.id);
      } catch (err) {
        setError(err as Error);
        console.error('获取文章失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}

/**
 * 使用特色文章
 */
export function useFeaturedPosts(limit: number = 5) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getFeaturedPosts(limit);
        setPosts(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取特色文章失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * 使用置顶文章
 */
export function useStickyPosts(limit: number = 5) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getStickyPosts(limit);
        setPosts(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取置顶文章失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * 使用相关文章
 */
export function useRelatedPosts(postId: string, limit: number = 4) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      if (!postId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getRelatedPosts(postId, limit);
        setPosts(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取相关文章失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [postId, limit]);

  return { posts, loading, error };
}

/**
 * 使用热门文章
 */
export function useTrendingPosts(limit: number = 5) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getTrendingPosts(limit);
        setPosts(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取热门文章失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * 使用最新文章
 */
export function useLatestPosts(limit: number = 10) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getLatestPosts(limit);
        setPosts(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取最新文章失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * 使用搜索
 */
export function useSearch(query: string, filters?: Omit<PostFilters, 'search'>) {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await blogService.searchPosts(query, filters);
        setResults(response.data);
        setHasSearched(true);
      } catch (err) {
        setError(err as Error);
        console.error('搜索失败:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      search();
    }, 300); // 防抖

    return () => clearTimeout(timer);
  }, [query, filters]);

  return { results, loading, error, hasSearched };
}

/**
 * 使用分类列表
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取分类列表失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * 使用单个分类
 */
export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getCategory(slug);
        setCategory(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取分类失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [slug]);

  return { category, loading, error };
}

/**
 * 使用标签列表
 */
export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getTags();
        setTags(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取标签列表失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  return { tags, loading, error };
}

/**
 * 使用单个标签
 */
export function useTag(slug: string) {
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTag() {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getTag(slug);
        setTag(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取标签失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTag();
  }, [slug]);

  return { tag, loading, error };
}

/**
 * 使用作者列表
 */
export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAuthors() {
      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getAuthors();
        setAuthors(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取作者列表失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthors();
  }, []);

  return { authors, loading, error };
}

/**
 * 使用单个作者
 */
export function useAuthor(slug: string) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAuthor() {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getAuthor(slug);
        setAuthor(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取作者失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthor();
  }, [slug]);

  return { author, loading, error };
}

/**
 * 使用评论
 */
export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await blogService.getComments(postId);
      setComments(data);
    } catch (err) {
      setError(err as Error);
      console.error('获取评论失败:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
}

/**
 * 使用提交评论
 */
export function useSubmitComment() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitComment = useCallback(async (postId: string, data: CommentFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const comment = await blogService.submitComment(postId, data);
      return comment;
    } catch (err) {
      setError(err as Error);
      console.error('提交评论失败:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitComment, submitting, error };
}

/**
 * 使用点赞
 */
export function useLikePost() {
  const [liking, setLiking] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const likePost = useCallback(async (postId: string) => {
    setLiking(true);
    setError(null);

    try {
      await blogService.likePost(postId);
    } catch (err) {
      setError(err as Error);
      console.error('点赞失败:', err);
      throw err;
    } finally {
      setLiking(false);
    }
  }, []);

  return { likePost, liking, error };
}

/**
 * 使用收藏
 */
export function useBookmark() {
  const [bookmarking, setBookmarking] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bookmarkPost = useCallback(async (postId: string, folderId?: string) => {
    setBookmarking(true);
    setError(null);

    try {
      await blogService.bookmarkPost(postId, folderId);
    } catch (err) {
      setError(err as Error);
      console.error('收藏失败:', err);
      throw err;
    } finally {
      setBookmarking(false);
    }
  }, []);

  const unbookmarkPost = useCallback(async (postId: string) => {
    setBookmarking(true);
    setError(null);

    try {
      await blogService.unbookmarkPost(postId);
    } catch (err) {
      setError(err as Error);
      console.error('取消收藏失败:', err);
      throw err;
    } finally {
      setBookmarking(false);
    }
  }, []);

  return { bookmarkPost, unbookmarkPost, bookmarking, error };
}

/**
 * 使用关注作者
 */
export function useFollowAuthor() {
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const followAuthor = useCallback(async (authorId: string) => {
    setFollowing(true);
    setError(null);

    try {
      await blogService.followAuthor(authorId);
    } catch (err) {
      setError(err as Error);
      console.error('关注失败:', err);
      throw err;
    } finally {
      setFollowing(false);
    }
  }, []);

  const unfollowAuthor = useCallback(async (authorId: string) => {
    setFollowing(true);
    setError(null);

    try {
      await blogService.unfollowAuthor(authorId);
    } catch (err) {
      setError(err as Error);
      console.error('取消关注失败:', err);
      throw err;
    } finally {
      setFollowing(false);
    }
  }, []);

  return { followAuthor, unfollowAuthor, following, error };
}

/**
 * 使用阅读历史
 */
export function useReadingHistory(limit: number = 10) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const data = await blogService.getReadingHistory(limit);
        setPosts(data);
      } catch (err) {
        setError(err as Error);
        console.error('获取阅读历史失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [limit]);

  return { posts, loading, error };
}
