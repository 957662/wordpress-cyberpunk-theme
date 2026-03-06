/**
 * 评论系统 Hooks
 * 处理评论相关的逻辑
 */

import { useState, useEffect, useCallback } from 'react';
import { commentApiService } from '@/services/comment-api.service';
import type {
  Comment,
  CommentQueryParams,
  CreateCommentRequest,
  CommentFilter,
} from '@/types/comment.types';

/**
 * 使用评论列表
 */
export function useComments(params?: CommentQueryParams) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params?.page || 1);
  const [pageSize] = useState(params?.pageSize || 20);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await commentApiService.getComments({
        ...params,
        page,
        pageSize,
      });

      setComments(response.comments);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  }, [params, page, pageSize]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const loadMore = useCallback(() => {
    if (!isLoading && comments.length < total) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, comments.length, total]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    isLoading,
    error,
    total,
    hasMore: comments.length < total,
    loadMore,
    refresh,
    page,
  };
}

/**
 * 使用文章评论
 */
export function usePostComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await commentApiService.getCommentsByPost(postId);

      setComments(response.comments);
      setTotalCount(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const createComment = useCallback(
    async (data: Omit<CreateCommentRequest, 'postId'>) => {
      try {
        const newComment = await commentApiService.createComment({
          ...data,
          postId,
        });

        setComments((prev) => [newComment, ...prev]);
        setTotalCount((prev) => prev + 1);

        return { success: true, comment: newComment };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || 'Failed to create comment',
        };
      }
    },
    [postId]
  );

  const likeComment = useCallback(
    async (commentId: string) => {
      try {
        const result = await commentApiService.likeComment(commentId);

        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  likes: result.likes,
                  isLiked: result.isLiked,
                }
              : c
          )
        );

        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || 'Failed to like comment',
        };
      }
    },
    []
  );

  const unlikeComment = useCallback(
    async (commentId: string) => {
      try {
        const result = await commentApiService.unlikeComment(commentId);

        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  likes: result.likes,
                  isLiked: result.isLiked,
                }
              : c
          )
        );

        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || 'Failed to unlike comment',
        };
      }
    },
    []
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        await commentApiService.deleteComment(commentId);

        setComments((prev) => {
          const removeCommentAndReplies = (comments: Comment[]): Comment[] => {
            return comments
              .filter((c) => c.id !== commentId)
              .map((c) => ({
                ...c,
                replies: c.replies
                  ? removeCommentAndReplies(c.replies)
                  : undefined,
              }));
          };

          return removeCommentAndReplies(prev);
        });

        setTotalCount((prev) => prev - 1);

        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || 'Failed to delete comment',
        };
      }
    },
    []
  );

  return {
    comments,
    isLoading,
    error,
    totalCount,
    createComment,
    likeComment,
    unlikeComment,
    deleteComment,
    refresh: fetchComments,
  };
}

/**
 * 使用评论回复
 */
export function useCommentReplies(commentId: string) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReplies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await commentApiService.getCommentReplies(commentId);

      setReplies(response.comments);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch replies');
    } finally {
      setIsLoading(false);
    }
  }, [commentId]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  const createReply = useCallback(
    async (data: Omit<CreateCommentRequest, 'postId' | 'parentId'>) => {
      try {
        const newReply = await commentApiService.createComment({
          ...data,
          postId: '', // 将在服务端从父评论获取
          parentId: commentId,
        });

        setReplies((prev) => [...prev, newReply]);

        return { success: true, reply: newReply };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || 'Failed to create reply',
        };
      }
    },
    [commentId]
  );

  return {
    replies,
    isLoading,
    error,
    createReply,
    refresh: fetchReplies,
  };
}

/**
 * 使用评论搜索
 */
export function useCommentSearch(filter: CommentFilter) {
  const [results, setResults] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const search = useCallback(async () => {
    if (!filter.search && !filter.status && !filter.author) {
      setResults([]);
      setTotal(0);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await commentApiService.searchComments(filter, page);

      setResults(response.comments);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to search comments');
    } finally {
      setIsLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    search();
  }, [search]);

  const loadMore = useCallback(() => {
    if (!isLoading && results.length < total) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, results.length, total]);

  return {
    results,
    isLoading,
    error,
    total,
    hasMore: results.length < total,
    loadMore,
    refresh: search,
  };
}

/**
 * 使用评论统计
 */
export function useCommentStats() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    spam: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await commentApiService.getCommentStats();

      setStats(data);
    } catch (err) {
      console.error('Failed to fetch comment stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, refresh: fetchStats };
}
