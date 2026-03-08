/**
 * useSocial Hook - 社交功能相关的自定义 Hook
 * 封装点赞、收藏、评论、关注等社交互动逻辑
 */

import { useState, useCallback } from 'react';
import {
  likePost,
  unlikePost,
  bookmarkPost,
  unbookmarkPost,
  getPostComments,
  createComment,
  deleteComment,
  likeComment,
  followUser,
  unfollowUser,
  getFollowStatus,
  Comment,
} from '@/services/social.service';

/**
 * 点赞功能 Hook
 */
export function useLike(postId: string, initialLikes = 0, initialIsLiked = false) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = useCallback(async () => {
    setIsLoading(true);

    try {
      if (isLiked) {
        await unlikePost(postId);
        setLikes((prev) => prev - 1);
        setIsLiked(false);
      } else {
        await likePost(postId);
        setLikes((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // 可以在这里添加错误提示
    } finally {
      setIsLoading(false);
    }
  }, [postId, isLiked]);

  return {
    likes,
    isLiked,
    isLoading,
    toggleLike,
  };
}

/**
 * 收藏功能 Hook
 */
export function useBookmark(postId: string, initialBookmarks = 0, initialIsBookmarked = false) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = useCallback(async () => {
    setIsLoading(true);

    try {
      if (isBookmarked) {
        await unbookmarkPost(postId);
        setBookmarks((prev) => prev - 1);
        setIsBookmarked(false);
      } else {
        await bookmarkPost(postId);
        setBookmarks((prev) => prev + 1);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, isBookmarked]);

  return {
    bookmarks,
    isBookmarked,
    isLoading,
    toggleBookmark,
  };
}

/**
 * 评论系统 Hook
 */
export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 加载评论
  const loadComments = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getPostComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // 提交评论
  const submitComment = useCallback(
    async (content: string, parentId?: string) => {
      if (!content.trim()) return;

      setIsSubmitting(true);

      try {
        const newComment = await createComment(postId, content, parentId);

        if (parentId) {
          // 如果是回复，添加到对应评论的回复列表中
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === parentId
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), newComment],
                  }
                : comment
            )
          );
        } else {
          // 如果是新评论，添加到列表顶部
          setComments((prev) => [newComment, ...prev]);
        }

        return newComment;
      } catch (error) {
        console.error('Failed to submit comment:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [postId]
  );

  // 删除评论
  const removeComment = useCallback(
    async (commentId: string) => {
      try {
        await deleteComment(postId, commentId);
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    },
    [postId]
  );

  // 点赞评论
  const toggleCommentLike = useCallback(
    async (commentId: string) => {
      try {
        await likeComment(commentId);

        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                isLiked: !comment.isLiked,
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                        isLiked: !reply.isLiked,
                      }
                    : reply
                ),
              };
            }
            return comment;
          })
        );
      } catch (error) {
        console.error('Failed to like comment:', error);
      }
    },
    []
  );

  return {
    comments,
    isLoading,
    isSubmitting,
    loadComments,
    submitComment,
    removeComment,
    toggleCommentLike,
  };
}

/**
 * 关注功能 Hook
 */
export function useFollow(userId: string, initialIsFollowing = false) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFollow = useCallback(async () => {
    setIsLoading(true);

    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
      } else {
        await followUser(userId);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isFollowing]);

  // 加载关注状态
  const loadStatus = useCallback(async () => {
    try {
      const status = await getFollowStatus(userId);
      setIsFollowing(status.isFollowing);
      setFollowersCount(status.followersCount);
    } catch (error) {
      console.error('Failed to load follow status:', error);
    }
  }, [userId]);

  return {
    isFollowing,
    followersCount,
    isLoading,
    toggleFollow,
    loadStatus,
  };
}

/**
 * 分享功能 Hook
 */
export function useShare(postId: string) {
  const [isSharing, setIsSharing] = useState(false);

  const share = useCallback(
    async (platform: string) => {
      setIsSharing(true);

      try {
        // 记录分享统计
        await fetch(`/api/social/posts/${postId}/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ platform }),
        });

        // 实际分享逻辑由组件处理
        return true;
      } catch (error) {
        console.error('Failed to share post:', error);
        return false;
      } finally {
        setIsSharing(false);
      }
    },
    [postId]
  );

  return {
    isSharing,
    share,
  };
}
